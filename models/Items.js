const dbSingleton = require('../config/singletonPattern/dbSingleton')
const dbObj = new dbSingleton();
const pool = dbObj.connectionKey()
//Items model, the methods below are self explanatory
class Items {
    constructor(item) {
        this.itemid = item.id
        this.typename = item.name
        this.value = item.value
        this.is_negated = item.is_negated
    }

    async save(sql) {
        pool.execute(sql)
    }

    static findAll() {
        pool.execute(sql)
    }

    static deleteItems() {
        let sql = "DELETE FROM items";
        return pool.promise().query(sql)
    }
}

module.exports = Items;