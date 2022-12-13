/**
 * retrieves bonussalaries from database
 * @param db source database
 * @return {Promise<Bonus>}
 */
exports.getAll = async (db) => {
    return await db.collection('bonus').find({}).toArray(); // use of toArray() is important here
}

/**
 * insert a new bonus into database
 */
exports.add = async (db, bonus) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: bonus._id});

    if (existingBonusById) {
        if (existingBonusById._id === bonus._id) {
            throw new Error('Bonus with id ' + bonus._id + ' already exist!');
        }
    }
    return (await db.collection('bonus').insertOne(bonus)).insertedId;
}
