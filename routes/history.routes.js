var express = require('express');
var router = express.Router();
var HistoryController = require('../controllers/history.controller');

var {
	body,
	param,
	validationResult
} = require('express-validator');

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
        // Retorna el historial del usuario
    }
});

router.delete('/delete/:userID',  [
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
        // Eliminar el historial del usuario
    }
});

module.exports = router;