const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRouter        = require('./routes/auth');
const eventosRouter     = require('./routes/eventos');
const baresRouter       = require('./routes/bares');
const usuariosRouter    = require('./routes/usuarios');
const comentariosRouter = require('./routes/comentarios');
const valoracionesRouter= require('./routes/valoraciones');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth',        authRouter);
app.use('/api/eventos',     eventosRouter);
app.use('/api/bares',       baresRouter);
app.use('/api/usuarios',    usuariosRouter);
app.use('/api/comentarios', comentariosRouter);
app.use('/api/valoraciones',valoracionesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n  Granada Eventos API corriendo en http://localhost:${PORT}`);
  console.log(`  Endpoints disponibles:`);
  console.log(`    GET  /api/health`);
  console.log(`    POST /api/auth/login`);
  console.log(`    GET  /api/eventos`);
  console.log(`    POST /api/eventos          (admin)`);
  console.log(`    PUT  /api/eventos/:id      (admin)`);
  console.log(`    DELETE /api/eventos/:id    (admin)`);
  console.log(`    GET  /api/bares`);
  console.log(`    POST /api/bares            (admin)`);
  console.log(`    PUT  /api/bares/:id        (admin)`);
  console.log(`    DELETE /api/bares/:id      (admin)`);
  console.log(`    GET  /api/usuarios         (admin)`);
  console.log(`    POST /api/usuarios`);
  console.log(`    DELETE /api/usuarios/:id   (admin)`);
  console.log(`    GET  /api/comentarios?evento_id=X`);
  console.log(`    POST /api/comentarios`);
  console.log(`    DELETE /api/comentarios/:id (admin)`);
  console.log(`    GET  /api/valoraciones?evento_id=X`);
  console.log(`    POST /api/valoraciones\n`);
});
