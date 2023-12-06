var fs = require('fs');
var files = require('../configs/db.config');

var StoreController = {
    leerArchivo: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(files.storesFile, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    get: (callback) => {
        StoreController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                callback({
                    success: true,
                    stores: data
                });
            }
            else {
                callback({
                    success: false,
                    error: 'Sin Tiendas'
                });
            }
        })
        .catch((error) => {
            callback({
                success: false,
                error: error
            });
        });
    }
}

module.exports = StoreController;
