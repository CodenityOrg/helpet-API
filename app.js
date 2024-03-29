require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
const index = require("./routes/index");
const { connect: connectDb } = require("./db");

connectDb();

const app = express();
app.use(cors());

const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(
  helmet({
    frameguard: {
      action: "deny"
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["style.com"]
      }
    },
    hsts: {
      maxAge: ninetyDaysInSeconds,
      force: true
    },
    hidePoweredBy: true,
    noSniff: true,
    ieNoOpen: true,
    xssFilter: true
  })
);

app.use(helmet.noCache());

app.use("/docs", express.static(pathToSwaggerUi));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_, res) => res.redirect("/api"));
app.use("/api", index);

app.use(express.static(path.join(__dirname, "tmp")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send(JSON.stringify(err));
});

require("expressjs-api-explorer")(app, express);

module.exports = app;
