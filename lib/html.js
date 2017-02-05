var fs                 = require("fs");
var Promise            = require('bluebird');
var webshot            = require('webshot');
var path               = require('path');
var gm                 = require('gm');
var _                  = require('lodash');
var uuid               = require('../uuid');
var debug              = require("debug")("html:");
var fileExtension      = config.webshot.streamType;

function generateURLShot(url, res){
    var fileName = uuid.generateId() + '.' + fileExtension;
    var filepath = path.join(config.temp, fileName);
    debug('Generated filepath:', filepath);
    webshotconfig = res ? _.merge(config.webshot,{screenSize: res}) :config.webshot;
    return new Promise(function(resolve, reject) {
        webshot(url, filepath, webshotconfig, function(err) {
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