const { Application, ApplicationPreference } = require('../models');

exports.createApplication = async (req, res) => {
  try {
    const { intern_id, group_type, internship_id } = req.body;

    const application = await Application.create({
      intern_id,
      group_type,
      internship_id,
      status: 'draft',
      submission_date: null
    });

    res.status(201).json({ message: 'Application created', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.submitPreferences = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const preferences = req.body.preferences;

    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({ message: 'Preferences are required' });
    }

    const existingApp = await Application.findByPk(applicationId);
    if (!existingApp) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Remove old preferences if any
    await ApplicationPreference.destroy({ where: { application_id: applicationId } });

    // Add new preferences
    const records = preferences.map((pref, index) => ({
      application_id: applicationId,
      internship_id: pref.internship_id,
      sub_office_id: pref.sub_office_id || null,
      preference_order: index + 1
    }));

    await ApplicationPreference.bulkCreate(records);

    res.status(201).json({ message: 'Preferences submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === 'submitted') {
      return res.status(400).json({ message: 'Application already submitted' });
    }

    await application.update({
      status: 'submitted',
      submission_date: new Date()
    });

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getApplicationByInternId = async (req, res) => {
  try {
    const { internId } = req.params;

    const applications = await Application.findAll({
      where: { intern_id: internId },
      include: ['Preferences'] // if associations are defined
    });

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
