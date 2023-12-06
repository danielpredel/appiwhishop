var fs = require('fs');
var files = require('../configs/db.config');
var Favorites = require('../models/favorites.model');
var ProductController = require('./product.controller');

var FavoritesController = {
    leerArchivo: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(files.favoritesFile, 'utf8', (error, data) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(data);
                }
            });
        });
    },
    escribirArchivo: (data) => {
        fs.writeFile(files.favoritesFile, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if(error){
                console.error(error);
            }
        });
    },
    addProduct: (userID, productID) => {
        FavoritesController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    data[index].products.push(productID);
                }
                else{
                    var favorites = new Favorites(userID, [productID]);
                    data.push(favorites);
                }
            }
            else{
                data = new Array();
                var favorites = new Favorites(userID, [productID]);
                data.push(favorites);
            }
            FavoritesController.escribirArchivo(data);
        });
    },
    getProducts: (userID, callback) => {
        FavoritesController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var ids = data[index].products;
                    ProductController.get(ids).then((results) => {
                        callback(results);
                    })
                }
                else{
                    callback({
                        success: false,
                        error: 'Sin Productos'
                    });
                }
            }
            else{
                callback({
                    success: false,
                    error: 'Sin Productos'
                });
            }
        })
        .catch((error) => {
            callback({
                success: false,
                error: error
            });
        });
    },
    deleteProduct: (userID) => {

    },
    deleteAll: (userID) => {
        
    }
}

module.exports = FavoritesController;
