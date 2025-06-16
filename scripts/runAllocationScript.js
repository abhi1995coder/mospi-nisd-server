const {
  Application,
  ApplicationPreference,
  Internship,
  Intern,
  Qualification
} = require('../models');
const allocateInternships = require('./allocateInternships');

async function runAllocation() {
  // 1) fetch only submitted applications
  const applications = await Application.findAll({
    where: { application_status: 'submitted' },
    include: {
      model: Intern,
      as: 'a_to_in',
      include: { model: Qualification, as: 'in_to_q' }
    }
  });

  // 2) map to simple objects for the allocator
  const formattedApps = applications.map(app => {
    const qual = app.a_to_in.in_to_q;
    return {
      application_id: app.id,
      intern_id:      app.intern_id,
      // no need for isEligible here
      verified_percentage:    qual?.verified_percentage,
      calculated_percentage:  getAutoPercentage(qual),
      twelth_percentage:      qual?.twelth_percentage
    };
  });

  // 3) load preferences & internships
  const preferences = await ApplicationPreference.findAll();
  const internships = await Internship.findAll();

  // 4) run the allocator
  const results = allocateInternships(formattedApps, preferences, internships);

  // 5) write back to the DB
  for (const r of results) {
    await Application.update(
      {
        selected_internship_id: r.assigned_internship_id,
        application_status:     r.status,
        review_date:            new Date()
      },
      { where: { id: r.application_id } }
    );
  }

  console.log('Allocation complete');
}

function getAutoPercentage(qual) {
  return qual?.graduation_percentage
      || qual?.post_graduation_percentage
      || qual?.twelth_percentage
      || 0;
}

module.exports = runAllocation;
