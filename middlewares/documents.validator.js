const multer = require('multer');

const allowedMimeTypes = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/jpg'],
};

const documentTypeMap = {
  aadhar_card: 'image',
  photo: 'image',
  marksheet_12: 'pdf',
  marksheet_grad: 'pdf',
  marksheet_pg: 'pdf',
  noc: 'pdf',
  conversion_proof: 'pdf',
  research_enrollment: 'pdf',
};

const fileFilter = (req, file, cb) => {
  const { document_type } = req.body;

  if (!document_type || !documentTypeMap[document_type]) {
    return cb(new Error('Invalid or missing document_type'), false);
  }

  const expectedType = documentTypeMap[document_type];
  const validTypes = allowedMimeTypes[expectedType];

  if (!validTypes.includes(file.mimetype)) {
    return cb(new Error(`Only ${expectedType.toUpperCase()} files allowed for ${document_type}`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = {
  uploadSingleDocument: upload.single('file'),
};
