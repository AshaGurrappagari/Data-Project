const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const users = sequelize.define('users',{
    user_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey :true
    },
    first_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    paranoid: true, 
    timestamps: true 
})

module.exports = users