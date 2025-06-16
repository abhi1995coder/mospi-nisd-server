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
        password_hash:hashedPassword,
        otp_code:otp,
        otp_expires_at:expiresAt,
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

       if(user.is_verified) return res.status(400).json({message:'Already Verified'})
       if(user.otp_code!=otp || new Date()>user.otp_expires_at) return res.status(400).json({message:'invalid or expired otp'})

       await user.update({is_verified:true,otp_code:null,otp_expires_at:null})
       //const token=jwt.sign({id:user.id,role:user.role,email:user.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
       res.status(200).json({message:'OTP verified'})
   }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}

exports.requestOtpLogin = async (req, res) => {
  const { email, password } = req.body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.is_verified)
      return res.status(403).json({ message: 'Account not verified' });

    if (!user.is_active)
      return res.status(403).json({ message: 'Account disabled' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ message: 'Invalid password' });

    await user.update({
      otp_code: otp,
      otp_expires_at: expiresAt,
    });

    await sendOtp(email, otp);

    return res.status(200).json({
      message: 'OTP sent for login',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (
      user.otp_code !== otp ||
      new Date() > user.otp_expires_at
    ) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }


    await user.update({ otp_code: null, otp_expires_at: null });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,{ expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.requestPasswordReset=async(req,res)=>{
   const{email}=req.body
   const otp=generateOTP()
   const expiresAt=new Date(Date.now()+10*60*1000)
   try{
    const user=await User.findOne({where:{email}})
    if(!user) return res.status(404).json({message:'Invalid credentials'})

    await user.update({otp_code:otp,otp_expires_at:expiresAt})
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
    if(!user || user.otp_code!=otp || new Date()>user.otp_expires_at) return res.status(400).json({message:'Invalid otp or expired '})

    const hashed=await bcrypt.hash(new_password,10)
    await user.update({password_hash:hashed,otp_code:null,otp_expires_at:null})
    res.status(200).json({message:'Password reset successfull'})
    }catch(err){
    console.log(err)
    res.status(500).json({message:'Server error'})
   }
}

