'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    id:{
      allowedNull:false,
      autoIncrement:true,
      primaryKey:true,
      type:Sequelize.INTEGER,
    },
    email:{
      type:Sequelize.STRING,
      unique:true,
      allowNull:false,
    },
    paaswordHash:{
      type:Sequelize.STRING,
    },
    role:{
      allowNull:false,
      type:Sequelize.STRING,
      defaultValue:'intern',
    },
    otpCode:{
      type:Sequelize.STRING
    },
    otpExpiresAt:{
      type:Sequelize.DATE
    },
    isVerified:{
      type:Sequelize.BOOLEAN,
      defaultValue:false,
    },
    createdAt:{
      type:Sequelize.DATE,
      allowNull:false,
      defaultValue:Sequelize.fn('NOW'),
    },
    updatedAt:{
      type:Sequelize.DATE,
      allowNull:false,
      defaultValue:Sequelize.fn('NOW'),
    },
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};