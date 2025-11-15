import express from 'express';
import db from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculatePriorityScore } from '../config/seed.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * @swagger
 * /drops:
 *   get:
 *     summary: Aktif drop listesi
 *     tags: [Drops]
 *     responses:
 *       200:
 *         description: Drop listesi
 */
router.get('/', (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const drops = db.prepare(`
      SELECT 
        id,
        title,
        description,
        total_stock,
        claim_window_start,
        claim_window_end,
        created_at
      FROM drops
      WHERE claim_window_end >= ?
      ORDER BY created_at DESC
    `).all(now);

    const dropsWithStats = drops.map(drop => {
      const waitlistCount = db.prepare(`
        SELECT COUNT(*) as count FROM waitlists WHERE drop_id = ?
      `).get(drop.id);

      const claimedCount = db.prepare(`
        SELECT COUNT(*) as count FROM claims WHERE drop_id = ?
      `).get(drop.id);

      return {
        ...drop,
        waitlist_count: waitlistCount.count,
        claimed_count: claimedCount.count,
        available_stock: drop.total_stock - claimedCount.count,
        is_claim_window_open: now >= drop.claim_window_start && now <= drop.claim_window_end
      };
    });

    res.json({ drops: dropsWithStats });
  } catch (error) {
    console.error('Get drops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /drops/{id}/join:
 *   post:
 *     summary: Waitlist'e katıl
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Waitlist'e katıldı
 *       200:
 *         description: Zaten waitlist'te
 *       401:
 *         description: Authentication gerekli
 */
router.post('/:id/join', authenticateToken, (req, res) => {
  const transaction = db.transaction(() => {
    try {
      const dropId = parseInt(req.params.id);
      const userId = req.user.id;
      const now = Math.floor(Date.now() / 1000);

      const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
      if (!drop) {
        return res.status(404).json({ error: 'Drop not found' });
      }

      if (now > drop.claim_window_end) {
        return res.status(400).json({ error: 'Drop claim window has ended' });
      }

      const existing = db.prepare(`
        SELECT * FROM waitlists WHERE drop_id = ? AND user_id = ?
      `).get(dropId, userId);

      if (existing) {
        return res.status(200).json({
          message: 'Already on waitlist',
          waitlist: existing
        });
      }

      const user = db.prepare('SELECT account_created_at FROM users WHERE id = ?').get(userId);
      const accountAgeDays = Math.floor((now - user.account_created_at) / 86400);
      const signupLatencyMs = 0;
      const rapidActions = 0;

      const priorityScore = calculatePriorityScore(
        signupLatencyMs,
        accountAgeDays,
        rapidActions
      );

      const result = db.prepare(`
        INSERT INTO waitlists (drop_id, user_id, joined_at, signup_latency_ms, priority_score)
        VALUES (?, ?, ?, ?, ?)
      `).run(dropId, userId, now, signupLatencyMs, priorityScore);

      const waitlist = db.prepare('SELECT * FROM waitlists WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({
        message: 'Joined waitlist successfully',
        waitlist
      });
    } catch (error) {
      console.error('Join waitlist error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  transaction();
});

/**
 * @swagger
 * /drops/{id}/leave:
 *   post:
 *     summary: Waitlist'ten ayrıl
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Waitlist'ten ayrıldı
 *       401:
 *         description: Authentication gerekli
 */
router.post('/:id/leave', authenticateToken, (req, res) => {
  try {
    const dropId = parseInt(req.params.id);
    const userId = req.user.id;

    const waitlist = db.prepare(`
      SELECT * FROM waitlists WHERE drop_id = ? AND user_id = ?
    `).get(dropId, userId);

    if (!waitlist) {
      return res.status(404).json({ error: 'Not on waitlist' });
    }

    const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
    const now = Math.floor(Date.now() / 1000);

    if (drop && now >= drop.claim_window_start) {
      return res.status(400).json({ error: 'Cannot leave waitlist after claim window starts' });
    }

    db.prepare('DELETE FROM waitlists WHERE drop_id = ? AND user_id = ?').run(dropId, userId);

    res.json({ message: 'Left waitlist successfully' });
  } catch (error) {
    console.error('Leave waitlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /drops/{id}/claim:
 *   post:
 *     summary: Drop claim et
 *     tags: [Drops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Claim başarılı
 *       200:
 *         description: Zaten claim edilmiş
 *       400:
 *         description: Claim window açık değil
 *       401:
 *         description: Authentication gerekli
 */
router.post('/:id/claim', authenticateToken, (req, res) => {
  const transaction = db.transaction(() => {
    try {
      const dropId = parseInt(req.params.id);
      const userId = req.user.id;
      const now = Math.floor(Date.now() / 1000);

      const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
      if (!drop) {
        return res.status(404).json({ error: 'Drop not found' });
      }

      if (now < drop.claim_window_start) {
        return res.status(400).json({ error: 'Claim window has not started yet' });
      }

      if (now > drop.claim_window_end) {
        return res.status(400).json({ error: 'Claim window has ended' });
      }

      const existingClaim = db.prepare(`
        SELECT * FROM claims WHERE drop_id = ? AND user_id = ?
      `).get(dropId, userId);

      if (existingClaim) {
        return res.status(200).json({
          message: 'Already claimed',
          claim: existingClaim
        });
      }

      const waitlist = db.prepare(`
        SELECT * FROM waitlists 
        WHERE drop_id = ? AND user_id = ?
        ORDER BY priority_score DESC
      `).get(dropId, userId);

      if (!waitlist) {
        return res.status(403).json({ error: 'Not on waitlist' });
      }

      const claimedCount = db.prepare(`
        SELECT COUNT(*) as count FROM claims WHERE drop_id = ?
      `).get(dropId);

      if (claimedCount.count >= drop.total_stock) {
        return res.status(409).json({ error: 'All stock has been claimed' });
      }

      const waitlistPosition = db.prepare(`
        SELECT COUNT(*) as count 
        FROM waitlists 
        WHERE drop_id = ? AND priority_score > ?
      `).get(dropId, waitlist.priority_score);

      const availableStock = drop.total_stock - claimedCount.count;
      if (waitlistPosition.count >= availableStock) {
        return res.status(409).json({ 
          error: 'Not eligible for claim',
          message: 'Higher priority users have claimed all available stock'
        });
      }

      const claimCode = crypto.randomBytes(16).toString('hex').toUpperCase();

      const result = db.prepare(`
        INSERT INTO claims (drop_id, user_id, claim_code, claimed_at)
        VALUES (?, ?, ?, ?)
      `).run(dropId, userId, claimCode, now);

      const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({
        message: 'Claim successful',
        claim: {
          id: claim.id,
          drop_id: claim.drop_id,
          claim_code: claim.claim_code,
          claimed_at: claim.claimed_at
        }
      });
    } catch (error) {
      console.error('Claim error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  transaction();
});

export default router;

