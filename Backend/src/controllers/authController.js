const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const User=require('../models/userModel')

//todo register
const register=async(req,res)=>{
    try{
        const{name, email, password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"All fields are mandetory"})
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(409).json({success:false, message:"User already exist"})
        }

        const hashedPassword=await bcrypt.hash(password, 10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })

        //todo generate token
        const token=jwt.sign(
            {id:user._id, name:user.name},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1d'}
        )

        //todo send token in cookies
        res.cookie("token", token)

        res.status(201).json({
            success:true, 
            message:"Registered successfully", 
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.log('registerControllerErr: ', err.message)
        res.status(500).json({success:false, message:"Something went wrong"})
    }
}

//todo login
const login=async(req,res)=>{
    try{
        const{email, password}=req.body
        if(!email || !password){
            return res.status(400).json({success:false, message:"All fields are mandetory"})
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(403).json({success:false, message:"Invalid Credentials"})
        }

        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(403).json({success:false, message:"Invalid Credentials"})
        }

        const token=jwt.sign(
            {id:user._id, name:user.name},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1d'}
        )

        res.cookie("token", token)

        res.status(200).json({
            success:true,
            message:"Loggedin successfully", 
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.log('loginControllerErr: ', err.message)
        res.status(500).json({success:false, message:"Something went wrong"})
    }
}



module.exports={register, login}