const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.PASSWORD; // Cambia esto a tu propia clave secreta
const blacklistedTokens = [];


// Genera el token JWT
const generateToken = (userId, matricula,id_rol) => {
  const payload = {
    id: userId,
    matricula,
    id_rol
  };

  const options = {
    expiresIn: '1h' // El token expirará en 1 hora
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

// Verifica y decodifica el token JWT
const verifyToken = (token) => {
  try {
    if (blacklistedTokens.includes(token)) {
      console.error('El token está en la lista negra. No se puede verificar.');
      return null;
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return null;
  }
};

// Agrega un token a la lista negra
const blacklistToken = (token) => {
  blacklistedTokens.push(token);
};

module.exports = {
  generateToken,
  verifyToken,
  blacklistToken
};

module.exports = {
  generateToken,
  verifyToken,
  blacklistToken
};
