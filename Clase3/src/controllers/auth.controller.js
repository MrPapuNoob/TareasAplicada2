const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '24h' }

);

res.json({ token });
