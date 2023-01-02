require('dotenv').config()

const environment = {
    production: false,
    port: 8091,
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD,
    sentinelOne: {
        username: process.env.SENTINELONE_USERNAME,
        token: process.env.SENTINELONE_TOKEN
    },
    db:{
        host: '10.143.9.250',
        username: process.env.OBSERVIUM_DB_USERNAME,
        password: process.env.OBSERVIUM_DB_PASSWORD,
        name: 'observium'
    }/* ,
    corsOrigins: [
        'http://localhost:4200'
    ] */
};

exports.default = environment;
