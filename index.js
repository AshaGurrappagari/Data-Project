let express = require('express')

let sequelize = require('./config/database')
let router = require('./routes/regionRoutes')
let wardrouter = require('./routes/wardRoutes')
let districtrouter = require('./routes/districtRoutes')
let villagerouter = require('./routes/villageRoutes')

let app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',router)
app.use(districtrouter)
app.use(wardrouter)
app.use(villagerouter)

sequelize.sync().then(() =>{
 app.listen(8080,()=>console.log('Connected to port'))
})

.catch(err=>{

    console.log('Databse not synced',err)
})



