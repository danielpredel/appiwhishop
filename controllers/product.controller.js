var WalmartController = require('./walmart.controller');
var AmazonController = require('./amazon.controller');
var HistoryController = require('./history.controller');
var fs = require('fs');
var files = require('../configs/db.config');

var ProductController = {
    search: async (keyword, userID) => {
        HistoryController.addProduct(userID,keyword);
        try {
            const [walmartResults, amazonResults] = await Promise.all([
                WalmartController.search(keyword),
                AmazonController.search(keyword),
            ]);
            var walmartStatus = walmartResults.success;
            var amazonStatus = amazonResults.success;
            if(amazonStatus === true && walmartStatus === true){
                var walmartProducts = walmartResults.products;
                var amazonProducts = amazonResults.products;
                var products = walmartProducts.concat(amazonProducts);
                return {
                    success: true,
                    products: products
                }
            }
            else if(amazonStatus === true){
                return {
                    success: true,
                    products: amazonResults.products,
                    walmartError: walmartResults.error
                }
            }
            else if(walmartStatus === true){
                return {
                    success: true,
                    products: walmartResults.products,
                    amazonError: amazonResults.error
                }
            }
            else{
                return {
                    success: false,
                    errors: {
                        walmartError: walmartResults.error,
                        amazonError: amazonResults.error
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
    trackProducts: async () => {
        try{
            var data = await ProductController.leerArchivo();
            var backup = data;
            if(data && data.length > 0){
                data = JSON.parse(data);
                backup = JSON.parse(backup);
                var results = await Promise.all(
                    data.map(async element => {
                        if(element.store == 'Amazon'){
                            var resp = await AmazonController.searchById(element.idFromStore);
                            if(resp.success === true){
                                var newPrice = resp.price;
                                if(newPrice != null){
                                    element.price = newPrice;
                                }
                                return element;
                            }
                            else{
                                return element;
                            }
                        }
                        else if(element.store == 'Walmart'){
                            var resp = await WalmartController.searchById(element.idFromStore);
                            if(resp.success === true){
                                var newPrice = resp.price;
                                if(newPrice != null){
                                    element.price = newPrice;
                                }
                                return element;
                            }
                            else{
                                return element;
                            }
                        }
                    })
                );
                // ProductController.escribirArchivo(backup);
                return {
                    success: true,
                    oldProducts: backup,
                    newProducts: results
                };
            }
            else{
                return {
                    success: false,
                    error: 'Sin Productos'
                };
            }
        }
        catch(error){
            return {
                success: false,
                error: error
            };
        }
    },
    leerArchivo: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(files.productsFile, 'utf8', (error, data) => {
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
        fs.writeFile(files.productsFile, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if(error){
                console.error(error);
            }
        });
    },
    addProduct(product){
        ProductController.leerArchivo().then((data) => {
            if(data && data.length > 0){
                data = JSON.parse(data);
                data.push(product);
            }
            else{
                data = new Array();
                data.push(product);
            }
            ProductController.escribirArchivo(data);
        });
    },
    get: async (productIDs) => {
        try{
            var data = await ProductController.leerArchivo();
            if(data && data.length > 0){
                data = JSON.parse(data);
                var products = data.filter(product => productIDs.includes(product.id));
                if(products.length > 0){
                    return {
                        success: true,
                        products: products
                    };
                }
                else{
                    return {
                        success: false,
                        error: 'No se encontraron los productos'
                    };
                }
            }
            else{
                return {
                    success: false,
                    error: 'Sin Productos'
                };
            }
        }
        catch(error){
            return {
                success: false,
                error: error
            }
        }
    }
}

module.exports = ProductController;
