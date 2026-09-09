
export const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
}

export const validarDescripcion = (req, res, next) => {
    const { descripcion } = req.body;
    if (!descripcion) {
        return res.status(400).json({ error: "La descripción es un campo requerido" });
    }
    next();
};

export default { logger, validarDescripcion };
