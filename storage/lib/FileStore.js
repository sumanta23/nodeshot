var inherits    = require('util').inherits;
var BaseAdapter = require('./BaseAdapter.js');
var fs          = require("fs");
var debug       = require('debug')("FileStore: ");
var schedular   = require('../../schedular/index.js');
var sendEvent   = require('../../socket.js').sendEvent;

function FileStore() {
    this.channel = "FileStore";
    BaseAdapter.call(this);
}

inherits(FileStore, BaseAdapter);



FileStore.prototype.put =function(filepath, url, userId){
    var key = new Buffer(config.rediskey.filestore + ":" + url + ":" + filepath).toString('base64');
 
    return new Promise(function(resolve, reject){
        var t = new Date();
        t.setSeconds(t.getSeconds() + config.rediskey.ttl);
        schedular.scheduleJob(t, function(){ 
            sendEvent(userId, 'update', 'info', "clearing from localstore");
            debug("clearing from localstore: "+ filepath); 
            fs.unlink(filepath);
        });
        return resolve(key);
      });
}


FileStore.prototype.get =function(request, response, fileId, userId) {
	var fileInfo = new Buffer(fileId, 'base64').toString('ascii');
    var index = fileInfo.lastIndexOf(config.temp);
    var filepath = fileInfo.substring(index,fileInfo.length);
    debug("fetching file: ", filepath);
    sendEvent(userId, 'update', 'success', "fetching file");
    fs.readFile(filepath, function(err,value){
      if (err) { response.send("file not found").status(404); } else {
        if (!value) {
          response.send("file not found").status(404);
        } else {
          response.writeHead(200, {"Content-Type": "image/jpg"});
          response.end(value,'binary');
        }
      }
    });
}


module.exports.channelId = "FileStore";
module.exports.instance = function(){
    return new FileStore();
};
