const dbSingleton = require('../config/singletonPattern/dbSingleton')
const dbObj = new dbSingleton();
const pool = dbObj.connectionKey()

//Auction model, the methods below are self explanatory
class Auctions{
    constructor(action) {
        this.id = action.id
        this.itemid = action.itemid
        this.quantity = action.quantity
        this.unit_price = action.unit_price
        this.time_left = action.time_left
        this.itemcontext = action.itemcontext
        this.buyout = action.buyout
    }

    async save(sql) {
        pool.execute(sql)
    }

    static findAll(sql) {
        pool.execute(sql)
    }

    static getAuctionItems() {
        let sql = "SELECT * FROM auction JOIN items ON auction.itemid=items.itemid";
        return pool.promise().query(sql)
    }

    static searchAuction(data) {
        let sql = "SELECT * FROM auction JOIN items ON auction.itemid=items.itemid WHERE items.typename LIKE '" + data + "'";
        return pool.promise().query(sql)
    }

    static getReprtData() {
        let sql = "SELECT * FROM auction LEFT JOIN items ON auction.itemid=items.itemid";
        return pool.promise().query(sql)
    }
    
    static deleteAuction() {
        let sql = "DELETE FROM auction";
        return pool.promise().query(sql)
    }
}

module.exports = Auctions;