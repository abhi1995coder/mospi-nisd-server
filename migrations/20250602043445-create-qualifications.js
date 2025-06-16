'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('qualifications',{
         id:{
         primaryKey:true,
         type:Sequelize.UUID,
         allowNull:false,
         defaultValue:Sequelize.UUIDV4,

      },
      intern_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'interns',
          key:'id'
        },
        onDelete:'CASCADE'

      },
      highest_academic_level:{
        type:Sequelize.STRING,
        allowNull:false

      },
      programme_name:{
        type:Sequelize.STRING,
        allowNull:false

      },
      discipline:{
        type:Sequelize.STRING,
        allowNull:false
      },
      year_of_study:{
         type:Sequelize.INTEGER
      },
      has_statistics_math_paper:{
         type:Sequelize.BOOLEAN,
         allowNull:false
      },
      graduation_percentage:{
         type:Sequelize.DECIMAL(5,2)
      },
      post_graduation_percentage:{
          type:Sequelize.DECIMAL(5,2)
      },
      twelth_percentage:{
         type:Sequelize.DECIMAL(5,2)
      },
      cgpa_conversion_factor:{
          type:Sequelize.DECIMAL(3,2)
      },
      conversion_proof_url:{
         type:Sequelize.STRING
      },
      research_area:{
         type:Sequelize.STRING
      },
      completion_date:{
        type:Sequelize.DATEONLY
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
      }


    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('qualifications')
  }

};
