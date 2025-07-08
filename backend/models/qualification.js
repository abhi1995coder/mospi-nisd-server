'use strict';
const {
  Model,
  
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Qualification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Qualification.belongsTo(models.Intern,{
      foreignKey:'intern_id',
      as:'q_to_in',
      onDelete:'CASCADE'
    })
    }
  }
  Qualification.init({
       id:{
         primaryKey:true,
         type:DataTypes.UUID,
         allowNull:false,
         defaultValue:DataTypes.UUIDV4,

      },
      intern_id:{
        type:DataTypes.UUID,
        allowNull:false,
      },
      highest_academic_level:{
        type:DataTypes.STRING,
        allowNull:false

      },
      programme_name:{
        type:DataTypes.STRING,
        allowNull:false

      },
      discipline:{
        type:DataTypes.STRING,
        allowNull:false
      },
      year_of_study:{
         type:DataTypes.STRING
      },
      has_statistics_math_paper:{
         type:DataTypes.BOOLEAN,
         allowNull:false
      },
      graduation_percentage:{
         type:DataTypes.DECIMAL(5,2)
      },
      post_graduation_percentage:{
          type:DataTypes.DECIMAL(5,2)
      },
      twelth_percentage:{
         type:DataTypes.DECIMAL(5,2)
      },
      cgpa_conversion_factor:{
          type:DataTypes.DECIMAL(3,2)
      },
      total_marks:{
        type:DataTypes.INTEGER
      },
      obtained_marks:{
        type:DataTypes.INTEGER
      },
      has_completed_second_year:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
      },
      research_area:{
         type:DataTypes.STRING
      },
      completion_date:{
        type:DataTypes.DATEONLY
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
    modelName: 'Qualification',
    tableName:'qualifications',
  });
  
  return Qualification;
};