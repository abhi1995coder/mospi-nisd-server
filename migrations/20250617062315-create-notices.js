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
    queryInterface.createTable('notices',{
      id:{
        type:Sequelize.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:Sequelize.UUIDV4
      },
      title:{
        type:Sequelize.STRING,
        allowNull:false
      },
      content:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      is_active:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
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
    queryInterface.dropTable('notices')
  }
};
