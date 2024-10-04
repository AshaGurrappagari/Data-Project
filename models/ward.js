const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const District = require('./district');

const Ward = sequelize.define('Ward',{
    ward_id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ward:{
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

Ward.belongsTo(District, {
    foreignKey: {
        name: 'districtId',
        allowNull: false
    },
    as: 'district',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports=Ward;