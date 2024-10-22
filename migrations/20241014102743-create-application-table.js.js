'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('application', { 
      application_id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'Users', // Name of the referenced table
          key: 'user_id', // Key in the referenced table
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
  },
    permission:{
        type:Sequelize.STRING,
        allowNull:false
    },
    deletedAt:{
        type:Sequelize.DATE,
        allowNull:true
    }
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('application');
  }
};
