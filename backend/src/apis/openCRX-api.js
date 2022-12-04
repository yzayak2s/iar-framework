const openCRXService = require("../services/openCRX-service");
const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

exports.getAccounts = (req, res) => {
    const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX'
    const credentials = {
        username: 'guest',
        password: 'guest'
    };
    const config = {
        headers: {
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
        auth: credentials,
    };

    openCRXService.getAllAccounts(baseUrl, config).then((accounts) => {
        res.send(accounts);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getProducts = (req, res) => {
    const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX'
    const credentials = {
        username: 'guest',
        password: 'guest'
    };
    const config = {
        headers: {
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
        auth: credentials,
    };

    openCRXService.getAllProducts(baseUrl, config).then((products) => {
        res.send(products);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getSalesOrders = (req, res) => {
    const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX'
    const credentials = {
        username: 'guest',
        password: 'guest'
    };
    const config = {
        headers: {
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
        auth: credentials,
    };

    openCRXService.getAllSalesOrders(baseUrl, config).then(salesOrders => {
        res.send(salesOrders);
    }).catch(_ => {
        res.status(500).send();
    });
}