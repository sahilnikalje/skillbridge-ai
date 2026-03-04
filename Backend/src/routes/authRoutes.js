const express=require('express')
const {register, login, logout, getMe} = require('../controllers/authController')
const authUser=require('../middlewares/authMiddleware')


const authRouter=express.Router()
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', register)

/**
 * @route POST /api/auth/login
 * @description login a user
 * @access Public
 */
authRouter.post('/login', login)

/**
 * @route GET or POST /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access Public
 */
authRouter.get('/logout', logout)

/**
 * @route GET /api/auth/logout
 * @description get the current loggedin user detailes
 * @access private
 */
authRouter.get('/get-me', authUser, getMe)


module.exports=authRouter