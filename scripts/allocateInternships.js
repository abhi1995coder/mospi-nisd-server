function allocateInternships(applications, preferences, internships) {
  // All apps in here are already "submitted" & eligible
  // Score them:
  applications.forEach(app => {
    app.score = app.verified_percentage
             ?? app.calculated_percentage
             ?? app.twelth_percentage
             ?? 0;
  });

  // Sort by descending score
  applications.sort((a, b) => b.score - a.score);

  // Build slots map
  const slotMap = {};
  internships.forEach(i => { slotMap[i.id] = i.available_slots; });

  const results = [];

  for (const app of applications) {
    const prefs = preferences
      .filter(p => p.application_id === app.application_id)
      .sort((a, b) => a.preference_order - b.preference_order);

    let assigned = false;
    for (const p of prefs) {
      if (slotMap[p.internship_id] > 0) {
        slotMap[p.internship_id]--;
        results.push({
          application_id:  app.application_id,
          intern_id:       app.intern_id,
          assigned_internship_id: p.internship_id,
          status:          'selected',
          preference_order:p.preference_order,
          merit_score:     app.score
        });
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      // fallback or waitlist
      const fallback = Object.entries(slotMap).find(([, slots]) => slots > 0);
      if (fallback) {
        slotMap[fallback[0]]--;
        results.push({
          application_id:  app.application_id,
          intern_id:       app.intern_id,
          assigned_internship_id: fallback[0],
          status:          'selected_fallback',
          preference_order:null,
          merit_score:     app.score
        });
      } else {
        results.push({
          application_id:  app.application_id,
          intern_id:       app.intern_id,
          assigned_internship_id: null,
          status:          'waitlisted',
          preference_order:null,
          merit_score:     app.score
        });
      }
    }
  }

  return results;
}

module.exports = allocateInternships;
