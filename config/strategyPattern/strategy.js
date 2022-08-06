//Strategy pattern
// Main idea here is to create the abstract class which can be implemented by sContext
class Strategy{
    constructor(){}

    sortData(){
        console.log("Dont call abstract method")
    }
}

module.exports = Strategy