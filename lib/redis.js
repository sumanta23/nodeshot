var projectDir         = __dirname;
var cjson              = require('cjson');
var config             = cjson.load(projectDir + "/../config/appconfig.json");
var fs                 = require('fs');
var Promise            = require('bluebird');
var redis              = require('redis');
var client             = redis.createClient(config.redis);

function put(filepath, url){
    var key = new Buffer(config.rediskey.filestore + ":" + url + ":" + filepath).toString('base64');
 
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

function get(request, response, fileId) {
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


module.exports = {
	put : put,
	get : get
}