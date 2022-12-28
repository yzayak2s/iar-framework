const Salesman = require('../models/SalesMan');
const {fitsModel} = require('../helper/creation-helper')
const {getAllEmployees} = require('../services/orangeHRM-service')
const {getAllAccounts} = require('../services/openCRX-service');

/**
 * retrieves salesmen from database
 * @param db source database
 * @return {Promise<SalesMan>}
 */
exports.getAll = async (db) => {
    return await db.collection('salesmen').find().toArray(); // use of toArray() is important here.
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
    return await db.collection('salesmen').findOne({_id: parseInt(_id)});
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
        throw new Error('Salesman with id ' + salesman._id + ' already exist!');
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
    const existingSalesmanId = await db.collection('salesmen').findOne({_id: parseInt(_id)});
    
    if (!existingSalesmanId) {
        throw new Error("Salesmen with id " + _id + " doesn't exist!");
    }

    return await db.collection('salesmen').updateOne(
        {
            _id: parseInt(_id)
        },
        { // TODO: provide 3 updates because when updating only firstname here we setting lastname to null!
            $set: {
                firstname: salesman.firstname,
                lastname: salesman.lastname
            }
        }
    );
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
        throw new Error("Salesman with id " + _id + " doesn't exist!")
    }

    return db.collection('salesmen').deleteOne({_id: parseInt(_id)})
}

exports.getSalesmenFromAPI = async (db) => {
    // ToDo: What if the Salesman already is in the database? Maybe someone took the ID? Delete Salesmen before?
    
    const orangeHRMEmployees = await getAllEmployees();
    // Only get Contacts
    let openCRXAccounts = (await getAllAccounts())[1];

    orangeHRMEmployees.forEach(employee => {
        let hasUID = false;
        
        for (let i = 0; i < openCRXAccounts.length; i++) {           
            const account = openCRXAccounts[i];

            if (employee.code == account.governmentId) {
                this.addWithUID(db, new Salesman(employee.firstName, employee.lastName, employee.employeeId, account.accountUID));
                hasUID = true;
                // remove this account from check list
                openCRXAccounts.splice(i, 1);
            }
        }

        if (!hasUID) {
            this.add(db, new Salesman(employee.firstName, employee.lastName, employee.employeeId));
        }
    });
}