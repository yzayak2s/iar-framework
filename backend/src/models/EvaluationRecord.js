/**
 * @swagger
 * components:
 *  schemas:
 *      Evaluation_Record:
 *          type: object
 *          required:
 *              - goalID
 *              - goalDescription
 *              - targetValue
 *              - actualValue
 *              - year
 *              - salesManID
 *          properties:
 *              goalID:
 *                  type: int
 *                  description: id of the evaluation Record
 *              goalDescription:
 *                  type: string
 *                  description: Description of our goal
 *              targetValue:
 *                  type: int
 *                  description: The amount of money we want our salesman to reach this year
 *              actualValue:
 *                  type: string
 *                  description: The current amount of money our salesman has reached
 *              year:
 *                  type: string
 *                  description: The year this Evaluation Record is from
 *              salesManID:
 *                  type: int
 *                  description: The id of the salesman this record belongs to
 *          example:
 *              goalID: 2
 *              goalDescription: Make 2000€ of sales this year
 *              targetValue: 2000
 *              actualValue: 1520
 *              year: 2021
 *              salesManID: 5
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
        this._id = _goalID;
        this.goalDescription = goalDescription;
        this.targetValue = targetValue;
        this.actualValue = actualValue;
        this.year = year;
        this.salesManID= salesManID;
    }
}

module.exports = EvaluationRecord;