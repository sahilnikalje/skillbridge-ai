const express=require('express')

const authRouter = require('./routes/authRoutes')

const app=express()

//** middlewares
app.use(express.json())

//** routes
app.use('/api/auth', authRouter)


module.exports=app