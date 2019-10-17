"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scaleFromTransformMatrix = scaleFromTransformMatrix;

/**
 * Extracts the scale from a 2D transform matrix.
 *
 * @param {string} transformMatrix The 2D transform matrix.
 *
 * @return {number} The combined scale element of the transform.
 */
function scaleFromTransformMatrix(transformMatrix) {
  var matrixValues = transformMatrix.split("(")[1].split("(")[0].split(",");
  var a = matrixValues[0];
  var b = matrixValues[1];
  return Math.sqrt(a * a + b * b);
}
