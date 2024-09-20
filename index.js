const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./config/database');
const router = require('./routes/regionRoutes');
const wardrouter = require('./routes/wardRoutes');
const districtrouter = require('./routes/districtRoutes');
const villagerouter = require('./routes/villageRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',router);
app.use(districtrouter);
app.use(wardrouter);
app.use(villagerouter);

sequelize.sync().then(() =>{
    app.listen(process.env.port,()=>console.log('Connected to port'));
})

    .catch(err=>{
        console.log('Databse not synced',err);
    });



