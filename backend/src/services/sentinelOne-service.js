const axios = require('axios');

/**
 * retrieves agents by computerName
 */
exports.getAgentByComputerName = async (baseUrl, config, computerName) => {
    const agentByComputerName = await axios.get(
        `${baseUrl}/agents?computerName=${computerName}`,
        config
    );

    return agentByComputerName.data;
}

/**
 * retrieves agents starts with computerName
 */
exports.getAgentsStartsWithComputerName = async (baseUrl, config, computerName) => {
    const agentsStartsWithComputerName = await axios.get(
        `${baseUrl}/agents?computerName__contains=${computerName}`,
        config
    );
    
    const agents = agentsStartsWithComputerName.data.data;

    var agentsArray = [];
    
    agents.map((value) => {
        const {
            computerName,
            lastActiveDate,
            encryptedApplications,
            lastLoggedInUserName,
            agentVersion,
            createdAt,
            osStartTime,
            totalMemory,
            externalIp,
            lastIpToMgmt,
            serialNumber,
            modelName,
            siteName,
            groupName,
            operationalState,
            networkInterfaces,
        } = value;

        agentsArray.push({
            computerName,
            lastActiveDate,
            encryptedApplications,
            lastLoggedInUserName,
            agentVersion,
            createdAt,
            osStartTime,
            totalMemory,
            externalIp,
            lastIpToMgmt,
            serialNumber,
            modelName,
            siteName,
            groupName,
            operationalState,
            networkInterfaces,   
        })
    });

    return agentsArray;
}