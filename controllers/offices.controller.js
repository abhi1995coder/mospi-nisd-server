const { Office } = require('../models');

// ✅ Create a new office (admin only)
exports.createOffice = async (req, res) => {
  try {
    const office = await Office.create(req.body);
    return res.status(201).json({ message: 'Office created', office });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all offices (accessible to all logged-in users)
exports.getAllOffices = async (req, res) => {
  try {
    const offices = await Office.findAll();
    return res.status(200).json({ offices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get single office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) return res.status(404).json({ message: 'Office not found' });
    return res.status(200).json({ office });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update office (admin only)
exports.updateOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) return res.status(404).json({ message: 'Office not found' });

    await office.update(req.body);
    return res.status(200).json({ message: 'Office updated', office });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete office (admin only)
exports.deleteOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) return res.status(404).json({ message: 'Office not found' });

    await office.destroy();
    return res.status(200).json({ message: 'Office deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
