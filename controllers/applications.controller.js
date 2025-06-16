const { Application, ApplicationPreference,Internship} = require('../models');
const { checkEligibility } = require('../utility/eligibility');

exports.createApplication = async (req, res) => {
  try {
    const { intern_id, group_type} = req.body;

    const application = await Application.create({
      intern_id,
      group_type,



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
    const { preferences } = req.body;

    // Validate that preferences is a non-empty array
    if (!Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({ message: 'Preferences are required' });
    }

    // Fetch the application
    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Enforce Group A vs Group B rules
    if (application.group_type === 'A') {
      // Group A: allow one or more preferences
      if (preferences.length < 1) {
        return res
          .status(400)
          .json({ message: 'At least one preference is required for Group A applications' });
      }
    } else if (application.group_type === 'B') {
      // Group B: exactly one preference
      if (preferences.length !== 1) {
        return res
          .status(400)
          .json({ message: 'Exactly one preference is required for Group B applications' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid group_type on application' });
    }

    // Validate that all internship IDs exist
    const internshipIds = preferences.map(p => p.internship_id);
    const internships = await Internship.findAll({
      where: { id: internshipIds }
    });
    if (internships.length !== internshipIds.length) {
      return res.status(400).json({ message: 'One or more internship IDs are invalid' });
    }

    // Ensure the internships belong to the same group_type as the application
    for (const internship of internships) {
      if (internship.group_type !== application.group_type) {
        return res.status(400).json({
          message: `Internship ${internship.id} does not belong to group ${application.group_type}`
        });
      }
    }

    // Remove any existing preferences
    await ApplicationPreference.destroy({
      where: { application_id: applicationId }
    });

    // Insert the new preferences
    const records = preferences.map(pref => ({
      application_id: applicationId,
      internship_id: pref.internship_id,
      preference_order: pref.preference_order
    }));
    await ApplicationPreference.bulkCreate(records);

    return res.status(201).json({ message: 'Preferences submitted successfully' });
  } catch (error) {
    console.error('Error in submitPreferences:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.submitApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    // Load application + intern + their qualification
    const application = await Application.findByPk(applicationId, {
      include: {
        model: Intern,
        as: 'a_to_in',             // adjust alias if yours differs
        include: {
          model: Qualification,
          as: 'in_to_q'            // adjust alias if yours differs
        }
      }
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow moving from draft → submitted once
    if (application.application_status === 'submitted') {
      return res.status(400).json({ message: 'Application already submitted' });
    }

    // Check eligibility
    const qual = application.a_to_in?.in_to_q;
    const eligible = checkEligibility(qual);
    if (!eligible) {
      await application.update({
        application_status: 'rejected',
        rejection_reason: 'Does not meet academic eligibility criteria',
        review_date: new Date()
      });
      return res
        .status(200)
        .json({ message: 'Application rejected: eligibility criteria not met' });
    }

    // Mark as submitted
    await application.update({
      application_status: 'submitted',
      submission_date: new Date()
    });

    return res
      .status(200)
      .json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error in submitApplication:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplicationByInternId = async (req, res) => {
  try {
    const { internId } = req.params;

    const applications = await Application.findAll({
      where: { intern_id: internId },
      include: ['Preferences']
    });

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
