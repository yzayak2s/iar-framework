class User{
    constructor(username, firstname, lastname, email, password, isAdmin) {
        this._id = undefined;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;