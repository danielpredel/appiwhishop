var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');

var {
	body,
	param,
	validationResult
} = require('express-validator');

router.post('/registro', [
	body('username').not().isEmpty().isString(),
	body('email').not().isEmpty().isString(),
	body('password').not().isEmpty().isString()
], (req, res) => {
  	const errors = validationResult(req);
	if(!errors.isEmpty()){
		res.json({
			success: false,
			error: JSON.stringify(errors)
		})
		return
	}
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	var result = userController.registro(username, email, password);
	console.log(result);
	if(result === true){
		res.json({
			success: true
		});
	}
	else if(result == -1){
		res.json({
			success: false,
			error: "Error al escribir el archivo"
		});
	}
	else if(result == -2){
		res.json({
			success: false,
			error: "Email en uso"
		});
	}
});

router.get('/getAll', function(req, res, next) {
	var userController = new UserController();
	users = userController.leerArchivo();
	if(users == null){
		res.json({
			array: null
		});
	}
	else{
		res.json(users);
	}
	// res.json();
});

module.exports = router;
