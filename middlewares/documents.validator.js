// middlewares/documents.validator.js
const multer = require('multer');
const FileType = require('file-type');

const allowedMimeTypes = {
  pdf: ['application/pdf'],
  image: ['image/jpeg','image/png'],
};

const documentTypeMap = {
  aadhar_card: 'image',
  photo:       'image',
  marksheet_12:'pdf',
  marksheet_grad:'pdf',
  marksheet_pg: 'pdf',
  noc:          'pdf',
  conversion_proof:'pdf',
  research_enrollment:'pdf',
};

const storage = multer.memoryStorage();

async function fileFilter (req, file, cb) {
  const docType = req.body.document_type;
  const expectedCategory = documentTypeMap[docType];
  if (!expectedCategory) {
    return cb(new Error('Invalid or missing document_type'), false);
  }

  // 1) Quick check against declared mimetype
  if (!allowedMimeTypes[expectedCategory].includes(file.mimetype)) {
    return cb(new Error(`Only ${expectedCategory.toUpperCase()} allowed`), false);
  }

  // 2) Sniff the buffer’s magic bytes
  const header = file.buffer.slice(0, FileType.minimumBytes);
  const ft = await FileType.fromBuffer(header);
  if (!ft || !allowedMimeTypes[expectedCategory].includes(ft.mime)) {
    return cb(new Error('File content does not match expected type'), false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

module.exports = {
  uploadSingleDocument: upload.single('file'),
};
