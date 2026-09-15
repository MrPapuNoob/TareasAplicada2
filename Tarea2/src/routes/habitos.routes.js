import { Router } from "express";
import {
  crearHabito,
  listarHabitos,
  registrarHabito,
  obtenerEstadisticas,
  eliminarHabito,
} from "../controllers/habitos.controller.js";
import { validarHabito } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/habitos", validarHabito, crearHabito);
router.get("/habitos", listarHabitos);
router.post("/habitos/:id/registrar", registrarHabito);
router.get("/habitos/:id/estadisticas", obtenerEstadisticas);
router.delete("/habitos/:id", eliminarHabito);

export default router;
