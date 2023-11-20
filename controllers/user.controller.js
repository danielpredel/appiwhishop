var User = require('../models/user.model');
var bcrypt = require('bcrypt');
var fs = require('fs');
var files = require('../configs/db.config');

var UserController = {
    leerArchivo: (callback) => {
        fs.readFile(files.usersFile, 'utf8', (error, data) => {
            if (error) {
                callback({
                    success: false,
                    error: JSON.stringify(error)
                })
                return;
            }
            if (data && data.length > 0) {
                callback({
                    success: true,
                    data: JSON.parse(data)
                });
                return
            }
            else {
                callback({
                    success: true,
                    data: []
                });
                return
            }
        });
    },
    escribirArchivo: (users, callback) => {
        fs.writeFile(files.usersFile, JSON.stringify(users, null, 2), 'utf8', (error) => {
            if(error){
                callback({
                    success: false,
                    error: JSON.stringify(error)
                });
                return
            }
            callback({
                success: true
            });
            return
        });
    },
    encriptarPassword: (password) => {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    },
    compararPassword: (password, encPass) => {
        return bcrypt.compareSync(password, encPass);
    },
    registro: (username, email, password, callback) => {
        UserController.leerArchivo((data => {
            if (data.success === false) {
                callback(data);
                return;
            } 
            else {
                var users = data.data;
                const correoEnUso = users.find(user => user.email === email);
                if (correoEnUso) {
                    callback({
                        success: false,
                        info: "Email en Uso"
                    });
                    return;
                }
                else {
                    var encPass = UserController.encriptarPassword(password);
                    var newUser = new User(username, email, encPass);
                    users.push(newUser);
                    UserController.escribirArchivo(users, (data => {
                        callback(data);
                        return;
                    }));
                }
            }
        }));
    },
    login: (email, password, callback) => {
        UserController.leerArchivo((data => {
            if (data.success === false) {
                callback(data);
                return;
            }
            else {
                var users = data.data;
                const usuario = users.find(user => user.email === email);
                if (usuario) {
                    var encPass = usuario.password;
                    if(UserController.compararPassword(password, encPass)){
                        callback({
                            success: true,
                            userID: usuario.id,
                            username: usuario.username
                        });
                        return;
                    }
                    else{
                        callback({
                            success: false,
                            info: 'Password Incorrecto'
                        });
                        return;
                    }
                }
                else{
                    callback({
                        success: false,
                        info: 'Correo no Encontrado'
                    });
                    return;
                }
            }
        }));
    }
}

module.exports = UserController;