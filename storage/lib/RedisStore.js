var fs                 = require('fs');
var Promise            = require('bluebird');
var redis              = require('redis');
var client             = redis.createClient(config.redis);
var inherits           = require('util').inherits;
var BaseAdapter        = require('./BaseAdapter.js');
var sendEvent   = require('../../socket.js').sendEvent;

function RedisStore() {
    this.channel = "RedisStore";
    BaseAdapter.call(this);
}

inherits(RedisStore, BaseAdapter);

RedisStore.prototype.put = function(filepath, url, userId){
    var key = new Buffer(config.rediskey.filestore + ":" + url + ":" + filepath).toString('base64');
    var t = new Date();
    t.setSeconds(t.getSeconds() + config.rediskey.ttl);
    schedular.scheduleJob(t, function(){
        var temp=memstore.get(userId);
        sendEvent(temp.socket, 'clearing', {msg: "clearing from localstore "});
    });
    return new Promise(function(resolve, reject){
        fs.readFile(filepath, function(err,data){
            if (!err){
                client.set( key, data, function(err, resp) {
                    if (err) {
                        fs.unlink(filepath);
                        return reject(err);
                    }
                    else {
                        fs.unlink(filepath);
                        client.expire(key, config.rediskey.ttl);
                        return resolve(key);
                    }
                });
            }else{
                fs.unlink(filepath);
                debug("error: ",err);
                return reject(err);
            }
        });
    });
}

RedisStore.prototype.get = function(request, response, fileId) {
    client.get(fileId,function(err,value) {
        if (err) { next(err); } else {
            if (!value) {
                response.send("file not found").status(404);
            } else {
                response.writeHead(200, {"Content-Type": "image/jpg"});
                response.end(value,'binary');
            }
        }
    });
}


module.exports.channelId = "RedisStore";
module.exports.instance = function(){
    return new RedisStore();
};
