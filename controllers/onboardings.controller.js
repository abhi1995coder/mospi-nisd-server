// controllers/onboarding.controller.js

const fs = require('fs');
const path = require('path');
const { OnboardingDetail, Application } = require('../models');




exports.getOnboarding = async (req, res) => {
  const { applicationId } = req.params;
  const onboarding = await OnboardingDetail.findOne({
    where: { application_id: applicationId }
  });
  if (!onboarding) {
    return res.status(404).json({ message: 'Onboarding record not found' });
  }
  return res.json({ onboarding });
};


exports.createOnboarding = async (req, res) => {
  const { applicationId } = req.params;
  // ensure the application exists
  const app = await Application.findByPk(applicationId);
  if (!app) {
    return res.status(404).json({ message: 'Application not found' });
  }
  // avoid duplicate
  let onboarding = await OnboardingDetail.findOne({
    where: { application_id: applicationId }
  });
  if (onboarding) {
    return res
      .status(200)
      .json({ message: 'Onboarding already exists', onboarding });
  }
  // create new
  onboarding = await OnboardingDetail.create({ application_id: applicationId });
  return res.status(201).json({ message: 'Onboarding created', onboarding });
};


/**
 * GET the offer letter URL
 */
exports.getOfferLetter = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const onboarding = await OnboardingDetail.findOne({
      where: { application_id: applicationId }
    });
    if (!onboarding || !onboarding.offer_letter_url) {
      return res.status(404).json({ message: 'Offer letter not available' });
    }
    return res.json({ offer_letter_url: onboarding.offer_letter_url });
  } catch (err) {
    console.error('getOfferLetter error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH accept or reject the offer
 */
exports.respondOffer = async (req, res) => {
  const { applicationId } = req.params;
  const { accepted, reason } = req.body;
  try {
    const onboarding = await OnboardingDetail.findOne({
      where: { application_id: applicationId }
    });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding record not found' });
    }

    await onboarding.update({
      offer_accepted: accepted,
      rejection_reason: accepted ? null : reason,
      offer_response_date: new Date()
    });

    return res.json({
      message: `Offer ${accepted ? 'accepted' : 'rejected'}`,
      onboarding
    });
  } catch (err) {
    console.error('respondOffer error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST upload the signed joining report
 */
exports.uploadJoiningReport = async (req, res) => {
  const { applicationId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const onboarding = await OnboardingDetail.findOne({
      where: { application_id: applicationId }
    });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding record not found' });
    }

    // save to disk (or your storage of choice)
    const filename = `joining_${Date.now()}_${file.originalname}`;
    const uploadPath = path.join(__dirname, '..', 'uploads', filename);
    fs.writeFileSync(uploadPath, file.buffer);

    await onboarding.update({ joining_report_url: `/uploads/${filename}` });
    return res.status(201).json({
      message: 'Joining report uploaded',
      joining_report_url: onboarding.joining_report_url
    });
  } catch (err) {
    console.error('uploadJoiningReport error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH select the date of joining
 */
exports.selectJoinDate = async (req, res) => {
  const { applicationId } = req.params;
  const { join_date } = req.body;
  try {
    const onboarding = await OnboardingDetail.findOne({
      where: { application_id: applicationId }
    });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding record not found' });
    }

    await onboarding.update({ join_date });
    return res.json({ message: 'Join date set', join_date });
  } catch (err) {
    console.error('selectJoinDate error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH upload bank details and passbook
 */
exports.uploadBankDetails = async (req, res) => {
  const { applicationId } = req.params;
  const { bank_name, bank_account_no, ifsc_code } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No passbook uploaded' });
  }

  try {
    const onboarding = await OnboardingDetail.findOne({
      where: { application_id: applicationId }
    });
    if (!onboarding) {
      return res.status(404).json({ message: 'Onboarding record not found' });
    }

    // save to disk
    const filename = `passbook_${Date.now()}_${file.originalname}`;
    const uploadPath = path.join(__dirname, '..', 'uploads', filename);
    fs.writeFileSync(uploadPath, file.buffer);

    await onboarding.update({
      bank_name,
      bank_account_no,
      ifsc_code,
      passbook_url: `/uploads/${filename}`
    });
    return res.json({
      message: 'Bank details saved',
      passbook_url: onboarding.passbook_url
    });
  } catch (err) {
    console.error('uploadBankDetails error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
