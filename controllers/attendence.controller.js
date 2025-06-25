const { Attendance, Intern } = require('../models');
const { Op } = require('sequelize');

/**
 * POST /api/attendance/check-in
 * Record today's check-in time.
 */
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // find the intern row
    const intern = await Intern.findOne({ where: { user_id: userId } });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const today = new Date().toISOString().slice(0,10);

    // upsert the record
    const [att, created] = await Attendance.findOrCreate({
      where: { intern_id: intern.id, date: today },
      defaults: { check_in: new Date() }
    });
    if (!created) {
      // already existed, just update check_in if empty
      if (att.check_in) {
        return res.status(400).json({ message: 'Already checked in today' });
      }
      await att.update({ check_in: new Date() });
    }

    return res.status(200).json({ message: 'Checked in', attendance: att });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/attendance/check-out
 * Record today's check-out time.
 */
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const intern = await Intern.findOne({ where: { user_id: userId } });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const today = new Date().toISOString().slice(0,10);
    const att = await Attendance.findOne({ 
      where: { intern_id: intern.id, date: today }
    });
    if (!att || !att.check_in) {
      return res.status(400).json({ message: 'You must check in first' });
    }
    if (att.check_out) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    await att.update({ check_out: new Date() });
    return res.status(200).json({ message: 'Checked out', attendance: att });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/attendance
 * List all attendance entries for the logged-in intern.
 */
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const intern = await Intern.findOne({ where: { user_id: userId } });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const records = await Attendance.findAll({
      where: { intern_id: intern.id },
      order: [['date','DESC']]
    });
    return res.status(200).json({ records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/attendance/summary
 * Get attendance percentage for the current internship period or month.
 * Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const intern = await Intern.findOne({ where: { user_id: userId } });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    let { start, end } = req.query;
    if (!start || !end) {
      // default to last 30 days
      end = new Date().toISOString().slice(0,10);
      start = new Date(Date.now() - 30*24*3600*1000).toISOString().slice(0,10);
    }
    const totalDays = Math.ceil((new Date(end) - new Date(start)) / (24*3600*1000)) + 1;

    const presentCount = await Attendance.count({
      where: {
        intern_id: intern.id,
        date: { [Op.between]: [start, end] },
        check_in: { [Op.ne]: null },
        check_out: { [Op.ne]: null }
      }
    });

    const percentage = ((presentCount / totalDays) * 100).toFixed(2);
    return res.status(200).json({ start, end, totalDays, presentCount, percentage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
