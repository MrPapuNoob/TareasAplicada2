import express from 'express';
import { logger, requireFields } from '../shared/middleware.js';

const app = express();
app.use(express.json());
app.use(logger);

let encuestas = [];
let nextId = 1;

const findById = (id) => encuestas.find((e) => e.id === Number(id));
const eliminarPorId = (id) => {
  const idx = encuestas.findIndex((e) => e.id === Number(id));
  if (idx === -1) return null;
  const [e] = encuestas.splice(idx, 1);
  return e;
};

const validarEncuestaPayload = (body) => {
  const { pregunta, opciones } = body || {};
  if (typeof pregunta !== 'string' || pregunta.trim() === '') {
    return 'pregunta es requerida (string no vacío)';
  }
  if (!Array.isArray(opciones)) {
    return 'opciones debe ser un arreglo';
  }
  if (opciones.length < 2) {
    return 'Se requieren mínimo 2 opciones';
  }
  for (const op of opciones) {
    if (typeof op !== 'string' || op.trim() === '') {
      return 'Cada opción debe ser un string no vacío';
    }
  }
  const limpias = opciones.map((o) => o.trim());
  const set = new Set(limpias.map((o) => o.toLowerCase()));
  if (set.size !== limpias.length) {
    return 'Las opciones no pueden repetirse';
  }
  return null;
};

app.post(
  '/encuestas',
  requireFields(['pregunta', 'opciones']),
  (req, res) => {
    const error = validarEncuestaPayload(req.body);
    if (error) return res.status(400).json({ error });

    const opciones = req.body.opciones.map((o) => o.trim());
    const votos = {};
    for (const op of opciones) votos[op] = 0;

    const encuesta = {
      id: nextId++,
      pregunta: req.body.pregunta.trim(),
      opciones,
      votos,
    };
    encuestas.push(encuesta);
    res.status(201).json(encuesta);
  }
);

app.get('/encuestas', (req, res) => {
  res.json(encuestas);
});

app.post(
  '/encuestas/:id/votar',
  requireFields(['opcion']),
  (req, res) => {
    const id = Number(req.params.id);
    const encuesta = findById(id);
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }
    const { opcion } = req.body;
    if (typeof opcion !== 'string') {
      return res.status(400).json({ error: 'opcion debe ser un string' });
    }
    if (!encuesta.opciones.includes(opcion)) {
      return res
        .status(400)
        .json({ error: `La opción "${opcion}" no existe en esta encuesta` });
    }
    encuesta.votos[opcion] += 1;
    res.json(encuesta);
  }
);

app.get('/encuestas/:id/resultados', (req, res) => {
  const id = Number(req.params.id);
  const encuesta = findById(id);
  if (!encuesta) {
    return res.status(404).json({ error: 'Encuesta no encontrada' });
  }
  const total = Object.values(encuesta.votos).reduce((a, b) => a + b, 0);
  const resultados = encuesta.opciones.map((op) => ({
    opcion: op,
    votos: encuesta.votos[op],
    porcentaje: total === 0 ? 0 : Number(((encuesta.votos[op] / total) * 100).toFixed(2)),
  }));
  let max = -1;
  for (const r of resultados) if (r.votos > max) max = r.votos;
  let ganador = null;
  let empatadas = [];
  if (total > 0) {
    empatadas = resultados.filter((r) => r.votos === max).map((r) => r.opcion);
    if (empatadas.length === 1) {
      ganador = empatadas[0];
      empatadas = [];
    }
  }
  res.json({
    id: encuesta.id,
    pregunta: encuesta.pregunta,
    total,
    resultados,
    ganador,
    empatadas,
  });
});

app.delete('/encuestas/:id', (req, res) => {
  const id = Number(req.params.id);
  const eliminada = eliminarPorId(id);
  if (!eliminada) {
    return res.status(404).json({ error: 'Encuesta no encontrada' });
  }
  res.json({ mensaje: 'Encuesta eliminada', encuesta: eliminada });
});

app.listen(3001, () => {
  console.log('API2 - Votacion corriendo en puerto 3001');
});
