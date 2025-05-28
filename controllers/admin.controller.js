const{users}=require('../models')
const bcrypt=require('bcryptjs')
const{v4:uuidv4}=require('uuid')
exports.createAdmin=async(req,res)=>{
    const{email,password,role}=req.body
    if(!['group_a_admin','group_b_admin'].includes(role)){
        return res.status(400).json({message:"Invalid admin role"})
    }
    try{
      const existingUser=await users.findOne({where:{email}})
      if(existingUser) return res.status(400).json({message:'User already exists'})
      
      const hashedPassword=await bcrypt.hash(password,10)

      const newAdmin=await users.create({
        user_id:uuidv4(),
        email,
        passwordHash:hashedPassword,
        role,
        isVerified:true
      })
      res.status(201).json({message:`Admin created successfully as ${role}`,user_id:newAdmin.user_id})

    }catch(err){
        console.log('Admin creation failed',err)
        res.status(500).json({message:'Server error'})
    }
}