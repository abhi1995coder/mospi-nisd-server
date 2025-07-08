// models/application.js
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      // An application belongs to one user
      Application.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // An application belongs to one internship cycle
      Application.belongsTo(models.InternshipCycle, {
        foreignKey: 'cycle_id',
        as: 'cycle'
      });
      // An application has many preferences
      Application.hasMany(models.Preference, {
        foreignKey: 'application_id',
        as: 'preferences'
      });
    }
  }

  Application.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    cycle_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'internship_cycles', key: 'id' },
      onDelete: 'RESTRICT'
    },
    group_type: {
      type: DataTypes.ENUM('group_a', 'group_b'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'screening', 'selected', 'rejected'),
      defaultValue: 'draft',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    underscored: true,
    timestamps: true
  });

  return Application;
};