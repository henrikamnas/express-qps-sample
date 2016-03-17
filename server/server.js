'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');

var r = request.defaults({
    rejectUnauthorized: false,
    host: 'localhost',
    cert: fs.readFileSync(__dirname + '/client.pem'),
    key: fs.readFileSync(__dirname + '/client_key.pem')
})

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log( path.join(__dirname, '../public')  )

app.use(express.static( path.join(__dirname, '../public') ))

app.get('/', function(req, res) {
    getQlikSenseTicket('hardcoded', 'testuser', function(err, ticket) {
        if(!err) {
            res.render('index', { 'ticket': ticket });
        }
    })
});


function getQlikSenseTicket(directory, user, callback) {    
    r.post({
        uri: 'https://localhost:4243/qps/ticket?xrfkey=abcdefghijklmnop',
        body: JSON.stringify({
            "UserDirectory": directory,
            "UserId": user,
            "Attributes": []
        }),
        headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
        }
    }, function(err, res, body) {
        if(err) return callback(err);
        var ticket = JSON.parse(body)['Ticket'];
        
        callback(null, ticket);       
    });
};
 
app.listen(8080)