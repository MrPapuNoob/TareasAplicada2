export const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

export const requireFields = (fields) => (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Body requerido (objeto JSON)' });
  }
  for (const f of fields) {
    const v = req.body[f];
    if (v === undefined || v === null) {
      return res.status(400).json({ error: `Campo requerido: ${f}` });
    }
    if (typeof v === 'string' && v.trim() === '') {
      return res.status(400).json({ error: `Campo requerido: ${f}` });
    }
    if (Array.isArray(v) && v.length === 0) {
      return res.status(400).json({ error: `Campo requerido: ${f}` });
    }
  }
  next();
};
