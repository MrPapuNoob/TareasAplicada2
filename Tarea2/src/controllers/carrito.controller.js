import { prisma } from "../db.js";

export const listarProductos = async (_req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
};

export const crearProducto = async (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  const existe = await prisma.producto.findFirst({ where: { nombre } });
  if (existe) {
    const actualizado = await prisma.producto.update({
      where: { id: existe.id },
      data: { cantidad: existe.cantidad + cantidad },
    });
    return res.status(200).json(actualizado);
  }
  const nuevo = await prisma.producto.create({
    data: { nombre, precio, cantidad },
  });
  res.status(201).json(nuevo);
};

export const actualizarProducto = async (req, res) => {
  const id = Number(req.params.id);
  const existe = await prisma.producto.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  const actualizado = await prisma.producto.update({
    where: { id },
    data: { cantidad: req.body.cantidad },
  });
  res.json(actualizado);
};

export const eliminarProducto = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.producto.delete({ where: { id } });
    res.json({ mensaje: "Producto eliminado" });
  } catch {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const obtenerTotal = async (_req, res) => {
  const productos = await prisma.producto.findMany();
  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  res.json({ total });
};

export const aplicarDescuento = async (req, res) => {
  const productos = await prisma.producto.findMany();
  const subtotal = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const { porcentaje } = req.body;
  const descuento = subtotal * (porcentaje / 100);
  const total = subtotal - descuento;
  res.json({ subtotal, porcentaje, descuento, total });
};
