var debug    = require('debug')('socketio: ');
var sessionStore = require("./sessionStore");

function sendEvent(userId, event, type, data){
    if(userId){
        var obj = {"userId" : userId, msg : data, type : type, event: event};
        sessionStore.putData(obj);
    }
}


function listen(server, opts) {
    const WebSocket = require('ws');
    var wss = new WebSocket.Server({
        server: server,
        noServer : true
    });
    
    wss.on('connection', function (socket, req) {
        var userId       = req.headers.cookie;
        userId       = new Buffer(userId).toString('base64');
        memstore.put(userId, {userId: userId, socket :socket});

        socket.send(JSON.stringify({event: "userId",msg: { type:"info", data:userId}}));

        socket.on('message', function (data) {
            debu("msg recieved", JSON.stringify(data));
            socket.send(JSON.stringify({event: "info", "data":"We are Connected"}));
        });
        
        socket.on('disconnect', function(){
            memstore.remove(socket.id);
            debug('user disconnected');
        });
    });
}

exports.listen = listen;
exports.sendEvent = sendEvent;
