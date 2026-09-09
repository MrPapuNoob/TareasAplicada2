import "dotenv/config";
import middleware from "./middleware.js";
import express from "express";
import { PrismaClient } from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import {logger, validarDescripcion} from "./middleware.js";

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());


app.get("/tareas", async (req, res) => {const tareas = await prisma.tarea.findMany();
  res.json(tareas);
});

app.get("/tareas/:id", async (req, res) => {
  const { id } = parseInt(req.params.id);
  const tarea = await prisma.tarea.findUnique({ where: { id } });

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(tarea);
});


//POST: Crear nueva tarea
app.post("/tareas", validarDescripcion, async (req, res) => {
  const { descripcion } = req.body;
  const nuevaTarea = await prisma.tarea.create({ descripcion });
  res.status(201).json(tarea);
});


//PUT: Actualizacion dinamica
app.put("/tareas/:id", validarDescripcion, async (req, res) => {
  const { id } = parseInt(req.params.id);
  const { tareaExiste } = await prisma.tarea.findUnique({ where: { id } });
  if (!tareaExiste) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  const { descripcion, completada } = req.body;
  
  const tareaActualizada = await prisma.tarea.update({
    where: { id },
    data: { ...(descripcion !== undefined ? { descripcion } : {}),
        ...(completada !== undefined ? { completada } : {}),

    },
  });
  res.json(tarea);
});


app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});