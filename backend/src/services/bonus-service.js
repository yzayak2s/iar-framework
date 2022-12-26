const evaRecordService = require('./evaluation-record-service')
const {fitsModel} = require('../middlewares/creation-helper')
const Bonus = require('../models/Bonus')

/**
 * @typedef {Object} evalRecords Evaluation Records with Bonus
 * @property {string} evalRecords.goalDescription - Name of the Evaluation Goal
 * @property {number} evalRecords.targetValue - Goal Value we want to reach
 * @property {number} evalRecords.actualValue - Goal Value that was actually reached
 * @property {number} evalRecords.bonus - Bonus for this Evaluation
 */

/**
 * @typedef {Object} salesOrders Sales order with Bonus
 * @property
 */

/** 
 * @typedef {Object} orderBonus
 * @property {number} total - The total amount of money earned for the orders
 * @property {Array<salesOrders} orderBonuses - Array of Order Bonuses
 */

/**
 * @typedef {Object} perfBonus
 * @property {number} total - The total amount of money earned for the performance Evaluation
 * @property {Array<evalRecords>} evalRecords - Array of evaluation Records of the evaluation

 */



/**
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns {Promise<{total: number, orderBonus: orderBonus}>} Total bonus of all sales orders aswell as array of sales orders with corresponding bonuses
 */
async function calculateBonusOrder(db, salesManID, year) {
    // request all belonged salesOrders and positions of a salesman (per year)
    // Client Ranking:
    //      percentage of total amount earned
    //      if ranking === excellent

    // excellent = 1 (7.5)
    // very good = 2 (5)
    // good = 3 (2.5)

    //
    // Alternative switch case

    // return {total, []}
    // return {total, }
}

/**
 * 
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns { Promise<{total: number, perfBonus: perfBonus}> } Total bonus of all records aswell as array of performance records with corresponding bonuses
 */
async function calculateBonusPerformance(db, salesmanID, year) {
    // request all belonged evaluation records to salesman (per year)
    // if actual value < target value --> 20 $
    // if actual value = target value --> 50 $
    // if actual value > target value --> 100 $
    // sumup the values as amount (total bonus B)

    // Alternative would switch-case

    // Get all records of current year
    const evalRecords = await evaRecordService.getBySalesmanID(db, salesmanID)
    evalRecords.filter(evaRecord => evaRecord.year === year);

    console.log(evalRecords);
    // evalRecords: {goalDescription, ACTUAL, TARGET, BONUS}, ..., Average: [ACTUAL, TARGET]}
    // {total, [evalRecords 1-...]}
    // return {total: total, evalRecords: evalRecordsWithBonus}
}

/**
 * Calculate Bonus for one salesman by ID
 * @param {*} db source database
 * @param {*} salesmanID salesman ID
 * @param {*} year current year
 * @returns {Promise<{total: number, orderBonus: orderBonus, perfBonus: perfBonus}>} Total bonus, Sales orders with bonuses and the performance records with bonuses
 */
exports.calculateBonusBySalesmanID = async (db, salesmanID, year) => {
    const orderBonus = await calculateBonusOrder(db, salesmanID, year);
    const perfBonus = await calculateBonusPerformance(db, salesmanID, year);

    // const totalBonus = orderBonus.total + perfBonus.total;
    // Gonna look like {TotalBonus, [ArrayOfOrderBonus], [ArrayOfPerfBonus]} 
    // return {totalBonus: totalBonus, orderBonus: orderBonus, perfBonus: perfBonus};
}

/**
 * Calculate Bonuses for all salesmen
 * @param {*} db source database
 * @param {*} year current year
 */
exports.calculateAllBonus = async (db, year) => {

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

    if (!await fitsModel(bonus, Bonus)) {
        throw new Error('Incorrect body object was provided. Needs _id, year, value, remark, verified and salesManID.')
    }

    if (!existingSalesMan){
        throw new Error('Salesman with id ' + bonus.salesManID + ' does not exists!');
    }

    if (existingBonusById) {
        throw new Error('Bonus with id ' + bonus._id + ' already exists!');
    }
    
    return (await db.collection('bonus').insertOne(new Bonus(bonus._id, bonus.year, bonus.value, bonus.remark, bonus.verified, bonus.salesManID))).insertedId;
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