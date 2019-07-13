var ExpressBrute = require('express-brute')
    //MemcachedStore = require('express-brute-memcached'),
var  moment = require('moment')
exports.userBrute = (req, res) => {
    var store = new ExpressBrute.MemoryStore()
// var store = new MemcachedStore(['127.0.0.1'], {
//         prefix: 'NoConflicts'
//     });

var failCallback = function (req, res, next, nextValidRequestDate) {
    res.json('You have made too many failed attempts in a short period of time'); // brute force protection triggered, send them back to the login page
};
var handleStoreError =  function (error) {
    log.error(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
}
// Start slowing requests after 5 failed attempts to do something for the same user
var userBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5*60*1000, // 5 minutes
    maxWait: 60*60*1000, // 1 hour,
    failCallback: failCallback,
    handleStoreError: handleStoreError
});
// No more than 1000 login attempts per day per IP
var globalBruteforce = new ExpressBrute(store, {
    freeRetries: 10,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    lifetime: 24*60*60, // 1 day (seconds not milliseconds)
    failCallback: failCallback,
    handleStoreError: handleStoreError
});
return userBruteforce
}

exports.getMiddleware = () => {
    this.userBrute().getMiddleware({
        key: function(req, res, next) {
            // prevent too many attempts for the same username
            next(req.body.username);
        }
    })
}