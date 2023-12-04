var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/product.controller');

var {
	body,
	param,
	validationResult
} = require('express-validator');

router.get('/search/:keyword/:userID',  [
	param('keyword').not().isEmpty().isString(),
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
        let keyword = req.params.keyword;
        let userID = req.params.userID;
        ProductController.search(keyword, userID).then((data) => {
            res.json(data);
        });
    }
});

module.exports = router;
