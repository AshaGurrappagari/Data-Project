const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Region = require('./region.model');

const District = sequelize.define('District',{
    district_id :{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    district:{
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

District.belongsTo(Region,{
    foreignKey:{
        name:'regionId',
        allowNull:false,
    },
    as:'region',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
});

module.exports = District;