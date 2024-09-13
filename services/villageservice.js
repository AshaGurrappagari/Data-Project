const sequelize = require('../config/database')
const villageModel = require('../models/village')
let region = require('../models/region')
let district = require('../models/district')
let ward = require('../models/ward')
const { literal } = require('sequelize')

let Datavillage = async (req,t)=>{
        try{
        let {region,district,ward,village,minCurrent,maxCurrent,minLast,maxLast, crop, variety} = req.body
        let regionId = req.params.id
        let districtId = req.params.districtId
        let wardId = req.params.wardId

        let newvillage = await villageModel.create(
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
        return Datavillage
    }
    catch(err){
        console.log('error in giving village',err)
        return err
    }
}

let villageQuery = async (req)=>{
    try{
        let villages = await villageModel.findAll({
        attributes:['region','district','ward','village',
            literal('"Min(Current)" AS "minCurrent"'),
            literal('"Max(Current)" AS "maxCurrent"'),
            literal('"Min(Last)" AS "minLast"'),
            literal('"Max(Last)" AS "maxLast"'),
            'crop','variety'], raw:true
       });
        let newdata = JSON.stringify(villages)
        let newstring = JSON.parse(newdata)
        console.log('====>\n',newstring)
        return villageQuery
        }
        catch(err){
            console.log('error in fetching village',err)
            return err
        }

}

let villageDatafiltered = async (req)=>{
        try{
        let villages = await villageModel.findAll({
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
        return formattedVillages
    }
    catch(err){
        console.log('error in fetching village',err)
        return err
    }

}

module.exports = {Datavillage,villageQuery,villageDatafiltered}