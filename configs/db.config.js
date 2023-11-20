// Varibles de entorno que almacenan la ruta absoluta del los directorios compartidos
var rutaDBOne = process.env.RUTA_DB_ONE;
var rutaDBTwo = process.env.RUTA_DB_TWO;

var usersFile = `${rutaDBOne}/users.json`;
var productsFile = `${rutaDBTwo}/products.json`;
// Otros archivos

module.exports = {
    usersFile: usersFile,
    productsFile: productsFile
};