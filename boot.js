init = function(config) {
    Object.defineProperty(global, 'config', {
        value: config,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

exports.init = init;