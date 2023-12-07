// Varibles de entorno que almacenan el correo de la aplicacion y el password de aplicacion
var email = process.env.WISHOP_EMAIL;
var password = process.env.WISHOP_PASSWORD;

module.exports = {
    email: email,
    password: password
};