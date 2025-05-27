const jwt=require('jsonwebtoken')
exports.authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader || authHeader.startsWith('Bearer '))
      return res.status().json({message:'Acess denied,no token provided'})
    const token=authHeader.split(' ')[1]
    try{
       const decoded=jwt.verify(token,process.env.JWT_SECRET)
       req.user=decoded
       next()
    }catch(err){
        res.status(403).json({message:'invalid or expired token'})
    }
    
}
exports.roleCheck=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)) return res.status(403).json({message:'Access forbidden for your role'})
        next()
    }
}