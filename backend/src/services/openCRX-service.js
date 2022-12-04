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
            customersArray.push(value);
        }
        if (value['jobTitle'] && value['jobTitle'] === 'Senior Salesman') {
            salesMenArray.push(value);
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
    return response.data.objects;
}

/**
 *
 */
exports.getAllSalesOrders = async (baseUrl, config) => {
    const response = await axios.get(
        `${baseUrl}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`,
        config
    );
    return response.data.objects;
}