var config = require('./config');
var HashTable = require('hashtable');
memstore = new HashTable();

var boot = require('./boot.js')
boot.init(config);
boot.initMemStore(memstore);
var debug = require("debug")("rest:");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var auth = require('./mw/authmiddleware.js');
var authMW = auth.authorize;
var responseHandler = require("./ResponseHandler").responseHandler;
var tracingmw = require('./mw/tracingMiddleware.js').initialize;
var service = require("./lib/service.js");

var express = require('express');
var app = express();
var port = process.env.PORT || config.app.port;

var server = app.listen(port, function(){
    debug("server strated on localhost:"+port)
});
require('./socket.js').listen(server)

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(__dirname + '/public'));


if(config.auth.enable === true){
    auth.initialize(app);
    app.use(authMW);
}
app.use(tracingmw);

app.post("/img", function(request, response){
    var body = request.body;
    debug("body: ", body);
    request.userId = body.userId;
    if(!body.url || body.url === ""){
        response.status(400).json({errors: [{msg:"url do not exists", code: 400}]});
    }
    responseHandler(request, response, service.createImageShot(body.url, body.resolution, body.userId));
});

app.get("/img/:fileId", function(request, response){
    var fileId = request.params.fileId;
    var userId = request.query.userId;
    request.userId = userId;
    debug("fileId", fileId);
    return service.fetchImageShot(request, response, fileId, userId);
});

