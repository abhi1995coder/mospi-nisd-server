const{User}=require('../models')
const bcrypt=require('bcryptjs')
const{v4:uuidv4}=require('uuid')
const{sendMail}=require('../utility/mailer')
exports.createAdmin=async(req,res)=>{
    const{name,email,role}=req.body
    const password="mospi@1234"
    if(!['group_a_admin','group_b_admin'].includes(role)){
        return res.status(400).json({message:"Invalid admin role",status:'400'})
    }
    try{
      const existingUser=await User.findOne({where:{email}})
      if(existingUser) {
        res.status(400).json({message:'User already exists',status:'400'})
      }

      const hashedPassword=await bcrypt.hash(password,10)

      const newAdmin=await User.create({

        name,
        email,
        password_hash:hashedPassword,
        role,
        is_verified:true,

      })
      const message=`You have been created a admin in nisd portal .Your default password is ${password}`
      await sendMail(email,message)
      res.status(201).json({message:`Admin created successfully as ${role}`,id:newAdmin.id,status:'201'})

    }catch(err){
        console.log('Admin creation failed',err)
        res.status(500).json({message:'Server error',status:'500'})
    }
}
exports.editAdmin=async(req,res)=>{
  const{id}=req.params
  const{name,email,role}=req.body
  if(role && !['group_a_admin','group_b_admin'].includes(role)){
    return res.status(400).json({message:'invalid role',status:'400'})
  }
  try{
    const user=await User.findOne({where:{id}})
    if(!user || !['group_a_admin','group_b_admin'].includes(user.role)){
      return res.status(404).json({message:'Admin not found',status:'404'})
    }
    const updateData={name,email,role}
    
    await user.update(updateData)
    res.status(200).json({message:'Admin updated successfully',status:'200'})

  }catch(err){
    console.log(err)
    res.status(500).json({message:'Failed to update Admin',status:'500'})
  }
}
exports.disableAdmin=async(req,res)=>{
  const{id}=req.params
  try{
    const user=await User.findOne({where:{id}})
    if(!user || !['group_a_admin','group_b_admin'].includes(user.role)){
      return res.status(404).json({message:'Admin not found',status:'404'})
    }
    await user.update({is_active:false})
    res.status(200).json({message:'Admin disabled successfully',status:'200'})

  }catch(err){
    console.log(err)
    res.status(500).json({message:'Failed to disable Admin',status:'500'})
  }
}
exports.getAllAdmins = async (req, res) => {
  try {
    const { role } = req.query;
    const validRoles = [ 'group_a_admin', 'group_b_admin' ];
    const whereClause = {};

    // If they passed ?role=group_b_admin (or group_a_admin), filter on it
    if (role) {
      if (!validRoles.includes(role)) {
        return res
          .status(400)
          .json({ message: `Invalid role; must be one of ${validRoles.join(', ')}` });
      }
      whereClause.role = role;
    } else {
      // default: return both group_a_admin and group_b_admin
      whereClause.role = validRoles;
    }

    const admins = await User.findAll({
      where: whereClause,
      attributes: ['id','name','email','role','is_active','createdAt']
    });

    res.status(200).json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};
exports.getAdminById=async(req,res)=>{
  const{id}=req.params
  try{
     const admin =await User.findOne({where:{id}})
    if(!admin){
      return res.status(404).json({message:'Admin not found',status:'404'})
    }
    res.status(200).json({admin,status:'200'})  
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error',status:'500'})
  }
}
