var fs = require('fs');
var files = require('../configs/db.config');
var List = require('../models/list.model');
var Lists = require('../models/lists.model');
const { error } = require('console');

var ListsController = {
    leerArchivo: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(files.listsFile, 'utf8', (error, data) => {
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
        fs.writeFile(files.listsFile, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if(error){
                console.error(error);
            }
        });
    },
    createList: (userID, name, callback) => {
        ListsController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var list = new List(name, []);
                    data[index].lists.push(list);
                    ListsController.escribirArchivo(data);
                    callback({
                        success: true,
                        id: list.id
                    });
                }
                else{
                    var list = new List(name, []);
                    var lists = new Lists(userID, [list]);
                    data.push(lists);
                    ListsController.escribirArchivo(data);
                    callback({
                        success: true,
                        id: list.id
                    });
                }
            }
            else{
                data = new Array();
                var list = new List(name, []);
                var lists = new Lists(userID, [list]);
                data.push(lists);
                ListsController.escribirArchivo(data);
                callback({
                    success: true,
                    id: list.id
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
    getLists: (userID, callback) => {
        ListsController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var lists = data[index].lists;
                    callback({
                        success: true,
                        lists: lists
                    });
                }
                else{
                    callback({
                        success: false,
                        info: 'Sin listas'
                    });
                }
            }
            else{
                callback({
                    success: false,
                    info: 'Sin listas'
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
    addProduct: (userID, listID, productID, callback) => {
        ListsController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var listIndex = data[index].lists.findIndex(item => item.id === listID);
                    if(listIndex !== -1){
                        data[index].lists[listIndex].products.push(productID);
                        ListsController.escribirArchivo(data);
                        callback({
                            success: true
                        });
                    }
                    else{
                        callback({
                            success: false,
                            error: `No existe lista con id: ${listID}`
                        });
                    }
                }
                else{
                    callback({
                        success: false,
                        error: `No existen listas para el usuario con id: ${userID}`
                    });
                }
            }
            else{
                callback({
                    success: false,
                    error: `No existe listas para el usuario con id: ${userID}`
                });
            }
        })
        .catch((error) => {
            callback({
                success: false,
                error: error.message
            });
        });
    }
}

module.exports = ListsController;
