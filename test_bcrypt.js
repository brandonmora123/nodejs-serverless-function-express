const bcrypt = require('bcrypt');

const password = 'admin123'; // La contraseña que quieres usar
bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Nuevo hash:', hash);
  })
  .catch(err => console.error(err));
