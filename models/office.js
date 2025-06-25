'use strict';
const {
  Model,
  
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Office extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Office.hasMany(models.SubOffice,{
        foreignKey:'office_id',
        as:'o_to_s'
      })
      Office.hasMany(models.Internship,{
        foreignKey:'office_id',
        as:'o_to_i'
      })
      Office.belongsTo(models.User,{
        foreignKey:'user_id',
        as:'o_to_u'
      })
    }
  }
  Office.init({
          id:{
          type:DataTypes.UUID,
          primaryKey:true,
          allowNull:false,
          defaultValue:DataTypes.UUIDV4

        },
        user_id:{
         type:DataTypes.UUID,
         allowNull:true
        },
        office_name:{
          type:DataTypes.STRING,
          allowNull:false
        },
        office_type:{
          type:DataTypes.ENUM('group_a','group_b'),
          allowNull:false
        },
        city:{
          type:DataTypes.STRING,
          allowNull:false
        },
        state:{
          type:DataTypes.STRING,
          allowNull:false
        },
        address:{
           type:DataTypes.TEXT,
           allowNull:false
        },
        contact_person:{
          type:DataTypes.STRING,
          allowNull:false
        },
        contact_email:{
           type:DataTypes.STRING,
           allowNull:false
        },
        contact_phone:{
          type:DataTypes.STRING,
          allowNull:false
        },
        
        is_active:{
          type:DataTypes.BOOLEAN,
          defaultValue:true,
          allowNull:false
        },
        createdAt:{
           type:DataTypes.DATE,
           allowNull:false,
           defaultValue:DataTypes.NOW
        },
        updatedAt:{
           type:DataTypes.DATE,
           defaultValue:DataTypes.NOW,
           allowNull:false
        }
  }, {
    sequelize,
    modelName: 'Office',
    tableName:'offices'
  });
  return Office;
};