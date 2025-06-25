const runAllocation = require('../scripts/runAllocationScript');

exports.runAllocationAPI = async (req, res) => {
  try {
    await runAllocation();
    res.status(200).json({ message: 'Internship allocation completed successfully.' });
  } catch (err) {
    console.error('API allocation error:', err);
    res.status(500).json({ message: 'Allocation failed', error: err.message });
  }
};
