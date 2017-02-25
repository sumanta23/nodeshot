var debug = require("debug")("tracingMiddleware:");

function tracingMiddleware(request, response, next){
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    debug("Remote IP: ", ip);
    debug(JSON.stringify(request.headers));
    next();
}


module.exports.initialize = tracingMiddleware;