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
          type:Sequelize.UUID,
          allowNull:false,
          primaryKey:true,
          defaultValue:Sequelize.literal('gen_random_uuid()')
         },
         intern_id:{
          type:Sequelize.UUID,
          allowNull:false,
          references:{
            model:'interns',
            key:'intern_id'
          },
          onDelete:'CASCADE'
         },
         group_type:{
            type: Sequelize.ENUM('A', 'B'),
            allowNull:false
         },
         application_status:{
           type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected'),
           defaultValue:'draft'
         },
         submission_date:{
           type:Sequelize.DATEONLY
         },
         review_date:{
           type:Sequelize.DATEONLY
         },
         rejection_reason:{
             type:Sequelize.TEXT
         },
         createdAt:{
            type:Sequelize.DATE,
            defaultValue:Sequelize.fn('NOW'),
            allowNull:false
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
    queryInterface.dropTable('applications')
  }
};
