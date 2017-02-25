config = require('../config');
require('../boot.js').init(config);
var assert = require('assert');
var should = require("should");
var request = require("request");
var expect = require("chai").expect;
var baseUrl = "https://swapi.co/api";
var util = require("util");
var fs   = require('fs');

var service = require("../lib/service.js");

describe('returns luke', function() {
    it('returns luke', function(done) {
        request.get({ url: baseUrl + '/people/1/' },
            function(error, response, body) {
            		var bodyObj = JSON.parse(body);
            		expect(bodyObj.name).to.equal("Luke Skywalker");
            		expect(bodyObj.hair_color).to.equal("blond");
                    expect(response.statusCode).to.equal(200);
                    console.log(body);
                done();
            });
    });
});

it('resolves as promised', function() {
    return Promise.resolve("woof")
        .then(function(m) { expect(m).to.equal('woof'); })
        .catch(function(m) { throw new Error('was not supposed to fail'); });
});

describe('returns image hashid', function() {
    it('returns image hashid', function() {
    	this.timeout(0);
    	return service.createImageShot("http://google.com",{height:320, width:480})
    	.then(function(data){
    		var fileInfo = new Buffer(data, 'base64').toString('ascii');
    		var index = fileInfo.lastIndexOf(config.temp);
    		var filepath = fileInfo.substring(index,fileInfo.length);
    		fs.unlink(filepath);
    		console.log(filepath);
    	});
    });
});

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});