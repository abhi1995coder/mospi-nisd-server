'use strict';
module.exports = (sequelize, DataTypes) => {
  const InternshipCycle = sequelize.define('InternshipCycle', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title:{
      type:DataTypes.STRING,
      allowNull:false
    },
    start_date: {
      type:DataTypes.DATEONLY,
      allowNull:false
    },
    end_date: {
      type:DataTypes.DATEONLY,
      allowNull:false
    },
    is_Active:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:false
    },
    createdAt:{
      type:DataTypes.DATE,
      defaultValue:DataTypes.NOW,
      allowNull:false
    },
    updatedAt:{
          type:DataTypes.DATE,
          allowNull:false,
          defaultValue:DataTypes.NOW
    }
  }, {
    tableName: 'internship_cycles'
  });

  InternshipCycle.associate = models => {
    InternshipCycle.hasMany(models.Vacancy, {
      foreignKey: 'cycle_id',
      as: 'vacancies'
    });
  };

  return InternshipCycle;
};