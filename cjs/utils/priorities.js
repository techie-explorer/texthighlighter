"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHighestPriority = isHighestPriority;

/**
 * Determines whether the provided highlighter has
 * the highest priority of a set of highlighters applied to
 * the same document.
 *
 * @param {string} highlighterNamespace
 * @param {Record<string, number>} priorities
 *
 * @return boolean
 */
function isHighestPriority(highlighterNamespace, priorities) {
  var keys = Object.keys(priorities);
  if (keys.length === 0) return true;
  if (!(highlighterNamespace in priorities)) return false;
  var highlighterPriority = priorities[highlighterNamespace];
  var hasHighestPriority = true;
  var i = 0;

  while (hasHighestPriority && i < keys.length) {
    hasHighestPriority = priorities[keys[i]] <= highlighterPriority;
    i = i + 1;
  }

  return hasHighestPriority;
}
