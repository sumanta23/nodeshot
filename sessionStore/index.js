var fs           = require('fs');
var _            = require('lodash');
var debug        = require("debug")("SessionEventStore:");

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
                var channel = require(newpath);
                if(channel.channelId && channel.instance){
                    channelListners[channel.channelId] = channel.instance;
                }
            }
        }
    });
}

loadListners(__dirname+'/lib', true);


function putData(data){
	 if ( config.eventStore.type && _.isFunction(channelListners[config.eventStore.type])) {
        var channelHandler = channelListners[config.eventStore.type]();
        return channelHandler.put(data);
	}
}

function getData(key){
	if ( config.eventStore.type && _.isFunction(channelListners[config.eventStore.type])) {
        var channelHandler = channelListners[config.eventStore.type]();
        return channelHandler.get(key);
	}
}

function removeData(query){
    if ( config.eventStore.type && _.isFunction(channelListners[config.eventStore.type])) {
        var channelHandler = channelListners[config.eventStore.type]();
        return channelHandler.remove(query);
    }
}

module.exports = {
	putData : putData,
	getData : getData,
    removeData : removeData
}