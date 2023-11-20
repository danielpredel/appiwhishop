var User = require('../models/user.model');
var bcrypt = require('bcrypt');
var fs = require('fs');
var files = require('../configs/db.config');

module.exports = {
    leerArchivo: () => {
        try{
            var users = fs.readFileSync(files.usersFile, 'utf8');
            if(users.length === 0){
                return null;
            }
            else{
                return JSON.parse(users);
            }
        }
        catch (error){
            console.error('Error al leer el archivo', error);
            return null;
        }
    },
    escribirArchivo: (users) => {
        try{
            fs.writeFileSync(files.usersFile, JSON.stringify(users, null, 2), 'utf8');
            return true;
        }
        catch(error){
            console.error('Error al escribir el archivo', error);
            return -1;
        }
    },
    encriptarPassword: (password) => {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    },    
    registro: (username, email, password) => {
        var users = this.leerArchivo();
        if(users == null){
            users = new Array();
        }
        users.forEach(user => {
            if(user.email === email){
                console.log('Email en uso');
                return -2;
            }
            else{
                var encPass = this.encriptarPassword(password);
                var newUser = new User(username, email, encPass);
                users.push(newUser);
                var result = this.escribirArchivo(users);
                return result;
            }
        });
    },
    login: (email, password) => {

    },
    compararPassword: (password) => {

    }
}