//Logic for sorting taken from https://khan4019.github.io/front-end-Interview-Questions/sort.html

////Implementation two of the strategy pattern for sorting.
const strategy = require('./strategy')

class insertionSortStrategy extends strategy {
    constructor(arr) {
        super()
        this.arr = arr
    }

    async sortData(arr) {
        var i, len = Object.keys(arr.customJSON).length, el, j;
        for (i = 1; i < len; i++) {
            el = arr.customJSON[i].id;
            j = i;

            while (j > 0 && arr.customJSON[j - 1].id > el) {
                arr.customJSON[j] = arr.customJSON[j - 1];
                j--;
            }

            arr.customJSON[j].id = el;
        }
        return arr;
    }
}

module.exports = insertionSortStrategy