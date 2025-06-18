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
    queryInterface.createTable('onboarding_details',{
        id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      application_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'applications', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      selected_internship_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'internships', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      offer_letter_url: 
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      offer_accepted:   
      { type: Sequelize.BOOLEAN, 
        allowNull: true 
      },
      offer_response_date: 
      { type: Sequelize.DATE, 
        allowNull: true
      },
      join_date:
      { type: Sequelize.DATEONLY, 
        allowNull: true 
      },
      joining_report_url:
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      bank_name:
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      bank_account_no:
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      ifsc_code:
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      passbook_url:
      { type: Sequelize.STRING, 
        allowNull: true 
      },
      createdAt:
      { type: Sequelize.DATE,
         allowNull: false, 
         defaultValue: Sequelize.NOW 
      },
      updatedAt:
      { type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW 
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
    queryInterface.dropTable('onboarding_details')
  }
};
