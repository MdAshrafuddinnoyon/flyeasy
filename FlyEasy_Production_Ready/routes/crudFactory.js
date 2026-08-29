// Generic CRUD route factory for simple entity tables.
// Keeps each entity route file tiny while staying explicit about
// which columns are allowed (avoids mass-assignment surprises).
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');

const JSON_COLUMNS = new Set([
  'gallery', 'amenities', 'itinerary', 'inclusions', 'exclusions',
]);

function serializeRow(row) {
  const out = { ...row };
  for (const col of JSON_COLUMNS) {
    if (col in out && typeof out[col] === 'string') {
      try { out[col] = JSON.parse(out[col]); } catch { /* leave as-is */ }
    }
  }
  return out;
}

function buildCrudRouter({ table, columns, publicRead = true, adminWrite = true, publicWrite = false, afterUpdate, afterDelete }) {
  const router = express.Router();

  // LIST
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` ORDER BY created_at DESC`);
      res.json(rows.map(serializeRow));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET ONE
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      res.json(serializeRow(rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const writeGuards = publicWrite ? [] : (adminWrite ? [authRequired, adminRequired] : [authRequired]);

  // CREATE
  router.post('/', ...writeGuards, async (req, res) => {
    try {
      const id = uuidv4();
      const data = {};
      for (const col of columns) {
        if (req.body[col] !== undefined) {
          data[col] = JSON_COLUMNS.has(col) ? JSON.stringify(req.body[col]) : req.body[col];
        }
      }
      const cols = Object.keys(data);
      const placeholders = cols.map(() => '?').join(', ');
      const values = cols.map((c) => data[c]);
      await pool.query(
        `INSERT INTO \`${table}\` (id, ${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (?, ${placeholders})`,
        [id, ...values]
      );
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
      res.status(201).json(serializeRow(rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE
  router.put('/:id', ...writeGuards, async (req, res) => {
    try {
      const data = {};
      for (const col of columns) {
        if (req.body[col] !== undefined) {
          data[col] = JSON_COLUMNS.has(col) ? JSON.stringify(req.body[col]) : req.body[col];
        }
      }
      const cols = Object.keys(data);
      if (!cols.length) return res.status(400).json({ error: 'No fields to update' });
      const setClause = cols.map((c) => `\`${c}\` = ?`).join(', ');
      const values = cols.map((c) => data[c]);
      await pool.query(`UPDATE \`${table}\` SET ${setClause} WHERE id = ?`, [...values, req.params.id]);
      const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      
      const updatedRow = serializeRow(rows[0]);
      if (afterUpdate) {
        await afterUpdate(updatedRow);
      }
      
      res.json(updatedRow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE
  router.delete('/:id', ...writeGuards, async (req, res) => {
    try {
      let deletedRow = null;
      if (afterDelete) {
        const [rows] = await pool.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [req.params.id]);
        if (rows.length) deletedRow = serializeRow(rows[0]);
      }
      
      await pool.query(`DELETE FROM \`${table}\` WHERE id = ?`, [req.params.id]);
      
      if (afterDelete && deletedRow) {
        await afterDelete(deletedRow);
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = buildCrudRouter;
