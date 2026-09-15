export const validarProducto = (req, res, next) => {
  const { nombre, precio, cantidad } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "nombre es requerido" });
  }
  if (typeof precio !== "number" || precio <= 0) {
    return res.status(400).json({ error: "precio debe ser numero positivo" });
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: "cantidad debe ser entero positivo" });
  }
  next();
};

export const validarCantidad = (req, res, next) => {
  const { cantidad } = req.body;
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: "cantidad debe ser entero positivo" });
  }
  next();
};

export const validarDescuento = (req, res, next) => {
  const { porcentaje } = req.body;
  if (typeof porcentaje !== "number" || porcentaje < 0) {
    return res.status(400).json({ error: "porcentaje debe ser numero >= 0" });
  }
  if (porcentaje > 50) {
    return res.status(400).json({ error: "descuento maximo permitido es 50%" });
  }
  next();
};

export const validarEncuesta = (req, res, next) => {
  const { pregunta, opciones } = req.body;
  if (!pregunta) {
    return res.status(400).json({ error: "pregunta es requerida" });
  }
  if (!Array.isArray(opciones) || opciones.length < 2) {
    return res
      .status(400)
      .json({ error: "opciones debe ser un array con minimo 2 elementos" });
  }
  next();
};

export const validarVoto = (req, res, next) => {
  const { opcion } = req.body;
  if (!opcion) {
    return res.status(400).json({ error: "opcion es requerida" });
  }
  next();
};

export const validarInventario = (req, res, next) => {
  const { producto, stock } = req.body;
  if (!producto) {
    return res.status(400).json({ error: "producto es requerido" });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "stock debe ser entero >= 0" });
  }
  next();
};

export const validarMovimiento = (req, res, next) => {
  const { cantidad } = req.body;
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: "cantidad debe ser entero positivo" });
  }
  next();
};

export const validarTurno = (req, res, next) => {
  const { cliente, servicio } = req.body;
  if (!cliente) {
    return res.status(400).json({ error: "cliente es requerido" });
  }
  if (!servicio) {
    return res.status(400).json({ error: "servicio es requerido" });
  }
  next();
};

export const validarHabito = (req, res, next) => {
  const { nombre, meta } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "nombre es requerido" });
  }
  if (!meta) {
    return res.status(400).json({ error: "meta es requerida" });
  }
  next();
};
