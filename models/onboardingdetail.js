'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OnboardingDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       OnboardingDetail.belongsTo(models.Application, {
        foreignKey: 'application_id',
        as: 'ob_to_a',
        onDelete: 'CASCADE'
      });
      OnboardingDetail.belongsTo(models.Internship, {
        foreignKey: 'selected_internship_id',
        as: 'ob_to_i',
        onDelete: 'SET NULL'
      });
    }
  }
  OnboardingDetail.init({
    id:
    { type: DataTypes.UUID, 
        primaryKey: true, 
        defaultValue: DataTypes.UUIDV4 
    },
    application_id: 
    { type: DataTypes.UUID, 
      allowNull: false 
    },
    selected_internship_id: DataTypes.UUID,
    offer_letter_url: DataTypes.STRING,
    offer_accepted: DataTypes.BOOLEAN,
    offer_response_date: DataTypes.DATE,
    join_date: DataTypes.DATEONLY,
    joining_report_url: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    bank_account_no: DataTypes.STRING,
    ifsc_code: DataTypes.STRING,
    passbook_url: DataTypes.STRING
  }, 
  {
    sequelize,
    modelName: 'OnboardingDetail',
    tableName:'onboarding_details'
  });
  return OnboardingDetail;
};