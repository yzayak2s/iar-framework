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
    return await db.collection('evaluation_record').findOne({_id: parseInt(_id)});
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
 * insert a new evaluationRecord into database
 * @param db target database
 * @param {EvaluationRecord} evaluationRecord
 */
exports.add = async (db, evaluationRecord) => {
    const existingEvaluationRecordId = await db.collection('evaluation_record').findOne({_id: evaluationRecord._id});
    const existingSalesMan = await db.collection('salesmen').findOne({_id: evaluationRecord.salesManID});

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + evaluationRecord.salesManID + ' does not exist!');
    }

    if (existingEvaluationRecordId) {
        throw new Error('EvaluationRecord with id ' + evaluationRecord._id + ' already exists!');
    }
    return (await db.collection('evaluation_record').insertOne(evaluationRecord)).insertedId;
}

/**
 * Update an old evaluationRecord with a new one
 * @param {*} db target database
 * @param {*} _id old evaluationRecord Id
 * @param {*} evaluationRecord The new evaluationRecord
 */
exports.updateById = async (db, _id, evaluationRecord) => {
    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: parseInt(_id)});

    if (!existingEvaluationRecord){
        throw new Error("No EvaluationRecord with id " + _id + " exists!");
    }

    return await db.collection('evaluation_record').updateOne(
        {
            _id: parseInt(_id)
        },
        {
            $set: {
                goalDescription: evaluationRecord.goalDescription,
                targetValue: evaluationRecord.targetValue,
                actualValue: evaluationRecord.actualValue,
                year: evaluationRecord.year,
                // TODO: Remove this part because it shouldn't be able to assign a already existing
                //  evaluation-record to an another salesman...
                //salesManID: evaluationRecord.salesManID
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
    const existingEvaluationRecord = await db.collection('evaluation_record').findOne({_id: parseInt(_id)});

    if (!existingEvaluationRecord) {
        throw new Error("EvaluationRecord with id " + _id + " doesn't exist!")
    }
    return db.collection('evaluation_record').deleteOne({_id: parseInt(_id)})
}

/**
 * Delete all evaluationRecords of one salesman
 * @param {*} db source database
 * @param {*} salesManID salesmanID
 */
exports.deleteBySalesmanID = async (db, salesManID) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(salesManID)});

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + salesManID + ' does not exist!');
    }

    return db.collection('evaluation_record').deleteMany({salesManID: parseInt(salesManID)});
}