init = function(config) {
    Object.defineProperty(global, 'config', {
        value: config,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

initMemStore = function(memstore){
    Object.defineProperty(global, 'memstore', {
        value: memstore,
        writable: true,
        configurable: false,
        enumerable: true
    });
}
exports.init = init;
exports.initMemStore = initMemStore;