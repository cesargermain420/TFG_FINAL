const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/valoraciones?evento_id=X  — valoraciones + media de un evento
router.get('/', async (req, res) => {
  try {
    const { evento_id } = req.query;
    const where  = evento_id ? 'WHERE evento_id = ?' : '';
    const params = evento_id ? [evento_id] : [];
    const [rows] = await db.query(
      `SELECT * FROM valoraciones ${where} ORDER BY created_at DESC`,
      params
    );

    if (evento_id) {
      const [[{ media, total }]] = await db.query(
        'SELECT ROUND(AVG(puntuacion), 1) AS media, COUNT(*) AS total FROM valoraciones WHERE evento_id = ?',
        [evento_id]
      );
      return res.json({ valoraciones: rows, media: media ?? 0, total });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/valoraciones  — cualquier visitante puede valorar
router.post('/', async (req, res) => {
  try {
    const { evento_id, puntuacion } = req.body;
    if (!evento_id || !puntuacion) {
      return res.status(400).json({ error: 'evento_id y puntuacion son obligatorios' });
    }
    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ error: 'La puntuacion debe estar entre 1 y 5' });
    }
    const [result] = await db.query(
      'INSERT INTO valoraciones (evento_id, puntuacion) VALUES (?, ?)',
      [evento_id, puntuacion]
    );
    const [rows] = await db.query('SELECT * FROM valoraciones WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
