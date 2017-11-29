var convict     = require('convict');
var path        = require('path');
var fs          = require('fs');
var uriTemplate = require('uri-templates');
var _           = require('lodash');
var cjson       = require('cjson');

/**
 * dummy for convict formatter
 * if no formatting is needed for a format type
 */
function dummy () {
}

/**
 * resolve relative path to absolute path from root dir
 * @param {String} relativePath
 * @returns {String} absolute path
 */
function pathLoader (relativePath) {
    return path.join(__dirname, '..', relativePath);
}

/**
 * create RegExp from string
 */
function regexCompiler (regexString) {
    return new RegExp(regexString);
}


//follows the RFC6570(http://tools.ietf.org/html/rfc6570)
function uriTemplateLoader(template) {
    return new uriTemplate(template);
}


convict.addFormat('path', dummy, pathLoader);
convict.addFormat('regex', dummy, regexCompiler);
convict.addFormat('uri-template', dummy, uriTemplateLoader);

var conf = convict(cjson.load(path.join(__dirname, 'configs')));

var configfile = process.env.APPCONFIG || conf.get('app.configfile');
configfile = path.join(__dirname, configfile);
if (fs.existsSync(configfile)) {
    conf.loadFile(configfile);
    console.info('server: config loaded from %s', configfile);
} else {
    console.info('server: no config file found at %s', configfile);
}


//set debug variables, ENV variables have highest priority
if (conf.get('app.debug')) {
    if (process.env.DEBUG) conf.set('app.debug', process.env.DEBUG);
    else process.env.DEBUG = conf.get('app.debug');

    require('debug').enable(conf.get('app.debug'));
}


conf.validate();

var _conf = conf._instance;

if ('get' in _conf) throw new Error('Do not set config.get');
_conf.get = conf.get.bind(conf);

module.exports = _conf;
