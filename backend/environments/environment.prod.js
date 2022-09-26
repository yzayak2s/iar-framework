const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    db:{
        host: '10.20.107.96',
        port: 27017,
        username: '<username>',
        password: '<password>',
        authSource: '<dbName>',
        name: '<dbName>'
    },
    corsOrigins: [
        'http://10.20.107.128'
    ]
};

exports.default = environment;