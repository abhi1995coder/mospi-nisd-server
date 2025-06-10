'use strict';
const {
  Model,
  
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id:{
      allowedNull:false,
      primaryKey:true,
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
    },
    user_name:{
      type:DataTypes.STRING,
      allowNull:true,
    },
    email:{
      type:DataTypes.STRING,
      unique:true,
      allowNull:false,
    },
    passwordHash:{
      type:DataTypes.STRING,
    },
    role:{
      allowNull:false,
      type:DataTypes.STRING,
      defaultValue:'intern',
    },
    otpCode:{
      type:DataTypes.STRING
    },
    otpExpiresAt:{
      type:DataTypes.DATE
    },
    isVerified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
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
    sequelize,
    modelName:'User',
    tableName:'users'
  });
  return User;
};