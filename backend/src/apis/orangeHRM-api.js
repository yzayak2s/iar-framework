const orangeHRMService = require('../services/orangeHRM-service');
const https = require('https');
const qs = require("querystring");
const httpsAgent = new https.Agent({rejectUnauthorized: false});

// 2 Possibilities to get accessToken
//console.log('TEST1: ' + process.env.ORANGEHRM_ACCESSTOKEN)
//console.log('TEST2: ' + req.app.get('environment').accessToken)

exports.getEmployees = (req, res) => {
    const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';
    //let accessToken = req.app.get('environment').accessToken;
    //let expiresAt = process.env.ORANGEHRM_TOKEN_EXPIRES_AT;

    const body = qs.stringify({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: 'zayakh',
        password: '*Safb02da42Demo$'
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent,
    };

    orangeHRMService.getAllEmployees(baseUrl, body, config)
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getEmployeeByCode = (req, res) => {}