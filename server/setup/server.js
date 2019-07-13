require('dotenv').config()
const express = require('express');
const logger = require('../logger').logger;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('../routes/routes')
const auth = require('../routes/auth')
const compression = require('compression')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')


module.exports = function () {
    let server = express(),
        create,
        start;

    create = (cluster) => {
        try {
            server.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                for(let i = 0; i < 2e6; i++){
    
                }
                console.log('Request was made to: ' + req.originalUrl);
                next()
            })
            server.use(bodyParser.json());
            server.use(bodyParser.urlencoded({ extended: false }));
            server.use('/', routes)
            server.use('/', auth)
            server.use(express.json({ limit: '1mb' }));//limit req payload to 1mb
            server.use(compression())
            server.use(morgan('dev'))
            server.use(cors())
            const { spawn } = require('child_process')
            server.get('/', (req, res) => {
                for(let i = 0; i < 2e6; i++){
    
                }
                logger.error('An error route')
            })
            
            //connect the database
            mongoose.connect(process.env.LOCAL_DB_CONNECT,
                { 
                    useNewUrlParser: true,
                    useCreateIndex: true
                }
            );
            
        } catch (error) {
            console.log(error)
        }
        
    };

    
    start = (pid) => {
        let hostname = 'localhost',
            port = process.env.PORT
        server.listen(port, function () {
            logger.info('Express server listening on - http://' + hostname + ':' + port + ' and is using process ' + pid)
            //console.log('Express server listening on - http://' + hostname + ':' + port + ' and is using process ' + pid);
        });
    };
    return {
        create: create,
        start: start
    };
};