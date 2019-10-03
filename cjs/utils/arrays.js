"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unique = unique;
exports.arrayToLower = arrayToLower;

/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
  return arr.filter(function (value, idx, self) {
    return self.indexOf(value) === idx;
  });
}
/**
 * Returns array of strings with all strings converted to lower case.
 *
 * @param {String[]} arr
 * @returns {String[]}
 */


function arrayToLower(arr) {
  return arr.map(Function.prototype.call, String.prototype.toLowerCase);
}
