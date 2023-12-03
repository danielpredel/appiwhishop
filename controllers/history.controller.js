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
                    resolve(JSON.parse(data));
                }
            });
        });
    },
    escribirArchivo: (userID, product) => {
        HistoryController.leerArchivo().then((data) => {
            if(data && data.length > 0){
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
            fs.writeFile(files.historyFile, JSON.stringify(data, null, 2), 'utf8', (error) => {
                if(error){
                    console.error(error);
                }
            });
        });
    },
    getHistory: (userID) => {

    },
    deleteHistory: (userID) => {
        
    }
}

module.exports = HistoryController;
