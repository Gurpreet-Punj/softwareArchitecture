const mysql = require('mysql2')
const fs = require('fs');

class dbSingleton {
    constructor() {
        //For singleTon pattern, making sure there is only one instance of this class. Returning that instance in case it exits.
        if (dbSingleton.instance instanceof dbSingleton) {
            return dbSingleton.instance
        }
        //creating a new instance in case it doesnt exist.
        this.pool = mysql.createPool({
            host: "wowlite.mysql.database.azure.com",
            user: "wowliteadmin",
            database: "wowlite",
            password: "GAdmin2@",
            port: 3306,
            ssl: {
                ca: fs.readFileSync('D:/McMaster/Sem3/Architecture/project/DigiCertGlobalRootCA.crt.pem')
            }
        })
        //settings to make sure we are freezing the object and new instances cant be forced.
        Object.freeze(this.pool)
        Object.freeze(this);
        dbSingleton.instance = this; //Setting it to Global
    }

    connectionKey() {
        return this.pool
    }
}
module.exports = dbSingleton;
