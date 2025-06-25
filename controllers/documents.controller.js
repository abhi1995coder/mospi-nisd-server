// controllers/documents.controller.js

const { v4: uuid }    = require('uuid');
const { writeFile }   = require('fs').promises;
const path            = require('path');
const UPLOAD_DIR      = path.join(__dirname, '..', 'uploads');

const { Document, Intern } = require('../models');
const { PDFDocument }       = require('pdf-lib');
const sharp                = require('sharp');

/**
 * POST /api/document
 * Intern uploads a single document
 */
exports.uploadDocument = async (req, res) => {
  try {
    // 1) Grab inputs
    const user_id       = req.user.user_id;
    const { document_type } = req.body;
    const file          = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 2) Ensure the intern exists
    const intern = await Intern.findOne({ where: { user_id } });
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // 3) Structural parse
    if (file.mimetype === 'application/pdf') {
      // Validate PDF structure
      try {
        await PDFDocument.load(file.buffer);
      } catch {
        return res.status(400).json({ message: 'Malformed PDF' });
      }
    } else {
      // Validate image structure
      try {
        await sharp(file.buffer).metadata();
      } catch {
        return res.status(400).json({ message: 'Invalid image file' });
      }
    }

    // 4) Safe write to disk with a UUID filename
    const ext = file.mimetype === 'application/pdf'
      ? 'pdf'
      : file.mimetype === 'image/png'
        ? 'png'
        : 'jpg';
    const filename = `${uuid()}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), file.buffer);

    // 5) Persist the DB record
    const document = await Document.create({
      intern_id:           intern.id,
      document_type,
      document_url:        `/uploads/${filename}`,
      verification_status: 'pending'
    });

    return res.status(201).json({ message: 'Document uploaded', document });
  } catch (err) {
    console.error('uploadDocument error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/document
 * Intern fetches their own documents
 */
exports.getDocumentsByIntern = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const intern  = await Intern.findOne({ where: { user_id } });
    if (!intern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    const documents = await Document.findAll({
      where: { intern_id: intern.id }
    });
    return res.status(200).json({ documents });
  } catch (err) {
    console.error('getDocumentsByIntern error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
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
    return res.status(200).json({ documents });
  } catch (err) {
    console.error('getDocumentsByInternId error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
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
    return res.status(200).json({ message: `Document ${status}`, document });
  } catch (err) {
    console.error('verifyDocument error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
