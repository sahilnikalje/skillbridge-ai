const express=require('express')
const cookieParser=require('cookie-parser')
const authRouter = require('./routes/authRoutes')

const app=express()

//** middlewares
app.use(express.json())
app.use(cookieParser())

//** routes
app.use('/api/auth', authRouter)


module.exports=app