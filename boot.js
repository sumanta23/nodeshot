init = function(_config) {
    Object.defineProperty(global, 'config', {
        value: _config,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

exports.init = init;