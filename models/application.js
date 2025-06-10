'use strict';
const {
  Model,

} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Application.belongsTo(models.Intern,{
      foreignKey:'intern_id',
      as:'intern',
      onDelete:'CASCADE'
       })
    }
  }
  Application.init({
    application_id:{
          type:DataTypes.UUID,
          allowNull:false,
          primaryKey:true,
          defaultValue:DataTypes.UUIDV4
         },
         intern_id:{
          type:DataTypes.UUID,
          allowNull:false,
          
         },
         group_type:{
            type: DataTypes.ENUM('A', 'B'),
            allowNull:false
         },
         preferred_offices:{
           type:DataTypes.JSONB
         },
         sub_office_preferences:{
            type:DataTypes.JSONB
         },
         application_status:{
           type: DataTypes.ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected'),
           defaultValue:'draft'
         },
         submission_date:{
           type:DataTypes.DATE
         },
         review_date:{
           type:DataTypes.DATE
         },
         rejection_reason:{
             type:DataTypes.TEXT
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
    sequelize,
    modelName: 'Application',
    tableName:'applications'
  });
  
  return Application;
};