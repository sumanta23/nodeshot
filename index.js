var config = require('./config');
var Hashtable = require('jshashtable');
var memstore = new Hashtable();

var boot = require('./boot.js')
var uuid               = require('./uuid');
boot.init(config);
boot.initMemStore(memstore);
var debug = require("debug")("rest:");
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');
var auth = require('./mw/authmiddleware.js');
var authMW = auth.authorize;
var responseHandler = require("./ResponseHandler").responseHandler;
var tracingmw = require('./mw/tracingMiddleware.js').initialize;
var service = require("./lib/service.js");

var express = require('express');
var session = require('express-session');
var app = express();
var port = process.env.PORT || config.app.port;
var server;

if(config.app.cluster){
    server = require('./cluster.js').init(app, port, config.app.nworker);
}else{
    server = app.listen(port, function(){
        debug("server started on localhost:"+port)
    });
}
require('./socket.js').listen(server);

app.use(session({secret: '$eCuRiTy'}));
app.use(morgan('short'));
app.use(compression({'threshold' : 10}));
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

require("./notification");
var dbpath  = "/tmp";
var db = require('diskdb');
db = db.connect(dbpath, ["events"]);