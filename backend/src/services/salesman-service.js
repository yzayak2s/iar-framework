/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<SalesMan>}
 */
exports.getAll = async (db) => {
    return await db.collection('salesmen').find({}).toArray(); // use of toArray() is important here.
}


/**
 * insert a new salesman into database
 * @param db target database
 * @param {SalesMan} salesman
 */
exports.add = async (db, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: salesman._id});
    // console.log(salesman)
    if (existingSalesmanId) {
        if (existingSalesmanId._id === salesman._id) {
            throw new Error('Salesman already exist!');
        }
    }
    return db.collection('salesmen').insertOne(salesman);
}

/**
 * delete a salesman by _id in database
 * @param db source database
 * @param _id
 * @return {Promise<*>}
 */
exports.delete = async (db, _id) => {
    const existingSalesMan = await db.collection('salesmen').findOne({_id: parseInt(_id)});

    if (!existingSalesMan) {
        throw new Error("Salesman with: " + _id + " doesn't exist!")
    }
    return db.collection('salesmen').deleteOne({_id: parseInt(_id)})
}