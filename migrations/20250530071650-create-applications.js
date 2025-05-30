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
    await queryInterface.createTable('applications',{
      application_id:{
        allowNull:false,
        primaryKey:true,
        type:Sequelize.UUID,
        defaultValue:Sequelize.literal('gen_random_uuid()')
      },
      user_id:{
        allowNull:false,
        type:Sequelize.UUID,
        references:{
          model:'users',
          key:'user_id'
        },
        onDelete:'CASCADE'
      },
      department:{
        type:Sequelize.STRING,
        allowNull:false
      },
      duration_weeks:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      preferred_topics:{
        type:Sequelize.STRING,
        allowNull:true
      },
      status:{
        type:Sequelize.STRING,
        defaultValue:'pending',
        allowNull:false
      },
      review_comment:{
        type:Sequelize.TEXT,
        allowNull:true
      },
      submittedAt:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.fn('NOW')
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
    await queryInterface.dropTable('applications');
  }
};
