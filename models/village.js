const {DataTypes}= require('sequelize')
const sequelize = require('../config/database')
const Region = require('./region')
const District = require('./district')
const Ward = require('./ward')


let Village = sequelize.define('village',{
    village_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    region:{
        type:DataTypes.STRING,
        allowNull:false
    },
    district:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ward:{
        type:DataTypes.STRING,
        allowNull:false
    },
    village:{
        type:DataTypes.STRING,
        allowNull:false
    },
    minCurrent:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:'Min(Current)'
    },
    maxCurrent:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:"Max(Current)"
    },
    minLast:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:"Min(Last)"
    },
    maxLast:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:"Max(Last)"
    },
    crop:{
        type:DataTypes.STRING,
        allowNull:false
    },
    variety:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Village.belongsTo(Region,{
    foreignKey:{
        name:'regionId',
        allowNull:false
    },
    as:'Region',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

Village.belongsTo(District,{
    foreignKey:{
        name:'districtId',
        allowNull:false
    },
    as:'District',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})
Village.belongsTo(Ward,{
    foreignKey:{
        name:'wardId',
        allowNull:false
    },
    as:'Ward',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

module.exports= Village