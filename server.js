const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');


//Load env vars
dotenv.config({ path: './config/config.env' });

//Routes files
const caballos = require('./routes/caballos');


const app = express();

app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));
console.log(path.join(__dirname, '/public'));

//File Upload
app.use(fileupload());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Ratelimiting
const limiter = rateLimit({
  windowMS: 10 * 60 * 1000, //10 mins
  max: 100,
});

app.use(limiter);

// Prevent HTTP param polution
app.use(hpp());

// Prevent CORS
app.use(cors());

//Mount routers

app.use('/api/v1/caballos', caballos);


app.use(errorHandler);
const PORT = process.env.PORT || 6500;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )
);

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
