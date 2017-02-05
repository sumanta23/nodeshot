var fs           = require('fs');
var _            = require('lodash');
var debug        = require("debug")("storage:");

var channelListners = {};

function loadListners(path, loadFilesInRoot) {
    loadFilesInRoot = (loadFilesInRoot === undefined) ? true : loadFilesInRoot;

    var files;

    files = fs.readdirSync(path);

    files.forEach(function (file) {
        if (['.','..','.git'].indexOf(file) > -1) {
            return;
        }

        var newpath = [path, file].join('/');
        var pathStat;

        pathStat = fs.statSync(newpath);

        if (pathStat.isFile() && file.substr(-3) === '.js') {
            if (loadFilesInRoot){
                if(config.storage.type === "FileStore" && file === "RedisStore.js"){
                    debug("skipping loading RedisStore");
                }else{
                    var channel = require(newpath);
                    if(channel.channelId && channel.instance){
                        channelListners[channel.channelId] = channel.instance;
                    }
                }
            }
        }
    });
}

loadListners(__dirname+'/lib', true);


function putFile(filepath, url){
	 if ( config.storage.type && _.isFunction(channelListners[config.storage.type])) {
        var channelHandler = channelListners[config.storage.type]();
        return channelHandler.put(filepath, url);
	}
}

function getFile(req, res, fileId){
	 if ( config.storage.type && _.isFunction(channelListners[config.storage.type])) {
        var channelHandler = channelListners[config.storage.type]();
        return channelHandler.get(req, res, fileId);
	}
}

module.exports = {
	putFile : putFile,
	getFile : getFile
}