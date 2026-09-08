import express from 'express';
import { logger, requireFields } from '../shared/middleware.js';

const app = express();
app.use(express.json());
app.use(logger);

let habitos = [];
let nextId = 1;

const findById = (id) => habitos.find((h) => h.id === Number(id));
const fechaHoy = () => new Date().toISOString().slice(0, 10);
const parseFecha = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const diffDias = (a, b) => {
  const ms = parseFecha(b).getTime() - parseFecha(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

const calcularEstadisticas = (registros) => {
  if (!registros || registros.length === 0) {
    return {
      totalRegistros: 0,
      diasCumplidos: 0,
      rachaActual: 0,
      mejorRacha: 0,
      porcentajeCumplimiento: 0,
    };
  }
  const completados = registros
    .filter((r) => r.completado)
    .map((r) => r.fecha)
    .sort();
  const totalRegistros = registros.length;
  const diasCumplidos = completados.length;

  let mejorRacha = 0;
  let actual = 0;
  let anterior = null;
  for (const f of completados) {
    if (anterior === null || diffDias(anterior, f) === 1) {
      actual += 1;
    } else if (diffDias(anterior, f) === 0) {
    } else {
      actual = 1;
    }
    if (actual > mejorRacha) mejorRacha = actual;
    anterior = f;
  }

  const hoy = fechaHoy();
  let rachaActual = 0;
  let cursor = hoy;
  while (completados.includes(cursor)) {
    rachaActual += 1;
    const d = parseFecha(cursor);
    d.setUTCDate(d.getUTCDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }

  const porcentajeCumplimiento =
    totalRegistros === 0
      ? 0
      : Number(((diasCumplidos / totalRegistros) * 100).toFixed(2));

  return {
    totalRegistros,
    diasCumplidos,
    rachaActual,
    mejorRacha,
    porcentajeCumplimiento,
  };
};

app.post(
  '/habitos',
  requireFields(['nombre', 'meta']),
  (req, res) => {
    const { nombre, meta } = req.body;
    if (
      typeof nombre !== 'string' ||
      nombre.trim() === '' ||
      typeof meta !== 'string' ||
      meta.trim() === ''
    ) {
      return res
        .status(400)
        .json({ error: 'nombre y meta deben ser strings no vacíos' });
    }
    const habito = {
      id: nextId++,
      nombre: nombre.trim(),
      meta: meta.trim(),
      registros: [],
    };
    habitos.push(habito);
    res.status(201).json(habito);
  }
);

app.get('/habitos', (req, res) => {
  res.json(habitos);
});

app.post('/habitos/:id/registrar', (req, res) => {
  const id = Number(req.params.id);
  const habito = findById(id);
  if (!habito) {
    return res.status(404).json({ error: 'Hábito no encontrado' });
  }
  const hoy = fechaHoy();
  const yaRegistrado = habito.registros.some((r) => r.fecha === hoy);
  if (yaRegistrado) {
    return res
      .status(400)
      .json({ error: 'Ya se registró este hábito hoy' });
  }
  habito.registros.push({ fecha: hoy, completado: true });
  res.json(habito);
});

app.get('/habitos/:id/estadisticas', (req, res) => {
  const id = Number(req.params.id);
  const habito = findById(id);
  if (!habito) {
    return res.status(404).json({ error: 'Hábito no encontrado' });
  }
  res.json({
    id: habito.id,
    nombre: habito.nombre,
    meta: habito.meta,
    ...calcularEstadisticas(habito.registros),
  });
});

app.delete('/habitos/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = habitos.findIndex((h) => h.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Hábito no encontrado' });
  }
  const [eliminado] = habitos.splice(idx, 1);
  res.json({ mensaje: 'Hábito eliminado', habito: eliminado });
});

app.listen(3004, () => {
  console.log('API5 - Habitos corriendo en puerto 3004');
});
