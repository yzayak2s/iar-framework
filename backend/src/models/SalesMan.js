class SalesMan {
    constructor(firstname, lastname, _id, uid) {
        this.firstname = firstname;
        this.lastname = lastname;
        this._id = parseInt(_id);
        this.uid = uid;
    }
}

module.exports = SalesMan;