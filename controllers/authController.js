 
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
      const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
      if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      const user = rows[0];
      // ✅ Comparación segura con bcrypt
      const validPassword = await bcrypt.compare(contrasena, user.contrasena);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign(
        { id: user.id_usuario, rol: user.id_rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({
        token,
        user: {
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.id_rol
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };