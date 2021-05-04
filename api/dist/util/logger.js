const winston = require("winston");
class Logger {
    constructor(rootName) {
        this.rootName = "";
        this.loggers = new Object();
        // Custom winstonjs format
        this.myFormat = winston.format.printf(({ level, message, label, timestamp, stack }) => {
            return `[${label}] [${timestamp}] [${level}]: ${stack || message}`;
        });
        this.rootName = rootName;
        this.transports = [
            new winston.transports.Console(),
            new winston.transports.File({
                level: "info",
                // 1KiB * 1KiB * 16 === 16 MiB
                maxsize: 1024 * 1024 * 16,
                dirname: `/var/log/CuteBotStack/${rootName}`,
                filename: `${rootName}.log`
            })
        ];
        this.addLogger(this.rootName);
    }
    addLogger(loggerName, level = "info") {
        let tmp = this.cleanName(loggerName);
        const log = winston.createLogger({
            level: level,
            format: winston.format.combine(winston.format.colorize(), winston.format.label({ label: tmp }), winston.format.timestamp(), winston.format.errors({ stack: true }), this.myFormat),
            transports: this.transports
        });
        if (this.loggers.hasOwnProperty(tmp)) {
            this.loggers[tmp].info(`Attempted to create logger ${tmp}, but already exists.`);
            return;
        }
        this.loggers[tmp] = log;
        this.info({
            text: `Created ${tmp} Logger`
        });
    }
    debug(args = {
        logger: this.rootName,
        text: ""
    }) {
        const loggerName = this.cleanName(args.logger || this.rootName);
        try {
            this.loggers[loggerName].debug(args.text);
        }
        catch (error) {
            this.loggers[this.rootName].error(`Tried to debug log, but failed`);
        }
    }
    info(args = {
        logger: this.rootName,
        text: ""
    }) {
        const loggerName = this.cleanName(args.logger || this.rootName);
        try {
            this.loggers[loggerName].info(args.text);
        }
        catch (error) {
            this.loggers[this.rootName].error(`Tried to info log, but failed`);
        }
    }
    warning(args = {
        logger: this.rootName,
        text: ""
    }) {
        const loggerName = this.cleanName(args.logger || this.rootName);
        try {
            this.loggers[loggerName].warning(args.text);
        }
        catch (error) {
            this.loggers[this.rootName].error(`Tried to warning log, but failed`);
        }
    }
    error(args = {
        logger: this.rootName,
        text: ""
    }) {
        const loggerName = this.cleanName(args.logger || this.rootName);
        try {
            this.loggers[loggerName].error(args.text);
        }
        catch (error) {
            this.loggers[this.rootName].error(`Tried to error log, but failed`);
        }
    }
    cleanName(name) {
        return String(name).toLocaleUpperCase();
    }
}
module.exports = Logger;
//# sourceMappingURL=logger.js.map