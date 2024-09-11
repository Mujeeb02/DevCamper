const path=require('path')
const express = require("express");
const fileupload=require('express-fileupload')
const cookieParser=require('cookie-parser')
const dotenv = require("dotenv");

const bootcamps = require("./routes/bootcamp");
const courses=require("./routes/courses")
const authRouter=require("./routes/auth")
const usersRoute=require("./routes/users")
const reviewsRoute=require("./routes/reviews")
// to sanitize the requested input
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet')

const rateLimit=require('express-rate-limit');
const hpp=require('hpp')
const cors=require('cors');

const colors = require("colors");
// const logger=require("./middleware/logger")

const morgan = require("morgan");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });
const app = express();

// Body parser middleware
app.use(express.json());
app.use(cookieParser())
// Database connection
connectDb();

// Morgan logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes

// file uploading middleware
app.use(fileupload());
// To remove data using these defaults:
app.use(mongoSanitize());

// set security headers
app.use(helmet())

// apply cors
app.use(cors());
// rate limiting
const limiter=rateLimit({
  windowMS:10*60*1000,
  max:1
})
app.use(limiter)

// prevent http param pollution
app.use(hpp());

// set static folder
app.use(express.static(path.join(__dirname,'public')))

// bootcamps routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses",courses)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",usersRoute);
app.use("/api/v1/reviews",reviewsRoute);
// custom error handler
app.use(errorHandler)

const port = process.env.PORT || 4000;

const server = app.listen(
  port,
  console.log(`server is running in ${process.env.NODE_ENV} mode on ${port}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error :${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
