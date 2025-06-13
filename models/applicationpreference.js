'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApplicationPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApplicationPreference.belongsTo(models.Application,{
      foreignKey:'application_id',
      as:'application',
      onDelete:'CASCADE'
      })
      ApplicationPreference.belongsTo(models.Internship,{
      foreignKey:'internship_id',
      as:'internship',
      onDelete:'CASCADE'
    })
    ApplicationPreference.belongsTo(models.SubOffice,{
      foreignKey:'sub_office_id',
      as:'sub_office',
      onDelete:'CASCADE'
    })
    }
  }
  ApplicationPreference.init({
    
     ap_id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
      },
      application_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
          model:'applications',
          key:'application_id'
        },
        onDelete:'CASCADE'
      },
      internship_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
          model:'internships',
          key:'internship_id'
        },
        onDelete:'CASCADE'
      },
      
      preferences:{
        type:DataTypes.INTEGER,
        allowNull:false,

      },
      createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,

      },
      updatedAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
      }
  }, {
    sequelize,
    modelName: 'ApplicationPreference',
    tableName:'application_preferences'
  });
  return ApplicationPreference;
};