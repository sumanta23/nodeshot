var inherits    = require('util').inherits;
var BaseAdapter = require('./BaseAdapter.js');
var fs          = require("fs");
var schedular   = require('../../schedular/index.js');

function FileStore() {
    this.channel = "FileStore";
    BaseAdapter.call(this);
}

inherits(FileStore, BaseAdapter);



FileStore.prototype.put =function(filepath, url){
    var key = new Buffer(config.rediskey.filestore + ":" + url + ":" + filepath).toString('base64');
 
    return new Promise(function(resolve, reject){
        var t = new Date();
        t.setSeconds(t.getSeconds() + config.rediskey.ttl);
        schedular.scheduleJob(t, function(){ console.log("clearing from localstore: "+ filepath); fs.unlink(filepath)});
        return resolve(key);
      });
}


FileStore.prototype.get =function(request, response, fileId) {
	var fileInfo = new Buffer(fileId, 'base64').toString('ascii');
    var index = fileInfo.indexOf('/');
    var filepath = fileInfo.substring(index,fileInfo.length);
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