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
    await queryInterface.createTable('assignments',{
         assignment_id:{
          primaryKey:true,
          type:Sequelize.UUID,
          allowNull:false,
          defaultValue:Sequelize.literal('gen_random_uuid()')
         },
         application_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'applications',
            key:'application_id'
          },
          onDelete:'CASCADE'

         },
         office_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'offices',
            key:'office_id'
          },
          onDelete:'CASCADE'
         },
         start_date:{
          type:Sequelize.DATE,

         },
         end_date:{
          type:Sequelize.DATE,

         },
         status:{
          type: Sequelize.ENUM('offered', 'accepted', 'joined', 'completed', 'terminated'),
          defaultValue:'offered'
         },
         joining_report_url:{
          type:Sequelize.STRING
         },
         bank_name:{
          type:Sequelize.STRING
         },
         bank_account_number:{
          type:Sequelize.STRING
         },
         ifsc_code:{
          type:Sequelize.STRING
         },
         passbook_proof_url:{
          type:Sequelize.STRING
         },
         stipend_paid:{
          type:Sequelize.BOOLEAN,
          defaultValue:false
         },
         stipend_payement_date:{
          type:Sequelize.DATE
         },
         certificate_issued:{
          type:Sequelize.BOOLEAN,
          defaultValue:false
         },
         certificate_url:{
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
    await queryInterface.dropTable('assignments')
  }
};
