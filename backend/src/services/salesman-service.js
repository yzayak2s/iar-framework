const {ObjectId} = require("mongodb");
const orangeHRMService = require('../services/orangeHRM-service');

const Salesman = require('../models/SalesMan');
const {fitsModel} = require('../helper/creation-helper')
const orangeHRMService = require('../services/orangeHRM-service')
const openCRXService = require('../services/openCRX-service');

/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<SalesMan>}
 */
exports.getAll = async (db) => {
    return await db.collection('salesmen').find({unit: "Sales"}).toArray(); // use of toArray() is important here.
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
    salesman.uid = undefined;

    if (!await fitsModel(salesman, Salesman)){
        throw new Error('Incorrect body object was provided. Needs _id, firstname and lastname.')
    }

    if (existingSalesmanId) {
        if (existingSalesmanId._id === salesman._id) {
            throw new Error('Salesman with id ' + salesman._id + ' already exist!');
        }
    }

    return (await db.collection('salesmen').insertOne(new Salesman(salesman.firstname, salesman.lastname, salesman._id))).insertedId;
}

/**
 * insert a new salesman with a UID into database
 * @param db target database
 * @param {SalesMan} salesman with uid
 */
exports.addWithUID = async (db, salesman) => {
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: salesman._id});

    if (!await fitsModel(salesman, Salesman)){
        throw new Error('Incorrect body object was provided. Needs _id, firstname, lastname and uid.')
    }

    if (existingSalesmanId) {
        throw new Error('Salesman with id ' + salesman._id + ' already exist!');
    }

    return (await db.collection('salesmen').insertOne(new Salesman(salesman.firstname, salesman.lastname, salesman._id, salesman.uid))).insertedId;
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

exports.getSalesmenFromAPI = async (db) => {
    const orangeHRMEmployees = await orangeHRMService.getAllEmployees();
    // Only get Contacts
    let openCRXAccounts = (await openCRXService.getAllAccounts())[1];

    await Promise.all(orangeHRMEmployees.map(async employee => {
        let hasUID = false;

        if(((await this.getSalesManById(db, employee.employeeId)) !== null)) {
            await this.delete(db, employee.employeeId)
        }

        for (let i = 0; i < openCRXAccounts.length; i++) {
            const account = openCRXAccounts[i];

            if (employee.code == account.governmentId) {
                // ToDo: Does Salesman exist? If yes delete
                await this.addWithUID(db, new Salesman(employee.firstName, employee.lastName, employee.employeeId, account.accountUID));
                hasUID = true;
                // remove this account from check list
                openCRXAccounts.splice(i, 1);
            }
        }

        if (!hasUID) {
            await this.add(db, new Salesman(employee.firstName, employee.lastName, employee.employeeId));
        }
    }));
}