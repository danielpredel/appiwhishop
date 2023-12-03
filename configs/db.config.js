// Varibles de entorno que almacenan la ruta absoluta del los directorios compartidos
var rutaDBOne = process.env.RUTA_DB_ONE;
var rutaDBTwo = process.env.RUTA_DB_TWO;

var usersFile = `${rutaDBOne}/users.json`;
var historyFile = `${rutaDBOne}/history.json`;
var favoritesFile = `${rutaDBOne}/favorites.json`;
var productsFile = `${rutaDBTwo}/products.json`;
var listsFile = `${rutaDBTwo}/lists.json`;
var storesFile = `${rutaDBTwo}/stores.json`;
// Otros archivos

module.exports = {
    usersFile: usersFile,
    historyFile: historyFile,
    favoritesFile: favoritesFile,
    productsFile: productsFile,
    listsFile: listsFile,
    storesFile: storesFile
};