const { Application, Internship, Office, Intern, Qualification, Attendance } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { Parser } = require('json2csv');

module.exports = {
  /**
   * GET /api/analytics/applications-summary
   * Returns counts of applications by status and group_type.
   */
  applicationsSummary: async (req, res) => {
    try {
      const rows = await Application.findAll({
        attributes: [
          'application_status',
          'group_type',
          [ fn('COUNT', col('id')), 'count' ]
        ],
        group: ['application_status','group_type']
      });
      return res.json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * GET /api/analytics/interns-summary
   * Returns counts of interns by office and their average attendance %.
   */
  internsSummary: async (req, res) => {
    try {
      // Total interns per office
      const internsPerOffice = await Intern.findAll({
        include: { model: Office, as: 'in_to_o', attributes: ['id','office_name'] },
        attributes: [
          'in_to_o.id',
          [ fn('COUNT', col('Intern.id')), 'internCount' ]
        ],
        group: ['in_to_o.id','in_to_o.office_name']
      });

      // Average attendance across last 30 days for all interns
      const thirtyDaysAgo = literal(`CURRENT_DATE - INTERVAL '30 days'`);
      const attendanceStats = await Attendance.findAll({
        attributes: [
          [ fn('ROUND', fn('AVG',
              fn('CASE', 
                fn('WHEN', literal('check_in IS NOT NULL AND check_out IS NOT NULL'), 1),
                0
              )
            ) * 100, 2), 'avgAttendancePct' ]
        ],
        where: {
          date: { [Op.gte]: thirtyDaysAgo }
        }
      });

      return res.json({
        internsPerOffice,
        avgAttendancePct: attendanceStats[0]?.get('avgAttendancePct') || 0
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * GET /api/analytics/export-applications
   * Streams a CSV of all applications + preferences.
   */
  exportApplications: async (req, res) => {
    try {
      const apps = await Application.findAll({
        include: [
          { model: Intern, as: 'a_to_in', attributes: ['full_name','aadhar_number'] },
          { model: Internship, as: 'a_to_ap', through: { attributes: ['preference_order'] }, attributes: ['title','office_id'] }
        ]
      });

      // Flatten for CSV
      const data = apps.map(a => ({
        id: a.id,
        internName: a.a_to_in.full_name,
        aadhar: a.a_to_in.aadhar_number,
        status: a.application_status,
        submitted: a.submission_date,
        preferences: a.a_to_ap.map(p => `${p.title}(${p.ApplicationPreference.preference_order})`).join('; ')
      }));

      const parser = new Parser();
      const csv = parser.parse(data);

      res.header('Content-Type','text/csv');
      res.attachment('applications.csv');
      return res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};
