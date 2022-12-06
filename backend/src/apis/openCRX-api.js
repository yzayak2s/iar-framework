const openCRXService = require("../services/openCRX-service");
const https = require("https");
const httpsAgent = new https.Agent({rejectUnauthorized: false});


// OpenCRX request data
const baseUrl = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX'
const credentials = {
    username: 'guest',
    password: 'guest'
};
const config = {
    headers: {
        'Accept': 'application/json'
    },
    httpsAgent: httpsAgent, 
    auth: credentials,
};


exports.getAccounts = (req, res) => {
    openCRXService.getAllAccounts(baseUrl, config).then((accounts) => {
        res.send(accounts);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getAccountByUID = (req, res) => {
    openCRXService.getAccountByUID(baseUrl, config, req.params.uid)
        .then((accountByUID) => {
            res.send(accountByUID);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.getProducts = (req, res) => {
    openCRXService.getAllProducts(baseUrl, config).then((products) => {
        res.send(products);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getProductByUID = (req, res) => {
    openCRXService.getProductByUID(baseUrl, config, req.params.uid)
        .then((productByUID) => {
            res.send(productByUID);
        }).catch(_ => {
        res.status(500).send();
    });

}

exports.getSalesOrders = (req, res) => {
    openCRXService.getAllSalesOrders(baseUrl, config).then(salesOrders => {
        res.send(salesOrders);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getSalesOrderByUID = (req, res) => {
    openCRXService.getSalesOrderByUID(baseUrl, config, req.params.uid)
        .then((salesOrderByUID) => {
            res.send(salesOrderByUID);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.getPositions = (req, res) => {

    //openCRXService...

}