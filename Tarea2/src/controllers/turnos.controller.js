import { prisma } from "../db.js";

export const crearTurno = async (req, res) => {
  const { cliente, servicio } = req.body;
  const nuevo = await prisma.turno.create({
    data: { cliente, servicio },
  });
  res.status(201).json(nuevo);
};

export const listarTurnos = async (_req, res) => {
  const turnos = await prisma.turno.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(turnos);
};

export const obtenerSiguiente = async (_req, res) => {
  const siguiente = await prisma.turno.findFirst({
    where: { estado: "esperando" },
    orderBy: { createdAt: "asc" },
  });
  if (!siguiente) {
    return res.status(404).json({ error: "No hay turnos en espera" });
  }
  res.json(siguiente);
};

export const llamarSiguiente = async (_req, res) => {
  const atendiendo = await prisma.turno.findFirst({
    where: { estado: "atendiendo" },
  });
  if (atendiendo) {
    return res.status(409).json({
      error: "Ya hay un turno siendo atendido",
      turno: atendiendo,
    });
  }
  const siguiente = await prisma.turno.findFirst({
    where: { estado: "esperando" },
    orderBy: { createdAt: "asc" },
  });
  if (!siguiente) {
    return res.status(404).json({ error: "No hay turnos en espera" });
  }
  const actualizado = await prisma.turno.update({
    where: { id: siguiente.id },
    data: { estado: "atendiendo" },
  });
  res.json(actualizado);
};

export const finalizarTurno = async (req, res) => {
  const id = Number(req.params.id);
  const turno = await prisma.turno.findUnique({ where: { id } });
  if (!turno) {
    return res.status(404).json({ error: "Turno no encontrado" });
  }
  if (turno.estado === "finalizado") {
    return res.status(400).json({ error: "El turno ya esta finalizado" });
  }
  const actualizado = await prisma.turno.update({
    where: { id },
    data: { estado: "finalizado" },
  });
  res.json(actualizado);
};

export const contarEspera = async (_req, res) => {
  const enEspera = await prisma.turno.count({
    where: { estado: "esperando" },
  });
  res.json({ enEspera });
};
