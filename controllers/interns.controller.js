const{Intern,Qualification}=require('../models')
exports.createIntern=async(req,res)=>{
    try{
      const user_id=req.user.user_id

      const existingIntern=await Intern.findOne({where:{user_id}})
      if(existingIntern){
        await existingIntern.update(req.body)
        return res.status(200).json({message:'Intern profile updated successfully',intern:existingIntern})
      }
      const newIntern=await Intern.create({user_id,...req.body})
      return res.status(200).json({message:'Intern profile created successfully',intern:newIntern})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error'})
    }
}
exports.getInternByUserId=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
       return res.status(404).json({message:'Intern not found'})
      }
      res.status(200).json(intern)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error'})
    }
}
exports.updateIntern=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:"Intern not found"})
      }
      await intern.update(req.body)
      res.status(200).json({message:"Intern profile updated",intern})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error'})
    }
}
exports.getQualifications=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:'Intern not found'})
      }
      const qualification= await Qualification.findOne({where:{intern_id:intern.id}})
      if(!qualification){
        return res.status(404).json({messasge:'Qualification not found'})
      }
      res.status(200).json(qualification)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error'})
    }
}
exports.upsrtQualifications=async(req,res)=>{
    try{
      const {userId}=req.params;


      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:'Intern not found'})
      }

      const[qualification,created]=await Qualification.upsert({intern_id:intern.intern_id, ...req.body},{returning:true})
      res.status(200).json({message:created?'Qualification created':'Qualification updated',qualification})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error'})
    }
}