var passport = require('passport')    
var BasicStrategy = require('passport-http').BasicStrategy

passport.use(new BasicStrategy(function(username, password, callback) {
    if (username.valueOf() === 'yourusername' && password.valueOf() === 'yourpassword'){
        return callback(null, true);
    }
    else{
        return callback(null, false);
    }
}));

function initialize(app){
    app.use(passport.initialize());
}


module.exports.authorize = passport.authenticate('basic', { session: false });
module.exports.initialize = initialize;