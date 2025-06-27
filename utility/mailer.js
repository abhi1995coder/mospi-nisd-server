const nodemailer=require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },

})
exports.sendMail=async(to,message)=>{
   const mailOptions={
    from:`"MOSPI Internship"=<${process.env.EMAIL_USER}>`,
    to,
    subject:'MOSPI Internship OTP Verification',
    text:message
   }
   try{
    await transporter.sendMail(mailOptions)
    console.log(`OTP send to: ${to}`)
   }catch(err){
    console.error('Error sending mail',err)
    throw err
   }
}