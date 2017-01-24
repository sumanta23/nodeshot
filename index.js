var express = require('express');
var app = express();
var cjson = require('cjson');
var config = cjson.load('./config/appconfig.json');
console.log(config);

require('./boot.js').init(config);

var debug = require("debug")("rest:");
var ServiceHandler = require("./ServiceHandler").serviceHandler;

var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var service = require("./lib/service.js");



app.set('port', (process.env.PORT || config.app.port))

app.get('/', function(request, response) {
  	response.sendFile(__dirname + '/public/index.html');
});

app.post("/img", urlencodedParser, function(request, response){
	var body = request.body;
	console.log("body", body);
	if(!body.url){
		response.status(400).json({errors: [{msg:"url do not exists", code: 400}]});
	}
	ServiceHandler(request, response, service.createImageShot(body.url));
});

app.get("/img/:fileId", function(request, response){
	var fileId = request.params.fileId;
	debug("fileId", fileId);
	return service.fetchImageShot(request, response, fileId);
});

app.listen(config.app.port, function() {
  console.log("Node app is running at localhost:" + config.app.port)
})
