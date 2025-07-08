const { InternshipCycle } = require('../models');

exports.createCycle = async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;
    const cycle = await InternshipCycle.create({ title, start_date, end_date });
    res.status(201).json({ cycle,status:'201'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create cycle',status:'500' });
  }
};
exports.updateCycle=async(req,res)=>{
  const{id}=req.params;
  try{
    const cycle=await InternshipCycle.findOne({where:{id}})
    if(!cycle){
      return res.status(404).json({message:'cycle not found',status:'404'})
    }

    const updatedCycle=await cycle.update(req.body)
    res.status(200).json({message:'cycle updated successfully',updatedCycle,status:'200'})

  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error',status:'500'})
  }

}

exports.disableCycle=async(req,res)=>{
  const{id}=req.params
  try{
   const cycle=await InternshipCycle.findOne({where:{id}})
   if(!cycle){
     return res.status(404).json({message:'Cycle not found',status:'404'})
   }
    await cycle.update({is_Active:false})
    res.status(200).json({message:'cycle disabled successfully',status:'200'})
  }catch(err){
   console.log(err)
   res.status(500).json({message:'Internal Server error',status:'500'})
  }
}


exports.getAllCycles = async (req, res) => {
  try {
    const cycles = await InternshipCycle.findAll({
      where:{is_Active:true},
      include: { association: 'vacancies' }
    });
    res.status(200).json({ cycles ,status:'200'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cycles',status:'500'});
  }
};
exports.getCycleById = async (req, res) => {
  const{id}=req.params
  try {
    const cycle=await InternshipCycle.findOne({where:{id}})
    if(!cycle){
      return res.status(404).json({message:'Cycle not found',status:'404'})
    }
    res.status(200).json({ cycle ,status:'200'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch cycles',status:'500'});
  }
};