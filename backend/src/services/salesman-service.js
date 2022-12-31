const {ObjectId} = require("mongodb");

/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<SalesMan>}
 */
exports.getAll = async (db) => {
    return await db.collection('salesmen').find({}).toArray(); // use of toArray() is important here.
}

/**
 * retrieves salesmen by firstname from database
 * @param db source database
 * @param firstname
 * @return {Promise<SalesMan>}
 */
exports.getSalesManByFirstname = async (db, firstname) => {
    return await db.collection('salesmen').findOne({firstname: firstname});
}

/**
 * retrieves salesmen by _id from database
 * @param db source database
 * @param _id
 * @return {Promise<SalesMan>}
 */
exports.getSalesManById = async (db, _id) => {
    return await db.collection('salesmen').findOne({_id: _id});
}

/**
 * insert a new salesman into database
 * @param db target database
 * @param {SalesMan} salesman
 */
exports.add = async (db, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: salesman._id});

    if (existingSalesmanId) {
        if (existingSalesmanId._id === salesman._id) {
            throw new Error('Salesman with id ' + salesman._id + ' already exist!');
        }
    }
    return (await db.collection('salesmen').insertOne(salesman)).insertedId;
}

/**
 * update an existing salesman
 * @param db target database
 * @param _id
 * @param salesman
 * @return {Promise<SalesMan>} salesman
 */
exports.update = async (db, _id, salesman) => {
    let ObjectId = require('mongodb').ObjectId;
    let o_id = new ObjectId(_id);
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: o_id});

    if (existingSalesmanId) {
        return await db.collection('salesmen').updateOne(
            {
                _id: o_id
            },
            { // TODO: provide 3 updates because when updating only firstname here we setting lastname to null!
                $set: {
                    firstName: salesman.firstName,
                    lastName: salesman.lastName
                }
            }
        );
    } else {
        throw new Error("Salesmen with ID " + _id + " doesn't exist!");
    }
}

/**
 * delete a salesman by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    let ObjectId = require('mongodb').ObjectId;
    let o_id = new ObjectId(_id);
    const existingSalesMan = await db.collection('salesmen').findOne({_id: o_id});

    if (!existingSalesMan) {
        throw new Error("Salesman with id " + _id + " doesn't exist!")
    }
    return db.collection('salesmen').deleteOne({_id: o_id})
}