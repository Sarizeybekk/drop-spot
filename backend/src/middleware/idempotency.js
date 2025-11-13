import db from '../db/database.js';
import crypto from 'crypto';

export function idempotencyCheck(table, uniqueFields) {
  return (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];
    
    if (!idempotencyKey) {
      return next();
    }

    try {
      const checkQuery = `SELECT * FROM ${table} WHERE idempotency_key = ?`;
      const existing = db.prepare(checkQuery).get(idempotencyKey);
      
      if (existing) {
        return res.status(200).json({
          message: 'Operation already completed',
          data: existing
        });
      }
      
      req.idempotencyKey = idempotencyKey;
      next();
    } catch (error) {
      next();
    }
  };
}

export function generateIdempotencyKey() {
  return crypto.randomBytes(16).toString('hex');
}

