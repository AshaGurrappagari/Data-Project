const sequelize = require('../config/database')
const {Datavillage,villageQuery,villageDatafiltered} = require('../services/villageservice')

let villagenew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await Datavillage(req,transaction)
        if(result.err){
            await transaction.rollback()
            return res.status(500).send('Error in inserting')
        }
        else{
         await transaction.commit();
         return res.status(200).send('Village Data inserted successfully')
        }
    }
    catch(err){
        console.log('error while inserting village',err)
        return res.status(500).send('Error Occurred while inserting')
    }
}

let villageData = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await villageQuery(req,res,transaction)
        if(result.err){
            await transaction.rollback()
            return res.status(500).send('Error in Querying')
        }
        else{
         await transaction.commit();
         return res.json(result)
        }
    }
        catch(err){
            console.log('error in fetching village',err)
            res.status(500).send('Error in Fetching')
        }
    
}

let villageFilteredData = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await villageDatafiltered(req,res,transaction)
        if(result.error){
            await transaction.rollback()
            return res.status(500).send('Error in Querying')
        }
        else{
            await transaction.commit();
            return res.json(result)
        }
    }
    catch(err){
        console.log('error in fetching village',err)
        res.status(500).send('Error in Fetching')

    }
}

module.exports = {villagenew,villageData,villageFilteredData}

