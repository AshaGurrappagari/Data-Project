const express = require('express');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const router = express.Router();

dotenv.config();

const sequelize = require('./config/database');

require('./routes/region.routes')(router);
require('./routes/ward.routes')(router);
require('./routes/district.routes')(router);
require('./routes/village.routes')(router);

const app = express();
const server = require("http").Server(app);

const corsOptions = {
	origin: '*'
};

app.use (cors(corsOptions));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Application with Swagger API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3000/api'
            }
        ]
    },
    apis: ['./index.js','./controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',router)

sequelize.sync()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => console.log(`Connected to port ${process.env.PORT || 3000}`));
    })
    .catch(err => {
        console.log('Database not synced', err);
    });