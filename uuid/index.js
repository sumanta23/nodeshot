uuidV4 = require('uuid/v4');

generateId = function(){
	return uuidV4();
};

exports.generateId = generateId;