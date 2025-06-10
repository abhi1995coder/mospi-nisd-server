'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubOffice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubOffice.belongsTo(models.Office,{
      foreignKey:'office_id',
      as:'office',
      onDelete:'CASCADE'
    })
    }
  }
  SubOffice.init({
     sub_office_id:{
          type:DataTypes.UUID,
          primaryKey:true,
          defaultValue:DataTypes.UUIDV4
        },
        office_id:{
          type:DataTypes.UUID,
          allowNull:false,
          references:{
            model:'offices',
            key:'office_id'
          },
          onDelete:'CASCADE'
        },
        name:{
          type:DataTypes.STRING,
          allowNull:false
        },
        address:{
          type:DataTypes.TEXT,
          allowNull:true
        },
        isActive:{
          type:DataTypes.BOOLEAN,
          defaultValue:true
        },
        createdAt:{
          type:DataTypes.DATE,
          defaultValue:DataTypes.NOW,
          allowNull:false
        },
        updatedAt:{
          type:DataTypes.DATE,
          defaultValue:DataTypes.NOW,
          allowNull:false
        }
  }, {
    sequelize,
    modelName: 'SubOffice',
    tableName:'sub_offices'
  });
  return SubOffice;
};