import "dotenv/config";
import express from "express";
import { logger } from "./middlewares/logger.middleware.js";
import carritoRoutes from "./routes/carrito.routes.js";
import votacionRoutes from "./routes/votacion.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import turnosRoutes from "./routes/turnos.routes.js";
import habitosRoutes from "./routes/habitos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use(carritoRoutes);
app.use(votacionRoutes);
app.use(inventarioRoutes);
app.use(turnosRoutes);
app.use(habitosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
