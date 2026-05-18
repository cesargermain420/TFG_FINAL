const express = require('express');
const router  = express.Router();
const db      = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/comentarios?evento_id=X  — comentarios de un evento
router.get('/', async (req, res) => {
  try {
    const { evento_id } = req.query;
    const where  = evento_id ? 'WHERE evento_id = ?' : '';
    const params = evento_id ? [evento_id] : [];
    const [rows] = await db.query(
      `SELECT * FROM comentarios ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/comentarios  — cualquier visitante puede comentar
router.post('/', async (req, res) => {
  try {
    const { evento_id, autor, texto } = req.body;
    if (!evento_id || !texto) {
      return res.status(400).json({ error: 'evento_id y texto son obligatorios' });
    }
    const [result] = await db.query(
      'INSERT INTO comentarios (evento_id, autor, texto) VALUES (?, ?, ?)',
      [evento_id, autor ?? 'Visitante', texto]
    );
    const [rows] = await db.query('SELECT * FROM comentarios WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comentarios/:id  — solo admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM comentarios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
