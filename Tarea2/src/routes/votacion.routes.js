import { Router } from "express";
import {
  crearEncuesta,
  listarEncuestas,
  votar,
  obtenerResultados,
  eliminarEncuesta,
} from "../controllers/votacion.controller.js";
import {
  validarEncuesta,
  validarVoto,
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/encuestas", validarEncuesta, crearEncuesta);
router.get("/encuestas", listarEncuestas);
router.post("/encuestas/:id/votar", validarVoto, votar);
router.get("/encuestas/:id/resultados", obtenerResultados);
router.delete("/encuestas/:id", eliminarEncuesta);

export default router;
