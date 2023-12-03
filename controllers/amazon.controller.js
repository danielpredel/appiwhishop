var apiKey = require('../configs/amazon.config');
const axios = require('axios');

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
                    return {
                        idFromStore: idFromStore,
                        name: name,
                        price: price,
                        listPrice: listPrice,
                        store: 'Amazon',
                        img: img,
                        url: url
                    };
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
        // axios.get('https://api.rainforestapi.com/request', { params })
        // .then(response => {
        //     var data = response.data;
        //     var status = data?.request_info?.success;
        //     if(status === true){
        //         var results = data?.search_results;
        //         var filteredResults = results.filter(item => item?.price?.value !== undefined)
        //         .map(item => {
        //             var idFromStore = item?.asin;
        //             var name = item?.title;
        //             var price = item?.price?.value;
        //             var prices = new Array();
        //             prices = item?.prices;
        //             var listPrice = null;
        //             if(prices !== undefined){
        //                 listPrice = item?.prices[1]?.value;
        //                 if(listPrice === undefined){
        //                     listPrice = null;
        //                 }
        //             }
        //             var img = item?.image;
        //             var url = item?.link;
        //             return {
        //                 idFromStore: idFromStore,
        //                 name: name,
        //                 price: price,
        //                 listPrice: listPrice,
        //                 store: 'Amazon',
        //                 img: img,
        //                 url: url
        //             };
        //         });
        //         callback({
        //             success: true,
        //             products: filteredResults
        //         });
        //     }
        //     else{
        //         callback({
        //             success: false
        //         });
        //     }
        // }).catch(error => {
        //     console.log('ERROR: ' + error);
        //     callback({
        //         success: false,
        //         error: error
        //     });
        // });
    },
    searchById: (itemId, callback ) => {

    }
}

module.exports = AmazonController;
