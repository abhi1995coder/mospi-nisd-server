
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
          as:'intern',
          include:{
            model:Qualification,
            as:'Qualification'
          }
        }
      ]
    });
    console.log('working till here')

    
    const formattedApps = applications.map(app => {
      const qual = app.Intern?.Qualification;
      const isEligible = checkEligibility(qual);
      return {
        application_id: app.application_id,
        intern_id: app.intern_id,
        status: app.status,
        isEligible,
        verified_percentage: qual?.verified_percentage,
        calculated_percentage: getAutoPercentage(qual),
        twelve_percentage: qual?.twelve_percentage
      };
    });

    
    const preferences = await ApplicationPreference.findAll();

    
    const results = allocateInternships(formattedApps, preferences, internships);

   
    for (const result of results) {
      await Application.update(
        {
          selected_internship_id: result.assigned_internship_id,
          status: result.status
        },
        { where: { application_id: result.application_id } }
      );
    }

    console.log('Allocation completed successfully.');
  } catch (err) {
    console.error('Allocation error:', err);
  }
}


function checkEligibility(qual) {
  if (!qual) return false;
  if (qual.education_level === 'undergraduate') {
    return qual.twelve_percentage >= 75 && qual.has_stats_or_maths_paper;
  }
  if (qual.education_level === 'graduate' || qual.education_level === 'research_scholar') {
    return qual.graduation_percentage >= 70 && qual.has_stats_or_maths_paper;
  }
  if (qual.education_level === 'graduate_passout' || qual.education_level === 'postgraduate_passout') {
    return (qual.graduation_percentage >= 70 || qual.postgrad_percentage >= 70);
  }
  return false;
}

function getAutoPercentage(qual) {
  return qual?.graduation_percentage || qual?.postgrad_percentage || qual?.twelve_percentage || 0;
}

module.exports = runAllocation;