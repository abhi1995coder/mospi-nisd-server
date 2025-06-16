'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Internship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Internship.belongsTo(models.Office,{
        foreignKey:'office_id',
        as:'i_to_o',
        onDelete:'CASCADE'
       })
       Internship.hasMany(models.ApplicationPreference,{
        foreignKey:'internship_id',
        as:'i_to_ap'
       })
    }
  }
  Internship.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    office_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'offices',
        key: 'office_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    group_type:{
     type:DataTypes.ENUM('A','B'),
     allowNull:false
    },
    duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    available_slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'closed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    createdAt:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
   
  }, {
    sequelize,
    modelName: 'Internship',
    tableName: 'internships',
  });
    
  return Internship;
};