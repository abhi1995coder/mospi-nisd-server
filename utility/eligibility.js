
function checkEligibility(qual) {
  if (!qual) return false;

  const level = qual.highest_academic_level.toLowerCase();
  const hasPaper = qual.has_statistics_math_paper;

  // Undergraduate
  if (level === 'undergraduate') {
    return qual.twelth_percentage >= 75 && hasPaper;
  }

  // Graduate or Research student
  if (level === 'graduate' || level.includes('research')) {
    return qual.graduation_percentage >= 70 && hasPaper;
  }

  // Graduates/Post-graduates (past two years)
  if (level.includes('pass-out')) {
    return (qual.graduation_percentage >= 70) ||
           (qual.post_graduation_percentage >= 70);
  }

  return false;
}

module.exports = { checkEligibility };
