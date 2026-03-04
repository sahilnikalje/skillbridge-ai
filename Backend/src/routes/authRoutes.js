const express=require('express')
const {register, login} = require('../controllers/authController')

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

module.exports=authRouter