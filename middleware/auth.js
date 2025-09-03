const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
      req.user = decoded;

      const userRole = decoded.nombre_rol; // ← usamos nombre_rol (string)

      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({ error: 'Permiso denegado' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
  };
};

module.exports = auth;
