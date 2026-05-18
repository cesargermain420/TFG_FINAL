const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  if (
    usuario === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'granada_secret',
      { expiresIn: '24h' }
    );
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Credenciales incorrectas' });
});

module.exports = router;
