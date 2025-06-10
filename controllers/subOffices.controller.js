const { SubOffice } = require('../models');

// Create sub-office
exports.createSubOffice = async (req, res) => {
  try {
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
    const subOffices = await SubOffice.findAll({ where: { isActive: true } });
    res.status(200).json({ subOffices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sub-offices for a specific office
exports.getSubOfficesByOfficeId = async (req, res) => {
  try {
    const { officeId } = req.params;
    const subOffices = await SubOffice.findAll({ where: { office_id: officeId, isActive: true } });
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

    await subOffice.update({ isActive: false });
    res.status(200).json({ message: 'Sub-office deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
