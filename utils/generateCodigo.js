 
let contador = 1;

function generarCodigoUnico() {
  const año = new Date().getFullYear();
  const codigo = `PKG-${año}-${String(contador).padStart(3, '0')}`;
  contador++;
  return codigo;
}

module.exports = { generarCodigoUnico };