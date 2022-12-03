/**
 * @swagger
 * components:
 *  schemas:
 *      SalesMan:
 *          type: object
 *          required:
 *              - id
 *              - firstname
 *              - lastname
 *          properties:
 *              id:
 *                  type: int
 *                  description: id of the salesman
 *              firstname:
 *                  type: string
 *                  description: The first name of the salesman
 *              lastname:
 *                  type: string
 *                  description: The last name of the salesman
 *          example:
 *              id: 5
 *              firstname: Max
 *              lastname: Mustermann
 */

class SalesMan {
    constructor(firstname, lastname, _id) {
        this.firstname = firstname;
        this.lastname = lastname;
        this._id = _id;
    }
}

module.exports = SalesMan;