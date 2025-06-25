const { SubOffice,Office} = require('../models');

// Create sub-office
exports.createSubOffice = async (req, res) => {
  try {
  const{office_id}=req.body  
  const office = await Office.findByPk(office_id);
  if (!office) {
    return res.status(404).json({ message: 'Office not found' });
  }
  
  if (office.office_type !== 'B') {
    return res.status(400).json({
      message: 'Sub-offices can only be created under Group B offices'
    });
  }
    const subOffice = await SubOffice.create(req.body);
    res.status(201).json({ message: 'Sub-office created', subOffice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all active sub-offices
exports.getAllSubOffices = async (req, res) => {
  try {
    const subOffices = await SubOffice.findAll({ where: { is_active: true } });
    res.status(200).json({ subOffices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sub-offices for a specific office
exports.getSubOfficesByOfficeId = async (req, res) => {
  try {
    const { id } = req.params;
    const subOffices = await SubOffice.findAll({ where: { office_id: id, isActive: true } });
    res.status(200).json({ subOffices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update sub-office
exports.updateSubOffice = async (req, res) => {
  try {
    const subOffice = await SubOffice.findByPk(req.params.id);
    if (!subOffice) return res.status(404).json({ message: 'Sub-office not found' });

    await subOffice.update(req.body);
    res.status(200).json({ message: 'Sub-office updated', subOffice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete (deactivate)
exports.deactivateSubOffice = async (req, res) => {
  try {
    const subOffice = await SubOffice.findByPk(req.params.id);
    if (!subOffice) return res.status(404).json({ message: 'Sub-office not found' });

    await subOffice.update({ is_active: false });
    res.status(200).json({ message: 'Sub-office deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
