const jwt=require('jsonwebtoken')
const blacklistTokens=require('../models/blacklistModel')

const authUser=async(req,res,next)=>{
    // const token=req.cookies.token
    const token=req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({success:false, message:"Token not provided"})
    }

    //todo check if the token is blacklisted or not
    const isTokenBlacklisted=await blacklistTokens.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({success:false, message:"Invalid token"})
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        //! here we are saving the data of decoded in new property req.user
        //! this will be used in getMe controller to get the user id
        req.user=decoded

        next()
    }
    catch(err){
        console.log("authUserMiddlewareErr: ", err.message)
        return res.status(401).json({success:false, message:"Invalid token"})
    }
}

module.exports=authUser