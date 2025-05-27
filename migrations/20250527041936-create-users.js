'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:{
            allowedNull:false,
            autoIncrement:true,
            primaryKey:true,
            type:Sequelize.INTEGER,
          },
          email:{
            type:Sequelize.STRING,
            unique:true,
            allowNull:false,
          },
          paaswordHash:{
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