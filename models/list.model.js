var { v4: uuidv4 } = require('uuid');

class List {
    constructor(name, products){
        this.id = uuidv4();
        this.name = name;
        this.products = products;
    }
}

module.exports = List;
