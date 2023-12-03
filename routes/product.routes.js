var express = require('express');
var router = express.Router();
var WalmartController = require('../controllers/walmart.controller');
var AmazonController = require('../controllers/amazon.controller');
var ProductController = require('../controllers/product.controller');

var {
	body,
	param,
	validationResult
} = require('express-validator');

router.get('/search/:keyword',  [
	param('keyword').not().isEmpty().isString()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            error: errors
        });
    }
    else{
        let keyword = req.params.keyword;
        ProductController.search(keyword).then((data) => {
            res.json(data);
        });
        // WalmartController.search(keyword).then((data) => {
        //     res.json(data);
        // });
        // AmazonController.search(keyword, data => {
        //     res.json(data);
        // });
    }
});

module.exports = router;
