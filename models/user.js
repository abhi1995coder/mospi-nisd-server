'use strict';
const {
  Model,

} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {


    }
  }
  User.init({
    id:{
      allowedNull:false,
      primaryKey:true,
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
    },
    name:{
      type:DataTypes.STRING,

    },
    email:{
      type:DataTypes.STRING,
      unique:true,
      allowNull:false,
    },
    password_hash:{
      type:DataTypes.STRING,
      allowedNull:false
    },
    role:{
      allowNull:false,
      type:DataTypes.STRING,
      defaultValue:'intern',
    },
    otp_code:{
      type:DataTypes.STRING
    },
    otp_expires_at:{
      type:DataTypes.DATE
    },
    is_verified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
      allowedNull:false
    },
    is_active:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowedNull:false
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