var debug    = require('debug')('socketio: ');

function sendEvent(userId, event, data){
    if(userId){
        var temp=memstore.get(userId);
        if(temp && temp.socket)
            temp.socket.emit(event, data);
    }
}

function listen(server, opts) {
    var io    = require('socket.io')(server);

    //io.set('transports', ['websocket', 'polling', 'xhr-polling']);

    io.on('connection', function (socket) {
        socket.on('message', function (data) {
            socket.emit('news', { hello: 'world' });
        });

        socket.on("cevent", function(data){
            var userId = socket.id;
            memstore.put(userId, {userId: userId, socket : socket});
            socket.emit('welcome',{userId: userId});
        });

        socket.on('disconnect', function(){
            memstore.remove(socket.id);
            debug('user disconnected');
        });
    });
}

exports.listen = listen;
exports.sendEvent = sendEvent;
