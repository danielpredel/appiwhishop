var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/product.controller');
var WalmartController = require('../controllers/walmart.controller');
var AmazonController = require('../controllers/amazon.controller');
var MailController = require('../controllers/mail.controller');

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

router.get('/track', (req, res) => {
    // ProductController.trackProducts().then((data) => {
    //     res.json(data);
    // });
    // var email = 'danielpreciadodelgadillo@gmail.com';
    // var desc = 'Pruebas';
    // MailController.mail(email, desc).then(() => {
    //     res.json({
    //         success: true
    //     });
    // });
    MailController.notifyChange().then(() => {
        res.json({
            success: true
        });
    })
    .catch((error) => {
        res.json({
            success: false,
            error: error
        });
    });
});


module.exports = router;
