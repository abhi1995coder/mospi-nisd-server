const { Office } = require('../models');

// Create a new office (admin only)
exports.createOffice = async (req, res) => {
  const { office_type } = req.body;
  const role = req.user.role;

  if (role === 'group_a_admin' && office_type !== 'A') {
    return res.status(403).json({ message: 'Group A admins can only create Group A offices.' });
  }
  if (role === 'group_b_admin' && office_type !== 'B') {
    return res.status(403).json({ message: 'Group B admins can only create Group B offices.' });
  }
  try {
    const office = await Office.create(req.body);
    return res.status(201).json({ message: 'Office created', office });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//  Get all offices (accessible to all logged-in users)
exports.getAllOffices = async (req, res) => {
  try {
    const offices = await Office.findAll();
    return res.status(200).json({ offices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single office by ID
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

//  Update office (admin only)
exports.updateOffice = async (req, res) => {
  const { office_type } = req.body;
  const role = req.user.role;

  if (role === 'group_a_admin' && office_type && office_type !== 'A') {
    return res.status(403).json({ message: 'Group A admins can only update to Group A offices.' });
  }
  if (role === 'group_b_admin' && office_type && office_type !== 'B') {
    return res.status(403).json({ message: 'Group B admins can only update to Group B offices.' });
  }
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

//  Delete office (admin only)
exports.disableOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) return res.status(404).json({ message: 'Office not found' });

    await office.update({is_active:false});
    return res.status(200).json({ message: 'Office disabled' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
