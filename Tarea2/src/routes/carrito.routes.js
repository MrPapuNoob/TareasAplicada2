import { Router } from "express";
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerTotal,
  aplicarDescuento,
} from "../controllers/carrito.controller.js";
import {
  validarProducto,
  validarCantidad,
  validarDescuento,
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/productos", listarProductos);
router.post("/productos", validarProducto, crearProducto);
router.put("/productos/:id", validarCantidad, actualizarProducto);
router.delete("/productos/:id", eliminarProducto);

router.get("/carrito/total", obtenerTotal);
router.post("/carrito/aplicar-descuento", validarDescuento, aplicarDescuento);

export default router;
