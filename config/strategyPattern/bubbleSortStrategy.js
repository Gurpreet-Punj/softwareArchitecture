//Logic for sorting taken from https://khan4019.github.io/front-end-Interview-Questions/sort.html
const strategy = require('./strategy')

class bubbleSortStrategy extends strategy{
    constructor(arr){
        super()
    }

    async sortData(arr){
        var len = Object.keys(arr.customJSON).length;
        for (var i = len-1; i>=0; i--){
          for(var j = 1; j<=i; j++){
            if(arr.customJSON[j-1].typename > arr.customJSON[j].typename){
                var temp = arr.customJSON[j-1];
                arr.customJSON[j-1] = arr.customJSON[j];
                arr.customJSON[j] = temp;
             }
          }
        }
        return arr;
    }
}

module.exports = bubbleSortStrategy