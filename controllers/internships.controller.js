const{Internship,Office}=require('../models')
exports.createInternship=async(req,res)=>{
    try{
        const{
            office_id,
            title,
            duration_months,
            start_date,
            end_date,
            available_slots,
            status
        }=req.body
        const office=await Office.findByPk(office_id)
        if(!office){
            return res.status(404).json({message:'Office not found'})
        }
        const internship=await Internship.create({
            office_id,
            title,
            duration_months,
            start_date,
            end_date,
            available_slots,
            status
        })
        res.status(201).json({message:'Internship created',internship})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal server error'})
    }
}
exports.getAllInternship = async (req, res) => {
  try {
    const { group_type } = req.query;

    const whereClause = {};
    if (group_type) {
      if (!['A', 'B'].includes(group_type)) {
        return res.status(400).json({ message: 'Invalid group_type. Use A or B.' });
      }
      whereClause.group_type = group_type;
    }

    const internships = await Internship.findAll({
      where: whereClause,
      include: {
        model: Office,
        attributes: ['office_id', 'name', 'state', 'city']
      },
      order: [['start_date', 'ASC']]
    });

    res.status(200).json({ internships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInternshipById=async(req,res)=>{
    try{
        const internship=await Internship.findByPk(req.params.id)
        if(!internship){
            return res.status(404).json({message:'Internship not found'})
        }
        res.status(200).json({internship})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal server error'})
    }
}
exports.updateInternship=async(req,res)=>{
    try{
        const internship=await Internship.findByPk(req.params.id)
        if(!internship){
           return res.status(404).json({message:'Internship not found'})
        }
        await internship.update(req.body)
        res.status(200).json({message:'Internship updated',internship})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal server error'})
    }
}