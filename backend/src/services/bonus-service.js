function calculateBonusOrder() {
    // request all belonged salesOrders and positions of a salesman (per year)
    // Client Ranking:
    //      percentage of total amount earned
    //      if ranking === excellent

    // excellent = 1 (7.5)
    // very good = 2 (5)
    // good = 3 (2.5)

    //
    // Alternative switch case
}

function calculateBonusPerformance() {
    // request all belonged evaluation records to salesman (per year)
    // if actual value < target value --> 20 $
    // if actual value = target value --> 50 $
    // if actual value > target value --> 100 $
    // sumup the values as amount (total bonus B)

    // Alternative would switch-case
}

/**
 * retrieves bonussalaries from database
 * @param db source database
 * @return {Promise<Bonus>}
 */
exports.getAll = async (db) => {
    return await db.collection('bonus').find({}).toArray(); // use of toArray() is important here
}

/**
 * retrieves a bonus by _id from database
 * @param db source database
 * @param _id
 * @return {Promise<Bonus>}
 */
exports.getBonusById = async (db, _id) => {
    return await db.collection('bonus').findOne({_id: parseInt(_id)});
}

/**
 * retrieves all bonuses of a salesman by its id
 * @param db source database
 * @param salesManID salesman ID
 * @returns {Promise<Bonus>}
 */
exports.getBonusBySalesmanID = async (db, salesManID) => {
    return await db.collection('bonus').find({salesManID: parseInt(salesManID)}).toArray();
}

/**
 * insert a new bonus into database
 * @param db target database
 * @param {Bonus} bonus
 */
exports.add = async (db, bonus) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: bonus._id});
    const existingSalesMan = await db.collection('salesmen').findOne({_id: bonus.salesManID});

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + bonus.salesManID + ' does not exists!');
    }

    if (existingBonusById) {
        throw new Error('Bonus with id ' + bonus._id + ' already exists!');
    }
    
    return (await db.collection('bonus').insertOne(bonus)).insertedId;
}

/**
 * update an existing bonus
 * @param db target database
 * @param _id
 * @param bonus
 * @return {Promise<Bonus>} bonus
 */
exports.update = async (db, _id, bonus) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: parseInt(_id)});
    if (!existingBonusById) {
        throw new Error(`Bonus with ID ${bonus._id} doesn't exist!`);
    }

    return await db.collection('bonus').updateOne(
        {
            _id: parseInt(_id)
        },
        {
            $set: {
                year: bonus.year,
                value: bonus.value,
                verified: bonus.verified,
            }
        }
    );
}

/**
 * delete a bonus by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: parseInt(_id)});

    if (!existingBonusById) {
        throw new Error(`Bonus with ID ${_id} doesn't exist!`);
    }
    return db.collection('bonus').deleteOne({_id: parseInt(_id)});
}

/**
 * delete all bonuses of one salesman
 * @param db source database
 * @param salesManID
 * @return {Promise<void>}
 */
exports.deleteBySalesManID = async (db, salesManID) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(salesManID)});

    if (!existingSalesMan) {
        throw new Error(`Salesman wit id ${salesManID} doesn't exist!`);
    }
    return db.collection('bonus').deleteMany({salesManID: parseInt(salesManID)});
}