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