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
            type:Sequelize.STRING,
            allowNull:false
         },
         preferred_offices:{
           type:Sequelize.JSONB
         },
         sub_office_preferences:{
            type:Sequelize.JSONB
         },
         application_status:{
           type:Sequelize.STRING,
           defaultValue:'draft'
         },
         submission_date:{
           type:Sequelize.DATE
         },
         review_date:{
           type:Sequelize.DATE
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
    await queryInterface.dropTable('applications')
  }
};
