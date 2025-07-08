const { Preference } = require('../models');

exports.setPreferences = async (req, res) => {
  const t = await Preference.sequelize.transaction();
  try {
    const { application_id, preferences } = req.body;
    // preferences = [{ office_id, sub_office_id, rank }, ...]
    // delete existing prefs
    await Preference.destroy({ where: { application_id }, transaction: t });
    // bulk create new
    const prefs = await Preference.bulkCreate(
      preferences.map(p => ({ ...p, application_id })),
      { transaction: t }
    );
    await t.commit();
    return res.status(200).json({ status: 'success', preferences: prefs });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Could not set preferences' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const prefs = await Preference.findAll({ where: { application_id: req.params.applicationId } });
    return res.json({ status: 'success', preferences: prefs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Could not fetch preferences' });
  }
};
