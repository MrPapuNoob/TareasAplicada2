import { Router } from "express";
import {
  crearTurno,
  listarTurnos,
  obtenerSiguiente,
  llamarSiguiente,
  finalizarTurno,
  contarEspera,
} from "../controllers/turnos.controller.js";
import { validarTurno } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/turnos", validarTurno, crearTurno);
router.get("/turnos", listarTurnos);
router.get("/turnos/siguiente", obtenerSiguiente);
router.put("/turnos/llamar", llamarSiguiente);
router.put("/turnos/:id/finalizar", finalizarTurno);
router.get("/turnos/espera", contarEspera);

export default router;
