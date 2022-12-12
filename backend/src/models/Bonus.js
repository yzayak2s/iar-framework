/**
 * this model specifies the format to exchange bonus-salaries with the frontend
 * and store it in mongoDB
 * @param {number} _bonusId
 * @param {number} year
 * @param {number} value
 * @param {string} verified
 * @param {number} salesManID
 */
class Bonus {
    constructor(_bonusId, year, value, verified, salesManID) {
        this._id = _bonusId;
        this.year = year;
        this.value = value;
        this.verified = verified;
        this.salesManID = salesManID;
    }
}

module.exports = Bonus;