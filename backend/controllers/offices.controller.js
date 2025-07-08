const { Office, User } = require('../models');

exports.createOffice = async (req, res) => {
  const { office_type, group_b_admin_id, ...rest } = req.body;
  const role = req.user.role;

  // Only super & Group-A Admin can create offices
  if (!['super_admin','group_a_admin'].includes(role)) {
    return res.status(403).json({ message: 'Not allowed to create offices', status:'403' });
  }

  // If it's a B-office, must link a real Group-B Admin
  let payload = { office_type, ...rest };
  if (office_type === 'group_b') {
    if (!group_b_admin_id) {
      return res
        .status(400)
        .json({ message: 'Must specify group_b_admin_id for Group-B office', status:'400' });
    }
    const gb = await User.findByPk(group_b_admin_id);
    if (!gb || gb.role !== 'group_b_admin') {
      return res
        .status(400)
        .json({ message: 'Invalid Group-B Admin ID', status:'400' });
    }
    const existing_gb=await Office.findOne({where:{group_b_admin_id}})
    if(existing_gb){
      return res.status(403).json({message:'Admin already exists for a Group B office',status:'403'})
    }
    payload.group_b_admin_id = group_b_admin_id;
  }

  try {
    const office = await Office.create(payload);
    return res
      .status(201)
      .json({ message: 'Office created', office, status:'201' });
  } catch (err) {
    console.error('createOffice error:', err);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message, status:'500' });
  }
};

// controllers/offices.controller.js
exports.getAllOffices = async (req, res) => {
  try {
    const { office_type } = req.query;
    const where = {};

    // 1) filter by office_type if supplied
    if (office_type) {
      if (!['group_a','group_b'].includes(office_type)) {
        return res
          .status(400)
          .json({ message: 'office_type must be "group_a" or "group_b"' });
      }
      where.office_type = office_type;
    }

    // 2) scope to Group-B Admin’s own office if they’re the caller
    if (req.user.role === 'group_b_admin') {
      where.group_b_admin_id = req.user.id;
    }

    // 3) fetch, including the linked Group-B Admin record
    const offices = await Office.findAll({
      where,
      include: [
        {
          model: User,
          as: 'groupBAdmin',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json({ offices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found', status:'404' });
    }

    // Group-B Admin can only fetch their own B-office
    if (req.user.role === 'group_b_admin' &&
        office.group_b_admin_id !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden', status:'403' });
    }

    // super_admin & group_a_admin have free access here
    return res.status(200).json({ office, status:'200' });
  } catch (err) {
    console.error('getOfficeById error:', err);
    return res
      .status(500)
      .json({ message: 'Server error', status:'500' });
  }
};

exports.updateOffice = async (req, res) => {
  const { office_type, group_b_admin_id, ...rest } = req.body;
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found', status:'404' });
    }

    // Only super & Group-A Admin can update
    if (!['super_admin','group_a_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden', status:'403' });
    }

    // If changing type to B, must supply valid group_b_admin_id
    if (office_type === 'group_b') {
      if (!group_b_admin_id) {
        return res
          .status(400)
          .json({ message: 'Must specify group_b_admin_id for Group-B office', status:'400' });
      }
      const gb = await User.findByPk(group_b_admin_id);
      if (!gb || gb.role !== 'group_b_admin') {
        return res
          .status(400)
          .json({ message: 'Invalid Group-B Admin ID', status:'400' });
      }
      const existing_gb=await Office.findOne({where:{group_b_admin_id}})
       if(existing_gb){
          return res.status(403).json({message:'Admin already exists for a Group B office',status:'403'})
       }
    }

    await office.update({ office_type, group_b_admin_id, ...rest });
    return res
      .status(200)
      .json({ message: 'Office updated', office, status:'200' });
  } catch (err) {
    console.error('updateOffice error:', err);
    return res
      .status(500)
      .json({ message: 'Server error', status:'500' });
  }
};

exports.disableOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found', status:'404' });
    }

    // Only super & Group-A Admin can disable
    if (!['super_admin','group_a_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden', status:'403' });
    }

    await office.update({ is_active: false });
    return res
      .status(200)
      .json({ message: 'Office disabled', status:'200' });
  } catch (err) {
    console.error('disableOffice error:', err);
    return res
      .status(500)
      .json({ message: 'Server error', status:'500' });
  }
};