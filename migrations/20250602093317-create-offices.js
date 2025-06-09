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
        office_id:{
          type:Sequelize.UUID,
          primaryKey:true,
          allowNull:false,
          defaultValue:Sequelize.literal('gen_random_uuid()')

        },
        office_name:{
          type:Sequelize.STRING,
          allowNull:false
        },
        office_type:{
          type:Sequelize.STRING,
          allowNull:false
        },
        location:{
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
        
        isActive:{
          type:Sequelize.BOOLEAN,
          defaultValue:true
        },
        createdAt:{
           type:Sequelize.DATE,
           allowNull:false,
           defaultValue:Sequelize.fn('NOW')
        },
        updatedAt:{
           type:Sequelize.DATE,
           defaultValue:Sequelize.fn('NOW'),
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
