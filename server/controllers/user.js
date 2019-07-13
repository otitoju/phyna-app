const crypto = require('crypto')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const passport = require('passport')
const GoogleAuthTokenStrategy = require('passport-google-plus-token')


// register user
exports.registerUser = async (req, res, next) => {
    try {
        if(!req.body.email || !req.body.name){
            res.json({message:"Error pls fill all fields"})
        }
        else{
            const info = await User.create(req.body)
            res.json({message:'successful'})
        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
   
    // if(req.body.method !== 'local'){
    //  next()   
    // }
    
    //     const hashed = bcrypt.hashSync(req.body.password, 10)
    //     const info = await User.create({
    //         method:'local',
    //         local:{
    //             name:req.body.name,
    //             email:req.body.email,
    //             password:hashed
    //         }
    //     })
    //     info.password = hashed
    //     await info.save()
    //     res.status(200).json({info:info})
    
}

//get users
exports.getUser = async (req, res) => {
    try {
        const info = await User.find().sort({"_id":-1})
        if (info.length > 0) {
            return res.status(200).json({info:info})
        }
        else {
            return res.status(404).json({
                message:'No users found in the system',
                code:'NOT_FOUND'
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
}
// getsingle user
exports.getSingleUser = async (req, res) => {
    try {
        const info = await User.findOne({"local.email":req.body.email})
        if (info) {
           return res.status(200).json({info:info})
        }
        else {
            return res.status(404).json({
                message: 'No user found in the system',
                code: 'NOT_FOUND'
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
}
//reset password LINK
exports.resetPasswordLink = async (req, res) => {
    try {
        const Users = await User.findOne({"local.email":req.body.email})
        if(!User){
           return res.status(404).json({
                message:'No user with such email',
                code: 'NOT_FOUND'
            })
        }
        else{
            const buffer = await crypto.randomBytes(20)
            const token = buffer.toString('hex')
            Users.local.req_reset = true
            Users.local.reset_token = token
            await Users.save()
            const transport = nodemailer.createTransport({
                service:'Gmail',
                auth:{
                    user: process.env.GMAILUSER,
                    pass: process.env.GMAILPW
                }
            })
            const mailOptions= {
                from:process.env.GMAILUSER,
                to:req.body.email,
                subject:'Password recovery team',
                html:'<p>You have requested for password reset'+
                    'please follow this link and reset your'+
                    'http://'+req.headers.host+'/reset/'+token +'</p>'
            }
            transport.sendMail(mailOptions, (err) =>{
                if (err){
                    res.status(500).json({message: `Error unable to send email`})
                }
                else {
                    res.status(200).json({message: `Mail sent`})
                }
            })

        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
    
}

// change password here
exports.changePassword = async (req, res) => {
    try {
        const info = await User.findOne({"local.reset_token": req.params.reset_token})
        if(!info){
           return res.status(404).json({
                message: 'Invalid reset payload',
                code: 'NOT_FOUND_ERROR'
            })
        }
        else{
            if(req.body.password !== req.body.confirm){
                return res.status(409).json({
                    message: 'Passwords do not match',
                    code: 'CONFLICT_ERROR'
                })
            }
            else if(req.body.password.length < 8){
                return res.status(406).json({
                    message: 'Password is too short and weak',
                    code: 'NOT_ACCEPTABLE'
                })
            }
            else{
                const hashed = bcrypt.hashSync(req.body.password, 10)
                info.local.password = hashed || info.local.password
                info.local.reset_token = ''
                info.local.req_reset = false
                await info.save()
                return res.status(200).json({message:'password changed'})
            }
        } 
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
    
}

//Oauth function
// exports.googleOauth = async (req, res) => {
//     console.log(req.user)
//     const token = await jwt.sign({id:req.user.id, email:req.user.email}, process.env.USER_SECRET)
//     res.status(200).json({token:token})
// }

// //google Oauth validation passport-google-plus-token
passport.use("googleToken", new GoogleAuthTokenStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('accessToken: ', accessToken)
        console.log('refreshToken: ', refreshToken)
        console.log('profile: ', profile)

        //check is user exist
        const userExist = await User.findOne({'google.id':profile.id})
        if(userExist){
            console.log('user already exist')
            return done(null, userExist)
        }
        else{
            console.log('create new user')
            //create new account
            const info = await User.create({
                method:'google',
                google:{
                    id:profile.id,
                    email:profile.emails[0].value,
                    fname:profile.name.familyName,
                    lname:profile.name.givenName,
                    photo:profile.photos[0].value
                }
            })
            await info.save()
            const token = await jwt.sign({id:info.google.id, email:info.google.email, photo:info.google.photo}, process.env.USER_SECRET)
            res.status(200).json({token:token, info:info})
            //done(null, info)
        }
        
    } catch (error) {
        console.log(error.message)
    }
    
}))

//update user
exports.updateUser = async (req, res) => {
    try {
        const info = await User.findOne({_id: req.params.id})
        if(!info){
            //throw new Error('something went worng')
            return res.status(404).json({
                message: 'No user found',
                code: 'USER_NOT_FOUND'
            })
        } else {
            const { name, email } = req.body
            info.name = name || info.name
            info.email = email || info.email
            await info.save()
            return res.status(200).json({
                message: 'user updated successfully'
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        });
    }
}

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const info = await User.findOneAndDelete({_id: req.params.id})
        if(info){
            return res.status(200).json({
                message: `user with ${info.name} deleted successfully`
            })
        }
        else {
            return res.status(404).json({
                code: 'NOT_FOUND_ERROR',
                message: 'No users found in the system'
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 'SERVER_ERROR',
            message: 'something went wrong, Please try again'
        }); 
    }
}