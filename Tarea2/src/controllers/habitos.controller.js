import { prisma } from "../db.js";

export const crearHabito = async (req, res) => {
  const { nombre, meta } = req.body;
  const nuevo = await prisma.habito.create({
    data: { nombre, meta },
  });
  res.status(201).json(nuevo);
};

export const listarHabitos = async (_req, res) => {
  const habitos = await prisma.habito.findMany();
  res.json(habitos);
};

export const registrarHabito = async (req, res) => {
  const id = Number(req.params.id);
  const habito = await prisma.habito.findUnique({ where: { id } });
  if (!habito) {
    return res.status(404).json({ error: "Habito no encontrado" });
  }
  const fecha = new Date().toISOString().slice(0, 10);
  try {
    const registro = await prisma.registroHabito.create({
      data: { fecha, completado: true, habitoId: id },
    });
    res.status(201).json(registro);
  } catch (e) {
    if (e.code === "P2002") {
      return res
        .status(409)
        .json({ error: "El habito ya fue registrado hoy" });
    }
    throw e;
  }
};

export const obtenerEstadisticas = async (req, res) => {
  const id = Number(req.params.id);
  const habito = await prisma.habito.findUnique({ where: { id } });
  if (!habito) {
    return res.status(404).json({ error: "Habito no encontrado" });
  }
  const registros = await prisma.registroHabito.findMany({
    where: { habitoId: id },
    orderBy: { fecha: "asc" },
  });
  const fechas = registros.map(r => r.fecha);

  if (fechas.length === 0) {
    return res.json({
      rachaActual: 0,
      mejorRacha: 0,
      porcentajeCumplimiento: 0,
    });
  }

  const fechasSet = new Set(fechas);
  let rachaActual = 0;
  let cursor = new Date(fechas[fechas.length - 1]);
  while (true) {
    const f = cursor.toISOString().slice(0, 10);
    if (fechasSet.has(f)) {
      rachaActual++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  let mejorRacha = 1;
  let actual = 1;
  for (let i = 1; i < fechas.length; i++) {
    const prev = new Date(fechas[i - 1]);
    prev.setDate(prev.getDate() + 1);
    if (prev.toISOString().slice(0, 10) === fechas[i]) {
      actual++;
    } else {
      actual = 1;
    }
    if (actual > mejorRacha) mejorRacha = actual;
  }

  const primera = new Date(fechas[0]);
  const hoy = new Date();
  const diasTotales =
    Math.floor((hoy - primera) / (1000 * 60 * 60 * 24)) + 1;
  const porcentajeCumplimiento = Number(
    ((fechas.length / diasTotales) * 100).toFixed(2)
  );

  res.json({ rachaActual, mejorRacha, porcentajeCumplimiento });
};

export const eliminarHabito = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.habito.delete({ where: { id } });
    res.json({ mensaje: "Habito eliminado" });
  } catch {
    res.status(404).json({ error: "Habito no encontrado" });
  }
};
