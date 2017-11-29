
function BaseAdapter(){
	var self = this;
}

BaseAdapter.prototype.put = function(data){
	throw new Error("call type adapter");
}

BaseAdapter.prototype.get = function(query) {
	throw new Error("call type adapter");
}

BaseAdapter.prototype.put = function(data){
	throw new Error("call type adapter");
}

BaseAdapter.prototype.remove = function(query) {
	throw new Error("call type adapter");
}


module.exports = BaseAdapter;