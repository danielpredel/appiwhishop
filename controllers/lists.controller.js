var fs = require('fs');
var files = require('../configs/db.config');
var List = require('../models/list.model');
var Lists = require('../models/lists.model');
var ProductController = require('./product.controller');

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
    getLists: async (userID, callback) => {
        try {
            var data = await ListsController.leerArchivo();
            if(data && data.length > 0){
                data = JSON.parse(data);
                var index = data.findIndex(item => item.userID === userID);
                if(index !== -1){
                    var lists = data[index].lists;
                    var results = await Promise.all(
                        lists.map(async (list) => {
                            if(list.products.length > 0){
                                var resp = await ProductController.get(list.products);
                                // console.log(resp);
                                if(resp.success === true){
                                    return {
                                        success: true,
                                        id: list.id,
                                        name: list.name,
                                        products: resp.products
                                    }
                                }
                                else {
                                    return {
                                        success: true,
                                        id: list.id,
                                        name: list.name,
                                        error: resp.error
                                    }
                                }
                            }
                            else {
                                return {
                                    success: false,
                                    id: list.id,
                                    name: list.name,
                                    error: 'Lista Vacia'
                                }
                            }
                        })
                    );
                    
                    callback({
                        success: true,
                        lists: results
                    });
                }
                else{
                    callback({
                        success: false,
                        error: 'Sin listas'
                    });
                }
            }
            else{
                callback({
                    success: false,
                    error: 'Sin listas'
                });
            }
        }
        catch(error) {
            
        }
        // ListsController.leerArchivo().then((data) => {
        //     if(data && data.length > 0){
        //         data = JSON.parse(data);
        //         var index = data.findIndex(item => item.userID === userID);
        //         if(index !== -1){
        //             var lists = data[index].lists;
        //             var results = lists.map(list => {
        //                 if(list.products.length > 0){
        //                     var resp = ProductController.get(list.products);
        //                     console.log(resp);
        //                     return {
        //                         success: true,
        //                         id: list.id,
        //                         name: list.name,
        //                         products: list.products
        //                     }
        //                 }
        //                 else {
        //                     return {
        //                         success: false,
        //                         id: list.id,
        //                         name: list.name,
        //                         error: 'Lista Vacia'
        //                     }
        //                 }
        //             });
        //             callback({
        //                 success: true,
        //                 lists: results
        //             });
        //         }
        //         else{
        //             callback({
        //                 success: false,
        //                 error: 'Sin listas'
        //             });
        //         }
        //     }
        //     else{
        //         callback({
        //             success: false,
        //             error: 'Sin listas'
        //         });
        //     }
        // })
        // .catch((error) => {
        //     callback({
        //         success: false,
        //         error: error
        //     });
        // });
    },
    // getLists: async (userID, callback) => {
    //     ListsController.leerArchivo().then((data) => {
    //         if(data && data.length > 0){
    //             data = JSON.parse(data);
    //             var index = data.findIndex(item => item.userID === userID);
    //             if(index !== -1){
    //                 var lists = data[index].lists;
    //                 var results = lists.map(list => {
    //                     if(list.products.length > 0){
    //                         var resp = ProductController.get(list.products);
    //                         console.log(resp);
    //                         return {
    //                             success: true,
    //                             id: list.id,
    //                             name: list.name,
    //                             products: list.products
    //                         }
    //                     }
    //                     else {
    //                         return {
    //                             success: false,
    //                             id: list.id,
    //                             name: list.name,
    //                             error: 'Lista Vacia'
    //                         }
    //                     }
    //                 });

    //                 // var results = lists.map(list => {
    //                 //     var ids = list.products;
    //                 //     // ProductController.get(ids, (res) => {
    //                 //     //     if(res.success === true) {
    //                 //     //         return {
    //                 //     //             success: true,
    //                 //     //             id: list.id,
    //                 //     //             name: list.name,
    //                 //     //             products: res.products
    //                 //     //         }
    //                 //     //     }
    //                 //     //     else{
    //                 //     //         return {
    //                 //     //             success: false,
    //                 //     //             id: list.id,
    //                 //     //             name: list.name,
    //                 //     //             error: res.error
    //                 //     //         }
    //                 //     //     }
    //                 //     // });
    //                 //     // var res = ProductController.get(ids);
    //                 //     // if(res.success === true) {
    //                 //     //     return {
    //                 //     //         success: true,
    //                 //     //         id: list.id,
    //                 //     //         name: list.name,
    //                 //     //         products: res.products
    //                 //     //     }
    //                 //     // }
    //                 //     // else{
    //                 //     //     return {
    //                 //     //         success: false,
    //                 //     //         id: list.id,
    //                 //     //         name: list.name,
    //                 //     //         error: res.error
    //                 //     //     }
    //                 //     // }
    //                 // });
    //                 // console.log(lists);
    //                 callback({
    //                     success: true,
    //                     lists: results
    //                 });
    //             }
    //             else{
    //                 callback({
    //                     success: false,
    //                     error: 'Sin listas'
    //                 });
    //             }
    //         }
    //         else{
    //             callback({
    //                 success: false,
    //                 error: 'Sin listas'
    //             });
    //         }
    //     })
    //     .catch((error) => {
    //         callback({
    //             success: false,
    //             error: error
    //         });
    //     });
    // },
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
