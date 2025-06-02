const{User}=require('../models')
const bcrypt=require('bcryptjs')
const{v4:uuidv4}=require('uuid')
exports.createAdmin=async(req,res)=>{
    const{name,email,password,role}=req.body
    if(!['group_a_admin','group_b_admin'].includes(role)){
        return res.status(400).json({message:"Invalid admin role"})
    }
    try{
      const existingUser=await User.findOne({where:{email}})
      if(existingUser) return res.status(400).json({message:'User already exists'})
      
      const hashedPassword=await bcrypt.hash(password,10)

      const newAdmin=await User.create({
        user_id:uuidv4(),
        user_name:name,
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
exports.editAdmin=async(req,res)=>{
  const{user_id}=req.params
  const{name,email,role,password}=req.body
  if(role && !['group_a_admin','group_b_admin'].includes(role)){
    return res.status(400).json({message:'invalid role'})
  }
  try{
    const user=await User.findOne({where:{user_id}})
    if(!user || !['group_a_admin','group_b_admin'].includes(user.role)){
      return res,status(404).json({message:'Admin not found'})
    }
    const updateData={name,email,role}
    if(password){
      updateData.passwordHash=await bcrypt.hash(password,10)
    }
    await user.update(updateData)
    res.status(200).json({message:'Admin updated successfully'})

  }catch(err){
    console.log(err)
    res.status(500).json({message:'Failed to update Admin'})
  }
}
exports.disableAdmin=async(req,res)=>{
  const{user_id}=req.params
  try{
    const user=await User.findOne({where:{user_id}})
    if(!user || ['group_a_admin','group_b_admin'].includes(user.role)){
      return res.status(404).json({message:'Admin not found'})
    }
    await user.update({isActive:false})
    res.status(200).json({message:'Admin disabled successfully'})

  }catch(err){
    console.log(err)
    res.status(500).json({message:'Failed to disable Admin'})
  }
}
exports.getAllAdmins=async(req,res)=>{
  try{
    const admins=await User.findAll({
      where:{
        role:['group_a_admin','group_b_admin']
      },
      attributes:['user_id','user_name','email','role','isActive','createdAt']
    })
    res.status(200).json({admins})
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Failed to fetch admins'})
  }
}