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
       as:'a_to_in',
      onDelete:'CASCADE'
      })
      Application.hasMany(models.ApplicationPreference,{
        foreignKey:'application_id',
        as:'a_to_ap'
      })
    }
  }
  Application.init({
        id:{
          type:DataTypes.UUID,
          allowNull:false,
          primaryKey:true,
          defaultValue:DataTypes.UUIDV4
         },
         intern_id:{
          type:DataTypes.UUID,
          allowNull:false,
          references:{
            model:'interns',
            key:'id'
          },
          onDelete:'CASCADE'
         },
         group_type:{
            type: DataTypes.ENUM('A', 'B'),
            allowNull:false
         },
         application_status:{
           type: DataTypes.ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected','incomplete'),
           defaultValue:'draft'
         },
         submission_date:{
           type:DataTypes.DATEONLY
         },
         review_date:{
           type:DataTypes.DATEONLY
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