
const { Application, ApplicationPreference, Internship, Intern } = require('../models');
const { Sequelize } = require('sequelize');

exports.allocateInternships = async () => {
  try {
    
    const applications = await Application.findAll({
      where: { status: 'submitted' },
      include: [
        {
          model: ApplicationPreference,
          as: 'preferences',
          order: [['preference_order', 'ASC']]
        },
        {
          model: Intern,
          attributes: ['intern_id', 'graduation_percentage'] 
        }
      ]
    });

   
    const sortedApplications = applications.sort((a, b) => {
      return b.Intern.graduation_percentage - a.Intern.graduation_percentage;
    });

  
    const slotMap = {};
    const internships = await Internship.findAll();
    internships.forEach(int => {
      slotMap[int.internship_id] = int.available_slots;
    });

    const results = [];

    
    for (const app of sortedApplications) {
      const preferences = app.preferences;
      let assigned = false;

      for (const pref of preferences) {
        const internshipId = pref.internship_id;

        if (slotMap[internshipId] > 0) {
          
          await app.update({
            selected_internship_id: internshipId,
            selected_sub_office_id: pref.sub_office_id || null,
            status: 'selected'
          });

          slotMap[internshipId]--;
          results.push({ intern_id: app.intern_id, assigned: internshipId });
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        await app.update({ status: 'waitlisted' });
        results.push({ intern_id: app.intern_id, assigned: null });
      }
    }

    console.log('Allocation complete');
    return results;
  } catch (err) {
    console.error('Error during allocation:', err);
    throw err;
  }
};
