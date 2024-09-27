const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.database,process.env.username,process.env.password,{
    host:process.env.host,
    dialect: process.env.dialect,
    attributeBehavior: 'escape',
    logging: console.log 
});

module.exports =  sequelize;