const { Notice } = require('../models');

exports.createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = await Notice.create({ title, content });
    res.status(201).json({ message: 'Notice created', notice });
  } catch (err) {
    console.error('Error creating notice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({where:{is_active:true}, order: [['createdAt', 'DESC']] });
    res.status(200).json({ notices });
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(200).json({ notice });
  } catch (err) {
    console.error('Error fetching notice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    const { title, content } = req.body;
    await notice.update({ title, content });
    res.status(200).json({ message: 'Notice updated', notice });
  } catch (err) {
    console.error('Error updating notice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    await notice.update({is_active:false});
    res.status(200).json({ message: 'Notice deactivated' });
  } catch (err) {
    console.error('Error deactivating notice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
