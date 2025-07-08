// models/application.js
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Preference extends Model {
    static associate(models) {
      
    }
  }

 Preference.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'applications', key: 'id' },
    onDelete: 'CASCADE',
  },
  office_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'offices', key: 'id' },
    onDelete: 'SET NULL',
  },
  sub_office_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'sub_offices', key: 'id' },
    onDelete: 'SET NULL',
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
}, {
  sequelize,
  modelName: 'Preference',
  tableName: 'preferences',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['application_id', 'office_id', 'sub_office_id'], unique: true }
  ],
});
return Preference
};