var { v4: uuidv4 } = require('uuid');

class Product {
    constructor(idFromStore, name, price, listPrice, store, img, url){
        this.id = uuidv4();
        this.idFromStore = idFromStore;
        this.name = name;
        this.price = price;
        this.listPrice = listPrice;
        this.store = store;
        this.img = img;
        this.url = url;
    }
}

module.exports = Product;