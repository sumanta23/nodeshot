var html    = require("./html.js");
var redis   = require("./redis.js");
var Promise = require('bluebird');
var debug   = require('debug');

function createImageShot(url){
	return html.generateURLShot(url).then(function(filedata){
		debug("file data", filedata);
		return redis.put(filedata.filepath).then(function(data){
			return data;
		});
	});
}

function fetchImageShot(request, response, imageId){
	return redis.get(request, response, imageId);
}

module.exports = {
	createImageShot : createImageShot,
	fetchImageShot : fetchImageShot
}