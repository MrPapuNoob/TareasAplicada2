import { prisma } from "../db.js";

export const crearEncuesta = async (req, res) => {
  const { pregunta, opciones } = req.body;
  const nueva = await prisma.encuesta.create({
    data: { pregunta, opciones },
  });
  res.status(201).json(nueva);
};

export const listarEncuestas = async (_req, res) => {
  const encuestas = await prisma.encuesta.findMany();
  res.json(encuestas);
};

export const votar = async (req, res) => {
  const id = Number(req.params.id);
  const encuesta = await prisma.encuesta.findUnique({ where: { id } });
  if (!encuesta) {
    return res.status(404).json({ error: "Encuesta no encontrada" });
  }
  const { opcion } = req.body;
  if (!encuesta.opciones.includes(opcion)) {
    return res
      .status(400)
      .json({ error: "La opcion no existe en la encuesta" });
  }
  const voto = await prisma.voto.create({
    data: { opcion, encuestaId: id },
  });
  res.status(201).json(voto);
};

export const obtenerResultados = async (req, res) => {
  const id = Number(req.params.id);
  const encuesta = await prisma.encuesta.findUnique({
    where: { id },
    include: { votos: true },
  });
  if (!encuesta) {
    return res.status(404).json({ error: "Encuesta no encontrada" });
  }
  const total = encuesta.votos.length;
  const resultados = encuesta.opciones.map(op => {
    const cantidad = encuesta.votos.filter(v => v.opcion === op).length;
    return {
      opcion: op,
      votos: cantidad,
      porcentaje:
        total === 0 ? 0 : Number(((cantidad / total) * 100).toFixed(2)),
    };
  });
  const maxVotos = Math.max(...resultados.map(r => r.votos), 0);
  const ganadora =
    maxVotos > 0
      ? resultados.filter(r => r.votos === maxVotos).map(r => r.opcion)
      : null;
  res.json({ pregunta: encuesta.pregunta, total, resultados, ganadora });
};

export const eliminarEncuesta = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.encuesta.delete({ where: { id } });
    res.json({ mensaje: "Encuesta eliminada" });
  } catch {
    res.status(404).json({ error: "Encuesta no encontrada" });
  }
};
