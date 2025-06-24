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
    queryInterface.createTable('attendences',{
       id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      intern_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'interns', key: 'id' },
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      check_in: {
        type: Sequelize.DATE,
        allowNull: true
      },
      check_out: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
      
    })
    // create a unique constraint so an intern has only one record per date
    await queryInterface.addConstraint('attendences', {
      fields: ['intern_id','date'],
      type: 'unique',
      name: 'attendance_unique_per_day'
    });
  },
  
  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    queryInterface.dropTable('attendences')
  }
};
