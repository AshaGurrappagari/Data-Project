const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres','postgres','1234',{
    host:'localhost',
    dialect:'postgres'
})

module.exports =  sequelize