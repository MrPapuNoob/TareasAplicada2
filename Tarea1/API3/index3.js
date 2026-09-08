import express from 'express';
import { logger, requireFields } from '../shared/middleware.js';

const app = express();
app.use(express.json());
app.use(logger);

let inventario = [];
let nextId = 1;

const STOCK_MINIMO_DEFECTO = 5;
const findById = (id) => inventario.find((p) => p.id === Number(id));
const isNonNegativeNumber = (v) =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0;
const isPositiveNumber = (v) =>
  typeof v === 'number' && Number.isFinite(v) && v > 0;

app.get('/inventario', (req, res) => {
  res.json(inventario);
});

app.post(
  '/inventario',
  requireFields(['producto', 'stock']),
  (req, res) => {
    const { producto, stock, stockMinimo } = req.body;
    if (typeof producto !== 'string' || producto.trim() === '') {
      return res
        .status(400)
        .json({ error: 'producto debe ser un string no vacío' });
    }
    if (!isNonNegativeNumber(stock)) {
      return res
        .status(400)
        .json({ error: 'stock debe ser un número >= 0' });
    }
    let minimo = STOCK_MINIMO_DEFECTO;
    if (stockMinimo !== undefined && stockMinimo !== null) {
      if (!isNonNegativeNumber(stockMinimo)) {
        return res
          .status(400)
          .json({ error: 'stockMinimo debe ser un número >= 0' });
      }
      minimo = stockMinimo;
    }
    const item = {
      id: nextId++,
      producto: producto.trim(),
      stock,
      stockMinimo: minimo,
    };
    inventario.push(item);
    res.status(201).json(item);
  }
);

app.post(
  '/inventario/:id/entrada',
  requireFields(['cantidad']),
  (req, res) => {
    const { cantidad } = req.body;
    if (!isPositiveNumber(cantidad)) {
      return res
        .status(400)
        .json({ error: 'cantidad debe ser un número positivo' });
    }
    const id = Number(req.params.id);
    const item = findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    item.stock += cantidad;
    res.json(item);
  }
);

app.post(
  '/inventario/:id/salida',
  requireFields(['cantidad']),
  (req, res) => {
    const { cantidad } = req.body;
    if (!isPositiveNumber(cantidad)) {
      return res
        .status(400)
        .json({ error: 'cantidad debe ser un número positivo' });
    }
    const id = Number(req.params.id);
    const item = findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (cantidad > item.stock) {
      return res.status(400).json({
        error: 'Stock insuficiente para realizar la salida',
        stockDisponible: item.stock,
        cantidadSolicitada: cantidad,
      });
    }
    item.stock -= cantidad;
    res.json(item);
  }
);

app.get('/inventario/alertas', (req, res) => {
  const alertas = inventario
    .filter((it) => it.stock < it.stockMinimo)
    .map((it) => ({
      id: it.id,
      producto: it.producto,
      stock: it.stock,
      stockMinimo: it.stockMinimo,
      falta: it.stockMinimo - it.stock,
    }));
  res.json(alertas);
});

app.listen(3002, () => {
  console.log('API3 - Inventario corriendo en puerto 3002');
});
