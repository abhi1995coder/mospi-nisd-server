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
    queryInterface.createTable('application_preferences',{
      id:{
        type:Sequelize.UUID,
        primaryKey:true,
        defaultValue:Sequelize.UUIDV4
      },
      application_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'applications',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      internship_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'internships',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      
      preferences:{
        type:Sequelize.INTEGER,
        allowNull:false,

      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW,

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
    queryInterface.dropTable('application_preferences')
  }
};
