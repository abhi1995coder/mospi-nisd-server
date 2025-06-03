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
   const name=process.env.SUPER_ADMIN_NAME
   const email=process.env.SUPER_ADMIN_EMAIL
   const password=process.env.SUPER_ADMIN_PASSWORD
   const hash=await bcrypt.hash(password,10)
   return queryInterface.bulkInsert('users',[{
    user_id:uuidv4(),
    user_name:name,
    email,
    passwordHash:hash,
    role:'super_admin',
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
