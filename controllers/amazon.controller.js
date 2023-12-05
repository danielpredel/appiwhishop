var apiKey = require('../configs/amazon.config');
const axios = require('axios');
var Product = require('../models/product.model');

var AmazonController = {
    search: async (keyword) => {
        const params = {
            api_key: `${apiKey}`,
            type: "search",
            amazon_domain: "amazon.com",
            search_term: `${keyword}`,
            page: "1",
            output: "json"
        }
        try{
            const response = await  axios.get('https://api.rainforestapi.com/request', { params });
            var data = response.data;
            var status = data?.request_info?.success;
            if(status === true){
                var results = data?.search_results;
                var filteredResults = results.filter(item => item?.price?.value !== undefined)
                .map(item => {
                    var idFromStore = item?.asin;
                    var name = item?.title;
                    var price = item?.price?.value;
                    var prices = item?.prices;
                    var listPrice = null;
                    if(prices !== undefined){
                        listPrice = item?.prices[1]?.value;
                        if(listPrice === undefined){
                            listPrice = null;
                        }
                    }
                    var img = item?.image;
                    var url = item?.link;
                    // return {
                    //     idFromStore: idFromStore,
                    //     name: name,
                    //     price: price,
                    //     listPrice: listPrice,
                    //     store: 'Amazon',
                    //     img: img,
                    //     url: url
                    // };
                    return new Product(idFromStore, name, price, listPrice, 'Amazon', img, url);
                });
                return {
                    success: true,
                    products: filteredResults
                }
            }
            else{
                return {
                    success: false,
                    error: 'Sin Resultados de Busqueda'
                }
            }

        }
        catch(error){
            return {
                success: false,
                error: error
            }
        }
    },
    searchById: (itemId, callback ) => {

    }
}

module.exports = AmazonController;
