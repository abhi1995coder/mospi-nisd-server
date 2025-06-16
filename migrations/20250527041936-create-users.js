'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
          id:{
            allowedNull:false,
            primaryKey:true,
            type:Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4,
          },
          name:{
            type:Sequelize.STRING,

          },
          email:{
            type:Sequelize.STRING,
            unique:true,
            allowNull:false,
          },
          password_hash:{
            type:Sequelize.STRING,
            allowNull:false
          },
          role:{
            allowNull:false,
            type:Sequelize.ENUM('intern','group_a_admin','group_b_admin','super_admin'),
            defaultValue:'intern',
          },
          otp_code:{
            type:Sequelize.STRING
          },
          otp_expires_at:{
            type:Sequelize.DATE
          },
          is_verified:{
            type:Sequelize.BOOLEAN,
            defaultValue:false,
            allowNUll:false
          },
          is_active:{
            type:Sequelize.BOOLEAN,
            defaultValue:true,
            allowNull:false,
          },
          createdAt:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.NOW,
          },
          updatedAt:{
            type:Sequelize.DATE,
            allowNull:false,
            defaultValue:Sequelize.NOW,
          }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};