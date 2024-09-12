const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const District = require('./district')

const Ward = sequelize.define('Ward',{
    ward_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ward:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Ward.belongsTo(District,{
    foreignKey:{
        name:'districtId',
        allowNull:false,
        as:'district'
    },
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

module.exports=Ward