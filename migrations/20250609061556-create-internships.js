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
    queryInterface.createTable('internships',{
      internship_id:{
        type:Sequelize.UUID,
        primaryKey:true,
        defaultValue:Sequelize.UUIDV4
      },
      office_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'offices',
          key:'office_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      title:{
        type:Sequelize.STRING,
        allowNull:false
      },
      duration_months:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      start_date:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      end_date:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      available_slots:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      status:{
        type:Sequelize.ENUM('draft','active','closed'),
        allowNull:false,
        defaultValue:'draft'
      },
      createdAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultvalue:Sequelize.fn('NOW')
      },
      updatedAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.fn('NOW')
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
    queryInterface.dropTable('internships');
  }
};
