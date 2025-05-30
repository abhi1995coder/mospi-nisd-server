'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applications.init({
    application_id:{
        allowNull:false,
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4
      },
      user_id:{
        allowNull:false,
        type:DataTypes.UUID
      },
      department:{
        type:DataTypes.STRING,
        allowNull:false
      },
      duration_weeks:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      preferred_topics:{
        type:DataTypes.STRING,
        allowNull:true
      },
      status:{
        type:DataTypes.STRING,
        defaultValue:'pending',
        allowNull:false
      },
      review_comment:{
        type:DataTypes.TEXT,
        allowNull:true
      },
      submittedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:Sequelize.fn('NOW')
      },
      updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:Sequelize.fn('NOW')
      }
  }, {
    sequelize,
    modelName: 'applications',
  });
  applications.associate=(models)=>{
    applications.belongsTo(models.users,{
      foreignKey:'user_id',
      as:'user'
    })
  }
  return applications;
};