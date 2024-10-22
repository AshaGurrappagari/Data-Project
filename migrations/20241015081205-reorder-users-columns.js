'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop Foreign Key Constraints that reference user_id (if any)
    await queryInterface.removeConstraint('applications', 'applications_userId_fkey')

    // 2. Modify or reorder the column
    await queryInterface.changeColumn('users', 'user_id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });
    const constraints = await queryInterface.showAllConstraints('applications');
    console.log(constraints);
    
    // 3. Re-add the Foreign Key Constraint (if needed)
    await queryInterface.addConstraint('applications', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'applications_userId_fkey', // Correct constraint name
      references: {
        table: 'users',
        field: 'user_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });    
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback logic, if needed
    await queryInterface.dropTable('users');
  }
};
