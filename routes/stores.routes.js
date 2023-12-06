var express = require('express');
var router = express.Router();
var StoreController = require('../controllers/store.controller');

router.get('/get', (req, res) => {
    StoreController.get((data) => {
        res.json(data);
    });
});

module.exports = router;
