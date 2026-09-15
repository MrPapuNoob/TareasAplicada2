import { Router } from "express";
import {
  listarInventario,
  crearProducto,
  entradaStock,
  salidaStock,
  obtenerAlertas,
} from "../controllers/inventario.controller.js";
import {
  validarInventario,
  validarMovimiento,
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/inventario", listarInventario);
router.post("/inventario", validarInventario, crearProducto);
router.post("/inventario/:id/entrada", validarMovimiento, entradaStock);
router.post("/inventario/:id/salida", validarMovimiento, salidaStock);
router.get("/inventario/alertas", obtenerAlertas);

export default router;
