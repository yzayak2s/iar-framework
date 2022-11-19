/**
 * this model specifies the format to exchange 'salesman-data'
 * with the frontend and store it in mongoDB
 * @param {string} firstname
 * @param {string} lastname
 * @param {number} _id
 */

class SalesMan {
    constructor(firstname, lastname, _id) {
        this.firstname = firstname;
        this.lastname = lastname;
        this._id = _id;
    }
}

module.exports = SalesMan;