const nodemailer=require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },

})
exports.sendOtp=async(to,otp)=>{
   const mailOptions={
    from:`"MOSPI Internship"=<${process.env.EMAIL_USER}>`,
    to,
    subject:'MOSPI Internship OTP Verification',
    text:`Your OTP code is ${otp}.It will expire in 10 minutes`
   }
   try{
    await transporter.sendMail(mailOptions)
    console.log(`OTP send to: ${to}`)
   }catch(err){
    console.error('Error sending mail',err)
    throw err
   }
}