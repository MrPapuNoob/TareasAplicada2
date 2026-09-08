import express from 'express';
import { logger, requireFields } from '../shared/middleware.js';

const app = express();
app.use(express.json());
app.use(logger);

const ESTADOS = ['esperando', 'atendiendo', 'finalizado'];
let turnos = [];
let nextId = 1;

const findById = (id) => turnos.find((t) => t.id === Number(id));
const findSiguiente = () =>
  [...turnos]
    .filter((t) => t.estado === 'esperando')
    .sort((a, b) => a.id - b.id)[0];
const hayAtendiendo = () => turnos.some((t) => t.estado === 'atendiendo');

app.post(
  '/turnos',
  requireFields(['cliente', 'servicio']),
  (req, res) => {
    const { cliente, servicio } = req.body;
    if (
      typeof cliente !== 'string' ||
      cliente.trim() === '' ||
      typeof servicio !== 'string' ||
      servicio.trim() === ''
    ) {
      return res
        .status(400)
        .json({ error: 'cliente y servicio deben ser strings no vacíos' });
    }
    const turno = {
      id: nextId++,
      cliente: cliente.trim(),
      servicio: servicio.trim(),
      estado: 'esperando',
      creadoEn: new Date().toISOString(),
    };
    turnos.push(turno);
    res.status(201).json(turno);
  }
);

app.get('/turnos', (req, res) => {
  res.json(turnos);
});

app.get('/turnos/siguiente', (req, res) => {
  const siguiente = findSiguiente();
  if (!siguiente) {
    return res
      .status(404)
      .json({ error: 'No hay turnos en cola' });
  }
  res.json(siguiente);
});

app.put('/turnos/llamar', (req, res) => {
  if (hayAtendiendo()) {
    return res.status(400).json({
      error: 'Ya hay un turno siendo atendido. Finalícelo antes de llamar al siguiente.',
    });
  }
  const siguiente = findSiguiente();
  if (!siguiente) {
    return res
      .status(404)
      .json({ error: 'No hay turnos en cola' });
  }
  siguiente.estado = 'atendiendo';
  res.json(siguiente);
});

app.put('/turnos/:id/finalizar', (req, res) => {
  const id = Number(req.params.id);
  const turno = findById(id);
  if (!turno) {
    return res.status(404).json({ error: 'Turno no encontrado' });
  }
  if (turno.estado !== 'atendiendo') {
    return res.status(400).json({
      error: `Solo se pueden finalizar turnos en estado "atendiendo" (actual: "${turno.estado}")`,
    });
  }
  turno.estado = 'finalizado';
  res.json(turno);
});

app.get('/turnos/espera', (req, res) => {
  const enEspera = turnos.filter((t) => t.estado === 'esperando').length;
  res.json({ enEspera });
});

app.listen(3003, () => {
  console.log('API4 - Turnos corriendo en puerto 3003');
});
