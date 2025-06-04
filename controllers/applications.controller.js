const{Application,Intern}=require('../models')
exports.createApplication=async(req,res)=>{
    try{
       const{user_id}=req.user
       const intern=await Intern.findOne({where:{user_id}})
       if(!intern){
        return res.status(404).json({message:'Intern not found'})
       }
       const existing=await Application.findOne({where:{intern_id:intern.intern_id,group_type:req.body.group_type}})
       if(existing){
        await existing.update(req.body)
        return res.status(200).json({message:'Application updated',application:existing})
       }
       const application=await Application.create({intern_id:intern.intern_id, ...req.body})
       res.status(201).json({message:'Application created',application})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server error'})
    }
}
exports.getApplicationByInternId=async(req,res)=>{
    try{
       const{internId}=req.params;
       const application=await Application.findOne({where:{intern_id:internId}})
       if(!application){
        return res.status(404).json({message:'Application not found'})
       }
       res.status(200).json(application)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server error'})
    }
}
exports.updateApplication=async(req,res)=>{
    try{
       const{applicationId}=req.params;
       const application=await Application.findOne({where:{application_id:applicationId}})
       if(!application){
        return res.status(404).json({message:'Application not found'})
       }
       await application.update(req.body)
       res.status(200).json({message:'Application updated',application})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server error'})
    }
}
exports.submitApplication=async(req,res)=>{
    try{
       const{applicationId}=req.params;
       const application=await Application.findOne({where:{application_id:applicationId}})
       if(!application){
        return res.status(404).json({message:'Application not found'})
       }
       await application.update({application_status:'subimtted'})
       res.status(200).json({message:'Application submitted',application})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server error'})
    }
}