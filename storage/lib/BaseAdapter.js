
function BaseAdapter(){
	var self = this;
}

BaseAdapter.prototype.put = function(filepath, url){
	throw new Error("call type adapter");
}

BaseAdapter.prototype.get = function(request, response, fileId) {
	throw new Error("call type adapter");
}


module.exports = BaseAdapter;