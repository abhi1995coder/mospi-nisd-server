// controllers/subOffices.controller.js

const { SubOffice, Office } = require('../models');

exports.createSubOffice = async (req, res) => {
  const role = req.user.role;
  // only super & group-a admin
  if (!['super_admin','group_a_admin'].includes(role)) {
    return res.status(403).json({ message: 'Not allowed to create sub-offices', status:'403' });
  }

  try {
    const { office_id, name, address } = req.body;
    const office = await Office.findByPk(office_id);

    if (!office) {
      return res.status(404).json({ message: 'Office not found', status:'404' });
    }
    if (office.office_type !== 'group_b') {
      return res.status(400).json({
        message: 'Sub-offices can only be created under Group B offices',
        status:'400'
      });
    }

    const subOffice = await SubOffice.create({ office_id, name, address });
    return res.status(201).json({
      message: 'Sub-office created',
      subOffice,
      status:'201'
    });
  } catch (err) {
    console.error('createSubOffice error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
      status:'500'
    });
  }
};

exports.getAllSubOffices = async (req, res) => {
  try {
    const subOffices = await SubOffice.findAll({
      where: { is_active: true },
      include: [{
        model: Office,
        as: 'office',               // make sure this matches your alias in models/subOffice.js
        where: { office_type: 'group_b' }, // only group_b parent offices
        attributes: ['id','office_name','city','state','office_type']
      }]
    });
    return res.status(200).json({ subOffices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubOfficesByOfficeId = async (req, res) => {
  try {
    const { id } = req.params;
    const subOffices = await SubOffice.findAll({
      where: {
        office_id: id,
        is_active: true
      },
      include: [{
        model: Office,
        as: 'office',
        attributes: ['id','office_name','city','state','office_type']
      }]
    });
    return res.status(200).json({ subOffices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.updateSubOffice = async (req, res) => {
  const role = req.user.role;
  if (!['super_admin','group_a_admin'].includes(role)) {
    return res.status(403).json({ message: 'Not allowed to update sub-offices', status:'403' });
  }

  try {
    const subOffice = await SubOffice.findByPk(req.params.id);
    if (!subOffice) {
      return res.status(404).json({ message: 'Sub-office not found', status:'404' });
    }

    // Optional: also ensure parent office is Group B
    const office = await Office.findByPk(subOffice.office_id);
    if (!office || office.office_type !== 'group_b') {
      return res.status(400).json({
        message: 'Invalid parent office for this sub-office',
        status:'400'
      });
    }

    await subOffice.update(req.body);
    return res.status(200).json({
      message: 'Sub-office updated',
      subOffice,
      status:'200'
    });
  } catch (err) {
    console.error('updateSubOffice error:', err);
    return res.status(500).json({ message: 'Server error', status:'500' });
  }
};

exports.deactivateSubOffice = async (req, res) => {
  const role = req.user.role;
  if (!['super_admin','group_a_admin'].includes(role)) {
    return res.status(403).json({ message: 'Not allowed to deactivate sub-offices', status:'403' });
  }

  try {
    const subOffice = await SubOffice.findByPk(req.params.id);
    if (!subOffice) {
      return res.status(404).json({ message: 'Sub-office not found', status:'404' });
    }

    await subOffice.update({ is_active: false });
    return res.status(200).json({ message: 'Sub-office deactivated', status:'200' });
  } catch (err) {
    console.error('deactivateSubOffice error:', err);
    return res.status(500).json({ message: 'Server error', status:'500' });
  }
};