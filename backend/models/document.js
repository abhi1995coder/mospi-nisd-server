'use strict';
const {
  Model,
  
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Document.belongsTo(models.Intern,{
      foreignKey:'intern_id',
      as:'d_to_in',
      onDelete:'CASCADE'
    })
    }
  }
  Document.init({
      id:{
         type:DataTypes.UUID,
         primaryKey:true,
         allowNull:false,
         defaultValue:DataTypes.UUIDV4
      },
      intern_id:{
        type:DataTypes.UUID,
        allowNull:false,
       
      },
      document_type:{
        type:DataTypes.STRING,
        allowNull:false
      },
      document_url:{
         type:DataTypes.STRING,
         allowNull:false
      },
      verification_status:{
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        allowNull:false,
        defaultValue:'pending'
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
    modelName: 'Document',
    tableName:'documents'
  });
  
  return Document;
};