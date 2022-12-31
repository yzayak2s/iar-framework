const {ObjectId} = require("mongodb");
/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<EvaluationRecord>}
 */
exports.getAll = async (db) => {
    return await db.collection('evaluation_record').find({}).toArray(); // use of toArray() is important here.
}

/**
 * Retrieve one evaluation record by its id
 * @param db source database
 * @param _id goalID
 * @returns {EvaluationRecord} evaluationRecord
 */
exports.getById = async (db, _id) => {
    let ObjectId = require('mongodb').ObjectId;
    let o_id = new ObjectId(_id);
    return await db.collection('evaluation_record').findOne({_id: o_id});
}

/**
 * Retrieve all evaluationRecords of a salesman by its id
 * @param {*} db source database
 * @param {*} salesManID salesman ID
 * @returns {EvaluationRecord} evaluationRecord
 */
exports.getBySalesmanID = async (db, salesManID) => {
    let ObjectId = require('mongodb').ObjectId;
    let salesman_ID = new ObjectId(salesManID);
    return await db.collection('evaluation_record').find({salesManID: salesman_ID}).toArray();
}


/**
 * insert a new evaluationRecord into database
 * @param db target database
 * @param {EvaluationRecord} evaluationRecord
 */
exports.add = async (db, evaluationRecord) => {
    let ObjectId = require('mongodb').ObjectId;
    let eval_id = new ObjectId(evaluationRecord._id);
    const existingEvaluationRecordId = await db.collection('evaluation_record').findOne({_id: eval_id});

    let salesman_id = new ObjectId(evaluationRecord.salesManID);
    const existingSalesMan = await db.collection('salesmen').findOne({_id: salesman_id});

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + evaluationRecord.salesManID + ' does not exist!');
    }

    if (existingEvaluationRecordId) {
        throw new Error('EvaluationRecord with id ' + evaluationRecord._id + ' already exists!');
    }
    evaluationRecord.salesManID = salesman_id;
    return (await db.collection('evaluation_record').insertOne(evaluationRecord)).insertedId;
}

/**
 * Update an old evaluationRecord with a new one
 * @param {*} db target database
 * @param {*} _id old evaluationRecord Id
 * @param {*} evaluationRecord The new evaluationRecord
 */
exports.updateById = async (db, _id, evaluationRecord) => {
    let ObjectId = require('mongodb').ObjectId;
    let eval_id = new ObjectId(_id);
    let salesman_id = new ObjectId(evaluationRecord.salesManID);

    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: eval_id});

    if (!existingEvaluationRecord){
        throw new Error("No EvaluationRecord with id " + _id + " exists!");
    }

    return await db.collection('evaluation_record').updateOne(
        {
            _id: eval_id
        },
        {
            $set: {
                goalDescription: evaluationRecord.goalDescription,
                targetValue: evaluationRecord.targetValue,
                actualValue: evaluationRecord.actualValue,
                year: evaluationRecord.year,
                salesManID: salesman_id,
                // TODO: Remove this part because it shouldn't be able to assign a already existing
                //  evaluation-record to an another salesman...

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
    let ObjectId = require('mongodb').ObjectId;
    let eval_id = new ObjectId(_id);
    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: eval_id});

    if (!existingEvaluationRecord) {
        throw new Error("EvaluationRecord with: " + _id + " doesn't exist!")
    }
    return db.collection('evaluation_record').deleteOne({_id: eval_id})
}

/**
 * Delete all evaluationRecords of one salesman
 * @param {*} db source database
 * @param {*} salesManID salesmanID
 */
exports.deleteBySalesmanID = async (db, salesManID) => {
    let ObjectId = require('mongodb').ObjectId;
    let salesman_ID = new ObjectId(salesManID);
    const existingSalesMan = await db.collection('salesmen').findOne({_id: salesman_ID});

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + evaluationRecord.salesManID + ' does not exist!');
    }

    return db.collection('evaluation_record').deleteMany({salesManID: salesman_ID});
}