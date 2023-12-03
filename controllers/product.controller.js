var WalmartController = require('./walmart.controller');
var AmazonController = require('./amazon.controller');
var HistoryController = require('./history.controller');

var ProductController = {
    search: async (keyword, userID) => {
        HistoryController.escribirArchivo(userID,keyword);
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
                    products: amazonResults.products
                }
            }
            else if(walmartStatus === true){
                return {
                    success: true,
                    products: walmartResults.products
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
    searchById: (itemId, callback ) => {

    }
}

module.exports = ProductController;
