'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Villages', {
            village_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            regionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Regions', // Name of the referenced table
                    key: 'region_id', // Key in the referenced table
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            districtId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: 'Districts', // Name of the referenced table
                  key: 'district_id', // Key in the referenced table
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            wardId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                model: 'Wards', // Name of the referenced table
                key: 'ward_id', // Key in the referenced table
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            village: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            minCurrent: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            maxCurrent: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            minLast: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            maxLast: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            crop: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            variety: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('now'),
            },
            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('now'),
            },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('villages');
  }
};
