require('winston-daily-rotate-file');
require('winston-mail')
require('winston-mongodb');
const winston = require('winston');
const fs = require('fs');
let logDirectory = 'Logs' 

//winston.setLevels(winston.config.npm.levels);
winston.level = 'error';
winston.level = 'warn';
winston.level = 'info';
winston.level = 'http';
winston.level = 'verbose';
winston.level = 'debug';
winston.level = 'silly';
//winston.debug('This will be logged now!');
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'blue'
});

//create directory if it is not present
if (!fs.existsSync(logDirectory)) {
  // Create the directory if it does not exist
  fs.mkdirSync(logDirectory);
}

//winston options for various logging type
let options = {
    file: {
      level: process.env.ENV === 'development' ? 'debug' : 'info',
      filename: logDirectory + '/%DATE%-logsDemo.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      timestamp: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      json: true,
      maxsize: 5242880, // 5MB
      colorize: true,
    }
    // database: {
    //     db  : 'ERRORLOGS',
    //     level: process.env.ENV === 'development' ? 'debug' : 'info',
    //   },
    // mail : {
    //     level: 'error',
    //     to: 'otitojuoluwapelumi@gmail.com',
    //     from: 'otitojuoluwapelumi@gmail.com',
    //     subject: 'An Error Occured On Server. Please Check IT ASAP',
    //     host: 'email_host',
    //     username: process.env.GMAILUSER,
    //     password: process.env.GMAILPW
    //   }
  };
  module.exports.logger = winston.createLogger({
    transports: [
      new winston.transports.DailyRotateFile(options.file)
    //   new winston.transports.MongoDB(options.database),
    //   new winston.transports.Mail(options.mail)
    ],
    exceptionHandlers: [
      new winston.transports.DailyRotateFile(options.file)
    //   new winston.transports.MongoDB(options.database),
    //   new winston.transports.Mail(options.mail)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });