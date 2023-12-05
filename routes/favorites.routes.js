var express = require('express');
var router = express.Router();
var FavoritesController = require('../controllers/favorites.controller');
var ProductController = require('../controllers/product.controller');
var Product = require('../models/product.model');

var {
	body,
	param,
	validationResult
} = require('express-validator');

router.post('/add', [
	body('id').not().isEmpty().isString(),
	body('idFromStore').not().isEmpty().isString(),
	body('name').not().isEmpty().isString(),
	body('price').not().isEmpty().isNumeric(),
	body('listPrice').optional().isNumeric(),
	body('store').not().isEmpty().isString(),
	body('img').not().isEmpty().isString(),
	body('url').not().isEmpty().isString(),
	body('userID').not().isEmpty().isString()
], (req, res) => {
  	const errors = validationResult(req);
	if(!errors.isEmpty()){
		res.status(400).json({
			success: false,
			error: errors
		});
	}
    else{
        var id = req.body.id;
        var idFromStore = req.body.idFromStore;
        var name =  req.body.name;
        var price = req.body.price;
        var listPrice = req.body.listPrice !== undefined ? req.body.listPrice : null;
        var store = req.body.store;
        var img = req.body.img;
        var url = req.body.url;
        var product = new Product(idFromStore, name, price, listPrice, store, img, url);
        product.id = id;
        ProductController.addProduct(product);
        var userID = req.body.userID;
        var productID = product.id;
        FavoritesController.addProduct(userID, productID);
        res.json({
            success: true
        });
    }
});

router.get('/get/:userID',  [
	param('userID').not().isEmpty().isString()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            error: errors
        });
    }
    else{
        let userID = req.params.userID;
        // Retornar productos favoritos del usuario
    }
});

router.delete('/delete/:userID/:productID',  [
	param('userID').not().isEmpty().isString(),
	param('productID').not().isEmpty().isString()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            error: errors
        });
    }
    else{
        let userID = req.params.userID;
        // Eliminar tal producto de favoritos del tal usuario
    }
});

router.delete('/deleteAll/:userID',  [
	param('userID').not().isEmpty().isString()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            error: errors
        });
    }
    else{
        let userID = req.params.userID;
        // Eliminar todos los productos favoritos de tal usuario
    }
});

module.exports = router;