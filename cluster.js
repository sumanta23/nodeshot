var cluster = require('cluster');
var http    = require('http');
var debug   = require('debug')('cluterconfig:');

exports.init = function(app, port, nworkers){
	var server;
    if(cluster.isMaster){
        nworkers = nworkers || require('os').cpus().length;
        debug('Master cluster setting up ' + nworkers + ' workers...');

        for(var i = 0; i < nworkers; i++) {
            cluster.fork(undefined, { addStdio: ['pipe'] });
        }

        cluster.on('online', function(worker) {
            debug('Worker ' + worker.process.pid + ' is online');
        });

        cluster.on('message', function(msg){
            debug("$$$$",msg);
        });

        cluster.on('listening', function(worker, addr) {
            console.log('worker %s listening on %d', worker.id, addr.port);
        });
        cluster.on('disconnect', function(worker) {
            console.log('worker %s disconnected', worker.id);
        });

        cluster.on('exit', function(worker, code, signal) {
            debug('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            debug('Starting a new worker');
            cluster.fork();
        });
    }
    else{
        server = http.createServer(app);
        server.listen(port, function () {
            debug('server: listening on port %s', port);
        });
    }
    return server;
}