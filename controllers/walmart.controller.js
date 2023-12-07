var apiKey = require('../configs/walmart.config');
const axios = require('axios');
var Product = require('../models/product.model');

var WalmartController = {
    search: async (keyword) => {
        const params = {
            api_key: `${apiKey}`,
            type: "search",
            search_term: `${keyword}`,
            sort_by: "best_match",
            page: "1",
            output: "json"
        };
        try{
            const response = await axios.get('https://api.bluecartapi.com/request', { params });
            var data = response.data;
            var status = data?.request_info?.success;
            if(status === true){
                var results = data?.search_results;
                var filteredResults = results.filter(item => item?.inventory?.in_stock === true)
                .map(item => {
                    var idFromStore = item?.product?.item_id;
                    var name = item?.product?.title;
                    var price = item?.offers?.primary?.price;
                    var listPrice = item?.offers?.primary?.list_price;
                    if (listPrice === undefined){
                        listPrice = null;
                    }
                    var img = item?.product?.main_image;
                    var url = item?.product?.link;
                    return new Product(idFromStore, name, price, listPrice, 'Walmart', img, url);
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
                error: error.message
            }
        }
    },
    searchById: async (itemID) => {
        const params = {
            api_key: `${apiKey}`,
            type: "product",
            item_id: `${itemID}`,
            output: "json"
        };
        try{
            const response = await axios.get('https://api.bluecartapi.com/request', { params });
            var data = response.data;
            var status = data?.request_info?.success;
            if(status === true){
                var item_id = data?.product?.item_id;
                if(item_id == itemID){
                    var price = data?.product?.buybox_winner?.price;
                    if (price === undefined){
                        price = null;
                    }
                    return {
                        success: true,
                        idFromStore: itemID,
                        price: price
                    }
                }
                else{
                    return {
                        success: false,
                        error: `Error al consultar producto con item_id: ${itemID}`
                    }
                }
            }
            else{
                return {
                    success: false,
                    error: `Error al consultar producto con item_id: ${itemID}`,
                    info: data
                }
            }
        }
        catch(error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = WalmartController;
