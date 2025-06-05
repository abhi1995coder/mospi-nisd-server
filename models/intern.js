'use strict';
const {
  Model,
  Sequelize
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
    }
  }
  Intern.init({
    intern_id:{
          type:DataTypes.UUID,
          allowNull:false,
          defaultValue:DataTypes.UUIDV4,
          primaryKey:true
       },
       user_id:{
          type:Sequelize.UUID,
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
           type:DataTypes.DATE
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
           defaultValue:Sequelize.fn('NOW')
       },
       updatedAt:{
           type:DataTypes.DATE,
           allowNull:false,
           defaultValue:Sequelize.fn('NOW')
       }
  }, {
    sequelize,
    modelName: 'Intern',
    tableName:'interns'
  });
  Intern.associate=(models)=>{
    Intern.belongsTo(models.User,{
      foreignKey:'user_id',
      as:'user',
      onDelete:'CASCADE'
    })
  }
  return Intern;
};