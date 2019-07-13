const express = require('express')
const authRouter = express.Router()
var ExpressBrute = require('express-brute')
var MemcachedStore = require('express-brute-memcached')
var  moment = require('moment')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


var store = new ExpressBrute.MemoryStore()
// var store = new MemcachedStore(['127.0.0.1'], {
//         prefix: 'NoConflicts'
//     });

var failCallback = function (req, res, next, nextValidRequestDate) {
    res.json({message: 'You have made too many failed attempts in a short period of time, please try again '+moment(nextValidRequestDate).fromNow()
    }); // brute force protection triggered, send them back to the login page
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
    minWait: 10*60*1000, // 5 minutes
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
//authRouter.set('trust proxy', 1);
authRouter.post('/login',globalBruteforce.prevent,
    userBruteforce.getMiddleware({
    key: function(req, res, next) {
        // prevent too many attempts for the same email
        next(req.body.email);
    }
}),
    async(req, res) => {
        try {
            const info = await User.findOne({email:req.body.email})
            if(!info){
                res.status(404).json({
                    message: 'Invalid email or password',
                    code: 'NOT_FOUND_ERROR'
                })
            }
            
            else{
                const passwordIsValid = bcrypt.compareSync(req.body.password, info.password)
                if(!passwordIsValid){
                    res.status(404).json({
                        message: 'Invalid email or password',
                        code: 'NOT_FOUND_ERROR'
                    })
                }
                else{
                    const token = await jwt.sign({id:info.id, email:info.email, name:info.name}, process.env.USER_SECRET)
                    req.brute.reset(function () {
                        res.status(200).json({
                           message: 'login was successful',
                           token: token,
                           code: 'OK'
                        }); 
                    });
                }
                
            }
        } catch (error) {
            return res.status(500).json({
                code: 'SERVER_ERROR',
                message: 'something went wrong, Please try again',
                error:error.message
            });
        }
       
})

module.exports = authRouter;