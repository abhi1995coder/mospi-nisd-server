'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id:{
            allowedNull:false,
            primaryKey:true,
            type:Sequelize.UUID,
            defaultValue:Sequelize.literal('gen_random_uuid()'),
          },
          email:{
            type:Sequelize.STRING,
            unique:true,
            allowNull:false,
          },
          passwordHash:{
            type:Sequelize.STRING,
          },
          role:{
            allowNull:false,
            type:Sequelize.STRING,
            defaultValue:'intern',
          },
          otpCode:{
            type:Sequelize.STRING
          },
          otpExpiresAt:{
            type:Sequelize.DATE
          },
          isVerified:{
            type:Sequelize.BOOLEAN,
            defaultValue:false,
          },
          isActive:{
            type:Sequelize.BOOLEAN,
            defaultValue:true,
            allowNull:false,
          },
          createdAt:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.fn('NOW'),
          },
          updatedAt:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.fn('NOW'),
          }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};