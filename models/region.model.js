const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Region = sequelize.define('Region',{
    region_id :{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    region:{
        type:DataTypes.STRING,
        allowNull:false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    paranoid: true, 
    timestamps: true 
});

module.exports = Region;