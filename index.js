const express = require('express');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const sequelize = require('./config/database');
const router = require('./routes/regionRoutes');
const wardrouter = require('./routes/wardRoutes');
const districtrouter = require('./routes/districtRoutes');
const villagerouter = require('./routes/villageRoutes');

const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Application with Swagger API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3000/'
            }
        ]
    },
    apis: ['./index.js','./controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.use(districtrouter);
app.use(wardrouter);
app.use(villagerouter);

sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => console.log(`Connected to port ${process.env.PORT || 3000}`));
    })
    .catch(err => {
        console.log('Database not synced', err);
    });
