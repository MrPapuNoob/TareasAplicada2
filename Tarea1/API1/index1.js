import express from 'express';
import { logger, requireFields } from '../shared/middleware.js';

const app = express();
app.use(express.json());
app.use(logger);

let productos = [];
let nextId = 1;

const normNombre = (s) => String(s).trim().toLowerCase();
const findById = (id) => productos.find((p) => p.id === Number(id));
const findByNombre = (nombre) =>
  productos.find((p) => normNombre(p.nombre) === normNombre(nombre));
const isPositiveNumber = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

const validarProductoPayload = (body) => {
  const { nombre, precio, cantidad } = body || {};
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return 'nombre es requerido (string no vacío)';
  }
  if (!isPositiveNumber(precio)) {
    return 'precio debe ser un número positivo';
  }
  if (!isPositiveNumber(cantidad)) {
    return 'cantidad debe ser un número positivo';
  }
  return null;
};

const validarCantidadPayload = (body) => {
  const { cantidad } = body || {};
  if (!isPositiveNumber(cantidad)) {
    return 'cantidad debe ser un número positivo';
  }
  return null;
};

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.post(
  '/productos',
  requireFields(['nombre', 'precio', 'cantidad']),
  (req, res) => {
    const error = validarProductoPayload(req.body);
    if (error) return res.status(400).json({ error });

    const { nombre, precio, cantidad } = req.body;
    const existente = findByNombre(nombre);
    if (existente) {
      existente.cantidad += cantidad;
      return res.status(200).json(existente);
    }

    const nuevo = {
      id: nextId++,
      nombre: nombre.trim(),
      precio,
      cantidad,
    };
    productos.push(nuevo);
    res.status(201).json(nuevo);
  }
);

app.put(
  '/productos/:id',
  requireFields(['cantidad']),
  (req, res) => {
    const error = validarCantidadPayload(req.body);
    if (error) return res.status(400).json({ error });

    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id inválido' });
    }
    const producto = findById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    producto.cantidad = req.body.cantidad;
    res.json(producto);
  }
);

app.delete('/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id inválido' });
  }
  const idx = productos.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  const [eliminado] = productos.splice(idx, 1);
  res.json({ mensaje: 'Producto eliminado', producto: eliminado });
});

const calcularTotal = () =>
  productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

app.get('/carrito/total', (req, res) => {
  res.json({ total: calcularTotal() });
});

app.post(
  '/carrito/aplicar-descuento',
  requireFields(['porcentaje']),
  (req, res) => {
    const { porcentaje } = req.body;
    if (typeof porcentaje !== 'number' || !Number.isFinite(porcentaje)) {
      return res.status(400).json({ error: 'porcentaje debe ser un número' });
    }
    if (porcentaje < 0 || porcentaje > 50) {
      return res
        .status(400)
        .json({ error: 'Descuento máximo permitido: 50%' });
    }
    const total = calcularTotal();
    const descuento = total * (porcentaje / 100);
    const totalConDescuento = total - descuento;
    res.json({
      total,
      porcentaje,
      descuento: Number(descuento.toFixed(2)),
      totalConDescuento: Number(totalConDescuento.toFixed(2)),
    });
  }
);

app.listen(3000, () => {
  console.log('API1 - Carrito corriendo en puerto 3000');
});
