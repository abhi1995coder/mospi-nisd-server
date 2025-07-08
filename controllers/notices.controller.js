// controllers/notice.controller.js
const { Notice } = require('../models');

// Upload a new notice (PDF)
exports.uploadNotice = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'PDF file is required' });
    }

    // req.file.path contains the file system path to the uploaded PDF
    const notice = await Notice.create({
      title,
      file_path: req.file.path,
      publish_date: new Date(),
      is_active: true
    });

    return res.status(201).json({ status: 'success', notice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Failed to upload notice' });
  }
};

// Fetch active notices for homepage
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: { is_active: true },
      order: [['publish_date', 'DESC']],
      attributes: ['id', 'title', 'file_path', 'publish_date']
    });

    return res.status(200).json({ status: 'success', notices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch notices' });
  }
};

