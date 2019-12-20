/*
 *  This builds a map from an array of objects.
 */
const buildMapFromArray = (array, key) => {
    const retval = {};
    array.map(currObj => {
            retval[currObj[key]] = currObj;
    });
    return retval;
}

//Compares two arrays for equality. Will only return true if both arrays have all the same elements at the same positions
const areArraysEqual = (arr1, arr2) => (arr1.length !== arr2.length) ? false : !(false in arr1.map((el, idx) => el === arr2[idx]))

export {
    buildMapFromArray,
    areArraysEqual
}