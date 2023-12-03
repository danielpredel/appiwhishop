// var api = require('../configs/walmartAPI.config');
var apiKey = require('../configs/walmart.config');
const axios = require('axios');

var WalmartController = {
    // searchByKeyword: async (keyword, callback) => {
    //     const options = {
    //         method: 'GET',
    //         url: 'https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword',
    //         params: {
    //             keyword: `${keyword}`,
    //             page: '1',
    //             sortBy: 'best_match'
    //         },
    //         headers: {
    //             'X-RapidAPI-Key': `${api.apiKey}`,
    //             'X-RapidAPI-Host': `${api.apiHost}`
    //         }
    //     };
    //     try {
    //         const response = await axios.request(options);
    //         var data = response.data;
    //         var status = data?.responseStatus;
    //         if(status === 'PRODUCT_FOUND_RESPONSE'){
    //             var products = data?.item?.props?.pageProps?.initialData?.searchResult?.itemStacks[0]?.items;
    //             var filteredProducts = products.filter(product => product.__typename === 'Product')
    //             .map(product => {
    //                 var price = product.price;
    //                 var itemPrice = product.priceInfo.itemPrice;
    //                 var linePrice = product.priceInfo.linePrice;
    //                 var priceAtt = 1;
    //                 if(itemPrice != ''){
    //                     itemPrice = itemPrice.replace('$','');
    //                     itemPrice = itemPrice.replace(',','');
    //                     itemPrice = parseFloat(itemPrice);
    //                     if(price < itemPrice){
    //                         price = itemPrice;
    //                         var priceAtt = 2;
    //                     }
    //                 }
    //                 else if (linePrice != ''){
    //                     linePrice = linePrice.replace('$','');
    //                     linePrice = linePrice.replace(',','');
    //                     linePrice = parseFloat(linePrice);
    //                     if(price < linePrice){
    //                         price = linePrice;
    //                         var priceAtt = 3;
    //                     }
    //                 }
    //                 return {
    //                     canonicalUrl: product.canonicalUrl,
    //                     image: product.image,
    //                     name: product.name,
    //                     price: price,
    //                     priceAtt: priceAtt,
    //                     store: 'Walmart'
    //                 };
    //             });
    //             callback({
    //                 success: true,
    //                 data: filteredProducts
    //             });
    //         }
    //         else{
    //             callback({
    //                 success: false,
    //                 error: 'No Data'
    //             });
    //         }
    //     }
    //     catch (error) {
    //         callback({
    //             success: false,
    //             error: error
    //         });
    //     }
    // },
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
                    return {
                        idFromStore: idFromStore,
                        name: name,
                        price: price,
                        listPrice: listPrice,
                        store: 'Walmart',
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
                error: error.message
            }
        }
        // axios.get('https://api.bluecartapi.com/request', { params })
        // .then(response => {
        //     var data = response.data;
        //     var status = data?.request_info?.success;
        //     if(status === true){
        //         var results = data?.search_results;
        //         var filteredResults = results.filter(item => item?.inventory?.in_stock === true)
        //         .map(item => {
        //             var idFromStore = item?.product?.item_id;
        //             var name = item?.product?.title;
        //             var price = item?.offers?.primary?.price;
        //             var listPrice = item?.offers?.primary?.list_price;
        //             if (listPrice === undefined){
        //                 listPrice = null;
        //             }
        //             var img = item?.product?.main_image;
        //             var url = item?.product?.link;
        //             return {
        //                 idFromStore: idFromStore,
        //                 name: name,
        //                 price: price,
        //                 listPrice: listPrice,
        //                 store: 'Walmart',
        //                 img: img,
        //                 url: url
        //             };
        //         });
        //         // callback({
        //         //     success: true,
        //         //     products: filteredResults
        //         // });
        //         return {
        //             success: true,
        //             products: filteredResults
        //         }
        //     }
        //     else{
        //         // callback({
        //         //     success: false
        //         // });
        //         return {
        //             success: false
        //         }
        //     }
        // }).catch(error => {
        //     // callback({
        //     //     success: false,
        //     //     error: error
        //     // });
        //     return {
        //         success: false,
        //         error: error
        //     }
        // });
    },
    searchById: (itemId, callback) => {

    }
}

module.exports = WalmartController;
