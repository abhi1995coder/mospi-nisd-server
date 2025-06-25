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
      as:'s_to_o',
      onDelete:'CASCADE'
    })
    }
  }
  SubOffice.init({
        id:{
          type:DataTypes.UUID,
          primaryKey:true,
          defaultValue:DataTypes.UUIDV4
        },
        office_id:{
          type:DataTypes.UUID,
          allowNull:false,
          references:{
            model:'offices',
            key:'id'
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
        is_active:{
          type:DataTypes.BOOLEAN,
          defaultValue:true,
          allowNull:true
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