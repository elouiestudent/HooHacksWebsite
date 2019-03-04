#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express')
var mainpath = require('path');
var app = express();
var hbs = require('hbs');
let https = require ('https');


// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8800 );
app.set('view engine', 'hbs');

// -------------- variable definition -------------- //
// This counter is stored in RAM, and will be reset every time you
// restart the server.

app.use('/js', express.static(mainpath.join(__dirname, 'js')))
app.use('/css', express.static(mainpath.join(__dirname, 'css')))

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/quiz.html', function(req, res){
    res.sendFile(__dirname + '/quiz.html');
});

app.get('/analytics.html', function(req, res){
    res.sendFile(__dirname + '/analytics.html');
});

app.get('/machine.html', function(req, res){
    res.sendFile(__dirname + '/machine.html');
});

app.get('/contacts.html', function(req, res){
    res.sendFile(__dirname + '/contacts.html');
});

// Replace the accessKey string value with your valid access key.
let accessKey = 'add6b3293e564b539ef550901fc1aa85';

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace 
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = 'westus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/keyPhrases';
var body_;

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
        console.log("body: " + body)
    });
    response.on ('end', function () {
        body_ = JSON.parse (body);
        console.log(body_["documents"])
        let body__ = JSON.stringify (body_, null, '  ');
        console.log ("body__: " + body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};
console.log("After response_handler, before get_key_phrases")
let get_key_phrases = function (documents) {
    let body = JSON.stringify (documents);
    console.log("bodygetkeyphrases: " + body)
    let request_params = {
        method : 'POST',
        hostname : uri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : accessKey,
        }
    };

    let req = https.request (request_params, response_handler);
    req.write (body);
    req.end ();
}

let documents = { 'documents': [
	    { 'id': '1', 'language': 'en', 'text': 'Approving the location of a memorial to commemorate and honor the members of the Armed Forces who served on active duty in support of Operation Desert Storm or Operation Desert Shield.' },
	    { 'id': '2', 'language': 'en', 'text': 'Prior to each fiscal year, the President shall transmit to the Congress a proposed budget for the United States Government for that fiscal year in which total outlays do not exceed total receipts.' },
	    { 'id': '3', 'language': 'en', 'text': 'Proposing a balanced budget amendment to the Constitution requiring that each agency and department’s funding is justified.' }
]};
var dict = get_key_phrases (documents)


console.log("Before get_key_phrases")


//let obj = JSON.parse(text);
// get_key_phrases (documents);
app.get('/language.html', function(req, res){
	// console.log("logging: " + dict)
	var dictdoc = body_["documents"];
	var total = "H.J.RES.3 Keywords: ";
	for(var i = 0; i < dictdoc.length; i++)
	{
		total += dictdoc[i]["keyPhrases"];
		if(i < dictdoc.length - 1)
		{
			total += ","
		}
	}
	var link = "https://www.govinfo.gov/bulkdata/BILLS/115/1/hjres/BILLS-115hjres18ih.xml";
	// console.log(body_)
	// console.log("result: " + result)
	// var total = "";
    res.render("language", {"stringinfo": total, "link": link});
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});