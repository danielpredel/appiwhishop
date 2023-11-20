var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');

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
		res.status(400).json({
			success: false,
			error: JSON.stringify(errors)
		});
	}
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	UserController.registro(username, email, password, (data => {
		if(data.success == true){
			res.json(data);
		}
		else{
			res.json(data);
		}
	}));
});

router.post('/login', [
	body('email').not().isEmpty().isString(),
	body('password').not().isEmpty().isString()
], (req, res) => {
  	const errors = validationResult(req);
	if(!errors.isEmpty()){
		res.status(400).json({
			success: false,
			error: JSON.stringify(errors)
		});
	}
	let email = req.body.email;
	let password = req.body.password;
	UserController.login(email, password, (data => {
		if(data.success == true){
			res.json(data);
		}
		else{
			res.json(data);
		}
	}));
});

router.get('/getAll', (req, res) => {
	UserController.leerArchivo(data => {
		res.json(data);
	});
});

module.exports = router;
