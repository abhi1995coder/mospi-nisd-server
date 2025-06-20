// controllers/internships.controller.js

const { Internship, Office } = require('../models');

/**
 * POST /api/internship
 * Create a new internship under a given office.
 */
exports.createInternship = async (req, res) => {
  try {
    const {
      office_id,
      title,
      group_type,
      duration_months,
      start_date,
      end_date,
      available_slots,
    } = req.body;

    // 1) Ensure parent office exists
    const office = await Office.findByPk(office_id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    // 2) Enforce that only the office-owner (or super_admin) can create
    if (
      req.user.role !== 'super_admin' &&
      office.user_id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access forbidden: you do not own this office' });
    }

    // 3) Make sure office_type === group_type
    if (office.office_type !== group_type) {
      return res.status(400).json({
        message: `Cannot create a '${group_type}' internship under a '${office.office_type}' office`
      });
    }

    // 4) Create the internship
    const internship = await Internship.create({
      office_id,
      title,
      group_type,
      duration_months,
      start_date,
      end_date,
      available_slots,
      created_by: req.user.id    // if you have that column
    });

    return res.status(201).json({ message: 'Internship created', internship });

  } catch (err) {
    console.error('createInternship error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/internship
 * List internships, optionally filtered by group_type.
 * Non-super_admins only see ones in offices they own.
 */
exports.getAllInternship = async (req, res) => {
  try {
    const { group_type } = req.query;
    const where = {};

    // Validate group_type, if supplied
    if (group_type) {
      if (!['group_a','group_b'].includes(group_type)) {
        return res.status(400).json({ message: 'Invalid group_type. Use "group_a" or "group_b".' });
      }
      where.group_type = group_type;
    }

    // Build the Office include, with ownership filter for non-super-admins
    const officeInclude = {
      model: Office,
      as: 'i_to_o',
      attributes: ['id','office_name','state','city','office_type','user_id'],
      // Only super_admin sees everything
      ...(req.user.role !== 'super_admin' ? { where: { user_id: req.user.id } } : {})
    };

    const internships = await Internship.findAll({
      where,
      include: officeInclude,
      order: [['start_date','ASC']]
    });

    return res.status(200).json({ internships });
  } catch (err) {
    console.error('getAllInternship error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/internship/:id
 * Fetch a single internship by its ID (with permission check).
 */
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: { model: Office, as: 'i_to_o', attributes: ['user_id','office_type'] }
    });
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Only allow owner or super_admin
    if (
      req.user.role !== 'super_admin' &&
      internship.i_to_o.user_id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    return res.status(200).json({ internship });
  } catch (err) {
    console.error('getInternshipById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/internship/:id
 * Update an existing internship (must own the parent office).
 */
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: { model: Office, as: 'i_to_o', attributes: ['user_id','office_type'] }
    });
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (
      req.user.role !== 'super_admin' &&
      internship.i_to_o.user_id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    // If office_type or group_type are changing, re-validate
    if (
      req.body.group_type &&
      req.body.group_type !== internship.i_to_o.office_type
    ) {
      return res.status(400).json({
        message: `Cannot change to '${req.body.group_type}' under a '${internship.i_to_o.office_type}' office`
      });
    }

    await internship.update(req.body);
    return res.status(200).json({ message: 'Internship updated', internship });
  } catch (err) {
    console.error('updateInternship error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/internship/:id/toggle-status
 * Flip between 'active' and 'closed' (office-owner or super_admin).
 */
exports.toggleStatus = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: { model: Office, as: 'i_to_o', attributes: ['user_id'] }
    });
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (
      req.user.role !== 'super_admin' &&
      internship.i_to_o.user_id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    const newStatus = internship.status === 'active' ? 'closed' : 'active';
    await internship.update({ status: newStatus });
    return res.status(200).json({
      message: `Internship status updated to ${newStatus}`,
      internship
    });
  } catch (err) {
    console.error('toggleStatus error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
