
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define('Vacancy', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    cycle_id: {
        type:DataTypes.UUID
    },
    office_id:{
      type:DataTypes.UUID,
    }, 
    sub_office_id:{
        type:DataTypes.UUID,
    }, 
    available_slots:{
        type:DataTypes.INTEGER,
    }, 
    duration:{
        type:DataTypes.INTEGER
    },
    createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },
    updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },
  }, {
    tableName: 'vacancies'
  });

  Vacancy.associate = models => {
    Vacancy.belongsTo(models.InternshipCycle, {
      foreignKey: 'cycle_id',
      as: 'cycle'
    });
    Vacancy.belongsTo(models.Office, {
      foreignKey: 'office_id',
      as: 'office'
    });
    Vacancy.belongsTo(models.SubOffice, {
      foreignKey: 'sub_office_id',
      as: 'subOffice'
    });
  };

  return Vacancy;
};