const { Document, Intern } = require('../models');


exports.uploadDocument = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { document_type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const intern = await Intern.findOne({ where: { user_id } });
    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const file_url = `uploads/${Date.now()}_${file.originalname}`; 

    

    const document = await Document.create({
      intern_id: intern.intern_id,
      document_type,
      document_url:file_url,
      status: 'pending',
    });

    res.status(201).json({ message: 'Document uploaded', document });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getDocumentsByIntern = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const intern = await Intern.findOne({ where: { user_id } });

    if (!intern) return res.status(404).json({ message: 'Intern not found' });

    const documents = await Document.findAll({
      where: { intern_id: intern.intern_id },
    });

    res.status(200).json({ documents });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
