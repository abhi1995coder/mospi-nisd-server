

function allocateInternships(applications, preferences, internships) {
  
  const eligible = applications.filter(app => app.status === 'submitted' && app.isEligible);

  
  eligible.forEach(app => {
    app.score = app.verified_percentage || app.calculated_percentage || app.twelve_percentage || 0;
  });

  
  eligible.sort((a, b) => b.score - a.score);

  
  const slotMap = {};
  internships.forEach(intn => {
    slotMap[intn.internship_id] = intn.available_slots;
  });

  
  const results = [];

  for (const app of eligible) {
    const prefs = preferences
      .filter(p => p.application_id === app.application_id)
      .sort((a, b) => a.preference_order - b.preference_order);

    let assigned = false;

    for (const pref of prefs) {
      const slotsLeft = slotMap[pref.internship_id];
      if (slotsLeft > 0) {
        slotMap[pref.internship_id]--;
        results.push({
          application_id: app.application_id,
          intern_id: app.intern_id,
          assigned_internship_id: pref.internship_id,
          status: 'selected',
          preference_order: pref.preference_order,
          merit_score: app.score
        });
        assigned = true;
        break;
      }
    }

    
    if (!assigned) {
      const fallback = Object.entries(slotMap).find(([_, slots]) => slots > 0);
      if (fallback) {
        slotMap[fallback[0]]--;
        results.push({
          application_id: app.application_id,
          intern_id: app.intern_id,
          assigned_internship_id: fallback[0],
          status: 'selected_fallback',
          preference_order: null,
          merit_score: app.score
        });
      } else {
        results.push({
          application_id: app.application_id,
          intern_id: app.intern_id,
          assigned_internship_id: null,
          status: 'waitlisted',
          preference_order: null,
          merit_score: app.score
        });
      }
    }
  }

  return results;
}


module.exports = allocateInternships;
