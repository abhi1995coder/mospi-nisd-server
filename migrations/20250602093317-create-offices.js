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
    await queryInterface.createTable('offices',{
        id:{
          type:Sequelize.UUID,
          primaryKey:true,
          allowNull:false,
          defaultValue:Sequelize.UUIDV4

        },
        office_name:{
          type:Sequelize.STRING,
          allowNull:false
        },
        office_type:{
          type:Sequelize.STRING,
          allowNull:false
        },
        city:{
          type:Sequelize.STRING,
          allowNull:false
        },
        state:{
          type:Sequelize.STRING,
          allowNull:false
        },
        address:{
           type:Sequelize.TEXT,
           allowNull:false
        },
        contact_person:{
          type:Sequelize.STRING,
          allowNull:false
        },
        contact_email:{
           type:Sequelize.STRING,
           allowNull:false
        },
        contact_phone:{
          type:Sequelize.STRING,
          allowNull:false
        },
        
        is_active:{
          type:Sequelize.BOOLEAN,
          defaultValue:true,
          allowNull:false
        },
        createdAt:{
           type:Sequelize.DATE,
           allowNull:false,
           defaultValue:Sequelize.NOW
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
    await queryInterface.dropTable('offices')
  }
};
