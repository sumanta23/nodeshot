var schedule = require('node-schedule');

scheduleJob = function(cronsyntax, cb){
	var j = schedule.scheduleJob(cronsyntax, cb);
}

exports.scheduleJob = scheduleJob;