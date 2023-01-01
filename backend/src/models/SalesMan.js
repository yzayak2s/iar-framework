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
 *              - middleName
 *              - fullName
 *              - unit
 *              - jobTitle
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
 *              middleName:
 *                  type: string
 *                  description: The middle name of the salesman
 *              fullName:
 *                  type: string
 *                  description: The full name of the salesman
 *              unit:
 *                  type: string
 *                  description: The unit of the salesman
 *              jobTitle:
 *                  type: string
 *                  description: The job title of the salesman
 *          example:
 *              id: 5
 *              firstname: Max
 *              lastname: Mustermann
 *              middleName: Muster
 *              fullName: Max Mustermann
 *              unit: Sales
 *              jobTitle: Senior Salesman
 */
class SalesMan {
    constructor(
        firstname,
        middleName,
        lastname,
        fullName,
        unit,
        jobTitle,
        _id,
        uid
    ) {
        this.firstname = firstname;
        this.middleName = middleName;
        this.lastname = lastname;
        this.fullName = fullName;
        this.unit = unit;
        this.jobTitle = jobTitle
        this._id = parseInt(_id);
        this.uid = uid;
    }
}

module.exports = SalesMan;