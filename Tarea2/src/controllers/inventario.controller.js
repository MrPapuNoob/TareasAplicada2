import { prisma } from "../db.js";

export const listarInventario = async (_req, res) => {
  const inventario = await prisma.inventario.findMany();
  res.json(inventario);
};

export const crearProducto = async (req, res) => {
  const { producto, stock, stockMinimo = 5 } = req.body;
  const nuevo = await prisma.inventario.create({
    data: { producto, stock, stockMinimo },
  });
  res.status(201).json(nuevo);
};

export const entradaStock = async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.inventario.findUnique({ where: { id } });
  if (!item) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  const actualizado = await prisma.inventario.update({
    where: { id },
    data: { stock: item.stock + req.body.cantidad },
  });
  res.json(actualizado);
};

export const salidaStock = async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.inventario.findUnique({ where: { id } });
  if (!item) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  if (req.body.cantidad > item.stock) {
    return res
      .status(400)
      .json({ error: "Cantidad mayor al stock disponible" });
  }
  const actualizado = await prisma.inventario.update({
    where: { id },
    data: { stock: item.stock - req.body.cantidad },
  });
  res.json(actualizado);
};

export const obtenerAlertas = async (_req, res) => {
  const todos = await prisma.inventario.findMany();
  const alertas = todos
    .filter(item => item.stock < item.stockMinimo)
    .map(item => ({ ...item, falta: item.stockMinimo - item.stock }));
  res.json(alertas);
};
