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
    await queryInterface.createTable('attendences',{
        attendence_id:{
          primaryKey:true,
          type:Sequelize.UUID,
          allowNull:false,
          defaultValue:Sequelize.literal('gen_random_uuid()')
        },
        assignment_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'assignments',
            key:'assignment_id'
          },
          onDelete:'CASCADE'
        },
        date:{
          type:Sequelize.DATE,
          allowNull:false
        },
        check_in:{
          type:Sequelize.TIME
        },
        check_out:{
          type:Sequelize.TIME
        },
        is_present:{
          type:Sequelize.BOOLEAN,
          defaultValue:false
        },
        createdAt:{
          type:Sequelize.DATE,
          defaultValue:Sequelize.fn('NOW'),
          allowNull:false
        },
        updatedAt:{
          type:Sequelize.DATE,
          defaultValue:Sequelize.fn('NOW'),
          allowNull:false
        },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('attendences')
  }
};
