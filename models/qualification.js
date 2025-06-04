'use strict';
const {
  Model,
  Sequelize
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
    }
  }
  Qualification.init({
    qualification_id:{
         primaryKey:true,
         type:DataTypes.UUID,
         allowNull:false,
         defaultValue:DataTypes.UUIDV4,

      },
      intern_id:{
        type:Sequelize.UUID,
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
         type:DataTypes.INTEGER
      },
      has_statistics_math_paper:{
         type:DataTypes.BOOLEAN,
         allowNull:false
      },
      graduation_percentage:{
         type:DataTypes.DECIMAL(5,2)
      },
      post_graduation_percentage:{
          type:Sequelize.DECIMAL(5,2)
      },
      twelth_percentage:{
         type:DataTypes.DECIMAL(5,2)
      },
      cgpa_conversion_factor:{
          type:DataTypes.DECIMAL(3,2)
      },
      conversion_proof_url:{
         type:DataTypes.STRING
      },
      research_area:{
         type:DataTypes.STRING
      },
      completion_date:{
        type:DataTypes.DATE
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
    modelName: 'Qualification',
    tableName:'qualifications',
  });
  Qualification.associate=(models)=>{
    Qualification.belongsTo(models.Intern,{
      foreignKey:'intern_id',
      as:'intern',
      onDelete:'CASCADE'
    })
  }
  return Qualification;
};