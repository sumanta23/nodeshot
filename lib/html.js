var fs                 = require("fs");
var Promise            = require('bluebird');
var webshot            = require('webshot');
var path               = require('path');
var gm                 = require('gm');
var debug              = require("debug")("html:");
var fileExtension      = config.webshot.streamType;

function generateURLShot(url){
    var fileName = (new Date()).toString() + '.' + fileExtension;
    var filepath = path.join(config.temp, fileName);
    debug('filepath', filepath);
    return new Promise(function(resolve, reject) {
        webshot(url, filepath, config.webshot, function(err) {
            if (err) {
                debug('error', err);
                return reject(err);
            }
            debug('file generated with name', fileName);
            gm(filepath).size(function(err,size){
                if(err){
                    return reject(err);
                }  
                return resolve({
                    fileName: fileName,
                    filepath: filepath,
                    fileExtension: fileExtension,
                    height: size.height,
                    width: size.width
                });
            });
        });
    });
}

module.exports = {
  generateURLShot :generateURLShot  
};