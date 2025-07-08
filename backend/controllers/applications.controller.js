// controllers/application.controller.js
// controllers/application.controller.js
const { Application, Preference } = require('../models');

exports.createApplication = async (req, res) => {
  try {
    const { cycle_id, group_type } = req.body;
    const user_id = req.user.id;

     let app = await Application.findOne({
      where: { user_id, cycle_id, group_type, status: 'draft' }
    });

    // 2. If none, create one
    if (!app) {
      app = await Application.create({
        user_id,
        cycle_id,
        group_type,
        status: 'draft'
      });
    }

    return res.status(201).json({ status: 'success', application: app });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Could not create application' });
  }
};

exports.getApplicationsByUser = async (req, res) => {
  try {
    const apps = await Application.findAll({
      where: { user_id: req.user.id },
      include: ['preferences']
    });
    return res.json({ status: 'success', applications: apps });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Could not fetch applications' });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({
      where: { id: req.params.id },
      include: ['preferences']
    });
    if (!app) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Application not found' });
    }
    // ensure interns only see their own
    if (req.user.role === 'intern' && app.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ status: 'error', message: 'Forbidden' });
    }
    return res.json({ status: 'success', application: app });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Error fetching application' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByPk(req.params.id);
    if (!app) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Application not found' });
    }
    // allow admins or the intern who owns it to change status
    if (
      !( ['super_admin','group_a_admin','group_b_admin'].includes(req.user.role) ) &&
      !( req.user.role === 'intern' && app.user_id === req.user.id )
    ) {
      return res
        .status(403)
        .json({ status: 'error', message: 'Forbidden' });
    }

    app.status = status;
    await app.save();

    return res.json({ status: 'success', application: app });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Could not update status' });
  }
};
