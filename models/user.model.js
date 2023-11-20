var { v4: uuidv4 } = require('uuid');

class User {
    constructor(username, email, password) {
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

module.exports = User;