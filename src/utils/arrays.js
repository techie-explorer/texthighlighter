/**
 * Returns array without duplicated values.
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  return arr.filter(function(value, idx, self) {
    return self.indexOf(value) === idx;
  });
}
