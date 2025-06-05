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
    queryInterface.createTable('interns',{
       intern_id:{
          type:Sequelize.UUID,
          allowNull:false,
          defaultValue:Sequelize.literal('gen_random_uuid()'),
          primaryKey:true
       },
       user_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'users',
            key:'user_id'
          },
          onDelete:'CASCADE'
       },
       full_name:{
           type:Sequelize.STRING,
           allowNull:false

       },
       father_name:{
           type:Sequelize.STRING,
           
       },
       aadhar_number:{
          type:Sequelize.STRING,
          allowNull:false,
          unique:true
           
       },
       date_of_birth:{
           type:Sequelize.DATE
       },
       contact_number:{
          type:Sequelize.STRING
       },
       alt_contact_number:{
           type:Sequelize.STRING
       },
       address:{
          type:Sequelize.STRING
       },
       nationality:{
           type:Sequelize.STRING
       },
       university:{
          type:Sequelize.STRING
       },
       
        createdAt:{
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
    await queryInterface.dropTable('interns');
  }
};
