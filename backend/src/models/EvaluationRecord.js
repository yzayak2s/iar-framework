/**
 * this model specifies the format to exchange
 * 'evaluationRecord-data' with the frontend
 * and store it in mongoDB
 * @param {number} _goalID
 * @param {string} goalDescription
 * @param {number} targetValue
 * @param {number} actualValue
 * @param {number} year
 * @param {number} salesManID
 */

class EvaluationRecord {
    constructor(
        _goalID,
        goalDescription,
        targetValue,
        actualValue,
        year,
        salesManID
    ) {
        this._id = _id;
        this.goalDescription = goalDescription;
        this.targetValue = targetValue;
        this.actualValue = actualValue;
        this.year = year;
        this.salesManID= salesManID;
    }
}

module.exports = EvaluationRecord;