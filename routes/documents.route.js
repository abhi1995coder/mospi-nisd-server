const express = require('express');
const router = express.Router();
const { uploadDocument, getDocumentsByIntern } = require('../controllers/documents.controller');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const multer = require('multer');


const storage = multer.memoryStorage(); 
const upload = multer({ storage });


router.post(
  '/',
  authMiddleware,
  roleCheck('intern'),
  upload.single('file'), 
  uploadDocument
);


router.get(
  '/',
  authMiddleware,
  roleCheck('intern'),
  getDocumentsByIntern
);

module.exports = router;
