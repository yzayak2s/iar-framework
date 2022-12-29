/**
 * @swagger
 * components:
 *  schemas:
 *      Bonus:
 *          type: object
 *          required:
 *              - year
 *              - value
 *              - remark
 *              - verified
 *              - salesManID
 *          properties:
 *              year:
 *                  type: number
 *                  description: Year of the bonus
 *              value:
 *                  type: number
 *                  description: amount of money for this bonus
 *              remark:
 *                  type: string
 *                  description: remark of CEO
 *              verified:
 *                  type: number
 *                  description: status of the verification
 *              salesManID:
 *                  type: number
 *                  description: ID of salesman this bonus belongs to
 *          example:
 *              year: 2020
 *              value: 512.5
 *              remark: "Good one!"
 *              verified: 3
 *              salesManID: 9
 */

/**
 * this model specifies the format to exchange bonus-salaries with the frontend
 * and store it in mongoDB
 * @param {number} year
 * @param {number} value
 * @param {string} remark
 * @param {string} verified
 * @param {number} salesManID
 */
class Bonus {
    constructor(year, value, remark, verified, salesManID) {
        this.year = year;
        this.value = value;
        this.remark = remark;
        this.verified = verified;
        this.salesManID = salesManID;
    }
}

module.exports = Bonus;