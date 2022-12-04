const axios = require('axios');

/**
 * retrieves accounts from openCRX
 */
exports.getAllAccounts = async (baseUrl, config) => {
    const contacts = await axios.get(
        `${baseUrl}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`,
        config
    );
    const accounts = contacts.data.objects;

    var salesMenArray = [],
        customersArray = []

    accounts.map((value) => {
        if (value['@type'].endsWith('LegalEntity')) {
            const {
                name,
                accountRating,
                accessLevelBrowse,
                accountState
            } = value;

            customersArray.push({
                name,
                accountRating,
                accessLevelBrowse,
                accountState
            });
        }
        if (value['jobTitle'] && value['jobTitle'] === 'Senior Salesman') {
            const {
                firstName,
                lastName,
                governmentId
            } = value;

            salesMenArray.push({
                firstName,
                lastName,
                governmentId
            });
        }
    });
    return [customersArray,salesMenArray]
}

/**
 * retrieves products from openCRX
 */
exports.getAllProducts = async (baseUrl, config) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product`,
        config
    );

    var productsArray = [];

    const products = response.data.objects;

    products.map((value) => {
        const {
            productNumber,
            name,
            description
        } = value;

        productsArray.push({
            productNumber,
            name,
            description
        });
    });

    return productsArray;
}

/**
 * retrieves salesorders from OpenCRX
 */
exports.getAllSalesOrders = async (baseUrl, config) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`,
        config
    );

    var salesOrdersArray = [];

    const salesOrders = response.data.objects;

    salesOrders.map((value) => {
        const {
            customer,
            salesRep,
            priority,
            contractNumber,
            totalTaxAmount,
            totalBaseAmount,
            totalAmountIncludingTax,
        } = value;

        var customerUID;
        Object.entries(customer).forEach(([key,value]) => {
            if (key === '@href') {
                customerUID = value.split('account/')[1];
            }
        });

        var salesManUID ;
        Object.entries(salesRep).forEach(([key,value]) => {
           if (key === '@href') {
               salesManUID = value.split('account/')[1];
           }
        });

        salesOrdersArray.push({
            customer: customerUID,
            salesRep: salesManUID,
            priority,
            contractNumber,
            totalTaxAmount,
            totalBaseAmount,
            totalAmountIncludingTax,
        })

    });
        return salesOrdersArray;
}