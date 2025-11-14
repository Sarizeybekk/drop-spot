import express from 'express';
import db from '../db/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

const dropSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  total_stock: z.number().int().positive('Total stock must be positive'),
  claim_window_start: z.number().int().positive('Claim window start is required'),
  claim_window_end: z.number().int().positive('Claim window end is required')
}).refine(data => data.claim_window_end > data.claim_window_start, {
  message: 'Claim window end must be after start',
  path: ['claim_window_end']
});

function validateDrop(req, res, next) {
  try {
    req.body = dropSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    next(error);
  }
}

router.get('/drops', (req, res) => {
  try {
    const drops = db.prepare(`
      SELECT 
        id,
        title,
        description,
        total_stock,
        claim_window_start,
        claim_window_end,
        created_at,
        updated_at
      FROM drops
      ORDER BY created_at DESC
    `).all();

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
        available_stock: drop.total_stock - claimedCount.count
      };
    });

    res.json({ drops: dropsWithStats });
  } catch (error) {
    console.error('Get admin drops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/drops', validateDrop, (req, res) => {
  try {
    const { title, description, total_stock, claim_window_start, claim_window_end } = req.body;
    const now = Math.floor(Date.now() / 1000);

    const result = db.prepare(`
      INSERT INTO drops (title, description, total_stock, claim_window_start, claim_window_end, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description || null, total_stock, claim_window_start, claim_window_end, now, now);

    const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Drop created successfully',
      drop: {
        id: drop.id,
        title: drop.title,
        description: drop.description,
        total_stock: drop.total_stock,
        claim_window_start: drop.claim_window_start,
        claim_window_end: drop.claim_window_end,
        created_at: drop.created_at,
        updated_at: drop.updated_at
      }
    });
  } catch (error) {
    console.error('Create drop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/drops/:id', validateDrop, (req, res) => {
  try {
    const dropId = parseInt(req.params.id);
    const { title, description, total_stock, claim_window_start, claim_window_end } = req.body;
    const now = Math.floor(Date.now() / 1000);

    const existingDrop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
    if (!existingDrop) {
      return res.status(404).json({ error: 'Drop not found' });
    }

    const claimedCount = db.prepare(`
      SELECT COUNT(*) as count FROM claims WHERE drop_id = ?
    `).get(dropId);

    if (total_stock < claimedCount.count) {
      return res.status(400).json({ 
        error: 'Total stock cannot be less than already claimed items',
        claimed_count: claimedCount.count
      });
    }

    db.prepare(`
      UPDATE drops 
      SET title = ?, description = ?, total_stock = ?, 
          claim_window_start = ?, claim_window_end = ?, updated_at = ?
      WHERE id = ?
    `).run(title, description || null, total_stock, claim_window_start, claim_window_end, now, dropId);

    const updatedDrop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);

    res.json({
      message: 'Drop updated successfully',
      drop: {
        id: updatedDrop.id,
        title: updatedDrop.title,
        description: updatedDrop.description,
        total_stock: updatedDrop.total_stock,
        claim_window_start: updatedDrop.claim_window_start,
        claim_window_end: updatedDrop.claim_window_end,
        created_at: updatedDrop.created_at,
        updated_at: updatedDrop.updated_at
      }
    });
  } catch (error) {
    console.error('Update drop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/drops/:id', (req, res) => {
  try {
    const dropId = parseInt(req.params.id);

    const drop = db.prepare('SELECT * FROM drops WHERE id = ?').get(dropId);
    if (!drop) {
      return res.status(404).json({ error: 'Drop not found' });
    }

    db.prepare('DELETE FROM drops WHERE id = ?').run(dropId);

    res.json({ message: 'Drop deleted successfully' });
  } catch (error) {
    console.error('Delete drop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

