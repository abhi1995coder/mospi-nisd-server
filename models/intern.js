'use strict';
const {
  Model,
  
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Intern extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Intern.belongsTo(models.User,{
      foreignKey:'user_id',
      as:'in_to_u',
      onDelete:'CASCADE'
      })
     Intern.hasOne(models.Qualification,{
       foreignKey:'intern_id',
       as:'in_to_q'
     })
     Intern.hasMany(models.Document,{
      foreignKey:'intern_id',
      as:'in_to_d'
     })
     Intern.hasOne(models.Application,{
      foreignKey:'intern_id',
      as:'in_to_a'
     })
    
    }
  }
  Intern.init({
        id:{
          type:DataTypes.UUID,
          allowNull:false,
          defaultValue:DataTypes.UUIDV4,
          primaryKey:true
       },
       user_id:{
          type:DataTypes.UUID,
          allowNull:false,
          
       },
       full_name:{
           type:DataTypes.STRING,
           allowNull:false

       },
       father_name:{
           type:DataTypes.STRING,
           
       },
       aadhar_number:{
          type:DataTypes.STRING,
          allowNull:false,
          unique:true
           
       },
       date_of_birth:{
           type:DataTypes.DATEONLY
       },
       contact_number:{
          type:DataTypes.STRING
       },
       alt_contact_number:{
           type:DataTypes.STRING
       },
       address:{
          type:DataTypes.STRING
       },
       nationality:{
           type:DataTypes.STRING
       },
       university:{
          type:DataTypes.STRING
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
    modelName: 'Intern',
    tableName:'interns'
  });
  
  return Intern;
};