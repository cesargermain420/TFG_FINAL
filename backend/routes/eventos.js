const express      = require('express');
const router       = express.Router();
const db           = require('../db');
const { requireAdmin } = require('../middleware/auth');

function rowToEvento(row) {
  const fecha = row.fecha instanceof Date
    ? row.fecha.toISOString().split('T')[0]
    : String(row.fecha);
  return {
    id:          String(row.id),
    titulo:      row.titulo,
    zona:        row.zona,
    fecha,
    hora:        row.hora,
    precio:      row.precio      ?? '',
    ubicacion:   row.ubicacion   ?? '',
    descripcion: row.descripcion ?? '',
    categoria:   row.categoria   ?? '',
    aforo:       row.aforo       ?? '',
    organizador: row.organizador ?? '',
    ...(row.imagen ? { imagen: row.imagen } : {}),
  };
}

// GET /api/eventos
router.get('/', async (req, res) => {
  try {
    const { zona, categoria } = req.query;
    const conditions = [];
    const params     = [];

    if (zona && zona !== 'Todas') { conditions.push('zona = ?');      params.push(zona); }
    if (categoria)                 { conditions.push('categoria = ?'); params.push(categoria); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [rows] = await db.query(`SELECT * FROM eventos ${where} ORDER BY fecha ASC`, params);
    res.json(rows.map(rowToEvento));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/eventos/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(rowToEvento(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/eventos  — solo admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { titulo, zona, fecha, hora, precio, ubicacion, descripcion, categoria, aforo, organizador, imagen } = req.body;
    const [result] = await db.query(
      `INSERT INTO eventos (titulo, zona, fecha, hora, precio, ubicacion, descripcion, categoria, aforo, organizador, imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, zona, fecha, hora, precio ?? '', ubicacion ?? '', descripcion ?? '', categoria ?? '', aforo ?? '', organizador ?? '', imagen ?? null]
    );
    const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [result.insertId]);
    res.status(201).json(rowToEvento(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/eventos/:id  — solo admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    const base = rowToEvento(existing[0]);
    const merged = { ...base, ...req.body };

    await db.query(
      `UPDATE eventos SET titulo=?, zona=?, fecha=?, hora=?, precio=?, ubicacion=?, descripcion=?, categoria=?, aforo=?, organizador=?, imagen=?
       WHERE id=?`,
      [merged.titulo, merged.zona, merged.fecha, merged.hora, merged.precio, merged.ubicacion,
       merged.descripcion, merged.categoria, merged.aforo, merged.organizador, merged.imagen ?? null, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
    res.json(rowToEvento(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/eventos/:id  — solo admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM eventos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
