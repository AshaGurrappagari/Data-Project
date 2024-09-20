const sequelize = require('../config/database')
const villageModel = require('../models/village')
const region = require('../models/region')
const district = require('../models/district')
const ward = require('../models/ward')
const { literal } = require('sequelize')
const customException = require('../errorHandler/customException')
const { NOT_FOUND } = require('../utils/statusCode')
const { messages } = require('../utils/errmessage')

const Datavillage = async (req,t)=>{
        try{
        const {region,district,ward,village,minCurrent,maxCurrent,minLast,maxLast, crop, variety} = req.body
        const regionId = req.params.id
        const districtId = req.params.districtId
        const wardId = req.params.wardId

        const newvillage = await villageModel.create(
            {
                region,
                district,
                ward,
                village,
                minCurrent,
                maxCurrent,
                minLast,
                maxLast,
                crop,
                variety,
                regionId:regionId,
                districtId:districtId,
                wardId:wardId
            },{transaction:t}
        )
        console.log('Village created',newvillage)
        return {data:newvillage}
    }
    catch(err){
        console.log('error in giving village',err)
        return {err:err}
    }
}

const villageQuery = async (req)=>{
    try{
        const villages = await villageModel.findAll({
        attributes:['village_id','region','district','ward','village',
            literal('"Min(Current)" AS "minCurrent"'),
            literal('"Max(Current)" AS "maxCurrent"'),
            literal('"Min(Last)" AS "minLast"'),
            literal('"Max(Last)" AS "maxLast"'),
            'crop','variety'], raw:true
       });
        if(!villages||villages.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data not found')
        }
        const newdata = JSON.stringify(villages)
        const newstring = JSON.parse(newdata)
        console.log('====>\n',newstring)
        return {err:null,data:newstring}
    }
    catch(err){
        console.log('error in fetching ward',err)
        return {err:err}
    }

}

const villageDatafiltered = async (req)=>{
        try{
        const villages = await villageModel.findAll({
         attributes:['region','district','ward','village',
                literal('"Min(Current)" as "minCurrent"'),
                literal('"Max(Current)" as "maxCurrent"'),
                literal('"Min(Last)" as "minLast"'),
                literal('"Max(Last)" as "maxLast"'),
                'crop','variety'],
            include: [
                {
                    model:ward,
                    as:'Ward',
                    attributes:['ward'],
                    includes:[
                        {
                           model: district,
                           as:'District',
                           attributes:['district'],
                                includes:[
                                    {
                                    model: region,
                                    as:'Region',
                                    attributes:['region']
                                }
                            ]
                        }
                    ]
                }
            ],raw:true
        }
    )
    if(!villages||villages.length === 0){
        throw customException.error(NOT_FOUND,'Enter a valid data','Data not found')
    }
    const formattedVillages = villages.map(village=>({
        region:village.region,
        district:village.district,
        ward:village.ward,
        village:village.village,
        minCurrent:village.minCurrent,
        maxCurrent:village.maxCurrent,
        minLast:village.minLast,
        maxLast:village.maxLast,
        crop:village.crop,
        variety:village.variety
    }))
    return {data:formattedVillages}
    }
    catch(err){
        console.log('error in fetching ward',err)
        return {err:err}
    }
}

const updateVillage = async (req,t) => {
    try{
        const regionName = req.body.region
        const villageId = req.params.id

        const [updatedvillages] = await villageModel.update(
            { region: regionName },
            { where: { village_id: villageId }, transaction: t }
        );
        if(!updatedvillages||updatedvillages.error){
            throw customException.error(NOT_FOUND,'please provide a valid village_id','Data Not Found')
        }
        return {data:{updatedvillages}}
    }
    catch(err){
        console.log('error in updating data')
        return {err:err}
    }
}

module.exports = {Datavillage,villageQuery,villageDatafiltered,updateVillage}