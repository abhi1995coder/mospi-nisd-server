const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const{User}=require('../models')
const{sendOtp}=require('../utility/mailer')

const generateOTP=()=>Math.floor(100000+Math.random()*900000).toString()

exports.register=async(req,res)=>{
   const{email,password}=req.body
   const hashedPassword= await bcrypt.hash(password,10)
   const otp=generateOTP()

   const expiresAt=new Date(Date.now()+10*60*1000)
   try{
      const existing=await User.findOne({where:{email}})
      if(existing) return res.status(400).json({message:'Email already exists'})
      await User.create({
        email,
        passwordHash:hashedPassword,
        otpCode:otp,
        otpExpiresAt:expiresAt,
        role:'intern',
        })
        await sendOtp(email,otp)
        res.status(201).json({message:'Registered successfullly,OTP sent.'})
   }catch(err){
      console.log(err)
      res.status(500).json({message:'Server error'})
   }

}
exports.verifyOtp=async(req,res)=>{
   const{email,otp}=req.body
   try{
       const user=await User.findOne({where:{email}})

       if(!user) return res.status(404).json({message:'User not found'})

       if(user.isVerified) return res.status(400).json({message:'Already Verified'})
       if(user.otpCode!=otp || new Date()>user.otpExpiresAt) return res.status(400).json({message:'invalid or expired otp'})

       await user.update({isVerified:true,otpCode:null,otpExpiresAt:null})
       const token=jwt.sign({id:user.id,role:user.role,email:user.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
       res.status(200).json({message:'OTP verified',token})
   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}
exports.login=async(req,res)=>{
   const{email,password}=req.body
   try{
    const user=await User.findOne({where:{email}})
    if(!user) return res.status(404).json({message:'Invalid credentialts'})
    if(!user.isVerified) return res.status(403).json({message:'Account not verified'})
    if(!user.isActive) return res.status(403).json({message:'Account disabled'})

    const match=await bcrypt.compare(password,user.passwordHash)
    if(!match) return res.status(400).json({message:'Invalid credentials'})
    const token=jwt.sign({user_id:user.user_id,role:user.role,email:user.email},process.env.JWT_SECRET,{expiresIn:'7d'})
    res.status(200).json({message:'Login successfull',token})

   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}
exports.requestPasswordReset=async(req,res)=>{
   const{email}=req.body
   const otp=generateOTP()
   const expiresAt=new Date(Date.now()+10*60*1000)
   try{
    const user=await User.findOne({where:{email}})
    if(!user) return res.status(404).json({message:'Invalid credentials'})

    await user.update({otpCode:otp,otpExpiresAt:expiresAt})
    await sendOtp(email,otp)

    res.status(200).json({message:'OTP sent for password reset'})
   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}
exports.resetPassword=async(req,res)=>{
   const{email,otp,new_password}=req.body
   try{
    const user=await User.findOne({where:{email}})
    if(!user || user.otpCode!=otp || new Date()>user.otpExpiresAt) return res.status(400).json({message:'Invalid otp or expired '})

    const hashed=await bcrypt.hash(new_password,10)
    await user.update({passwordHash:hashed,otpCode:null,otpExpiresAt:null})
    res.status(200).json({message:'Password reset successfull'})
    }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}

