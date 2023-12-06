var fs = require('fs');
var files = require('../configs/db.config');
var History = require('../models/history.model');

var HistoryController = {
    leerArchivo: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(files.historyFile, 'utf8', (error, data) => {
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
        fs.writeFile(files.historyFile, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if(error){
                console.error(error);
            }
        });
    },
    addProduct: (userID, product) => {
        HistoryController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    data[index].history.push(product);
                }
                else{
                    var history = new History(userID, [product]);
                    data.push(history);
                }
            }
            else{
                data = new Array();
                var history = new History(userID, [product]);
                data.push(history);
            }
            HistoryController.escribirArchivo(data);
        });
    },
    getHistory: async (userID, callback) => {
        try{
            var data = await HistoryController.leerArchivo();
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var history = data[index].history;
                    callback({
                        success: true,
                        history: history
                    });
                }
                else{
                    callback({
                        success: false,
                        error: 'Sin historial'
                    });
                }
            }
            else{
                callback({
                    success: false,
                    error: 'Sin historial'
                });
            }
        }
        catch(error) {
            callback({
                success: false,
                error: error
            });
        }
    },
    deleteHistory: (userID,callback) => {
        HistoryController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data).filter(item => item.userID !== userID);
                HistoryController.escribirArchivo(data);
                callback({
                    success: true
                });
            }
            else{
                callback({
                    success: true
                });
            }
        });
    }
}

module.exports = HistoryController;
