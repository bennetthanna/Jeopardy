// var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");

var server = app.listen(8080, function () {
    console.log("Server listening at 8080");
})

app.use(express.static('public'));

app.get('/', function (req, res) { 
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/questions/:category',function(req,res) {
 //now lets send the json file with questions for that category 
 res.sendFile(path.join(__dirname+'/public/'+req.params.category+'.json'));
});