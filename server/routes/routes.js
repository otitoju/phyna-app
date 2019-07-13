const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandler')
const usercontroller = require('../controllers/user')
// const passport = require('passport')
// const passportAuth = passport.authenticate('googleToken', {session: false})
//user
router.post('/register', usercontroller.registerUser)
//router.post('/login', usercontroller.loginUser)
router.get('/users', catchErrors(usercontroller.getUser))
router.post('/user', catchErrors(usercontroller.getSingleUser))
router.post('/forgot', catchErrors(usercontroller.resetPasswordLink))
router.post('/reset/:reset_token', catchErrors(usercontroller.changePassword))
//router.post('/oauth/google', passportAuth)


module.exports = router;