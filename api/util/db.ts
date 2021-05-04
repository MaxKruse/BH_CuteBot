import mysql from "mysql";
import Logger from "./logger";

class DbConnection {
    connection: any;
    logger: Logger;
    res: any;
    isConnected: string;

    constructor(creds: any, logger: Logger) {
        this.connection = mysql.createConnection({
            user: creds.username,
            password: creds.password,
            database: creds.database,
            host: creds.host
        })

        this.logger = logger;
        this.isConnected = "waiting";
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) reject(err);

                this.isConnected = this.connection.state;
                resolve("connected");
            })
        })
    }

    query(sql: string, args: Array<any> = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, resp, fields) => {
                if (err) reject(err);
                resolve(resp);
            })
        });
    }
}

export default DbConnection;