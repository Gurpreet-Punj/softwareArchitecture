//Logic for sorting taken from https://khan4019.github.io/front-end-Interview-Questions/sort.html

//Implementation three of the strategy pattern for sorting.
const strategy = require('./strategy')

class selectionSortStrategy extends strategy {
    constructor() {
        super()
    }

    async sortData(arr) {
        var minIdx, temp,
            len = Object.keys(arr.customJSON).length;
        for (var i = 0; i < len; i++) {
            minIdx = i;
            for (var j = i + 1; j < len; j++) {
                if (arr.customJSON[j].quantity < arr.customJSON[minIdx].quantity) {
                    minIdx = j;
                }
            }
            temp = arr.customJSON[i];
            arr.customJSON[i] = arr.customJSON[minIdx];
            arr.customJSON[minIdx] = temp;
        }
        return this.arr;
    }
}

module.exports = selectionSortStrategy