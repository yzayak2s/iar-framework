exports.getBonusComputationBySalesmanID = async (db, salesManId) => {
    return await db.collection('bonus_calculations').findOne({salesManID: salesManId});
}

exports.getBonusComputationBySalesmanIDAndYear = async (db, salesManId, year) => {
    return await db.collection('bonus_calculations').findOne({salesManID: salesManId, year: year});
}

exports.addBonusComputation = async (db, bonusComputation) => {
    const existingBonusComputation = await db.collection('bonus_calculations').findOne({_id: bonusComputation._id});
    if (existingBonusComputation) {
        await db.collection('bonus_calculations').deleteOne({_id: bonusComputation._id});
    }

    return await db.collection('bonus_calculations').insertOne(bonusComputation).insertedId;
}

exports.deleteBonusComputation = async (db, _id) => {
    return db.collection('bonus_calculations').deleteOne({_id: _id});
}