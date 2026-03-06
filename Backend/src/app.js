const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors')

const authRouter = require('./routes/authRoutes')
const interviewRouter = require('./routes/interviewRoutes')

const app=express()

//** middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

//** routes
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports=app