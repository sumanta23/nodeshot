var html    = require("./html.js");
var storage   = require("../storage");
var Promise = require('bluebird');
var debug   = require('debug');
var sendEvent   = require('../socket.js').sendEvent;

function createImageShot(url, res, userId){
	sendEvent(userId, 'update', {msg: "processing your request", event: "info"});
	return html.generateURLShot(url, res).then(function(filedata){
		debug("file data", filedata);
		return storage.putFile(filedata.filepath, url, userId).then(function(data){
			return {hash: data};
		});
	});
}

function fetchImageShot(request, response, imageId, userId){
	return storage.getFile(request, response, imageId, userId);
}

module.exports = {
	createImageShot : createImageShot,
	fetchImageShot : fetchImageShot
}