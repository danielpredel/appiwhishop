var express = require('express');
var router = express.Router();
var FavoritesController = require('../controllers/favorites.controller');
var Product = require('../models/product.model');

var {
	body,
	param,
	validationResult
} = require('express-validator');

// idFromStore, name, price, listPrice, store, img, url
router.post('/add', [
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
    var idFromStore = req.body.idFromStore;
    var name =  req.body.name;
    var price = req.body.price;
    var listPrice = req.body.listPrice;
    var store = req.body.store;
    var img = req.body.img;
    var url = req.body.url;
    var userID = req.body.userID;
    // Esto en el controlador
    // var product = new Product(idFromStore, name, price, listPrice, store, img, url);
    /**
     * Crear un Objeto Product
     * Guardar dicho objeto en el archivo products.json
     * obtener el id del objeto product
     * alamcenar el id del objeto en el array de favoritos del usuario
     */
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