const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const users = require('./users.model')

const application = sequelize.define('application',{
    application_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: users,
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    permission:{
        type:DataTypes.STRING,
        allowNull:false
    },
    deletedAt:{
        type:DataTypes.DATE,
        allowNull:true
    }
},
{
    paranoid:true,
    timestamps:true
})
application.belongsTo(users,{
    foreignKey: 'userId',
    as: 'Users'
})
module.exports = application