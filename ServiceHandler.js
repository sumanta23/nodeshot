var _           = require('lodash');
var debug       = require('debug')('serviceHandler');
var Promise     = require('bluebird');

function constructResponse(serviceResult) {
    var result = {
        'body': (serviceResult && serviceResult.body) || serviceResult || null,
        'headers': (serviceResult && serviceResult.headers) || {},
        'status': 200
    };
    return result;
}


function safelySetHeaders(res, headers) {
    if (res.headersSent) return;

    res.header(headers);
}

function constructErrorResponse(e) {
    if (!(e instanceof Error)) {
        console.warn('WARNING: Expecting Error, but got %s',
                JSON.stringify(e) || (e.toString && e.toString() || 'invalid argument'));
    }

    return e;
}


function serviceHandler (req, res, serviceP) {
    return serviceP
        .then(constructResponse)
        .catch(function(error) {
            console.log(error);
            var errResponse = constructErrorResponse(error);
            return errResponse;
        })
        .then(function (result) {
            safelySetHeaders(res, result.headers);
            res.status(result.status).send(result.body);
        });

}


exports.serviceHandler         = serviceHandler;