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
    await queryInterface.createTable('documents',{
        id:{
         type:Sequelize.UUID,
         primaryKey:true,
         allowNull:false,
         defaultValue:Sequelize.UUIDV4
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
      document_type:{
        type:Sequelize.STRING,
        allowNull:false
      },
      document_url:{
         type:Sequelize.STRING,
         allowNull:false
      },
      verification_status:{
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        allowNull:false,
        defaultValue:'pending'
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
    await queryInterface.dropTable('documents')
  }
};
