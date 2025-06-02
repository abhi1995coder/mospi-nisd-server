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
    await queryInterface.createTable('notices',{
       notice_id:{
        type:Sequelize.UUID,
        allowNull:false,
        defaultValue:Sequelize.literal('gen_random_uuid()'),
        primaryKey:true
       },
       title:{
        type:Sequelize.STRING
       },
       content:{
        type:Sequelize.TEXT
       },
       published_by:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'user_id'
        },
        onDelete:'CASCADE'
       },
       published_date:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.fn('NOW')
       },
       expiry_date:{
        type:Sequelize.DATE
       },
       is_Active:{
        type:Sequelize.BOOLEAN
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
    await queryInterface.dropTable('notices')
  }
};
