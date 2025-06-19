

const fs = require('fs');
const path = require('path');
const { Document, Intern } = require('../models');

// Ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

/**
 * POST /api/document
 * Intern uploads a single document
 */
exports.uploadDocument = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { document_type } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the intern record
    const intern = await Intern.findOne({ where: { user_id } });
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // Build a unique filename and write to disk
    const filename = `${Date.now()}_${file.originalname}`;
    const destPath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(destPath, file.buffer);

    // Save the URL in DB
    const document = await Document.create({
      intern_id: intern.id,
      document_type,
      document_url: `/uploads/${filename}`, // public URL
      verification_status: 'pending'
    });

    res.status(201).json({ message: 'Document uploaded', document });
  } catch (err) {
    console.error('uploadDocument error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/document
 * Intern fetches their own documents
 */
exports.getDocumentsByIntern = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const intern = await Intern.findOne({ where: { user_id } });
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const documents = await Document.findAll({
      where: { intern_id: intern.id }
    });

    res.status(200).json({ documents });
  } catch (err) {
    console.error('getDocumentsByIntern error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/document/intern/:internId
 * Admin fetches any intern’s documents
 */
exports.getDocumentsByInternId = async (req, res) => {
  try {
    const { internId } = req.params;
    const intern = await Intern.findByPk(internId);
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const documents = await Document.findAll({
      where: { intern_id: intern.id }
    });

    res.status(200).json({ documents });
  } catch (err) {
    console.error('getDocumentsByInternId error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * PATCH /api/document/:id/verify
 * Admin verifies or rejects a document
 */
exports.verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "verified" or "rejected".' });
    }

    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await document.update({ verification_status: status });
    res.status(200).json({ message: `Document ${status}`, document });
  } catch (err) {
    console.error('verifyDocument error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
