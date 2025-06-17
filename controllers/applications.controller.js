const { Application, ApplicationPreference,Internship} = require('../models');
const { checkEligibility } = require('../utility/eligibility');
const requiredDocs = require('../config/requiredDocs');

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
    // 1) Load application with intern & qual
    const application = await Application.findByPk(applicationId, {
      include: {
        model: Intern,
        as: 'a_to_in',              // your alias
        include: {
          model: Qualification,
          as: 'in_to_q'            // your alias
        }
      }
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // 2) Prevent double‐submit
    if (application.application_status === 'submitted') {
      return res.status(400).json({ message: 'Application already submitted' });
    }

    // === SECTION A: Document completeness check ===
    // Fetch all docs this intern has uploaded
    const internId = application.intern_id;
    const docs = await Document.findAll({ where: { intern_id: internId } });
    const uploadedTypes = docs.map(d => d.document_type);

    // Find which required ones are missing
    const missing = requiredDocs.filter(dt => !uploadedTypes.includes(dt));
    if (missing.length > 0) {
      await application.update({
        application_status: 'incomplete',
        review_date: new Date(),
        rejection_reason: `Missing documents: ${missing.join(', ')}`
      });
      return res.status(200).json({
        message: 'Application incomplete—required documents missing',
        missing
      });
    }
    // === End Section A ===

    // === Your existing eligibility logic ===
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

    // 3) All good → mark submitted
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
exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status, rejection_reason } = req.body;

  // Allowed manual statuses
  const allowed = ['incomplete', 'under_review', 'rejected'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `Invalid status; must be one of ${allowed.join(', ')}` });
  }
  // If marking incomplete or rejected, require a reason
  if ((status === 'incomplete' || status === 'rejected') && !rejection_reason) {
    return res
      .status(400)
      .json({ message: 'rejection_reason is required when setting status to incomplete or rejected' });
  }

  try {
    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.update({
      application_status: status,
      rejection_reason: rejection_reason || null,
      review_date: new Date()
    });

    return res.status(200).json({
      message: `Application status set to '${status}'`,
      application
    });
  } catch (err) {
    console.error('Error in updateApplicationStatus:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
