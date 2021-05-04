const mysql = require("mysql");
class DbConnection {
    constructor(creds, logger) {
        this.connection = mysql.createConnection({
            user: creds.username,
            password: creds.password,
            database: creds.database,
            host: creds.host
        });
        this.logger = logger;
        this.connection.connect((err) => {
            if (err)
                logger.error({ text: `${err}` });
            logger.info({ text: `State: ${this.connection.state}` });
        });
    }
    query(text) {
        let res;
        this.connection.query(text, (err, r, fields) => {
            res = r;
        });
        return res;
    }
    isConnected() {
        return this.connection.state === "connected";
    }
}
module.exports = DbConnection;
//# sourceMappingURL=db.js.map