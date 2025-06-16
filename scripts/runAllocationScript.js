const {
  Application,
  ApplicationPreference,
  Internship,
  Intern,
  Qualification
} = require('../models');
const allocateInternships = require('./allocateInternships');

async function runAllocation() {
  try {
    const internships = await Internship.findAll();

    const applications = await Application.findAll({
      where: { application_status: 'submitted' },
      include: [
        {
          model: Intern,
          as: 'a_to_in',
          include: {
            model: Qualification,
            as: 'in_to_q'
          }
        }
      ]
    });

    const formattedApps = applications.map(app => {
      const intern = app.a_to_in;
      const qual = intern?.in_to_q;

      return {
        application_id: app.id,
        intern_id: app.intern_id,
        application_status: app.application_status,
        isEligible: checkEligibility(qual),
        verified_percentage: qual?.verified_percentage,
        calculated_percentage: getAutoPercentage(qual),
        twelth_percentage: qual?.twelth_percentage
      };
    });

    const preferences = await ApplicationPreference.findAll();

    const results = allocateInternships(formattedApps, preferences, internships);

    for (const result of results) {
      await Application.update(
        {
          selected_internship_id: result.assigned_internship_id,
          application_status: result.status,
          review_date: new Date()
        },
        { where: { id: result.application_id } }
      );
    }

    console.table(results.map(r => ({
      intern: r.intern_id,
      assigned: r.assigned_internship_id,
      status: r.status,
      preference: r.preference_order,
      score: r.merit_score
    })));

    console.log('Allocation completed successfully.');
  } catch (err) {
    console.error('Allocation error:', err);
  }
}

// Eligibility based on MoSPI Annexure F
function checkEligibility(qual) {
  if (!qual) return false;

  const hasPaper = qual.has_statistics_math_paper;

  const level = qual.highest_academic_level?.toLowerCase();
  if (level === 'undergraduate') {
    return qual.twelth_percentage >= 75 && hasPaper;
  }
  if (level === 'graduate' || level === 'research scholar') {
    return qual.graduation_percentage >= 70 && hasPaper;
  }
  if (level === 'graduate pass-out' || level === 'post-graduate pass-out') {
    return (qual.graduation_percentage >= 70 || qual.post_graduation_percentage >= 70);
  }

  return false;
}

// Used for tie-breaker ranking
function getAutoPercentage(qual) {
  return qual?.graduation_percentage || qual?.post_graduation_percentage || qual?.twelth_percentage || 0;
}

module.exports = runAllocation;
