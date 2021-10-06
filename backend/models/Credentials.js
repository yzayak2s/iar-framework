export class User{
    constructor(firstname, lastname, email, password, isAdmin) {
        this._id = undefined;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}