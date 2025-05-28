'use strict';
const bcrypt=require('bcryptjs')
const{v4:uuidv4}=require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async(queryInterface, Sequelize)=> {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const hash=await bcrypt.hash('superadmin@1234',10)
   return queryInterface.bulkInsert('users',[{
    user_id:uuidv4(),
    email:"superadmin@gmail.com",
    passwordHash:hash,
    role:'superadmin',
    isVerified:true,
    createdAt:new Date(),
    updatedAt:new Date(),
   }])
  },

  down: async(queryInterface, Sequelize)=> {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users',{email:'superadmin@gmail.com'})
  }
};
