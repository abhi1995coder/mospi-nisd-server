'use strict';
const {
  Model,
  Sequelize
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
    }
  }
  Office.init({
     office_id:{
          type:DataTypes.UUID,
          primaryKey:true,
          allowNull:false,
          defaultValue:DataTypes.UUIDV4

        },
        office_name:{
          type:DataTypes.STRING,
          allowNull:false
        },
        office_type:{
          type:DataTypes.STRING,
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
        
        isActive:{
          type:DataTypes.BOOLEAN,
          defaultValue:true
        },
        createdAt:{
           type:DataTypes.DATE,
           allowNull:false,
           defaultValue:Sequelize.fn('NOW')
        },
        updatedAt:{
           type:DataTypes.DATE,
           defaultValue:Sequelize.fn('NOW'),
           allowNull:false
        }
  }, {
    sequelize,
    modelName: 'Office',
    tableName:'offices'
  });
  return Office;
};