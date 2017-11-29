var _           = require('lodash');
var debug       = require('debug')('responseHandler');
var Promise     = require('bluebird');
var sendEvent   = require('./socket.js').sendEvent;

function constructResponse(serviceResult) {
    var result = {
        'body': (serviceResult && serviceResult.body) || serviceResult || null,
        'headers': (serviceResult && serviceResult.headers) || {},
        'status': 200
    };
    return result;
}


function setHeaders(res, headers) {
    if (res.headersSent) return;

    res.header(headers);
}

function constructErrorResponse(e) {
    var res= e.toString();
    if (!(e instanceof Error)) {
        console.warn('WARNING: Error expected, but got %s',
                JSON.stringify(e) || (e.toString && e.toString() || 'invalid argument'));
    }else {
        res = {
            'body': {err: e.toString() || null },
            'headers': {},
            'status': 500
        };
    }

    return res;
}


function responseHandler (req, res, serviceP) {
    return serviceP
        .then(constructResponse)
        .catch(function(error) {
            console.log(error);
            var errResponse = constructErrorResponse(error);
            sendEvent(req.userId, 'update', "error", errResponse.body.err);
            return errResponse;
        })
        .then(function (result) {
            debug("response--> ", result);
            setHeaders(res, result.headers);
            res.status(result.status).send(result.body);
        });

}


exports.responseHandler         = responseHandler;