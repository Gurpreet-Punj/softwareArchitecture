//This is the context class which will handle the call of execute function for sorting and setting stratergies
//There are 3 sorting algorithms implemented.
const strategy = require('./strategy')
class sContext{
    constructor(){
        this.strategy = null
    }

    execute(arr){
        return this.strategy.sortData(arr)
    }

    setStratergy(strategy){
        this.strategy = strategy
    }
}
module.exports = sContext