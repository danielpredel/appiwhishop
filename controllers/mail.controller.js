var ProductController = require('./product.controller');
var UserController = require('./user.controller');
var FavoritesController = require('./favorites.controller');
var ListsController = require('./lists.controller');
var nodemailer = require('nodemailer');
var Mail = require('../configs/mail.config');

var MailController = {
    notifyChange: async () => {
        try{
            var favorites = await FavoritesController.leerArchivo();
            if(favorites && favorites.length){
                favorites = JSON.parse(favorites);
                favorites = favorites.filter(item => item.products.length > 0);
                // console.log(favorites);
            }
            else{
                favorites = null;
            }
            var lists = await ListsController.leerArchivo();
            if(lists && lists.length){
                lists = JSON.parse(lists);
                var transformedData = lists.map(user => {
                    return {
                        userID: user.userID,
                        products: user.lists.reduce((products, list) => {
                            return products.concat(list.products);
                        }, [])
                    };
                });
                transformedData = transformedData.filter(item => item.products.length > 0);
                // console.log(transformedData);
                lists = transformedData;
                // console.log(lists);
            }
            else{
                lists = null;
            }
            var userProducts = null;
            if(favorites != null && lists != null){
                var combinedData = favorites.concat(lists);
                // Agrupar por userID y combinar productos
                var result = combinedData.reduce((acc, current) => {
                    const existingUser = acc.find(item => item.userID === current.userID);

                    if (existingUser) {
                        existingUser.products = [...new Set(existingUser.products.concat(current.products))];
                    }
                    else {
                        acc.push({ userID: current.userID, products: [...current.products] });
                    }

                    return acc;
                }, []);
                userProducts = result;
            }
            else if(favorites != null){
                userProducts = favorites;
            }
            else if(lists != null){
                userProducts = lists;
            }
            var trackedProducts = await ProductController.trackProducts();
            if(trackedProducts.success === true){
                console.log('Success tracking products');
                var oldProducts = trackedProducts.oldProducts;
                var newProducts = trackedProducts.newProducts;
                // console.log(oldProducts);
                // console.log(newProducts);
                var productosFiltrados = [];

                // Bucle anidado para comparar cada elemento de oldProducts con newProducts
                for (var i = 0; i < oldProducts.length; i++) {
                    var oldProduct = oldProducts[i];

                    for (var j = 0; j < newProducts.length; j++) {
                        var newProduct = newProducts[j];

                        // Condición de filtrado basada en el precio y el id
                        if (newProduct.id === oldProduct.id && newProduct.price < oldProduct.price) {
                        // Agregar el nuevo producto al array de productos filtrados
                            productosFiltrados.push(newProduct);
                            break; // Romper el bucle interno una vez que se encuentra un nuevo producto que cumple la condición
                        }
                    }
                }
                // console.log(productosFiltrados);
                if(userProducts != null && productosFiltrados.length > 0){
                    // console.log('User Products no null y productos flitrados no vacio');
                    // Notificar
                    for(var i = 0; i < productosFiltrados.length; i++){
                        var product = productosFiltrados[i];
                        // console.log('id => ' + product.id);
                        for(var j = 0; j < userProducts.length; j++){
                            var user = userProducts[j];
                            // console.log(`UserID: ${user.userID}, User p =>  ${user.products}`);
                            if(user.products.includes(product.id)){
                                // console.log('Lo incluye');
                                var emailResolve = await UserController.getEmail(user.userID);
                                console.log(emailResolve);
                                if(emailResolve.success === true){
                                    var email = emailResolve.email;
                                    var content = `${product.name} a un precio de $${product.price}`;
                                    console.log(`Enviar a ${email}, ${content}`);
                                    var resp = await MailController.mail(email, content);
                                }
                            }
                        }
                    }
                }
            }
        }
        catch(error){
            console.error(error);
        }
    },
    mail: async (userEmail, mailContent) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: `${Mail.email}`,
                pass: `${Mail.password}`
            },
        });
        try{
            let info = await transporter.sendMail({
                from: `Wishop <${Mail.email}>`, // sender address
                to: `${userEmail}`, // list of receivers
                subject: 'Cambio de Precio en Productos', // Subject line
                text: "Wishop Alerts", // plain text body
                html: `<h1>Cambiaron de Precio</h1>
                    <h3>Los siguientes productos de tus favoritos/listas bajaron de Precio</h3>
                    <div>${mailContent}</div>`, // html body
            });
            // return info;
        }
        catch(error){
            console.error(error.message);
        }
    },
    filtrarNuevosProductos: (oldProduct, newProduct) => {
        return newProduct.price < oldProduct.price;
    }
}

module.exports = MailController;
