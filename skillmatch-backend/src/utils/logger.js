const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  let output = `${timestamp} [${level}]: ${message}`;
  if (stack) {
    output += `\n${stack}`;
  }
  return output;
});

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }) // تأكد من تسجيل الـ stack trace
  ),

  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),

    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: format.json(),
    }),

    new transports.File({
      filename: "logs/combined.log",
      format: format.json(),
    }),
  ],
});

module.exports = logger;
