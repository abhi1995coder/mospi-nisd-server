const { Vacancy, Office, SubOffice } = require('../models');

exports.createVacancy = async (req, res) => {
  try {
    const { cycle_id, office_id, sub_office_id, available_slots,duration} = req.body;
    let vac = await Vacancy.findOne({ where: { office_id } });
    if (vac) {
      res.status(400).json({message:'vacancy already created',status:'400'})
    } else {
      vac = await Vacancy.create({ cycle_id, office_id, sub_office_id, available_slots,duration});
    }
    res.status(201).json({message:'vacancy created successfully' ,status:'201'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create vacancy',status:'500'});
  }
};
exports.UpdateVacancy = async (req, res) => {
  const {officeId}=req.params;
  try {
    const { cycle_id, office_id, sub_office_id, available_slots } = req.body;
    let vac = await Vacancy.findOne({ where: {office_id:officeId} });
    if (!vac) {
      res.status(404).json({message:'office not found',status:'404'})
    } else {
      vac = await vac.update(req.body);
    }
    res.status(201).json({ message:'vacancy updated',status:'201'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upsert vacancy',status:'500'});
  }
};
exports.getVacanciesByCycle = async (req, res) => {
  try {
    const { cycleId } = req.params;
    const where = { cycle_id: cycleId };

    // scope to own offices for non-super admins
    if (req.user.role !== 'super_admin') {
      where.office_id = req.user.role === 'group_a_admin'
        ? { [Op.in]: await req.user.getOffices({ where: { office_type: 'group_a' } }).map(o=>o.id) }
        : { [Op.in]: await req.user.getOffices({ where: { office_type: 'group_b' } }).map(o=>o.id) };
    }

    const vacancies = await Vacancy.findAll({
      where,
      include: [
        { model: Office, as: 'office', attributes: ['office_name'] },
        { model: SubOffice, as: 'subOffice', attributes: ['name'] }
      ]
    });

    res.status(200).json({ vacancies,status:'200' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch vacancies',status:'500'});
  }
};