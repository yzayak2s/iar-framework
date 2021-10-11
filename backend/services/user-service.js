const crypto = require('crypto');
const salt = 'integrationArchitectures';

exports.add = async function (db, user){
    user.password = hashPassword(user.password);

    return (await db.collection('users').insertOne(user)).insertedId; //return unique ID
}

exports.authenticate = async function (db, credentials){
    let user = await db.collection('users').findOne({username: credentials.username}); //retrieve user with given email from database

    if(!user) throw new Error('User was not found!'); //no user found -> throw error
    if(!verifyPassword(credentials.password, user.password)) throw new Error('Password wrong!');
}

function hashPassword(password){
    let hash = crypto.createHmac('sha3-256', salt);
    hash.update(password);
    return hash.digest('base64');
}

function verifyPassword(password, hash){
    return hashPassword(password) === hash;
}