const express      = require('express');
const router       = express.Router();
const db           = require('../db');
const { requireAdmin } = require('../middleware/auth');

function rowToBar(row) {
  return {
    id:      String(row.id),
    nombre:  row.nombre,
    zona:    row.zona,
    ...(row.descripcion ? { descripcion: row.descripcion } : {}),
    ...(row.direccion   ? { direccion:   row.direccion   } : {}),
    ...(row.horarios    ? { horarios:    row.horarios    } : {}),
    ...(row.telefono    ? { telefono:    row.telefono    } : {}),
    ...(row.imagen      ? { imagen:      row.imagen      } : {}),
  };
}

// GET /api/bares
router.get('/', async (req, res) => {
  try {
    const { zona } = req.query;
    const where  = zona ? 'WHERE zona = ?' : '';
    const params = zona ? [zona] : [];
    const [rows] = await db.query(`SELECT * FROM bares ${where} ORDER BY nombre ASC`, params);
    res.json(rows.map(rowToBar));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bares/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bares WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Bar no encontrado' });
    res.json(rowToBar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bares  — solo admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { nombre, zona, descripcion, direccion, horarios, telefono, imagen } = req.body;
    const [result] = await db.query(
      `INSERT INTO bares (nombre, zona, descripcion, direccion, horarios, telefono, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, zona, descripcion ?? null, direccion ?? null, horarios ?? null, telefono ?? null, imagen ?? null]
    );
    const [rows] = await db.query('SELECT * FROM bares WHERE id = ?', [result.insertId]);
    res.status(201).json(rowToBar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bares/:id  — solo admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM bares WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Bar no encontrado' });

    const base   = rowToBar(existing[0]);
    const merged = { ...base, ...req.body };

    await db.query(
      `UPDATE bares SET nombre=?, zona=?, descripcion=?, direccion=?, horarios=?, telefono=?, imagen=? WHERE id=?`,
      [merged.nombre, merged.zona, merged.descripcion ?? null, merged.direccion ?? null,
       merged.horarios ?? null, merged.telefono ?? null, merged.imagen ?? null, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM bares WHERE id = ?', [req.params.id]);
    res.json(rowToBar(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bares/:id  — solo admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM bares WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Bar no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
