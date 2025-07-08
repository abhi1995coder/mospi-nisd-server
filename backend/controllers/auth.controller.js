const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const{User}=require('../models')
const{sendMail}=require('../utility/mailer')

const generateOTP=()=>Math.floor(100000+Math.random()*900000).toString()

exports.register=async(req,res)=>{
   const{email,password}=req.body
   const hashedPassword= await bcrypt.hash(password,10)
   const otp=generateOTP()

   const expiresAt=new Date(Date.now()+10*60*1000)
   try{
      const existing=await User.findOne({where:{email}})
      if(existing) return res.status(400).json({message:'Email already exists',status:'400'})
      await User.create({
        email,
        password_hash:hashedPassword,
        otp_code:otp,
        otp_expires_at:expiresAt,
        role:'intern',
      })
        const message=`Your OTP is ${otp}. It will expire in 10 minutes. `
        await sendMail(email,message)
        res.status(201).json({message:'Registered successfullly,OTP sent',status:'201'})
   }catch(err){
      console.log(err)
      res.status(500).json({message:'Server error',status:'500'})
   }

}
exports.verifyOtp=async(req,res)=>{
   const{email,otp}=req.body
   try{
       const user=await User.findOne({where:{email}})

       if(!user) return res.status(404).json({message:'User not found'})

       if(user.is_verified) return res.status(400).json({message:'Already Verified'})
       if(user.otp_code!=otp || new Date()>user.otp_expires_at) return res.status(400).json({message:'invalid or expired otp',status:'400'})

       await user.update({is_verified:true,otp_code:null,otp_expires_at:null})

       const token=jwt.sign({id:user.id,role:user.role,email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
       res.status(200).json({message:'OTP verified',token,status:'200'})
   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error',status:'500'})
   }
}

exports.requestOtpLogin = async (req, res) => {
  const { email, password } = req.body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: 'User not found',status:'404' });

    if (!user.is_verified)
      return res.status(403).json({ message: 'Account not verified',status:'403' });

    if (!user.is_active)
      return res.status(403).json({ message: 'Account disabled' ,status:'403'});

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ message: 'Invalid password',status:'400' });

    await user.update({
      otp_code: otp,
      otp_expires_at: expiresAt,
    });

    const message=`Your OTP is ${otp}. It will expire in 10 minutes. `
    await sendMail(email,message)

    return res.status(200).json({
      message: 'OTP sent for login',
      status:'200'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' ,status:'500'});
  }
};


exports.login = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: 'User not found',status:'404' });

    if (
      user.otp_code !== otp ||
      new Date() > user.otp_expires_at
    ) {
      return res.status(400).json({
        message: 'Invalid or expired OTP'
        ,status:'400'
      });
    }


    await user.update({ otp_code: null, otp_expires_at: null });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        name:user.name
      },
      process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      status:'200'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error',status:'500' });
  }
};
exports.requestPasswordReset=async(req,res)=>{
   const{email}=req.body
   const otp=generateOTP()
   const expiresAt=new Date(Date.now()+10*60*1000)
   try{
    const user=await User.findOne({where:{email}})
    if(!user) return res.status(404).json({message:'Invalid credentials',status:'404'})

    await user.update({otp_code:otp,otp_expires_at:expiresAt})
    const message=`Your OTP is ${otp}. It will expire in 10 minutes. `
    await sendMail(email,message)

    res.status(200).json({message:'OTP sent for password reset',status:'200'})
   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error',status:'500'})
   }
}
exports.resetPassword=async(req,res)=>{
   const{email,otp,new_password}=req.body
   try{
    const user=await User.findOne({where:{email}})
    if(!user || user.otp_code!=otp || new Date()>user.otp_expires_at) return res.status(400).json({message:'Invalid otp or expired ',status:'400'})

    const hashed=await bcrypt.hash(new_password,10)
    await user.update({password_hash:hashed,otp_code:null,otp_expires_at:null})
    res.status(200).json({message:'Password reset successfull',status:'200'})
    }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error',status:'500'})
   }
}

