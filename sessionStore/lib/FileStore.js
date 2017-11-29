var inherits    = require('util').inherits;
var BaseAdapter = require('./BaseAdapter.js');
var debug       = require('debug')("diskDB: ");
var dbpath  = "/tmp";
var db = require('diskdb');
db = db.connect(dbpath, ["events"]);


function FileStore() {
    this.channel = "diskDBStore";
    BaseAdapter.call(this);
}

inherits(FileStore, BaseAdapter);



FileStore.prototype.put =function(data){
    db.events.save( data);
}


FileStore.prototype.get =function(query) {
        var datas = db.events.find(query);
        return datas;
}

FileStore.prototype.remove =function(query) {
        var datas = db.events.remove(query);
}

module.exports.channelId = "diskDBStore";
module.exports.instance = function(){
    return new FileStore();
};