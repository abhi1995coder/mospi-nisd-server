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
    queryInterface.createTable('sub_offices',{
        id:{
          type:Sequelize.UUID,
          primaryKey:true,
          defaultValue:Sequelize.UUIDV4
        },
        office_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'offices',
            key:'id'
          },
          onDelete:'CASCADE'
        },
        name:{
          type:Sequelize.STRING,
          allowNull:false
        },
        address:{
          type:Sequelize.TEXT,
          allowNull:false
        },
        is_active:{
          type:Sequelize.BOOLEAN,
          defaultValue:true,
          allowNull:false
        },
        createdAt:{
          type:Sequelize.DATE,
          defaultValue:Sequelize.NOW,
          allowNull:false
        },
        updatedAt:{
          type:Sequelize.DATE,
          defaultValue:Sequelize.NOW,
          allowNull:false
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
    queryInterface.dropTable('sub_offices')
  }
};
