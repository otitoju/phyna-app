// var ExpressBrute = require('express-brute'),
//     MemcachedStore = require('express-brute-memcached'),
//     moment = require('moment'),
//     store;

//     // https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d
 
// if (config.environment == 'development'){
//     store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
// } else {
//     // stores state with memcached
//     store = new MemcachedStore(['127.0.0.1'], {
//         prefix: 'NoConflicts'
//     });
// }
 
// var failCallback = function (req, res, next, nextValidRequestDate) {
//     req.flash('error', "You've made too many failed attempts in a short period of time, please try again "+moment(nextValidRequestDate).fromNow());
//     res.redirect('/login'); // brute force protection triggered, send them back to the login page
// };
// var handleStoreError =  function (error) {
//     log.error(error); // log this error so we can figure out what went wrong
//     // cause node to exit, hopefully restarting the process fixes the problem
//     throw {
//         message: error.message,
//         parent: error.parent
//     };
// }
// // Start slowing requests after 5 failed attempts to do something for the same user
// var userBruteforce = new ExpressBrute(store, {
//     freeRetries: 5,
//     minWait: 5*60*1000, // 5 minutes
//     maxWait: 60*60*1000, // 1 hour,
//     failCallback: failCallback,
//     handleStoreError: handleStoreError
// });
// // No more than 1000 login attempts per day per IP
// var globalBruteforce = new ExpressBrute(store, {
//     freeRetries: 1000,
//     attachResetToRequest: false,
//     refreshTimeoutOnRequest: false,
//     minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
//     maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
//     lifetime: 24*60*60, // 1 day (seconds not milliseconds)
//     failCallback: failCallback,
//     handleStoreError: handleStoreError
// });
 
// app.set('trust proxy', 1); // Don't set to "true", it's not secure. Make sure it matches your environment
// app.post('/auth',
//     globalBruteforce.prevent,
//     userBruteforce.getMiddleware({
//         key: function(req, res, next) {
//             // prevent too many attempts for the same username
//             next(req.body.username);
//         }
//     }),
//     function (req, res, next) {
//         if (User.isValidLogin(req.body.username, req.body.password)) { // omitted for the sake of conciseness
//          	// reset the failure counter so next time they log in they get 5 tries again before the delays kick in
//             req.brute.reset(function () {
//                 res.redirect('/'); // logged in, send them to the home page
//             });
//         } else {
//             res.flash('error', "Invalid username or password")
//             res.redirect('/login'); // bad username/password, send them back to the login page
//         }
//     }
// );
//check if there is network connection
function checkInternet(cb) {
    require('dns').lookup('www.naijaloaded.com.ng',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

// example usage:
checkInternet(function(isConnected) {
    if (isConnected) {
        // connected to the internet
        console.log('connected')
    } else {
        // not connected to the internet
        console.log('not connected')
    }
});
//download route
// app.get('/download/:file(*)', (req, res) => {
//     var file = req.params.file
//     var location = path.join('https://cloudinary.com/console/media_library/asset/image/upload/', file)
//     console.log(location)
//     res.download(location, file)
// })


//or this
// const checkInternetConnected = require('check-internet-connected');

// const config = {
//   timeout: 5000, //timeout connecting to each server(A and AAAA), each try (default 5000)
//   retries: 5,//number of retries to do before failing (default 5)
//   domain: 'google.com'//the domain to check DNS record of
// }

// checkInternetConnected(config)
//   .then(() => {
//     console.log("Internet available");          
//   }).catch((error) => {
//     console.log("No internet", error);
//   });