var html    = require("./html.js");
var storage   = require("../storage");
var Promise = require('bluebird');
var debug   = require('debug');

function createImageShot(url, res){
	return html.generateURLShot(url, res).then(function(filedata){
		debug("file data", filedata);
		return storage.putFile(filedata.filepath, url).then(function(data){
			return data;
		});
	});
}

function fetchImageShot(request, response, imageId){
	return storage.getFile(request, response, imageId);
}

module.exports = {
	createImageShot : createImageShot,
	fetchImageShot : fetchImageShot
}