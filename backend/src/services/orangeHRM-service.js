const axios = require('axios');

var issueToken = {}

async function checkToken(issueToken, generateToken) {
    return issueToken && (issueToken.expires_at - new Date().getTime() > 0) ? issueToken : await generateToken()
}

/**
 * retrieves employees from orangeHRM
 */
exports.getAllEmployees = async (baseUrl, config, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const employees = await axios.get(`${baseUrl}/api/v1/employee/search`, config);

    return employees.data.data;
}

/**
 * retrieves an employee by employeeId from orangeHRM
 */
exports.getEmployeeByID = async (baseUrl, config, employeeId, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const employeeById = await axios.get(`${baseUrl}/api/v1/employee/${employeeId}`, config);

    return employeeById.data.data;
}

/**
 * retrieves bonusSalary of an employee
 */
exports.getBonusSalariesByEmployee = async (baseUrl, config, employeeId, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const bonusSalariesByEmployee = await axios.get(`${baseUrl}/api/v1/employee/${employeeId}/bonussalary`, config);
    return bonusSalariesByEmployee.data.data;
}

/**
 * insert a new bonus into database and add it in orangeHRM
 */
exports.add = async (db, baseUrl, config, bonus, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const existingBonus = await db.collection('bonus').findOne({_id: parseInt(bonus._id)})

    if (existingBonus) {
        if (existingBonus._id === bonus._id) {
            throw new Error('Bonus with id ' + bonus._id + ' already exist!');
        }
    }

    await axios.post(
        `${baseUrl}/api/v1/employee/${bonus.salesManID}/bonussalary`,
        {year: bonus.year, value: bonus.value},
        config
    );
    return (await db.collection('bonus').insertOne(bonus)).insertedId;
}