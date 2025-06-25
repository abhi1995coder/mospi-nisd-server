'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notice.init({
     id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
      },
      title:{
        type:DataTypes.STRING,
        allowNull:false
      },
      content:{
        type:DataTypes.TEXT,
        allowNull:false
      },
      is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
      },
      updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
      }
  }, {
    sequelize,
    modelName: 'Notice',
    tableName:'notices'
  });
  return Notice;
};