'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const request = require('request');


/**
 * Our Qlik Sense Server information
 * Needs exported certificates from Qlik Sense QMC
 */
var r = request.defaults({
    rejectUnauthorized: false,
    host: 'localhost',
    cert: fs.readFileSync(__dirname + '/client.pem'),
    key: fs.readFileSync(__dirname + '/client_key.pem')
})

/**
 * Request ticket from QPS.
 * Adjust uri as needed.
 */
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

/**
 * Express settings
 */
var app = express();

/**
 * Views configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Static resources, i.e our page assets
 */
app.use(express.static( path.join(__dirname, '../public') ))

/**
 * Default route
 */
app.get('/', function(req, res) {
    // Request a ticket, in this case a for a hardcoded user
    getQlikSenseTicket('hardcoded', 'testuser', function(err, ticket) {
        if(!err) {
            // If we got a ticket render template
            res.render('index', { 'ticket': ticket });
        } else {
            // handle error
        }
    })
});

// Start server
app.listen(8080)