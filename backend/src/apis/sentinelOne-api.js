const sentinelOneService = require("../services/sentinelOne-service");
const https = require("https");
const httpsAgent = new https.Agent({rejectUnauthorized: false});

// SentinelOne Request data
const baseUrl = "https://euce1-104.sentinelone.net/web/api/v2.1";
const credentials = {}

var config = {
    headers: { 
      'Authorization': 'ApiToken Z6vr1grCywql1LMBiOcCEzK50Z4AyeiZMwDqNBI9lx26Mwp2mBPtoVXUs3RvrWHiZ9uwI0Yn8hg7SsVA',
      'Accept-Encoding': 'application/json',
    },
    httpsAgent: httpsAgent,
};

exports.getAgentByComputerName = (req, res) => {
    sentinelOneService.getAgentByComputerName(baseUrl, config, req.params.computerName)
        .then((agentByComputerName) => {
            res.send(agentByComputerName);
        }).catch(_ => {
            res.status(500).send();
        });
}