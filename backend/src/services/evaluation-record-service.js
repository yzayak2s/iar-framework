
const { fitsModel } = require("../helper/creation-helper");
const EvaluationRecord = require('../models/EvaluationRecord')

/**
 * Get all goals
 * @param {*} db source database 
 * @returns {Array<{goal_description: string}>}
 */
exports.getAllGoals = async (db) => {
    return await db.collection('goals').find({}).toArray(); // use of toArray() is important here.
}

/**
 * Create a new goal
 * @param {*} db source database
 * @param {string} goalDescription Description of new Goal
 */
exports.addGoal = async (db, goalDescription) => {
    if (await db.collection('goals').findOne({goal_description: goalDescription})) {
        throw new Error('Goal with same description already exists!');
    }

    await db.collection('goals').insertOne({goal_description: goalDescription});
}



/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<EvaluationRecord>}
 */
exports.getAll = async (db) => {
    return await db.collection('evaluation_record')
        .aggregate([
            { $lookup:
                    {
                        from: 'salesmen',
                        localField: 'salesManID',
                        foreignField: '_id',
                        as: 'salesMan'
                    }
            }
        ]).toArray(); // use of toArray() is important here.
}


/**
 * Retrieve one evaluation record by its id
 * @param db source database
 * @param _id goalID
 * @returns {EvaluationRecord} evaluationRecord
 */
exports.getById = async (db, _id) => {
    return await db.collection('evaluation_record').findOne({_id: _id});
}

/**
 * Retrieve all evaluationRecords of a salesman by its id
 * @param {*} db source database
 * @param {*} salesManID salesman ID
 * @returns {EvaluationRecord} evaluationRecord
 */
exports.getBySalesmanID = async (db, salesManID) => {
    return await db.collection('evaluation_record').find({salesManID: parseInt(salesManID)}).toArray();
}

/**
 * Retrieve all evaluationRecords of a salesman by its id and year
 * @param {*} db source database
 * @param {*} salesManID salesman ID
 * @param {*} year year
 * @returns {EvaluationRecord} evaluationRecord
 */
exports.getBySalesmanIDAndYear = async (db, salesManID, year) => {
    return await db.collection('evaluation_record').find({salesManID: parseInt(salesManID), year: year}).toArray();
}


/**
 * insert a new evaluationRecord into database
 * @param db target database
 * @param {EvaluationRecord} evaluationRecord
 */
exports.add = async (db, evaluationRecord) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: evaluationRecord.salesManID});
    const existingEvaluationRecordCriteria = await db.collection('evaluation_record').findOne(
        {
            goalDescription: evaluationRecord.goalDescription,
            year: parseInt(evaluationRecord.year),
            salesManID: evaluationRecord.salesManID
        }
    )

    await fitsModel(evaluationRecord, EvaluationRecord) // Check given Object

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + evaluationRecord.salesManID + ' does not exist!');
    }

    if (existingEvaluationRecordCriteria) {
        const e = new Error(`EvaluationRecord criteria with ${evaluationRecord.goalDescription} already exist!`);
        e.type = "goalError"
        throw e;
    }

    return (await db.collection('evaluation_record').insertOne(new EvaluationRecord(
        evaluationRecord.goalDescription,
        parseInt(evaluationRecord.targetValue),
        parseInt(evaluationRecord.actualValue),
        parseInt(evaluationRecord.year),
        parseInt(evaluationRecord.salesManID)
    ))).insertedId;
}

/**
 * Update an old evaluationRecord with a new one
 * @param {*} db target database
 * @param {*} _id old evaluationRecord Id
 * @param {*} evaluationRecord The new evaluationRecord
 */
exports.updateById = async (db, _id, evaluationRecord) => {
    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: _id});

    if (!existingEvaluationRecord){
        const e = new Error("No EvaluationRecord with id " + _id + " exists!");
        e.type = 'notFound';
        throw e;
    }

    return await db.collection('evaluation_record').updateOne(
        {
            _id: _id
        },
        {
            $set: {
                goalDescription: evaluationRecord.goalDescription,
                targetValue: parseInt(evaluationRecord.targetValue),
                actualValue: parseInt(evaluationRecord.actualValue),
                year: parseInt(evaluationRecord.year),
                salesManID: parseInt(evaluationRecord.salesManID),
            }
        }
    );
}

/**
 * delete a evaluationRecord by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: _id});

    if (!existingEvaluationRecord) {
        const e = new Error("No EvaluationRecord with id " + _id + " exists!");
        e.type = 'notFound';
        throw e;
    }

    return db.collection('evaluation_record').deleteOne({_id: _id})
}

/**
 * Delete all evaluationRecords of one salesman
 * @param {*} db source database
 * @param {*} salesManID salesmanID
 */
exports.deleteBySalesmanID = async (db, salesManID) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(salesManID)});

    if (!existingSalesMan){
        const e = new Error('Salesman with id ' + salesManID + ' does not exist!');
        e.type = 'notFound';
        throw e;
    }

    return db.collection('evaluation_record').deleteMany({salesManID: parseInt(salesManID)});
}
