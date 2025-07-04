'use strict';
/**
 * Sequelize model definition for the Offices table
 */
module.exports = (sequelize, DataTypes) => {
  const Office = sequelize.define('Office', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    office_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    office_type: {
      type: DataTypes.ENUM('group_a', 'group_b'),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
    
    group_b_admin_id: {
      type: DataTypes.UUID,
      allowNull: true,
      unique:true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'offices',
    timestamps: true
  });

  Office.associate = models => {
    // link a Group-B office to its assigned admin
    Office.belongsTo(models.User, {
      foreignKey: 'group_b_admin_id',
      as: 'groupBAdmin'
    });

    // Sub-offices under this office
    Office.hasMany(models.SubOffice, {
      foreignKey: 'office_id',
      as: 'subOffices'
    });

    // Vacancies defined for this office in a given cycle
    Office.hasMany(models.Vacancy, {
      foreignKey: 'office_id',
      as: 'vacancies'
    });

   
    
  };

  return Office;
};
