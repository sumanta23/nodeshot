var debug = require("debug")("notifcationProcessor:");
var dbInst = require("../sessionStore");
var schedule = require('node-schedule');
var _      = require("lodash");
var cronsyntax = '* * * * * *';
var query=undefined;
var PubSub = require('pubsub-js');
var TOPIC = "MY TOPIC";


schedule.scheduleJob(cronsyntax, function(){
	var datas=dbInst.getData(query);
	_.map(datas, function(data){
		PubSub.publishSync( TOPIC, data );
	});
});

var mySubscriber = function( msg, data ){
    var notifcationId = data._id
    var userId = data.userId;
    var message = data.msg;
    var type = data.type;
    var event = data.event;
    var temp = memstore.get(userId);
    if(temp && temp.socket){
        var tempData = { event :event , msg : { type: type, data: message}};
        data = JSON.stringify(tempData);
        temp.socket.send(data);
        dbInst.removeData({_id: notifcationId});
    }

};

var token = PubSub.subscribe( TOPIC, mySubscriber );