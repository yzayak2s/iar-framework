const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();
const crypto = require('crypto');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// MongoDB connection details:
const domain = 'localhost';
const port = '27017';
const username = '';
const password = '';
const databaseName = 'intArch';

app.use(express.json()); //adds support for json encoded bodies
app.use(express.urlencoded({extended: true})); //adds support url encoded bodies
app.use(upload.array()); //adds support multipart/form-data bodies

const apiRouter = require('./routes/api-routes'); //get api-router from routes/api
app.use('/api', apiRouter); //mount api-router at path "/api"


let credentials = '';
if(username && username !== ''){
    credentials = username+':'+password+'@';
}

MongoClient.connect('mongodb://' + credentials + domain + ':' + port + '/').then(async dbo =>{ //connect to MongoDb
    const db = dbo.db(databaseName);
    await initDb(db);
    app.set('db',db);
    app.listen(8080, () => { //start webserver
        console.log('Webserver started.');
    });
});

async function initDb(db){
    if(await db.collection('users').count() < 1){ //if no user exists create admin user
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = crypto.randomBytes(8).toString('base64');
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, true));

        console.log('created admin user with password: '+adminPassword);
    }
}