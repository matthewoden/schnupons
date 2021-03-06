const path = require("path");
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// TODO: Parameterize
const rotateTransport = new transports.DailyRotateFile({
  filename: "schnupons-%DATE%.log",
  auditFile: "./log/schnupons-audit.json",
  dirname: path.join(__dirname, "/log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "1k",
  maxFiles: "14d"
});

const logger = createLogger({
  defaultMeta: { service: "schnupons-service" },
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console(), rotateTransport]
});

module.exports = logger;
