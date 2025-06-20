// controllers/offices.controller.js
const { Office } = require('../models');

/**
 * POST /api/office
 * Create a new office
 */
exports.createOffice = async (req, res) => {
  const { office_type } = req.body;
  const role = req.user.role;

  // Enforce group admins only create their own group
  if (role === 'group_a_admin' && office_type !== 'group_a') {
    return res.status(403).json({
      message: 'Group A admins can only create offices of type "group_a".'
    });
  }
  if (role === 'group_b_admin' && office_type !== 'group_b') {
    return res.status(403).json({
      message: 'Group B admins can only create offices of type "group_b".'
    });
  }

  try {
    const office = await Office.create({
      ...req.body,
      user_id: req.user.id    // track creator
    });
    return res.status(201).json({ message: 'Office created', office });
  } catch (err) {
    console.error('createOffice error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/office
 * List offices (scoped by creator for non-super_admin)
 */
exports.getAllOffices = async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'super_admin') {
      where.user_id = req.user.id;
    }
    const offices = await Office.findAll({ where });
    return res.status(200).json({ offices });
  } catch (err) {
    console.error('getAllOffices error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/office/:id
 * Retrieve a single office by ID (with ownership check)
 */
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }
    if (req.user.role !== 'super_admin' && office.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    return res.status(200).json({ office });
  } catch (err) {
    console.error('getOfficeById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/office/:id
 * Update an office (with ownership + type guard)
 */
exports.updateOffice = async (req, res) => {
  const { office_type } = req.body;
  const role = req.user.role;

  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }
    if (req.user.role !== 'super_admin' && office.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    // Prevent group admins from changing to a different group
    if (role === 'group_a_admin' && office_type && office_type !== 'group_a') {
      return res.status(403).json({
        message: 'Group A admins can only set office_type to "group_a".'
      });
    }
    if (role === 'group_b_admin' && office_type && office_type !== 'group_b') {
      return res.status(403).json({
        message: 'Group B admins can only set office_type to "group_b".'
      });
    }

    await office.update(req.body);
    return res.status(200).json({ message: 'Office updated', office });
  } catch (err) {
    console.error('updateOffice error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/office/:id
 * Disable (soft-delete) an office
 */
exports.disableOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }
    if (req.user.role !== 'super_admin' && office.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    await office.update({ is_active: false });
    return res.status(200).json({ message: 'Office disabled' });
  } catch (err) {
    console.error('disableOffice error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
