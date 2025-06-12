// Allocation script for MoSPI Internship Portal
// This script assumes availability of:
// - Applications: array of eligible applications
// - Preferences: array of application preferences
// - Internships: array of internship programs with available slots

function allocateInternships(applications, preferences, internships) {
  // Step 1: Filter only submitted and eligible applications
  const eligible = applications.filter(app => app.status === 'submitted' && app.isEligible);

  // Step 2: Attach score from verified percentage or fallback to 12th %
  eligible.forEach(app => {
    app.score = app.verified_percentage || app.calculated_percentage || app.twelve_percentage || 0;
  });

  // Step 3: Sort applications by descending merit score
  eligible.sort((a, b) => b.score - a.score);

  // Step 4: Build a map of available slots for internships
  const slotMap = {}; // internship_id -> available slots
  internships.forEach(intn => {
    slotMap[intn.internship_id] = intn.available_slots;
  });

  // Step 5: Loop through each application and assign internships
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

    // If no preferred internships available, assign fallback
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

// Export for use in routes or CLI
module.exports = allocateInternships;
