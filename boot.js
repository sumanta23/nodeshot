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
};

initSessionStore = function(sessionStore){
    Object.defineProperty(global, 'sessionStore', {
        value: sessionStore,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

exports.init = init;
exports.initMemStore = initMemStore;
exports.initSessionStore = initSessionStore;