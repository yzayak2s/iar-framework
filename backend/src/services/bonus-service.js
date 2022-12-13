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
 * insert a new bonus into database
 * @param db target database
 * @param {Bonus} bonus
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

/**
 * update an existing bonus
 * @param db target database
 * @param _id
 * @param bonus
 * @return {Promise<Bonus>} bonus
 */
exports.update = async (db, _id, bonus) => {
    const existingBonusById = await db.collection('bonus').findOne({_id: parseInt(_id)});
    if (existingBonusById) {
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
    throw new Error(`Bonus with ID ${bonus._id} doesn't exist!`);
}

