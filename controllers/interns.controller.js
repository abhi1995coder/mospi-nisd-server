const{Intern,Qualification}=require('../models')
exports.createIntern=async(req,res)=>{
    try{
      const user_id=req.user.id

      const existingIntern=await Intern.findOne({where:{user_id}})
      if(existingIntern){
        await existingIntern.update(req.body)
        return res.status(200).json({message:'Intern profile updated successfully',intern:existingIntern,status:'200'})
      }
      const newIntern=await Intern.create({user_id,...req.body})
      return res.status(200).json({message:'Intern profile created successfully',intern:newIntern,status:'200'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error',status:'500'})
    }
}
exports.getInternByUserId=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
       return res.status(404).json({message:'Intern not found',status:'404'})
      }
      res.status(200).json({intern,status:'200'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error',status:'500'})
    }
}
exports.updateIntern=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:"Intern not found",status:'404'})
      }
      await intern.update(req.body)
      res.status(200).json({message:"Intern profile updated",intern,status:'200'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error',status:'500'})
    }
}
exports.getQualifications=async(req,res)=>{
    try{
      const{userId}=req.params;
      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:'Intern not found',status:'404'})
      }
      const qualification= await Qualification.findOne({where:{intern_id:intern.id}})
      if(!qualification){
        return res.status(404).json({messasge:'Qualification not found',status:'404'})
      }
      res.status(200).json({qualification,status:'200'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error',status:'500'})
    }
}
exports.upsrtQualifications=async(req,res)=>{
    try{
      const {userId}=req.params;


      const intern=await Intern.findOne({where:{user_id:userId}})
      if(!intern){
        return res.status(404).json({message:'Intern not found',status:'404'})
      }

      const[qualification,created]=await Qualification.upsert({intern_id:intern.id, ...req.body},{returning:true})
      res.status(200).json({message:created?'Qualification created':'Qualification updated',qualification,status:'200'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal server error',status:'500'})
    }
}