const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();

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

MongoClient.connect('mongodb://' + credentials + domain + ':' + port + '/').then(dbo =>{ //connect to MongoDb
    app.set('db', dbo.db(databaseName));
    app.listen(8080, () => { //start webserver
        console.log('Webserver started.');
    });
});