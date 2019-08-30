(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IGNORE_TAGS = exports.END_OFFSET_ATTR = exports.START_OFFSET_ATTR = exports.TIMESTAMP_ATTR = exports.DATA_ATTR = void 0;

/**
 * Attribute added by default to every highlight.
 * @type {string}
 */
var DATA_ATTR = "data-highlighted";
/**
 * Attribute used to group highlight wrappers.
 * @type {string}
 */

exports.DATA_ATTR = DATA_ATTR;
var TIMESTAMP_ATTR = "data-timestamp";
exports.TIMESTAMP_ATTR = TIMESTAMP_ATTR;
var START_OFFSET_ATTR = "data-start-offset";
exports.START_OFFSET_ATTR = START_OFFSET_ATTR;
var END_OFFSET_ATTR = "data-end-offset";
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */

exports.END_OFFSET_ATTR = END_OFFSET_ATTR;
var IGNORE_TAGS = ["SCRIPT", "STYLE", "SELECT", "OPTION", "BUTTON", "OBJECT", "APPLET", "VIDEO", "AUDIO", "CANVAS", "EMBED", "PARAM", "METER", "PROGRESS"];
exports.IGNORE_TAGS = IGNORE_TAGS;

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

var _textHighlighter = _interopRequireDefault(require("./text-highlighter"));

require("./jquery-plugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Expose the TextHighlighter class globally to be
 * used in demos and to be injected directly into html files.
 */
global.TextHighlighter = _textHighlighter["default"];
/**
 * Load the jquery plugin globally expecting jQuery and TextHighlighter to be globally
 * avaiable, this means this library doesn't need a hard requirement of jQuery.
 */

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./jquery-plugin":5,"./text-highlighter":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _highlights = require("../utils/highlights");

var _config = require("../config");

var _dom = _interopRequireDefault(require("../utils/dom"));

var _arrays = require("../utils/arrays");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * IndependenciaHighlighter that provides text highlighting functionality to dom elements
 * with a focus on removing interdependence between highlights and other element nodes in the context element.
 */
var IndependenciaHighlighter =
/*#__PURE__*/
function () {
  /**
   * Creates a IndependenciaHighlighter instance for functionality that focuses for highlight independence.
   *
   * @param {HTMLElement} element - DOM element to which highlighted will be applied.
   * @param {object} [options] - additional options.
   * @param {string} options.color - highlight color.
   * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
   * @param {string} options.contextClass - class added to element to which highlighter is applied,
   *  'highlighter-context' by default.
   * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
   *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
   * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
   *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
   * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param.
   * @class IndependenciaHighlighter
   */
  function IndependenciaHighlighter(element, options) {
    _classCallCheck(this, IndependenciaHighlighter);

    this.el = element;
    this.options = options;
  }
  /**
   * Highlights the range allowing isolation for overlapping highlights.
   * This solution steals the text or other nodes in the DOM from overlapping (NOT NESTED) highlights
   * for representation in the DOM.
   *
   * For the purpose of serialisation this will maintain a data attribute on the highlight wrapper
   * with the start text and end text offsets relative to the context root element.
   *
   * Wraps text of given range object in wrapper element.
   *
   * @param {Range} range
   * @param {HTMLElement} wrapper
   * @returns {Array} - array of created highlights.
   * @memberof IndependenciaHighlighter
   */


  _createClass(IndependenciaHighlighter, [{
    key: "highlightRange",
    value: function highlightRange(range, wrapper) {
      if (!range || range.collapsed) {
        return [];
      }

      console.log("ALSDebug29: RANGE: ", range);
      var highlights = [];
      var wrapperClone = wrapper.cloneNode(true);
      var startOffset = (0, _highlights.getElementOffset)(range.startContainer, this.el) + range.startOffset;
      var endOffset = range.startContainer === range.endContainer ? startOffset + (range.endOffset - range.startOffset) : (0, _highlights.getElementOffset)(range.endContainer, this.el) + range.endOffset;
      console.log("ALSDebug29: startOffset: ", startOffset, "endOffset: ", endOffset);
      wrapperClone.setAttribute(_config.START_OFFSET_ATTR, startOffset);
      wrapperClone.setAttribute(_config.END_OFFSET_ATTR, endOffset);
      console.log("\n\n\n FINDING START CONTAINER FIRST TEXT NODE ");
      console.log("range.startContainer: ", range.startContainer);
      var startContainer = (0, _highlights.findTextNodeAtLocation)(range.startContainer, "start");
      console.log("\n\n\n FINDING END CONTAINER FIRST TEXT NODE ");
      console.log("range.endContainer: ", range.endContainer);
      var endContainer = (0, _highlights.findTextNodeAtLocation)(range.endContainer, "start");

      if (!startContainer || !endContainer) {
        throw new Error("Failed to find the text node for the start or the end of the selected range");
      }

      var afterNewHighlight = range.endOffset < endContainer.textContent.length - 1 ? endContainer.splitText(range.endOffset) : endContainer;

      if (startContainer === endContainer) {
        var startOfNewHighlight = range.startOffset > 0 ? startContainer.splitText(range.startOffset) : startContainer; // Simply wrap the selected range in the same container as a highlight.

        var highlight = (0, _dom["default"])(startOfNewHighlight).wrap(wrapperClone);
        highlights.push(highlight);
      } else if (endContainer.textContent.length >= range.endOffset) {
        var _startOfNewHighlight = startContainer.splitText(range.startOffset);

        var endOfNewHighlight = afterNewHighlight.previousSibling;
        console.log("Node at the start of the new highlight: ", _startOfNewHighlight);
        console.log("Node at the end of new highlight: ", endOfNewHighlight);
        var startElementParent = (0, _highlights.findFirstNonSharedParent)({
          childElement: _startOfNewHighlight,
          otherElement: endOfNewHighlight
        });
        var startElementParentCopy;

        if (startElementParent) {
          startElementParentCopy = (0, _highlights.extractElementContentForHighlight)({
            element: _startOfNewHighlight,
            elementAncestor: startElementParent,
            options: this.options,
            locationInSelection: "start"
          });
          console.log("startElementParent:", startElementParent);
          console.log("startElementParentCopy: ", startElementParentCopy);
        }

        var endElementParent = (0, _highlights.findFirstNonSharedParent)({
          childElement: endOfNewHighlight,
          otherElement: _startOfNewHighlight
        });
        var endElementParentCopy;

        if (endElementParent) {
          endElementParentCopy = (0, _highlights.extractElementContentForHighlight)({
            element: endOfNewHighlight,
            elementAncestor: endElementParent,
            options: this.options,
            locationInSelection: "end"
          });
          console.log("Node that is the wrapper of the end of the new highlight: ", endElementParent);
          console.log("Cloned of node that is the wrapper of the end of the new highlight after removing siblings and unwrapping highlight spans: ", endElementParentCopy);
        }

        if (startElementParentCopy) {
          if (startElementParentCopy.classList.contains(this.options.highlightedClass)) {
            console.log(startElementParentCopy.childNodes.length);
            startElementParentCopy.childNodes.forEach(function (childNode) {
              console.log("appending child node: ", childNode.textContent);
              wrapperClone.appendChild(childNode);
            });
          } else {
            console.log("appending startElementParentCopy: ", startElementParentCopy);
            wrapperClone.appendChild(startElementParentCopy);
          }
        } else {
          console.log("appending startOfNewHighlight: ", _startOfNewHighlight);
          wrapperClone.appendChild(_startOfNewHighlight);
        } // TODO: add containers in between.


        var containersInBetween = (0, _highlights.nodesInBetween)(startContainer, endContainer);
        containersInBetween.forEach(function (container) {
          wrapperClone.appendChild(container);
        });

        if (endElementParentCopy) {
          // Only copy the children of a highlighted span into our new highlight.
          if (endElementParentCopy.classList.contains(this.options.highlightedClass)) {
            endElementParentCopy.childNodes.forEach(function (childNode) {
              wrapperClone.appendChild(childNode);
            });
          } else {
            wrapperClone.appendChild(endElementParentCopy);
          }
        } else {
          wrapperClone.appendChild(endOfNewHighlight);
        }

        (0, _dom["default"])(wrapperClone).insertBefore(endElementParent ? endElementParent : afterNewHighlight);
      }

      return highlights;
    }
    /**
     * Normalizes highlights. Ensures text nodes within any given element node are merged together.
     *
     * @param {Array} highlights - highlights to normalize.
     * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
     * input highlights.
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "normalizeHighlights",
    value: function normalizeHighlights(highlights) {
      var normalizedHighlights; //Since we're not merging or flattening, we need to normalise the text nodes.

      highlights.forEach(function (highlight) {
        (0, _dom["default"])(highlight).normalizeTextNodes();
      }); // omit removed nodes

      normalizedHighlights = highlights.filter(function (hl) {
        return hl.parentElement ? hl : null;
      });
      normalizedHighlights = (0, _arrays.unique)(normalizedHighlights);
      normalizedHighlights.sort(function (a, b) {
        return a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft;
      });
      return normalizedHighlights;
    }
    /**
     * Removes highlights from element. If element is a highlight itself, it is removed as well.
     * If no element is given, all highlights are removed.
     * @param {HTMLElement} [element] - element to remove highlights from
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "removeHighlights",
    value: function removeHighlights(element) {
      var container = element || this.el,
          highlights = this.getHighlights(),
          self = this;

      function removeHighlight(highlight) {
        if (highlight.className === container.className) {
          (0, _dom["default"])(highlight).unwrap();
        }
      }

      highlights.forEach(function (hl) {
        if (self.options.onRemoveHighlight(hl) === true) {
          removeHighlight(hl);
        }
      });
    }
    /**
     * Returns highlights from given container.
     * @param params
     * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
     * highlighter is applied to.
     * @param {boolean} [params.andSelf] - if set to true and container is a highlight itself, add container to
     * returned results. Default: true.
     * @param {boolean} [params.grouped] - if set to true, highlights are grouped in logical groups of highlights added
     * in the same moment. Each group is an object which has got array of highlights, 'toString' method and 'timestamp'
     * property. Default: false.
     * @returns {Array} - array of highlights.
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "getHighlights",
    value: function getHighlights(params) {
      var mergedParams = _objectSpread({
        container: this.el,
        dataAttr: _config.DATA_ATTR,
        timestampAttr: _config.TIMESTAMP_ATTR
      }, params);

      return (0, _highlights.retrieveHighlights)(mergedParams);
    }
    /**
     * Returns true if element is a highlight.
     *
     * @param el - element to check.
     * @returns {boolean}
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "isHighlight",
    value: function isHighlight(el, dataAttr) {
      return (0, _highlights.isElementHighlight)(el, dataAttr);
    }
    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "serializeHighlights",
    value: function serializeHighlights(id) {
      var highlights = this.getHighlights(),
          refEl = this.el,
          hlDescriptors = [];
      (0, _highlights.sortByDepth)(highlights, false);
      highlights.forEach(function (highlight) {
        var length = highlight.textContent.length,
            // hlPath = getElementPath(highlight, refEl),
        offset = (0, _highlights.getElementOffset)(highlight, refEl),
            // Hl offset from the root element.
        wrapper = highlight.cloneNode(true);
        wrapper.innerHTML = "";
        wrapper = wrapper.outerHTML;
        console.log("Highlight text offset from root node: ", offset);
        console.log("wrapper.toString().indexOf(".concat(id, "):"), wrapper.toString().indexOf(id));

        if (wrapper.toString().indexOf(id) > -1) {
          hlDescriptors.push([wrapper, highlight.textContent, offset, length]);
        }
      });
      return JSON.stringify(hlDescriptors);
    }
    /**
     * Deserializes the independent form of highlights.
     *
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "deserializeHighlights",
    value: function deserializeHighlights(json) {
      var hlDescriptors,
          highlights = [],
          self = this;

      if (!json) {
        return highlights;
      }

      try {
        hlDescriptors = JSON.parse(json);
      } catch (e) {
        throw "Can't parse JSON: " + e;
      }

      function deserializationFnCustom(hlDescriptor) {
        var hl = {
          wrapper: hlDescriptor[0],
          text: hlDescriptor[1],
          offset: Number.parseInt(hlDescriptor[2]),
          length: Number.parseInt(hlDescriptor[3])
        },
            hlNode,
            highlight;
        var parentNode = self.el;

        var _findNodeAndOffset = (0, _highlights.findNodeAndOffset)(hl, parentNode),
            node = _findNodeAndOffset.node,
            offsetWithinNode = _findNodeAndOffset.offset;

        hlNode = node.splitText(offsetWithinNode);
        hlNode.splitText(hl.length);

        if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
          (0, _dom["default"])(hlNode.nextSibling).remove();
        }

        if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
          (0, _dom["default"])(hlNode.previousSibling).remove();
        }

        highlight = (0, _dom["default"])(hlNode).wrap((0, _dom["default"])().fromHTML(hl.wrapper)[0]);
        highlights.push(highlight);
      }

      hlDescriptors.forEach(function (hlDescriptor) {
        try {
          console.log("Highlight: ", hlDescriptor);
          deserializationFnCustom(hlDescriptor);
        } catch (e) {
          if (console && console.warn) {
            console.warn("Can't deserialize highlight descriptor. Cause: " + e);
          }
        }
      });
      return highlights;
    }
  }]);

  return IndependenciaHighlighter;
}();

var _default = IndependenciaHighlighter;
exports["default"] = _default;

},{"../config":1,"../utils/arrays":7,"../utils/dom":8,"../utils/highlights":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _highlights = require("../utils/highlights");

var _dom = _interopRequireWildcard(require("../utils/dom"));

var _config = require("../config");

var _arrays = require("../utils/arrays");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * PrimitivoHighlighter that provides text highlighting functionality to dom elements
 * for simple use cases.
 */
var PrimitivoHighlighter =
/*#__PURE__*/
function () {
  /**
   * Creates a PrimitivoHighlighter instance for functionality specific to the original implementation.
   *
   * @param {HTMLElement} element - DOM element to which highlighted will be applied.
   * @param {object} [options] - additional options.
   * @param {string} options.color - highlight color.
   * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
   * @param {string} options.contextClass - class added to element to which highlighter is applied,
   *  'highlighter-context' by default.
   * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
   *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
   * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
   *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
   * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param.
   * @class TextHighlighter
   */
  function PrimitivoHighlighter(element, options) {
    _classCallCheck(this, PrimitivoHighlighter);

    this.el = element;
    this.options = options;
  }
  /**
   * Highlights range.
   * Wraps text of given range object in wrapper element.
   * @param {Range} range
   * @param {HTMLElement} wrapper
   * @returns {Array} - array of created highlights.
   * @memberof PrimitivoHighlighter
   */


  _createClass(PrimitivoHighlighter, [{
    key: "highlightRange",
    value: function highlightRange(range, wrapper) {
      if (!range || range.collapsed) {
        return [];
      }

      console.log("ALSDebug28: range before refined! ", range);
      var result = (0, _highlights.refineRangeBoundaries)(range),
          startContainer = result.startContainer,
          endContainer = result.endContainer,
          goDeeper = result.goDeeper,
          done = false,
          node = startContainer,
          highlights = [],
          highlight,
          wrapperClone,
          nodeParent;

      do {
        if (goDeeper && node.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
          if (_config.IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== "") {
            wrapperClone = wrapper.cloneNode(true);
            wrapperClone.setAttribute(_config.DATA_ATTR, true);
            nodeParent = node.parentNode; // highlight if a node is inside the el

            if ((0, _dom["default"])(this.el).contains(nodeParent) || nodeParent === this.el) {
              highlight = (0, _dom["default"])(node).wrap(wrapperClone);
              highlights.push(highlight);
            }
          }

          goDeeper = false;
        }

        if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
          done = true;
        }

        if (node.tagName && _config.IGNORE_TAGS.indexOf(node.tagName) > -1) {
          if (endContainer.parentNode === node) {
            done = true;
          }

          goDeeper = false;
        }

        if (goDeeper && node.hasChildNodes()) {
          node = node.firstChild;
        } else if (node.nextSibling) {
          node = node.nextSibling;
          goDeeper = true;
        } else {
          node = node.parentNode;
          goDeeper = false;
        }
      } while (!done);

      return highlights;
    }
    /**
     * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
     * wrapping HTML elements.
     * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
     * @param {Array} highlights - highlights to normalize.
     * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
     * input highlights.
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "normalizeHighlights",
    value: function normalizeHighlights(highlights) {
      var normalizedHighlights;
      this.flattenNestedHighlights(highlights);
      this.mergeSiblingHighlights(highlights); // omit removed nodes

      normalizedHighlights = highlights.filter(function (hl) {
        return hl.parentElement ? hl : null;
      });
      normalizedHighlights = (0, _arrays.unique)(normalizedHighlights);
      normalizedHighlights.sort(function (a, b) {
        return a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft;
      });
      return normalizedHighlights;
    }
    /**
     * Flattens highlights structure.
     * Note: this method changes input highlights - their order and number after calling this method may change.
     * @param {Array} highlights - highlights to flatten.
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "flattenNestedHighlights",
    value: function flattenNestedHighlights(highlights) {
      var again,
          self = this;
      (0, _highlights.sortByDepth)(highlights, true);

      function flattenOnce() {
        var again = false;
        highlights.forEach(function (hl, i) {
          var parent = hl.parentElement,
              parentPrev = parent.previousSibling,
              parentNext = parent.nextSibling;

          if (self.isHighlight(parent, _config.DATA_ATTR)) {
            if (!(0, _highlights.haveSameColor)(parent, hl)) {
              if (!hl.nextSibling) {
                if (!parentNext) {
                  (0, _dom["default"])(hl).insertAfter(parent);
                } else {
                  (0, _dom["default"])(hl).insertBefore(parentNext);
                }

                (0, _dom["default"])(hl).insertBefore(parentNext || parent);
                again = true;
              }

              if (!hl.previousSibling) {
                if (!parentPrev) {
                  (0, _dom["default"])(hl).insertBefore(parent);
                } else {
                  (0, _dom["default"])(hl).insertAfter(parentPrev);
                }

                (0, _dom["default"])(hl).insertAfter(parentPrev || parent);
                again = true;
              }

              if (hl.previousSibling && hl.previousSibling.nodeType == 3 && hl.nextSibling && hl.nextSibling.nodeType == 3) {
                var spanleft = document.createElement("span");
                spanleft.style.backgroundColor = parent.style.backgroundColor;
                spanleft.className = parent.className;
                var timestamp = parent.attributes[_config.TIMESTAMP_ATTR].nodeValue;
                spanleft.setAttribute(_config.TIMESTAMP_ATTR, timestamp);
                spanleft.setAttribute(_config.DATA_ATTR, true);
                var spanright = spanleft.cloneNode(true);
                (0, _dom["default"])(hl.previousSibling).wrap(spanleft);
                (0, _dom["default"])(hl.nextSibling).wrap(spanright);
                var nodes = Array.prototype.slice.call(parent.childNodes);
                nodes.forEach(function (node) {
                  (0, _dom["default"])(node).insertBefore(node.parentNode);
                });
                again = true;
              }

              if (!parent.hasChildNodes()) {
                (0, _dom["default"])(parent).remove();
              }
            } else {
              parent.replaceChild(hl.firstChild, hl);
              highlights[i] = parent;
              again = true;
            }
          }
        });
        return again;
      }

      do {
        again = flattenOnce();
      } while (again);
    }
    /**
     * Merges sibling highlights and normalizes descendant text nodes.
     * Note: this method changes input highlights - their order and number after calling this method may change.
     * @param highlights
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "mergeSiblingHighlights",
    value: function mergeSiblingHighlights(highlights) {
      var self = this;

      function shouldMerge(current, node) {
        return node && node.nodeType === _dom.NODE_TYPE.ELEMENT_NODE && (0, _highlights.haveSameColor)(current, node) && self.isHighlight(node, _config.DATA_ATTR);
      }

      highlights.forEach(function (highlight) {
        var prev = highlight.previousSibling,
            next = highlight.nextSibling;

        if (shouldMerge(highlight, prev)) {
          (0, _dom["default"])(highlight).prepend(prev.childNodes);
          (0, _dom["default"])(prev).remove();
        }

        if (shouldMerge(highlight, next)) {
          (0, _dom["default"])(highlight).append(next.childNodes);
          (0, _dom["default"])(next).remove();
        }

        (0, _dom["default"])(highlight).normalizeTextNodes();
      });
    }
    /**
     * Removes highlights from element. If element is a highlight itself, it is removed as well.
     * If no element is given, all highlights all removed.
     * @param {HTMLElement} [element] - element to remove highlights from
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "removeHighlights",
    value: function removeHighlights(element) {
      var container = element || this.el,
          highlights = this.getHighlights({
        container: container
      }),
          self = this;

      function mergeSiblingTextNodes(textNode) {
        var prev = textNode.previousSibling,
            next = textNode.nextSibling;

        if (prev && prev.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
          textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
          (0, _dom["default"])(prev).remove();
        }

        if (next && next.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
          textNode.nodeValue = textNode.nodeValue + next.nodeValue;
          (0, _dom["default"])(next).remove();
        }
      }

      function removeHighlight(highlight) {
        var textNodes = (0, _dom["default"])(highlight).unwrap();
        textNodes.forEach(function (node) {
          mergeSiblingTextNodes(node);
        });
      }

      (0, _highlights.sortByDepth)(highlights, true);
      highlights.forEach(function (hl) {
        if (self.options.onRemoveHighlight(hl) === true) {
          removeHighlight(hl);
        }
      });
    }
    /**
     * Returns highlights from given container.
     * @param params
     * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
     * highlighter is applied to.
     * @param {boolean} [params.andSelf] - if set to true and container is a highlight itself, add container to
     * returned results. Default: true.
     * @param {boolean} [params.grouped] - if set to true, highlights are grouped in logical groups of highlights added
     * in the same moment. Each group is an object which has got array of highlights, 'toString' method and 'timestamp'
     * property. Default: false.
     * @returns {Array} - array of highlights.
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "getHighlights",
    value: function getHighlights(params) {
      var mergedParams = _objectSpread({
        container: this.el,
        dataAttr: _config.DATA_ATTR,
        timestampAttr: _config.TIMESTAMP_ATTR
      }, params);

      return (0, _highlights.retrieveHighlights)(mergedParams);
    }
    /**
     * Returns true if element is a highlight.
     *
     * @param el - element to check.
     * @returns {boolean}
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "isHighlight",
    value: function isHighlight(el, dataAttr) {
      return (0, _highlights.isElementHighlight)(el, dataAttr);
    }
    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "serializeHighlights",
    value: function serializeHighlights() {
      var highlights = this.getHighlights(),
          refEl = this.el,
          hlDescriptors = [];

      function getElementPath(el, refElement) {
        var path = [],
            childNodes;

        do {
          childNodes = Array.prototype.slice.call(el.parentNode.childNodes);
          path.unshift(childNodes.indexOf(el));
          el = el.parentNode;
        } while (el !== refElement || !el);

        return path;
      }

      (0, _highlights.sortByDepth)(highlights, false);
      highlights.forEach(function (highlight) {
        var offset = 0,
            // Hl offset from previous sibling within parent node.
        length = highlight.textContent.length,
            hlPath = getElementPath(highlight, refEl),
            wrapper = highlight.cloneNode(true);
        wrapper.innerHTML = "";
        wrapper = wrapper.outerHTML;

        if (highlight.previousSibling && highlight.previousSibling.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
          offset = highlight.previousSibling.length;
        }

        hlDescriptors.push([wrapper, highlight.textContent, hlPath.join(":"), offset, length]);
      });
      return JSON.stringify(hlDescriptors);
    }
    /**
     * Deserializes highlights.
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof PrimitivoHighlighter
     */

  }, {
    key: "deserializeHighlights",
    value: function deserializeHighlights(json) {
      var hlDescriptors,
          highlights = [],
          self = this;

      if (!json) {
        return highlights;
      }

      try {
        hlDescriptors = JSON.parse(json);
      } catch (e) {
        throw "Can't parse JSON: " + e;
      }

      function deserializationFn(hlDescriptor) {
        var hl = {
          wrapper: hlDescriptor[0],
          text: hlDescriptor[1],
          path: hlDescriptor[2].split(":"),
          offset: hlDescriptor[3],
          length: hlDescriptor[4]
        },
            elIndex = hl.path.pop(),
            node = self.el,
            hlNode,
            highlight,
            idx;

        while (idx = hl.path.shift()) {
          node = node.childNodes[idx];
        }

        if (node.childNodes[elIndex - 1] && node.childNodes[elIndex - 1].nodeType === _dom.NODE_TYPE.TEXT_NODE) {
          elIndex -= 1;
        }

        node = node.childNodes[elIndex];
        hlNode = node.splitText(hl.offset);
        hlNode.splitText(hl.length);

        if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
          (0, _dom["default"])(hlNode.nextSibling).remove();
        }

        if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
          (0, _dom["default"])(hlNode.previousSibling).remove();
        }

        highlight = (0, _dom["default"])(hlNode).wrap((0, _dom["default"])().fromHTML(hl.wrapper)[0]);
        highlights.push(highlight);
      }

      hlDescriptors.forEach(function (hlDescriptor) {
        try {
          deserializationFn(hlDescriptor);
        } catch (e) {
          if (console && console.warn) {
            console.warn("Can't deserialize highlight descriptor. Cause: " + e);
          }
        }
      });
      return highlights;
    }
  }]);

  return PrimitivoHighlighter;
}();

var _default = PrimitivoHighlighter;
exports["default"] = _default;

},{"../config":1,"../utils/arrays":7,"../utils/dom":8,"../utils/highlights":10}],5:[function(require,module,exports){
"use strict";

/* global jQuery TextHighlighter */
if (typeof jQuery !== "undefined") {
  (function ($) {
    "use strict";

    var PLUGIN_NAME = "textHighlighter";

    function wrap(fn, wrapper) {
      return function () {
        wrapper.call(this, fn);
      };
    }
    /**
     * The jQuery plugin namespace.
     * @external "jQuery.fn"
     * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
     */

    /**
     * Creates TextHighlighter instance and applies it to the given jQuery object.
     * @param {object} options Same as {@link TextHighlighter} options.
     * @returns {jQuery}
     * @example $('#sandbox').textHighlighter({ color: 'red' });
     * @function external:"jQuery.fn".textHighlighter
     */


    $.fn.textHighlighter = function (options) {
      return this.each(function () {
        var el = this,
            hl;

        if (!$.data(el, PLUGIN_NAME)) {
          hl = new TextHighlighter(el, options);
          hl.destroy = wrap(hl.destroy, function (destroy) {
            destroy.call(hl);
            $(el).removeData(PLUGIN_NAME);
          });
          $.data(el, PLUGIN_NAME, hl);
        }
      });
    };

    $.fn.getHighlighter = function () {
      return this.data(PLUGIN_NAME);
    };
  })(jQuery);
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dom = _interopRequireDefault(require("./utils/dom"));

var _events = require("./utils/events");

var _primitivo = _interopRequireDefault(require("./highlighters/primitivo"));

var _independencia = _interopRequireDefault(require("./highlighters/independencia"));

var _config = require("./config");

var _highlights = require("./utils/highlights");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var highlighters = {
  primitivo: _primitivo["default"],
  "v1-2014": _primitivo["default"],
  independencia: _independencia["default"],
  "v2-2019": _independencia["default"]
};
/**
 * TextHighlighter that provides text highlighting functionality to dom elements.
 */

var TextHighlighter =
/*#__PURE__*/
function () {
  /**
   * Creates TextHighlighter instance and binds to given DOM elements.
   *
   * @param {HTMLElement} element - DOM element to which highlighted will be applied.
   * @param {object} [options] - additional options.
   * @param {string} options.version - The version of the text highlighting functionality to use.
   * There are two options:
   *   primitivo (v1-2014) is for the initial implementation using interdependent highlight locators.
   *   (Lots of issues for requirements beyond simple all or nothing highlights)
   *
   *   independencia (v2-2019) is for an improved implementation focusing on making highlights independent
   *   from eachother and other element nodes within the context DOM object. v2 uses data attributes
   *   as the source of truth about the text range selected to create the original highlight.
   *   This allows us freedom to manipulate the DOM at will and handle overlapping highlights a lot better.
   *
   * @param {string} options.color - highlight color.
   * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
   * @param {string} options.contextClass - class added to element to which highlighter is applied,
   *  'highlighter-context' by default.
   * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
   *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
   * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
   *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
   * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param.
   * @class TextHighlighter
   */
  function TextHighlighter(element, options) {
    _classCallCheck(this, TextHighlighter);

    if (!element) {
      throw new Error("Missing anchor element");
    }

    this.el = element;
    this.options = _objectSpread({
      color: "#ffff7b",
      highlightedClass: "highlighted",
      contextClass: "highlighter-context",
      version: "independencia",
      onRemoveHighlight: function onRemoveHighlight() {
        return true;
      },
      onBeforeHighlight: function onBeforeHighlight() {
        return true;
      },
      onAfterHighlight: function onAfterHighlight() {}
    }, options);

    if (!highlighters[this.options.version]) {
      throw new Error("Please provide a valid version of the text highlighting functionality");
    }

    this.highlighter = new highlighters[this.options.version](this.el, this.options);
    (0, _dom["default"])(this.el).addClass(this.options.contextClass);
    (0, _events.bindEvents)(this.el, this);
  }
  /**
   * Permanently disables highlighting.
   * Unbinds events and remove context element class.
   * @memberof TextHighlighter
   */


  _createClass(TextHighlighter, [{
    key: "destroy",
    value: function destroy() {
      (0, _events.unbindEvents)(this.el, this);
      (0, _dom["default"])(this.el).removeClass(this.options.contextClass);
    }
  }, {
    key: "highlightHandler",
    value: function highlightHandler() {
      this.doHighlight();
    }
    /**
     * Highlights current range.
     * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
     * @memberof TextHighlighter
     */

  }, {
    key: "doHighlight",
    value: function doHighlight(keepRange) {
      var range = (0, _dom["default"])(this.el).getRange(),
          wrapper,
          createdHighlights,
          normalizedHighlights,
          timestamp;

      if (!range || range.collapsed) {
        return;
      }

      if (this.options.onBeforeHighlight(range) === true) {
        timestamp = +new Date();
        wrapper = (0, _highlights.createWrapper)(this.options);
        wrapper.setAttribute(_config.TIMESTAMP_ATTR, timestamp);
        createdHighlights = this.highlightRange(range, wrapper);
        normalizedHighlights = this.normalizeHighlights(createdHighlights);
        this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
      }

      if (!keepRange) {
        (0, _dom["default"])(this.el).removeAllRanges();
      }
    }
    /**
     * Highlights range.
     * Wraps text of given range object in wrapper element.
     * @param {Range} range
     * @param {HTMLElement} wrapper
     * @returns {Array} - array of created highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "highlightRange",
    value: function highlightRange(range, wrapper) {
      return this.highlighter.highlightRange(range, wrapper);
    }
    /**
     * Normalizes highlights. Ensure at least text nodes are normalized, carries out some flattening and nesting
     * where necessary.
     *
     * @param {Array} highlights - highlights to normalize.
     * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
     * input highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "normalizeHighlights",
    value: function normalizeHighlights(highlights) {
      return this.highlighter.normalizeHighlights(highlights);
    }
    /**
     * Sets highlighting color.
     * @param {string} color - valid CSS color.
     * @memberof TextHighlighter
     */

  }, {
    key: "setColor",
    value: function setColor(color) {
      this.options.color = color;
    }
    /**
     * Returns highlighting color.
     * @returns {string}
     * @memberof TextHighlighter
     */

  }, {
    key: "getColor",
    value: function getColor() {
      return this.options.color;
    }
    /**
     * Removes highlights from element. If element is a highlight itself, it is removed as well.
     * If no element is given, all highlights all removed.
     * @param {HTMLElement} [element] - element to remove highlights from
     * @memberof TextHighlighter
     */

  }, {
    key: "removeHighlights",
    value: function removeHighlights(element) {
      this.highlighter.removeHighlights(element);
    }
    /**
     * Returns highlights from given container.
     * @param params
     * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
     * highlighter is applied to.
     * @param {boolean} [params.andSelf] - if set to true and container is a highlight itself, add container to
     * returned results. Default: true.
     * @param {boolean} [params.grouped] - if set to true, highlights are grouped in logical groups of highlights added
     * in the same moment. Each group is an object which has got array of highlights, 'toString' method and 'timestamp'
     * property. Default: false.
     * @returns {Array} - array of highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "getHighlights",
    value: function getHighlights(params) {
      return this.highlighter.getHighlights(params);
    }
    /**
     * Returns true if element is a highlight.
     * All highlights have 'data-highlighted' attribute.
     * @param el - element to check.
     * @returns {boolean}
     * @memberof TextHighlighter
     */

  }, {
    key: "isHighlight",
    value: function isHighlight(el) {
      return this.highlighter.isHighlight(el, _config.DATA_ATTR);
    }
    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
     */

  }, {
    key: "serializeHighlights",
    value: function serializeHighlights() {
      return this.highlighter.serializeHighlights();
    }
    /**
     * Deserializes highlights.
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "deserializeHighlights",
    value: function deserializeHighlights(json) {
      return this.highlighter.deserializeHighlights(json);
    }
    /**
     * Finds and highlights given text.
     * @param {string} text - text to search for
     * @param {boolean} [caseSensitive] - if set to true, performs case sensitive search (default: true)
     * @memberof TextHighlighter
     */

  }, {
    key: "find",
    value: function find(text, caseSensitive) {
      var wnd = (0, _dom["default"])(this.el).getWindow(),
          scrollX = wnd.scrollX,
          scrollY = wnd.scrollY,
          caseSens = typeof caseSensitive === "undefined" ? true : caseSensitive;
      (0, _dom["default"])(this.el).removeAllRanges();

      if (wnd.find) {
        while (wnd.find(text, caseSens)) {
          this.doHighlight(true);
        }
      } else if (wnd.document.body.createTextRange) {
        var textRange = wnd.document.body.createTextRange();
        textRange.moveToElementText(this.el);

        while (textRange.findText(text, 1, caseSens ? 4 : 0)) {
          if (!(0, _dom["default"])(this.el).contains(textRange.parentElement()) && textRange.parentElement() !== this.el) {
            break;
          }

          textRange.select();
          this.doHighlight(true);
          textRange.collapse(false);
        }
      }

      (0, _dom["default"])(this.el).removeAllRanges();
      wnd.scrollTo(scrollX, scrollY);
    }
  }]);

  return TextHighlighter;
}();

var _default = TextHighlighter;
exports["default"] = _default;

},{"./config":1,"./highlighters/independencia":3,"./highlighters/primitivo":4,"./utils/dom":8,"./utils/events":9,"./utils/highlights":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unique = unique;

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

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.NODE_TYPE = void 0;
var NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 */

exports.NODE_TYPE = NODE_TYPE;

var dom = function dom(el) {
  return (
    /** @lends dom **/
    {
      /**
       * Adds class to element.
       * @param {string} className
       */
      addClass: function addClass(className) {
        if (el.classList) {
          el.classList.add(className);
        } else {
          el.className += " " + className;
        }
      },

      /**
       * Removes class from element.
       * @param {string} className
       */
      removeClass: function removeClass(className) {
        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(new RegExp("(^|\\b)" + className + "(\\b|$)", "gi"), " ");
        }
      },

      /**
       * Prepends child nodes to base element.
       * @param {Node[]} nodesToPrepend
       */
      prepend: function prepend(nodesToPrepend) {
        var nodes = Array.prototype.slice.call(nodesToPrepend),
            i = nodes.length;

        while (i--) {
          el.insertBefore(nodes[i], el.firstChild);
        }
      },

      /**
       * Appends child nodes to base element.
       * @param {Node[]} nodesToAppend
       */
      append: function append(nodesToAppend) {
        var nodes = Array.prototype.slice.call(nodesToAppend);

        for (var i = 0, len = nodes.length; i < len; ++i) {
          el.appendChild(nodes[i]);
        }
      },

      /**
       * Inserts base element after refEl.
       * @param {Node} refEl - node after which base element will be inserted
       * @returns {Node} - inserted element
       */
      insertAfter: function insertAfter(refEl) {
        return refEl.parentNode.insertBefore(el, refEl.nextSibling);
      },

      /**
       * Inserts base element before refEl.
       * @param {Node} refEl - node before which base element will be inserted
       * @returns {Node} - inserted element
       */
      insertBefore: function insertBefore(refEl) {
        return refEl.parentNode.insertBefore(el, refEl);
      },

      /**
       * Removes base element from DOM.
       */
      remove: function remove() {
        el.parentNode.removeChild(el);
        el = null;
      },

      /**
       * Returns true if base element contains given child.
       * @param {Node|HTMLElement} child
       * @returns {boolean}
       */
      contains: function contains(child) {
        return el !== child && el.contains(child);
      },

      /**
       * Wraps base element in wrapper element.
       * @param {HTMLElement} wrapper
       * @returns {HTMLElement} wrapper element
       */
      wrap: function wrap(wrapper) {
        if (el.parentNode) {
          el.parentNode.insertBefore(wrapper, el);
        }

        wrapper.appendChild(el);
        return wrapper;
      },

      /**
       * Unwraps base element.
       * @returns {Node[]} - child nodes of unwrapped element.
       */
      unwrap: function unwrap() {
        var nodes = Array.prototype.slice.call(el.childNodes),
            wrapper;
        nodes.forEach(function (node) {
          wrapper = node.parentNode;
          dom(node).insertBefore(node.parentNode);
        });
        dom(wrapper).remove();
        return nodes;
      },

      /**
       * Returns array of base element parents.
       * @returns {HTMLElement[]}
       */
      parents: function parents() {
        var parent,
            path = [];

        while (parent = el.parentNode) {
          path.push(parent);
          el = parent;
        }

        return path;
      },

      /**
       * Returns array of base element parents, excluding the document.
       * @returns {HTMLElement[]}
       */
      parentsWithoutDocument: function parentsWithoutDocument() {
        return this.parents().filter(function (elem) {
          return elem !== document;
        });
      },

      /**
       * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
       * element node has only one text node.
       * It should does the same as standard element.normalize, but IE implements it incorrectly.
       */
      normalizeTextNodes: function normalizeTextNodes() {
        if (!el) {
          return;
        }

        if (el.nodeType === NODE_TYPE.TEXT_NODE) {
          while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
            el.nodeValue += el.nextSibling.nodeValue;
            el.parentNode.removeChild(el.nextSibling);
          }
        } else {
          dom(el.firstChild).normalizeTextNodes();
        }

        dom(el.nextSibling).normalizeTextNodes();
      },

      /**
       * Returns element background color.
       * @returns {CSSStyleDeclaration.backgroundColor}
       */
      color: function color() {
        return el.style.backgroundColor;
      },

      /**
       * Creates dom element from given html string.
       * @param {string} html
       * @returns {NodeList}
       */
      fromHTML: function fromHTML(html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.childNodes;
      },

      /**
       * Returns first range of the window of base element.
       * @returns {Range}
       */
      getRange: function getRange() {
        var selection = dom(el).getSelection(),
            range;

        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        }

        return range;
      },

      /**
       * Removes all ranges of the window of base element.
       */
      removeAllRanges: function removeAllRanges() {
        var selection = dom(el).getSelection();
        selection.removeAllRanges();
      },

      /**
       * Returns selection object of the window of base element.
       * @returns {Selection}
       */
      getSelection: function getSelection() {
        return dom(el).getWindow().getSelection();
      },

      /**
       * Returns window of the base element.
       * @returns {Window}
       */
      getWindow: function getWindow() {
        return dom(el).getDocument().defaultView;
      },

      /**
       * Returns document of the base element.
       * @returns {HTMLDocument}
       */
      getDocument: function getDocument() {
        // if ownerDocument is null then el is the document itself.
        return el.ownerDocument || el;
      }
    }
  );
};

var _default = dom;
exports["default"] = _default;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindEvents = bindEvents;
exports.unbindEvents = unbindEvents;

function bindEvents(el, scope) {
  el.addEventListener("mouseup", scope.highlightHandler.bind(scope));
  el.addEventListener("touchend", scope.highlightHandler.bind(scope));
}

function unbindEvents(el, scope) {
  el.removeEventListener("mouseup", scope.highlightHandler.bind(scope));
  el.removeEventListener("touchend", scope.highlightHandler.bind(scope));
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refineRangeBoundaries = refineRangeBoundaries;
exports.sortByDepth = sortByDepth;
exports.haveSameColor = haveSameColor;
exports.createWrapper = createWrapper;
exports.findTextNodeAtLocation = findTextNodeAtLocation;
exports.findNodeAndOffset = findNodeAndOffset;
exports.getElementOffset = getElementOffset;
exports.findFirstNonSharedParent = findFirstNonSharedParent;
exports.extractElementContentForHighlight = extractElementContentForHighlight;
exports.nodesInBetween = nodesInBetween;
exports.groupHighlights = groupHighlights;
exports.retrieveHighlights = retrieveHighlights;
exports.isElementHighlight = isElementHighlight;

var _dom = _interopRequireWildcard(require("./dom"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
function refineRangeBoundaries(range) {
  var startContainer = range.startContainer,
      endContainer = range.endContainer,
      ancestor = range.commonAncestorContainer,
      goDeeper = true;

  if (range.endOffset === 0) {
    while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
      endContainer = endContainer.parentNode;
    }

    endContainer = endContainer.previousSibling;
  } else if (endContainer.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
    if (range.endOffset < endContainer.nodeValue.length) {
      endContainer.splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }

  if (startContainer.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
    if (range.startOffset === startContainer.nodeValue.length) {
      goDeeper = false;
    } else if (range.startOffset > 0) {
      startContainer = startContainer.splitText(range.startOffset);

      if (endContainer === startContainer.previousSibling) {
        endContainer = startContainer;
      }
    }
  } else if (range.startOffset < startContainer.childNodes.length) {
    startContainer = startContainer.childNodes.item(range.startOffset);
  } else {
    startContainer = startContainer.nextSibling;
  }

  return {
    startContainer: startContainer,
    endContainer: endContainer,
    goDeeper: goDeeper
  };
}
/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */


function sortByDepth(arr, descending) {
  arr.sort(function (a, b) {
    return (0, _dom["default"])(descending ? b : a).parents().length - (0, _dom["default"])(descending ? a : b).parents().length;
  });
}
/**
 * Returns true if elements a i b have the same color.
 * @param {Node} a
 * @param {Node} b
 * @returns {boolean}
 */


function haveSameColor(a, b) {
  return (0, _dom["default"])(a).color() === (0, _dom["default"])(b).color();
}
/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 */


function createWrapper(options) {
  var span = document.createElement("span");
  span.style.backgroundColor = options.color;
  span.className = options.highlightedClass;
  return span;
}

function findTextNodeAtLocation(element, locationInChildNodes) {
  console.log("Element as parameter: ", element);
  var textNodeElement = element;
  var i = 0;

  while (textNodeElement && textNodeElement.nodeType !== _dom.NODE_TYPE.TEXT_NODE) {
    console.log("textNodeElement step ".concat(i), textNodeElement);

    if (locationInChildNodes === "start") {
      if (textNodeElement.childNodes.length > 0) {
        textNodeElement = textNodeElement.childNodes[0];
      } else {
        textNodeElement = textNodeElement.nextSibling;
      }
    } else if (locationInChildNodes === "end") {
      if (textNodeElement.childNodes.length > 0) {
        var lastIndex = textNodeElement.childNodes.length - 1;
        textNodeElement = textNodeElement.childNodes[lastIndex];
      } else {
        textNodeElement = textNodeElement.previousSibling;
      }
    } else {
      textNodeElement = null;
    }

    i++;
  }

  console.log("text node element returned: ", textNodeElement);
  return textNodeElement;
}
/**
 * Determine where to inject a highlight based on it's offset.
 *
 * @param {*} highlight
 * @param {*} parentNode
 */


function findNodeAndOffset(highlight, parentNode) {
  var currentNode = parentNode;
  var currentOffset = 0;
  var offsetWithinNode = 0;
  var locationFound = false;

  while (currentNode && !locationFound && (currentOffset < highlight.offset || currentOffset === highlight.offset && currentNode.childNodes.length > 0)) {
    var endOfNodeOffset = currentOffset + currentNode.textContent.length;

    if (endOfNodeOffset > highlight.offset) {
      if (currentNode.childNodes.length === 0) {
        offsetWithinNode = highlight.offset - currentOffset;
        locationFound = true;
        currentOffset = currentOffset + offsetWithinNode;
      } else {
        currentNode = currentNode.childNodes[0];
      }
    } else {
      currentOffset = endOfNodeOffset;
      currentNode = currentNode.nextSibling;
    }
  }

  return {
    node: currentNode,
    offset: offsetWithinNode
  };
}

function getElementOffset(childElement, rootElement) {
  var offset = 0;
  var childNodes;
  var currentElement = childElement;

  do {
    childNodes = Array.prototype.slice.call(currentElement.parentNode.childNodes);
    var childElementIndex = childNodes.indexOf(currentElement);
    var offsetInCurrentParent = getTextOffsetBefore(childNodes, childElementIndex);
    offset += offsetInCurrentParent;
    currentElement = currentElement.parentNode;
  } while (currentElement !== rootElement || !currentElement);

  return offset;
}

function getTextOffsetBefore(childNodes, cutIndex) {
  var textOffset = 0;

  for (var i = 0; i < cutIndex; i++) {
    var currentNode = childNodes[i]; // Use textContent and not innerHTML to account for invisible characters as well.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

    var text = currentNode.textContent;

    if (text && text.length > 0) {
      textOffset += text.length;
    }
  }

  return textOffset;
}

function findFirstNonSharedParent(elements) {
  var childElement = elements.childElement;
  var otherElement = elements.otherElement;
  var parents = (0, _dom["default"])(childElement).parentsWithoutDocument();
  var i = 0;
  var firstNonSharedParent = null;
  var allParentsAreShared = false;

  while (!firstNonSharedParent && !allParentsAreShared && i < parents.length) {
    var currentParent = parents[i];

    if (currentParent.contains(otherElement)) {
      console.log("currentParent contains other element!", currentParent);

      if (i > 0) {
        firstNonSharedParent = parents[i - 1];
      } else {
        allParentsAreShared = true;
      }
    }

    i++;
  }

  return firstNonSharedParent;
}

var siblingRemovalDirections = {
  start: "previousSibling",
  end: "nextSibling"
};

function extractElementContentForHighlight(params) {
  var element = params.element;
  var elementAncestor = params.elementAncestor;
  var options = params.options;
  var locationInSelection = params.locationInSelection;
  var elementAncestorCopy = elementAncestor.cloneNode(true); // Beginning of childNodes list for end container in selection
  // and end of childNodes list for start container in selection.

  var locationInChildNodes = locationInSelection === "start" ? "end" : "start";
  var elementCopy = findTextNodeAtLocation(elementAncestorCopy, locationInChildNodes);
  var elementCopyParent = elementCopy.parentNode;
  var siblingRemovalDirection = siblingRemovalDirections[locationInSelection];
  var sibling = elementCopy[siblingRemovalDirection];

  while (sibling) {
    elementCopyParent.removeChild(sibling);
    sibling = elementCopy[siblingRemovalDirection];
  }

  console.log("elementCopy: ", elementCopy);
  console.log("elementCopyParent: ", elementCopyParent); // Clean out any nested highlight wrappers.

  if (elementCopyParent !== elementAncestorCopy && elementCopyParent.classList.contains(options.highlightedClass)) {
    (0, _dom["default"])(elementCopyParent).unwrap();
  } // Remove the text node that we need for the new highlight
  // from the existing highlight or other element.


  element.parentNode.removeChild(element);
  return elementAncestorCopy;
}

function nodesInBetween(startNode, endNode) {
  if (startNode === endNode) {
    return [];
  } // TODO: get all nodes that are in between the two nodes across different levels in the DOM tree.

}
/**
 * Groups given highlights by timestamp.
 * @param {Array} highlights
 * @param {string} timestampAttr
 * @returns {Array} Grouped highlights.
 */


function groupHighlights(highlights, timestampAttr) {
  var order = [],
      chunks = {},
      grouped = [];
  highlights.forEach(function (hl) {
    var timestamp = hl.getAttribute(timestampAttr);

    if (typeof chunks[timestamp] === "undefined") {
      chunks[timestamp] = [];
      order.push(timestamp);
    }

    chunks[timestamp].push(hl);
  });
  order.forEach(function (timestamp) {
    var group = chunks[timestamp];
    grouped.push({
      chunks: group,
      timestamp: timestamp,
      toString: function toString() {
        return group.map(function (h) {
          return h.textContent;
        }).join("");
      }
    });
  });
  return grouped;
}

function retrieveHighlights(params) {
  params = _objectSpread({
    andSelf: true,
    grouped: false
  }, params);
  var nodeList = params.container.querySelectorAll("[" + params.dataAttr + "]"),
      highlights = Array.prototype.slice.call(nodeList);

  if (params.andSelf === true && params.container.hasAttribute(params.dataAttr)) {
    highlights.push(params.container);
  }

  if (params.grouped) {
    highlights = groupHighlights(highlights, params.timestampAttr);
  }

  return highlights;
}

function isElementHighlight(el, dataAttr) {
  return el && el.nodeType === _dom.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(dataAttr);
}

},{"./dom":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzIiwic3JjL2dsb2JhbC1zY3JpcHQuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWEuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2by5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUlPLElBQU0sU0FBUyxHQUFHLGtCQUFsQjtBQUVQOzs7Ozs7QUFJTyxJQUFNLGNBQWMsR0FBRyxnQkFBdkI7O0FBRUEsSUFBTSxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsaUJBQXhCO0FBRVA7Ozs7OztBQUlPLElBQU0sV0FBVyxHQUFHLENBQ3pCLFFBRHlCLEVBRXpCLE9BRnlCLEVBR3pCLFFBSHlCLEVBSXpCLFFBSnlCLEVBS3pCLFFBTHlCLEVBTXpCLFFBTnlCLEVBT3pCLFFBUHlCLEVBUXpCLE9BUnlCLEVBU3pCLE9BVHlCLEVBVXpCLFFBVnlCLEVBV3pCLE9BWHlCLEVBWXpCLE9BWnlCLEVBYXpCLE9BYnlCLEVBY3pCLFVBZHlCLENBQXBCOzs7Ozs7O0FDbkJQOztBQVlBOzs7O0FBVkE7Ozs7QUFJQSxNQUFNLENBQUMsZUFBUCxHQUF5QiwyQkFBekI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7O0FBV0E7O0FBTUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLHdCOzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsb0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxP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TyxFQUFFLElBREw7QUFFSixJQUFBLE9BQU8sRUFBRTtBQUZMLEtBR0QsTUFIQyxDQUFOO0FBTUEsTUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsZ0JBQWpCLENBQWtDLE1BQU0sTUFBTSxDQUFDLFFBQWIsR0FBd0IsR0FBMUQsQ0FBZjtBQUFBLE1BQ0UsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFFBQTNCLENBRGY7O0FBR0EsTUFDRSxNQUFNLENBQUMsT0FBUCxLQUFtQixJQUFuQixJQUNBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFlBQWpCLENBQThCLE1BQU0sQ0FBQyxRQUFyQyxDQUZGLEVBR0U7QUFDQSxJQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE1BQU0sQ0FBQyxTQUF2QjtBQUNEOztBQUVELE1BQUksTUFBTSxDQUFDLE9BQVgsRUFBb0I7QUFDbEIsSUFBQSxVQUFVLEdBQUcsZUFBZSxDQUFDLFVBQUQsRUFBYSxNQUFNLENBQUMsYUFBcEIsQ0FBNUI7QUFDRDs7QUFFRCxTQUFPLFVBQVA7QUFDRDs7QUFFTSxTQUFTLGtCQUFULENBQTRCLEVBQTVCLEVBQWdDLFFBQWhDLEVBQTBDO0FBQy9DLFNBQ0UsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFILEtBQWdCLGVBQVUsWUFBaEMsSUFBZ0QsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsQ0FEbEQ7QUFHRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQXR0cmlidXRlIGFkZGVkIGJ5IGRlZmF1bHQgdG8gZXZlcnkgaGlnaGxpZ2h0LlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IERBVEFfQVRUUiA9IFwiZGF0YS1oaWdobGlnaHRlZFwiO1xuXG4vKipcbiAqIEF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIGhpZ2hsaWdodCB3cmFwcGVycy5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBUSU1FU1RBTVBfQVRUUiA9IFwiZGF0YS10aW1lc3RhbXBcIjtcblxuZXhwb3J0IGNvbnN0IFNUQVJUX09GRlNFVF9BVFRSID0gXCJkYXRhLXN0YXJ0LW9mZnNldFwiO1xuZXhwb3J0IGNvbnN0IEVORF9PRkZTRVRfQVRUUiA9IFwiZGF0YS1lbmQtb2Zmc2V0XCI7XG5cbi8qKlxuICogRG9uJ3QgaGlnaGxpZ2h0IGNvbnRlbnQgb2YgdGhlc2UgdGFncy5cbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqL1xuZXhwb3J0IGNvbnN0IElHTk9SRV9UQUdTID0gW1xuICBcIlNDUklQVFwiLFxuICBcIlNUWUxFXCIsXG4gIFwiU0VMRUNUXCIsXG4gIFwiT1BUSU9OXCIsXG4gIFwiQlVUVE9OXCIsXG4gIFwiT0JKRUNUXCIsXG4gIFwiQVBQTEVUXCIsXG4gIFwiVklERU9cIixcbiAgXCJBVURJT1wiLFxuICBcIkNBTlZBU1wiLFxuICBcIkVNQkVEXCIsXG4gIFwiUEFSQU1cIixcbiAgXCJNRVRFUlwiLFxuICBcIlBST0dSRVNTXCJcbl07XG4iLCJpbXBvcnQgVGV4dEhpZ2hsaWdodGVyIGZyb20gXCIuL3RleHQtaGlnaGxpZ2h0ZXJcIjtcblxuLyoqXG4gKiBFeHBvc2UgdGhlIFRleHRIaWdobGlnaHRlciBjbGFzcyBnbG9iYWxseSB0byBiZVxuICogdXNlZCBpbiBkZW1vcyBhbmQgdG8gYmUgaW5qZWN0ZWQgZGlyZWN0bHkgaW50byBodG1sIGZpbGVzLlxuICovXG5nbG9iYWwuVGV4dEhpZ2hsaWdodGVyID0gVGV4dEhpZ2hsaWdodGVyO1xuXG4vKipcbiAqIExvYWQgdGhlIGpxdWVyeSBwbHVnaW4gZ2xvYmFsbHkgZXhwZWN0aW5nIGpRdWVyeSBhbmQgVGV4dEhpZ2hsaWdodGVyIHRvIGJlIGdsb2JhbGx5XG4gKiBhdmFpYWJsZSwgdGhpcyBtZWFucyB0aGlzIGxpYnJhcnkgZG9lc24ndCBuZWVkIGEgaGFyZCByZXF1aXJlbWVudCBvZiBqUXVlcnkuXG4gKi9cbmltcG9ydCBcIi4vanF1ZXJ5LXBsdWdpblwiO1xuIiwiaW1wb3J0IHtcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIGdldEVsZW1lbnRPZmZzZXQsXG4gIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24sXG4gIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCxcbiAgZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0LFxuICBub2Rlc0luQmV0d2VlbixcbiAgc29ydEJ5RGVwdGgsXG4gIGZpbmROb2RlQW5kT2Zmc2V0XG59IGZyb20gXCIuLi91dGlscy9oaWdobGlnaHRzXCI7XG5pbXBvcnQge1xuICBTVEFSVF9PRkZTRVRfQVRUUixcbiAgRU5EX09GRlNFVF9BVFRSLFxuICBEQVRBX0FUVFIsXG4gIFRJTUVTVEFNUF9BVFRSXG59IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBkb20gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgdW5pcXVlIH0gZnJvbSBcIi4uL3V0aWxzL2FycmF5c1wiO1xuXG4vKipcbiAqIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciB0aGF0IHByb3ZpZGVzIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gZG9tIGVsZW1lbnRzXG4gKiB3aXRoIGEgZm9jdXMgb24gcmVtb3ZpbmcgaW50ZXJkZXBlbmRlbmNlIGJldHdlZW4gaGlnaGxpZ2h0cyBhbmQgb3RoZXIgZWxlbWVudCBub2RlcyBpbiB0aGUgY29udGV4dCBlbGVtZW50LlxuICovXG5jbGFzcyBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciBpbnN0YW5jZSBmb3IgZnVuY3Rpb25hbGl0eSB0aGF0IGZvY3VzZXMgZm9yIGhpZ2hsaWdodCBpbmRlcGVuZGVuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHRoZSByYW5nZSBhbGxvd2luZyBpc29sYXRpb24gZm9yIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMuXG4gICAqIFRoaXMgc29sdXRpb24gc3RlYWxzIHRoZSB0ZXh0IG9yIG90aGVyIG5vZGVzIGluIHRoZSBET00gZnJvbSBvdmVybGFwcGluZyAoTk9UIE5FU1RFRCkgaGlnaGxpZ2h0c1xuICAgKiBmb3IgcmVwcmVzZW50YXRpb24gaW4gdGhlIERPTS5cbiAgICpcbiAgICogRm9yIHRoZSBwdXJwb3NlIG9mIHNlcmlhbGlzYXRpb24gdGhpcyB3aWxsIG1haW50YWluIGEgZGF0YSBhdHRyaWJ1dGUgb24gdGhlIGhpZ2hsaWdodCB3cmFwcGVyXG4gICAqIHdpdGggdGhlIHN0YXJ0IHRleHQgYW5kIGVuZCB0ZXh0IG9mZnNldHMgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcm9vdCBlbGVtZW50LlxuICAgKlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyOTogUkFOR0U6IFwiLCByYW5nZSk7XG5cbiAgICBsZXQgaGlnaGxpZ2h0cyA9IFtdO1xuICAgIGxldCB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcblxuICAgIGxldCBzdGFydE9mZnNldCA9XG4gICAgICBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLnN0YXJ0Q29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgIGxldCBlbmRPZmZzZXQgPVxuICAgICAgcmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHJhbmdlLmVuZENvbnRhaW5lclxuICAgICAgICA/IHN0YXJ0T2Zmc2V0ICsgKHJhbmdlLmVuZE9mZnNldCAtIHJhbmdlLnN0YXJ0T2Zmc2V0KVxuICAgICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLmVuZE9mZnNldDtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJBTFNEZWJ1ZzI5OiBzdGFydE9mZnNldDogXCIsXG4gICAgICBzdGFydE9mZnNldCxcbiAgICAgIFwiZW5kT2Zmc2V0OiBcIixcbiAgICAgIGVuZE9mZnNldFxuICAgICk7XG5cbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKFNUQVJUX09GRlNFVF9BVFRSLCBzdGFydE9mZnNldCk7XG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShFTkRfT0ZGU0VUX0FUVFIsIGVuZE9mZnNldCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIFNUQVJUIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2Uuc3RhcnRDb250YWluZXI6IFwiLCByYW5nZS5zdGFydENvbnRhaW5lcik7XG4gICAgbGV0IHN0YXJ0Q29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5zdGFydENvbnRhaW5lciwgXCJzdGFydFwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuXFxuIEZJTkRJTkcgRU5EIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2UuZW5kQ29udGFpbmVyOiBcIiwgcmFuZ2UuZW5kQ29udGFpbmVyKTtcbiAgICBsZXQgZW5kQ29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5lbmRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBpZiAoIXN0YXJ0Q29udGFpbmVyIHx8ICFlbmRDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJGYWlsZWQgdG8gZmluZCB0aGUgdGV4dCBub2RlIGZvciB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgc2VsZWN0ZWQgcmFuZ2VcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJOZXdIaWdobGlnaHQgPVxuICAgICAgcmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCAtIDFcbiAgICAgICAgPyBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldClcbiAgICAgICAgOiBlbmRDb250YWluZXI7XG5cbiAgICBpZiAoc3RhcnRDb250YWluZXIgPT09IGVuZENvbnRhaW5lcikge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPVxuICAgICAgICByYW5nZS5zdGFydE9mZnNldCA+IDBcbiAgICAgICAgICA/IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldClcbiAgICAgICAgICA6IHN0YXJ0Q29udGFpbmVyO1xuICAgICAgLy8gU2ltcGx5IHdyYXAgdGhlIHNlbGVjdGVkIHJhbmdlIGluIHRoZSBzYW1lIGNvbnRhaW5lciBhcyBhIGhpZ2hsaWdodC5cbiAgICAgIGxldCBoaWdobGlnaHQgPSBkb20oc3RhcnRPZk5ld0hpZ2hsaWdodCkud3JhcCh3cmFwcGVyQ2xvbmUpO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfSBlbHNlIGlmIChlbmRDb250YWluZXIudGV4dENvbnRlbnQubGVuZ3RoID49IHJhbmdlLmVuZE9mZnNldCkge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPSBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0ID0gYWZ0ZXJOZXdIaWdobGlnaHQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiTm9kZSBhdCB0aGUgc3RhcnQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJOb2RlIGF0IHRoZSBlbmQgb2YgbmV3IGhpZ2hsaWdodDogXCIsIGVuZE9mTmV3SGlnaGxpZ2h0KTtcblxuICAgICAgY29uc3Qgc3RhcnRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN0YXJ0RWxlbWVudFBhcmVudENvcHk7XG4gICAgICBpZiAoc3RhcnRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgIHN0YXJ0RWxlbWVudFBhcmVudENvcHkgPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoe1xuICAgICAgICAgIGVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHQsXG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwic3RhcnRcIlxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0RWxlbWVudFBhcmVudDpcIiwgc3RhcnRFbGVtZW50UGFyZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydEVsZW1lbnRQYXJlbnRDb3B5OiBcIiwgc3RhcnRFbGVtZW50UGFyZW50Q29weSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVuZEVsZW1lbnRQYXJlbnQgPSBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQoe1xuICAgICAgICBjaGlsZEVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHRcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZW5kRWxlbWVudFBhcmVudENvcHk7XG4gICAgICBpZiAoZW5kRWxlbWVudFBhcmVudCkge1xuICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weSA9IGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodCh7XG4gICAgICAgICAgZWxlbWVudDogZW5kT2ZOZXdIaWdobGlnaHQsXG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBlbmRFbGVtZW50UGFyZW50LFxuICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBsb2NhdGlvbkluU2VsZWN0aW9uOiBcImVuZFwiXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIk5vZGUgdGhhdCBpcyB0aGUgd3JhcHBlciBvZiB0aGUgZW5kIG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJDbG9uZWQgb2Ygbm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQgYWZ0ZXIgcmVtb3Zpbmcgc2libGluZ3MgYW5kIHVud3JhcHBpbmcgaGlnaGxpZ2h0IHNwYW5zOiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhcnRFbGVtZW50UGFyZW50Q29weSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgc3RhcnRFbGVtZW50UGFyZW50Q29weS5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzc1xuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coc3RhcnRFbGVtZW50UGFyZW50Q29weS5jaGlsZE5vZGVzLmxlbmd0aCk7XG4gICAgICAgICAgc3RhcnRFbGVtZW50UGFyZW50Q29weS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXBwZW5kaW5nIGNoaWxkIG5vZGU6IFwiLCBjaGlsZE5vZGUudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcImFwcGVuZGluZyBzdGFydEVsZW1lbnRQYXJlbnRDb3B5OiBcIixcbiAgICAgICAgICAgIHN0YXJ0RWxlbWVudFBhcmVudENvcHlcbiAgICAgICAgICApO1xuICAgICAgICAgIHdyYXBwZXJDbG9uZS5hcHBlbmRDaGlsZChzdGFydEVsZW1lbnRQYXJlbnRDb3B5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJhcHBlbmRpbmcgc3RhcnRPZk5ld0hpZ2hsaWdodDogXCIsIHN0YXJ0T2ZOZXdIaWdobGlnaHQpO1xuICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoc3RhcnRPZk5ld0hpZ2hsaWdodCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IGFkZCBjb250YWluZXJzIGluIGJldHdlZW4uXG4gICAgICBjb25zdCBjb250YWluZXJzSW5CZXR3ZWVuID0gbm9kZXNJbkJldHdlZW4oc3RhcnRDb250YWluZXIsIGVuZENvbnRhaW5lcik7XG4gICAgICBjb250YWluZXJzSW5CZXR3ZWVuLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnRDb3B5KSB7XG4gICAgICAgIC8vIE9ubHkgY29weSB0aGUgY2hpbGRyZW4gb2YgYSBoaWdobGlnaHRlZCBzcGFuIGludG8gb3VyIG5ldyBoaWdobGlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZEVsZW1lbnRQYXJlbnRDb3B5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZE9mTmV3SGlnaGxpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgZG9tKHdyYXBwZXJDbG9uZSkuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBlbmRFbGVtZW50UGFyZW50ID8gZW5kRWxlbWVudFBhcmVudCA6IGFmdGVyTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0ZXh0IG5vZGVzIHdpdGhpbiBhbnkgZ2l2ZW4gZWxlbWVudCBub2RlIGFyZSBtZXJnZWQgdG9nZXRoZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgbm9ybWFsaXplZEhpZ2hsaWdodHM7XG5cbiAgICAvL1NpbmNlIHdlJ3JlIG5vdCBtZXJnaW5nIG9yIGZsYXR0ZW5pbmcsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIHRoZSB0ZXh0IG5vZGVzLlxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYXJlIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZWxlbWVudCB8fCB0aGlzLmVsLFxuICAgICAgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoaGlnaGxpZ2h0KSB7XG4gICAgICBpZiAoaGlnaGxpZ2h0LmNsYXNzTmFtZSA9PT0gY29udGFpbmVyLmNsYXNzTmFtZSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICAgIGlmIChzZWxmLm9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQoaGwpID09PSB0cnVlKSB7XG4gICAgICAgIHJlbW92ZUhpZ2hsaWdodChobCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgY29uc3QgbWVyZ2VkUGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgZGF0YUF0dHI6IERBVEFfQVRUUixcbiAgICAgIHRpbWVzdGFtcEF0dHI6IFRJTUVTVEFNUF9BVFRSLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgICByZXR1cm4gcmV0cmlldmVIaWdobGlnaHRzKG1lcmdlZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpIHtcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgbGV0IGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIC8vIGhsUGF0aCA9IGdldEVsZW1lbnRQYXRoKGhpZ2hsaWdodCwgcmVmRWwpLFxuICAgICAgICBvZmZzZXQgPSBnZXRFbGVtZW50T2Zmc2V0KGhpZ2hsaWdodCwgcmVmRWwpLCAvLyBIbCBvZmZzZXQgZnJvbSB0aGUgcm9vdCBlbGVtZW50LlxuICAgICAgICB3cmFwcGVyID0gaGlnaGxpZ2h0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgd3JhcHBlciA9IHdyYXBwZXIub3V0ZXJIVE1MO1xuXG4gICAgICBjb25zb2xlLmxvZyhcIkhpZ2hsaWdodCB0ZXh0IG9mZnNldCBmcm9tIHJvb3Qgbm9kZTogXCIsIG9mZnNldCk7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYHdyYXBwZXIudG9TdHJpbmcoKS5pbmRleE9mKCR7aWR9KTpgLFxuICAgICAgICB3cmFwcGVyLnRvU3RyaW5nKCkuaW5kZXhPZihpZClcbiAgICAgICk7XG4gICAgICBpZiAod3JhcHBlci50b1N0cmluZygpLmluZGV4T2YoaWQpID4gLTEpIHtcbiAgICAgICAgaGxEZXNjcmlwdG9ycy5wdXNoKFt3cmFwcGVyLCBoaWdobGlnaHQudGV4dENvbnRlbnQsIG9mZnNldCwgbGVuZ3RoXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaGxEZXNjcmlwdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBpbmRlcGVuZGVudCBmb3JtIG9mIGhpZ2hsaWdodHMuXG4gICAqXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIGxldCBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbkN1c3RvbShobERlc2NyaXB0b3IpIHtcbiAgICAgIGxldCBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIG9mZnNldDogTnVtYmVyLnBhcnNlSW50KGhsRGVzY3JpcHRvclsyXSksXG4gICAgICAgICAgbGVuZ3RoOiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzNdKVxuICAgICAgICB9LFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodDtcblxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHNlbGYuZWw7XG4gICAgICBjb25zdCB7IG5vZGUsIG9mZnNldDogb2Zmc2V0V2l0aGluTm9kZSB9ID0gZmluZE5vZGVBbmRPZmZzZXQoXG4gICAgICAgIGhsLFxuICAgICAgICBwYXJlbnROb2RlXG4gICAgICApO1xuXG4gICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChvZmZzZXRXaXRoaW5Ob2RlKTtcbiAgICAgIGhsTm9kZS5zcGxpdFRleHQoaGwubGVuZ3RoKTtcblxuICAgICAgaWYgKGhsTm9kZS5uZXh0U2libGluZyAmJiAhaGxOb2RlLm5leHRTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcgJiYgIWhsTm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaGlnaGxpZ2h0ID0gZG9tKGhsTm9kZSkud3JhcChkb20oKS5mcm9tSFRNTChobC53cmFwcGVyKVswXSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhpZ2hsaWdodDogXCIsIGhsRGVzY3JpcHRvcik7XG4gICAgICAgIGRlc2VyaWFsaXphdGlvbkZuQ3VzdG9tKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyO1xuIiwiaW1wb3J0IHtcbiAgcmVmaW5lUmFuZ2VCb3VuZGFyaWVzLFxuICByZXRyaWV2ZUhpZ2hsaWdodHMsXG4gIGlzRWxlbWVudEhpZ2hsaWdodCxcbiAgc29ydEJ5RGVwdGgsXG4gIGhhdmVTYW1lQ29sb3Jcbn0gZnJvbSBcIi4uL3V0aWxzL2hpZ2hsaWdodHNcIjtcbmltcG9ydCBkb20sIHsgTk9ERV9UWVBFIH0gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgSUdOT1JFX1RBR1MsIERBVEFfQVRUUiwgVElNRVNUQU1QX0FUVFIgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyB1bmlxdWUgfSBmcm9tIFwiLi4vdXRpbHMvYXJyYXlzXCI7XG5cbi8qKlxuICogUHJpbWl0aXZvSGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50c1xuICogZm9yIHNpbXBsZSB1c2UgY2FzZXMuXG4gKi9cbmNsYXNzIFByaW1pdGl2b0hpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBQcmltaXRpdm9IaWdobGlnaHRlciBpbnN0YW5jZSBmb3IgZnVuY3Rpb25hbGl0eSBzcGVjaWZpYyB0byB0aGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHJhbmdlLlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBTFNEZWJ1ZzI4OiByYW5nZSBiZWZvcmUgcmVmaW5lZCEgXCIsIHJhbmdlKTtcblxuICAgIGxldCByZXN1bHQgPSByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpLFxuICAgICAgc3RhcnRDb250YWluZXIgPSByZXN1bHQuc3RhcnRDb250YWluZXIsXG4gICAgICBlbmRDb250YWluZXIgPSByZXN1bHQuZW5kQ29udGFpbmVyLFxuICAgICAgZ29EZWVwZXIgPSByZXN1bHQuZ29EZWVwZXIsXG4gICAgICBkb25lID0gZmFsc2UsXG4gICAgICBub2RlID0gc3RhcnRDb250YWluZXIsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBoaWdobGlnaHQsXG4gICAgICB3cmFwcGVyQ2xvbmUsXG4gICAgICBub2RlUGFyZW50O1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGdvRGVlcGVyICYmIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS5wYXJlbnROb2RlLnRhZ05hbWUpID09PSAtMSAmJlxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIlxuICAgICAgICApIHtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG4gICAgICAgICAgbm9kZVBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICAgIC8vIGhpZ2hsaWdodCBpZiBhIG5vZGUgaXMgaW5zaWRlIHRoZSBlbFxuICAgICAgICAgIGlmIChkb20odGhpcy5lbCkuY29udGFpbnMobm9kZVBhcmVudCkgfHwgbm9kZVBhcmVudCA9PT0gdGhpcy5lbCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ID0gZG9tKG5vZGUpLndyYXAod3JhcHBlckNsb25lKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUgPT09IGVuZENvbnRhaW5lciAmJlxuICAgICAgICAhKGVuZENvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkgJiYgZ29EZWVwZXIpXG4gICAgICApIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFX1RBR1MuaW5kZXhPZihub2RlLnRhZ05hbWUpID4gLTEpIHtcbiAgICAgICAgaWYgKGVuZENvbnRhaW5lci5wYXJlbnROb2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICBnb0RlZXBlciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCFkb25lKTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0aGF0IGhpZ2hsaWdodGluZyBpcyBkb25lIHdpdGggdXNlIG9mIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBudW1iZXIgb2ZcbiAgICogd3JhcHBpbmcgSFRNTCBlbGVtZW50cy5cbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUgYW5kIG1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMuIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gaGlnaGxpZ2h0cy5cbiAgICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0cyAtIGhpZ2hsaWdodHMgdG8gbm9ybWFsaXplLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2Ygbm9ybWFsaXplZCBoaWdobGlnaHRzLiBPcmRlciBhbmQgbnVtYmVyIG9mIHJldHVybmVkIGhpZ2hsaWdodHMgbWF5IGJlIGRpZmZlcmVudCB0aGFuXG4gICAqIGlucHV0IGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuXG4gICAgdGhpcy5mbGF0dGVuTmVzdGVkSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcbiAgICB0aGlzLm1lcmdlU2libGluZ0hpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG5cbiAgICAvLyBvbWl0IHJlbW92ZWQgbm9kZXNcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IGhpZ2hsaWdodHMuZmlsdGVyKGZ1bmN0aW9uKGhsKSB7XG4gICAgICByZXR1cm4gaGwucGFyZW50RWxlbWVudCA/IGhsIDogbnVsbDtcbiAgICB9KTtcblxuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gdW5pcXVlKG5vcm1hbGl6ZWRIaWdobGlnaHRzKTtcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLm9mZnNldFRvcCAtIGIub2Zmc2V0VG9wIHx8IGEub2Zmc2V0TGVmdCAtIGIub2Zmc2V0TGVmdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBub3JtYWxpemVkSGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVucyBoaWdobGlnaHRzIHN0cnVjdHVyZS5cbiAgICogTm90ZTogdGhpcyBtZXRob2QgY2hhbmdlcyBpbnB1dCBoaWdobGlnaHRzIC0gdGhlaXIgb3JkZXIgYW5kIG51bWJlciBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIGZsYXR0ZW4uXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZmxhdHRlbk5lc3RlZEhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIGxldCBhZ2FpbixcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBmbGF0dGVuT25jZSgpIHtcbiAgICAgIGxldCBhZ2FpbiA9IGZhbHNlO1xuXG4gICAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwsIGkpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IGhsLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgcGFyZW50UHJldiA9IHBhcmVudC5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgICAgcGFyZW50TmV4dCA9IHBhcmVudC5uZXh0U2libGluZztcblxuICAgICAgICBpZiAoc2VsZi5pc0hpZ2hsaWdodChwYXJlbnQsIERBVEFfQVRUUikpIHtcbiAgICAgICAgICBpZiAoIWhhdmVTYW1lQ29sb3IocGFyZW50LCBobCkpIHtcbiAgICAgICAgICAgIGlmICghaGwubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnROZXh0KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudE5leHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudE5leHQgfHwgcGFyZW50KTtcbiAgICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWhsLnByZXZpb3VzU2libGluZykge1xuICAgICAgICAgICAgICBpZiAoIXBhcmVudFByZXYpIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50UHJldik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnRQcmV2IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBobC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09IDMgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGxldCBzcGFubGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICBzcGFubGVmdC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyZW50LmF0dHJpYnV0ZXNbVElNRVNUQU1QX0FUVFJdLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKFRJTUVTVEFNUF9BVFRSLCB0aW1lc3RhbXApO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zZXRBdHRyaWJ1dGUoREFUQV9BVFRSLCB0cnVlKTtcblxuICAgICAgICAgICAgICBsZXQgc3BhbnJpZ2h0ID0gc3BhbmxlZnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICAgIGRvbShobC5wcmV2aW91c1NpYmxpbmcpLndyYXAoc3BhbmxlZnQpO1xuICAgICAgICAgICAgICBkb20oaGwubmV4dFNpYmxpbmcpLndyYXAoc3BhbnJpZ2h0KTtcblxuICAgICAgICAgICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChwYXJlbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGRvbShub2RlKS5pbnNlcnRCZWZvcmUobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFwYXJlbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgIGRvbShwYXJlbnQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGhsLmZpcnN0Q2hpbGQsIGhsKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHNbaV0gPSBwYXJlbnQ7XG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFnYWluO1xuICAgIH1cblxuICAgIGRvIHtcbiAgICAgIGFnYWluID0gZmxhdHRlbk9uY2UoKTtcbiAgICB9IHdoaWxlIChhZ2Fpbik7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIHNpYmxpbmcgaGlnaGxpZ2h0cyBhbmQgbm9ybWFsaXplcyBkZXNjZW5kYW50IHRleHQgbm9kZXMuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0c1xuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIG1lcmdlU2libGluZ0hpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHNob3VsZE1lcmdlKGN1cnJlbnQsIG5vZGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIG5vZGUgJiZcbiAgICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgICBoYXZlU2FtZUNvbG9yKGN1cnJlbnQsIG5vZGUpICYmXG4gICAgICAgIHNlbGYuaXNIaWdobGlnaHQobm9kZSwgREFUQV9BVFRSKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICB2YXIgcHJldiA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSBoaWdobGlnaHQubmV4dFNpYmxpbmc7XG5cbiAgICAgIGlmIChzaG91bGRNZXJnZShoaWdobGlnaHQsIHByZXYpKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLnByZXBlbmQocHJldi5jaGlsZE5vZGVzKTtcbiAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3VsZE1lcmdlKGhpZ2hsaWdodCwgbmV4dCkpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkuYXBwZW5kKG5leHQuY2hpbGROb2Rlcyk7XG4gICAgICAgIGRvbShuZXh0KS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgZG9tKGhpZ2hsaWdodCkubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYWxsIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCkge1xuICAgIHZhciBjb250YWluZXIgPSBlbGVtZW50IHx8IHRoaXMuZWwsXG4gICAgICBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKHsgY29udGFpbmVyOiBjb250YWluZXIgfSksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIG1lcmdlU2libGluZ1RleHROb2Rlcyh0ZXh0Tm9kZSkge1xuICAgICAgdmFyIHByZXYgPSB0ZXh0Tm9kZS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSB0ZXh0Tm9kZS5uZXh0U2libGluZztcblxuICAgICAgaWYgKHByZXYgJiYgcHJldi5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICB0ZXh0Tm9kZS5ub2RlVmFsdWUgPSBwcmV2Lm5vZGVWYWx1ZSArIHRleHROb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQgJiYgbmV4dC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICB0ZXh0Tm9kZS5ub2RlVmFsdWUgPSB0ZXh0Tm9kZS5ub2RlVmFsdWUgKyBuZXh0Lm5vZGVWYWx1ZTtcbiAgICAgICAgZG9tKG5leHQpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodChoaWdobGlnaHQpIHtcbiAgICAgIHZhciB0ZXh0Tm9kZXMgPSBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcblxuICAgICAgdGV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBtZXJnZVNpYmxpbmdUZXh0Tm9kZXMobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCB0cnVlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodChobCkgPT09IHRydWUpIHtcbiAgICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGhsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodHMgZnJvbSBnaXZlbiBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3BhcmFtcy5jb250YWluZXJdIC0gcmV0dXJuIGhpZ2hsaWdodHMgZnJvbSB0aGlzIGVsZW1lbnQuIERlZmF1bHQ6IHRoZSBlbGVtZW50IHRoZVxuICAgKiBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuYW5kU2VsZl0gLSBpZiBzZXQgdG8gdHJ1ZSBhbmQgY29udGFpbmVyIGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgYWRkIGNvbnRhaW5lciB0b1xuICAgKiByZXR1cm5lZCByZXN1bHRzLiBEZWZhdWx0OiB0cnVlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuZ3JvdXBlZF0gLSBpZiBzZXQgdG8gdHJ1ZSwgaGlnaGxpZ2h0cyBhcmUgZ3JvdXBlZCBpbiBsb2dpY2FsIGdyb3VwcyBvZiBoaWdobGlnaHRzIGFkZGVkXG4gICAqIGluIHRoZSBzYW1lIG1vbWVudC4gRWFjaCBncm91cCBpcyBhbiBvYmplY3Qgd2hpY2ggaGFzIGdvdCBhcnJheSBvZiBoaWdobGlnaHRzLCAndG9TdHJpbmcnIG1ldGhvZCBhbmQgJ3RpbWVzdGFtcCdcbiAgICogcHJvcGVydHkuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRIaWdobGlnaHRzKHBhcmFtcykge1xuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5lbCxcbiAgICAgIGRhdGFBdHRyOiBEQVRBX0FUVFIsXG4gICAgICB0aW1lc3RhbXBBdHRyOiBUSU1FU1RBTVBfQVRUUixcbiAgICAgIC4uLnBhcmFtc1xuICAgIH07XG4gICAgcmV0dXJuIHJldHJpZXZlSGlnaGxpZ2h0cyhtZXJnZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKlxuICAgKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0cygpIHtcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFBhdGgoZWwsIHJlZkVsZW1lbnQpIHtcbiAgICAgIGxldCBwYXRoID0gW10sXG4gICAgICAgIGNoaWxkTm9kZXM7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLnBhcmVudE5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICAgIHBhdGgudW5zaGlmdChjaGlsZE5vZGVzLmluZGV4T2YoZWwpKTtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgfSB3aGlsZSAoZWwgIT09IHJlZkVsZW1lbnQgfHwgIWVsKTtcblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgbGV0IG9mZnNldCA9IDAsIC8vIEhsIG9mZnNldCBmcm9tIHByZXZpb3VzIHNpYmxpbmcgd2l0aGluIHBhcmVudCBub2RlLlxuICAgICAgICBsZW5ndGggPSBoaWdobGlnaHQudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgICBobFBhdGggPSBnZXRFbGVtZW50UGF0aChoaWdobGlnaHQsIHJlZkVsKSxcbiAgICAgICAgd3JhcHBlciA9IGhpZ2hsaWdodC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIHdyYXBwZXIgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgICAgaWYgKFxuICAgICAgICBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgPSBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaGxEZXNjcmlwdG9ycy5wdXNoKFtcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgaGlnaGxpZ2h0LnRleHRDb250ZW50LFxuICAgICAgICBobFBhdGguam9pbihcIjpcIiksXG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgbGVuZ3RoXG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShobERlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pIHtcbiAgICBsZXQgaGxEZXNjcmlwdG9ycyxcbiAgICAgIGhpZ2hsaWdodHMgPSBbXSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaGxEZXNjcmlwdG9ycyA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgXCJDYW4ndCBwYXJzZSBKU09OOiBcIiArIGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemF0aW9uRm4oaGxEZXNjcmlwdG9yKSB7XG4gICAgICBsZXQgaGwgPSB7XG4gICAgICAgICAgd3JhcHBlcjogaGxEZXNjcmlwdG9yWzBdLFxuICAgICAgICAgIHRleHQ6IGhsRGVzY3JpcHRvclsxXSxcbiAgICAgICAgICBwYXRoOiBobERlc2NyaXB0b3JbMl0uc3BsaXQoXCI6XCIpLFxuICAgICAgICAgIG9mZnNldDogaGxEZXNjcmlwdG9yWzNdLFxuICAgICAgICAgIGxlbmd0aDogaGxEZXNjcmlwdG9yWzRdXG4gICAgICAgIH0sXG4gICAgICAgIGVsSW5kZXggPSBobC5wYXRoLnBvcCgpLFxuICAgICAgICBub2RlID0gc2VsZi5lbCxcbiAgICAgICAgaGxOb2RlLFxuICAgICAgICBoaWdobGlnaHQsXG4gICAgICAgIGlkeDtcblxuICAgICAgd2hpbGUgKChpZHggPSBobC5wYXRoLnNoaWZ0KCkpKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmNoaWxkTm9kZXNbaWR4XTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBub2RlLmNoaWxkTm9kZXNbZWxJbmRleCAtIDFdICYmXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4IC0gMV0ubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICkge1xuICAgICAgICBlbEluZGV4IC09IDE7XG4gICAgICB9XG5cbiAgICAgIG5vZGUgPSBub2RlLmNoaWxkTm9kZXNbZWxJbmRleF07XG4gICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChobC5vZmZzZXQpO1xuICAgICAgaGxOb2RlLnNwbGl0VGV4dChobC5sZW5ndGgpO1xuXG4gICAgICBpZiAoaGxOb2RlLm5leHRTaWJsaW5nICYmICFobE5vZGUubmV4dFNpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUubmV4dFNpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGxOb2RlLnByZXZpb3VzU2libGluZyAmJiAhaGxOb2RlLnByZXZpb3VzU2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBoaWdobGlnaHQgPSBkb20oaGxOb2RlKS53cmFwKGRvbSgpLmZyb21IVE1MKGhsLndyYXBwZXIpWzBdKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH1cblxuICAgIGhsRGVzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbihobERlc2NyaXB0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRlc2VyaWFsaXphdGlvbkZuKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJpbWl0aXZvSGlnaGxpZ2h0ZXI7XG4iLCIvKiBnbG9iYWwgalF1ZXJ5IFRleHRIaWdobGlnaHRlciAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoZnVuY3Rpb24oJCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3QgUExVR0lOX05BTUUgPSBcInRleHRIaWdobGlnaHRlclwiO1xuXG4gICAgZnVuY3Rpb24gd3JhcChmbiwgd3JhcHBlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB3cmFwcGVyLmNhbGwodGhpcywgZm4pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgalF1ZXJ5IHBsdWdpbiBuYW1lc3BhY2UuXG4gICAgICogQGV4dGVybmFsIFwialF1ZXJ5LmZuXCJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vZG9jcy5qcXVlcnkuY29tL1BsdWdpbnMvQXV0aG9yaW5nIFRoZSBqUXVlcnkgUGx1Z2luIEd1aWRlfVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGFwcGxpZXMgaXQgdG8gdGhlIGdpdmVuIGpRdWVyeSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgU2FtZSBhcyB7QGxpbmsgVGV4dEhpZ2hsaWdodGVyfSBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtqUXVlcnl9XG4gICAgICogQGV4YW1wbGUgJCgnI3NhbmRib3gnKS50ZXh0SGlnaGxpZ2h0ZXIoeyBjb2xvcjogJ3JlZCcgfSk7XG4gICAgICogQGZ1bmN0aW9uIGV4dGVybmFsOlwialF1ZXJ5LmZuXCIudGV4dEhpZ2hsaWdodGVyXG4gICAgICovXG4gICAgJC5mbi50ZXh0SGlnaGxpZ2h0ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZWwgPSB0aGlzLFxuICAgICAgICAgIGhsO1xuXG4gICAgICAgIGlmICghJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSkpIHtcbiAgICAgICAgICBobCA9IG5ldyBUZXh0SGlnaGxpZ2h0ZXIoZWwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgaGwuZGVzdHJveSA9IHdyYXAoaGwuZGVzdHJveSwgZnVuY3Rpb24oZGVzdHJveSkge1xuICAgICAgICAgICAgZGVzdHJveS5jYWxsKGhsKTtcbiAgICAgICAgICAgICQoZWwpLnJlbW92ZURhdGEoUExVR0lOX05BTUUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSwgaGwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5mbi5nZXRIaWdobGlnaHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YShQTFVHSU5fTkFNRSk7XG4gICAgfTtcbiAgfSkoalF1ZXJ5KTtcbn1cbiIsImltcG9ydCBkb20gZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyBiaW5kRXZlbnRzLCB1bmJpbmRFdmVudHMgfSBmcm9tIFwiLi91dGlscy9ldmVudHNcIjtcbmltcG9ydCBQcmltaXRpdm8gZnJvbSBcIi4vaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2b1wiO1xuaW1wb3J0IEluZGVwZW5kZW5jaWEgZnJvbSBcIi4vaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWFcIjtcbmltcG9ydCB7IFRJTUVTVEFNUF9BVFRSLCBEQVRBX0FUVFIgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IGNyZWF0ZVdyYXBwZXIgfSBmcm9tIFwiLi91dGlscy9oaWdobGlnaHRzXCI7XG5cbmNvbnN0IGhpZ2hsaWdodGVycyA9IHtcbiAgcHJpbWl0aXZvOiBQcmltaXRpdm8sXG4gIFwidjEtMjAxNFwiOiBQcmltaXRpdm8sXG4gIGluZGVwZW5kZW5jaWE6IEluZGVwZW5kZW5jaWEsXG4gIFwidjItMjAxOVwiOiBJbmRlcGVuZGVuY2lhXG59O1xuXG4vKipcbiAqIFRleHRIaWdobGlnaHRlciB0aGF0IHByb3ZpZGVzIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gZG9tIGVsZW1lbnRzLlxuICovXG5jbGFzcyBUZXh0SGlnaGxpZ2h0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGJpbmRzIHRvIGdpdmVuIERPTSBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMudmVyc2lvbiAtIFRoZSB2ZXJzaW9uIG9mIHRoZSB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIHVzZS5cbiAgICogVGhlcmUgYXJlIHR3byBvcHRpb25zOlxuICAgKiAgIHByaW1pdGl2byAodjEtMjAxNCkgaXMgZm9yIHRoZSBpbml0aWFsIGltcGxlbWVudGF0aW9uIHVzaW5nIGludGVyZGVwZW5kZW50IGhpZ2hsaWdodCBsb2NhdG9ycy5cbiAgICogICAoTG90cyBvZiBpc3N1ZXMgZm9yIHJlcXVpcmVtZW50cyBiZXlvbmQgc2ltcGxlIGFsbCBvciBub3RoaW5nIGhpZ2hsaWdodHMpXG4gICAqXG4gICAqICAgaW5kZXBlbmRlbmNpYSAodjItMjAxOSkgaXMgZm9yIGFuIGltcHJvdmVkIGltcGxlbWVudGF0aW9uIGZvY3VzaW5nIG9uIG1ha2luZyBoaWdobGlnaHRzIGluZGVwZW5kZW50XG4gICAqICAgZnJvbSBlYWNob3RoZXIgYW5kIG90aGVyIGVsZW1lbnQgbm9kZXMgd2l0aGluIHRoZSBjb250ZXh0IERPTSBvYmplY3QuIHYyIHVzZXMgZGF0YSBhdHRyaWJ1dGVzXG4gICAqICAgYXMgdGhlIHNvdXJjZSBvZiB0cnV0aCBhYm91dCB0aGUgdGV4dCByYW5nZSBzZWxlY3RlZCB0byBjcmVhdGUgdGhlIG9yaWdpbmFsIGhpZ2hsaWdodC5cbiAgICogICBUaGlzIGFsbG93cyB1cyBmcmVlZG9tIHRvIG1hbmlwdWxhdGUgdGhlIERPTSBhdCB3aWxsIGFuZCBoYW5kbGUgb3ZlcmxhcHBpbmcgaGlnaGxpZ2h0cyBhIGxvdCBiZXR0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGFuY2hvciBlbGVtZW50XCIpO1xuICAgIH1cblxuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGNvbG9yOiBcIiNmZmZmN2JcIixcbiAgICAgIGhpZ2hsaWdodGVkQ2xhc3M6IFwiaGlnaGxpZ2h0ZWRcIixcbiAgICAgIGNvbnRleHRDbGFzczogXCJoaWdobGlnaHRlci1jb250ZXh0XCIsXG4gICAgICB2ZXJzaW9uOiBcImluZGVwZW5kZW5jaWFcIixcbiAgICAgIG9uUmVtb3ZlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25CZWZvcmVIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBvbkFmdGVySGlnaGxpZ2h0OiBmdW5jdGlvbigpIHt9LFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG5cbiAgICBpZiAoIWhpZ2hsaWdodGVyc1t0aGlzLm9wdGlvbnMudmVyc2lvbl0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIHZlcnNpb24gb2YgdGhlIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHlcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZ2hsaWdodGVyID0gbmV3IGhpZ2hsaWdodGVyc1t0aGlzLm9wdGlvbnMudmVyc2lvbl0oXG4gICAgICB0aGlzLmVsLFxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgKTtcblxuICAgIGRvbSh0aGlzLmVsKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29udGV4dENsYXNzKTtcbiAgICBiaW5kRXZlbnRzKHRoaXMuZWwsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcm1hbmVudGx5IGRpc2FibGVzIGhpZ2hsaWdodGluZy5cbiAgICogVW5iaW5kcyBldmVudHMgYW5kIHJlbW92ZSBjb250ZXh0IGVsZW1lbnQgY2xhc3MuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdW5iaW5kRXZlbnRzKHRoaXMuZWwsIHRoaXMpO1xuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29udGV4dENsYXNzKTtcbiAgfVxuXG4gIGhpZ2hsaWdodEhhbmRsZXIoKSB7XG4gICAgdGhpcy5kb0hpZ2hsaWdodCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgY3VycmVudCByYW5nZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBrZWVwUmFuZ2UgLSBEb24ndCByZW1vdmUgcmFuZ2UgYWZ0ZXIgaGlnaGxpZ2h0aW5nLiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZG9IaWdobGlnaHQoa2VlcFJhbmdlKSB7XG4gICAgbGV0IHJhbmdlID0gZG9tKHRoaXMuZWwpLmdldFJhbmdlKCksXG4gICAgICB3cmFwcGVyLFxuICAgICAgY3JlYXRlZEhpZ2hsaWdodHMsXG4gICAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyxcbiAgICAgIHRpbWVzdGFtcDtcblxuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodChyYW5nZSkgPT09IHRydWUpIHtcbiAgICAgIHRpbWVzdGFtcCA9ICtuZXcgRGF0ZSgpO1xuICAgICAgd3JhcHBlciA9IGNyZWF0ZVdyYXBwZXIodGhpcy5vcHRpb25zKTtcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFRJTUVTVEFNUF9BVFRSLCB0aW1lc3RhbXApO1xuXG4gICAgICBjcmVhdGVkSGlnaGxpZ2h0cyA9IHRoaXMuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICAgICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoY3JlYXRlZEhpZ2hsaWdodHMpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMub25BZnRlckhpZ2hsaWdodChyYW5nZSwgbm9ybWFsaXplZEhpZ2hsaWdodHMsIHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgaWYgKCFrZWVwUmFuZ2UpIHtcbiAgICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyByYW5nZS5cbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlIGF0IGxlYXN0IHRleHQgbm9kZXMgYXJlIG5vcm1hbGl6ZWQsIGNhcnJpZXMgb3V0IHNvbWUgZmxhdHRlbmluZyBhbmQgbmVzdGluZ1xuICAgKiB3aGVyZSBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5ub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaGlnaGxpZ2h0aW5nIGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB2YWxpZCBDU1MgY29sb3IuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5vcHRpb25zLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRpbmcgY29sb3IuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYWxsIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICB0aGlzLmhpZ2hsaWdodGVyLnJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKiBBbGwgaGlnaGxpZ2h0cyBoYXZlICdkYXRhLWhpZ2hsaWdodGVkJyBhdHRyaWJ1dGUuXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmlzSGlnaGxpZ2h0KGVsLCBEQVRBX0FUVFIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLnNlcmlhbGl6ZUhpZ2hsaWdodHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBoaWdobGlnaHRzIGdpdmVuIHRleHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGV4dCB0byBzZWFyY2ggZm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nhc2VTZW5zaXRpdmVdIC0gaWYgc2V0IHRvIHRydWUsIHBlcmZvcm1zIGNhc2Ugc2Vuc2l0aXZlIHNlYXJjaCAoZGVmYXVsdDogdHJ1ZSlcbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZmluZCh0ZXh0LCBjYXNlU2Vuc2l0aXZlKSB7XG4gICAgbGV0IHduZCA9IGRvbSh0aGlzLmVsKS5nZXRXaW5kb3coKSxcbiAgICAgIHNjcm9sbFggPSB3bmQuc2Nyb2xsWCxcbiAgICAgIHNjcm9sbFkgPSB3bmQuc2Nyb2xsWSxcbiAgICAgIGNhc2VTZW5zID0gdHlwZW9mIGNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2FzZVNlbnNpdGl2ZTtcblxuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcblxuICAgIGlmICh3bmQuZmluZCkge1xuICAgICAgd2hpbGUgKHduZC5maW5kKHRleHQsIGNhc2VTZW5zKSkge1xuICAgICAgICB0aGlzLmRvSGlnaGxpZ2h0KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBsZXQgdGV4dFJhbmdlID0gd25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQodGhpcy5lbCk7XG4gICAgICB3aGlsZSAodGV4dFJhbmdlLmZpbmRUZXh0KHRleHQsIDEsIGNhc2VTZW5zID8gNCA6IDApKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZG9tKHRoaXMuZWwpLmNvbnRhaW5zKHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkpICYmXG4gICAgICAgICAgdGV4dFJhbmdlLnBhcmVudEVsZW1lbnQoKSAhPT0gdGhpcy5lbFxuICAgICAgICApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgd25kLnNjcm9sbFRvKHNjcm9sbFgsIHNjcm9sbFkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRIaWdobGlnaHRlcjtcbiIsIi8qKlxuICogUmV0dXJucyBhcnJheSB3aXRob3V0IGR1cGxpY2F0ZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpZHgsIHNlbGYpIHtcbiAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaWR4O1xuICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBOT0RFX1RZUEUgPSB7IEVMRU1FTlRfTk9ERTogMSwgVEVYVF9OT0RFOiAzIH07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFrZSBET00gbWFuaXB1bGF0aW9uIGVhc2llci5cbiAqIEBwYXJhbSB7Tm9kZXxIVE1MRWxlbWVudH0gW2VsXSAtIGJhc2UgRE9NIGVsZW1lbnQgdG8gbWFuaXB1bGF0ZVxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuY29uc3QgZG9tID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIC8qKiBAbGVuZHMgZG9tICoqLyB7XG4gICAgLyoqXG4gICAgICogQWRkcyBjbGFzcyB0byBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxiKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXGJ8JClcIiwgXCJnaVwiKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9QcmVwZW5kXG4gICAgICovXG4gICAgcHJlcGVuZDogZnVuY3Rpb24obm9kZXNUb1ByZXBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9QcmVwZW5kKSxcbiAgICAgICAgaSA9IG5vZGVzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbC5pbnNlcnRCZWZvcmUobm9kZXNbaV0sIGVsLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIGNoaWxkIG5vZGVzIHRvIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge05vZGVbXX0gbm9kZXNUb0FwcGVuZFxuICAgICAqL1xuICAgIGFwcGVuZDogZnVuY3Rpb24obm9kZXNUb0FwcGVuZCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXNUb0FwcGVuZCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGFmdGVyIHJlZkVsLlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcmVmRWwgLSBub2RlIGFmdGVyIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbC5uZXh0U2libGluZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGJlZm9yZSByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBiZWZvcmUgd2hpY2ggYmFzZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gLSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICovXG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYmFzZSBlbGVtZW50IGZyb20gRE9NLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIGVsID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIGJhc2UgZWxlbWVudCBjb250YWlucyBnaXZlbiBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IGNoaWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gZWwgIT09IGNoaWxkICYmIGVsLmNvbnRhaW5zKGNoaWxkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYmFzZSBlbGVtZW50IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKi9cbiAgICB3cmFwOiBmdW5jdGlvbih3cmFwcGVyKSB7XG4gICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgICB9XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVud3JhcHMgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtOb2RlW119IC0gY2hpbGQgbm9kZXMgb2YgdW53cmFwcGVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW53cmFwOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLmNoaWxkTm9kZXMpLFxuICAgICAgICB3cmFwcGVyO1xuXG4gICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgd3JhcHBlciA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZG9tKG5vZGUpLmluc2VydEJlZm9yZShub2RlLnBhcmVudE5vZGUpO1xuICAgICAgfSk7XG4gICAgICBkb20od3JhcHBlcikucmVtb3ZlKCk7XG5cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cy5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwYXJlbnQsXG4gICAgICAgIHBhdGggPSBbXTtcblxuICAgICAgd2hpbGUgKChwYXJlbnQgPSBlbC5wYXJlbnROb2RlKSkge1xuICAgICAgICBwYXRoLnB1c2gocGFyZW50KTtcbiAgICAgICAgZWwgPSBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGJhc2UgZWxlbWVudCBwYXJlbnRzLCBleGNsdWRpbmcgdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHBhcmVudHNXaXRob3V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50cygpLmZpbHRlcihlbGVtID0+IGVsZW0gIT09IGRvY3VtZW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplcyB0ZXh0IG5vZGVzIHdpdGhpbiBiYXNlIGVsZW1lbnQsIGllLiBtZXJnZXMgc2libGluZyB0ZXh0IG5vZGVzIGFuZCBhc3N1cmVzIHRoYXQgZXZlcnlcbiAgICAgKiBlbGVtZW50IG5vZGUgaGFzIG9ubHkgb25lIHRleHQgbm9kZS5cbiAgICAgKiBJdCBzaG91bGQgZG9lcyB0aGUgc2FtZSBhcyBzdGFuZGFyZCBlbGVtZW50Lm5vcm1hbGl6ZSwgYnV0IElFIGltcGxlbWVudHMgaXQgaW5jb3JyZWN0bHkuXG4gICAgICovXG4gICAgbm9ybWFsaXplVGV4dE5vZGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgZWwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICAgKSB7XG4gICAgICAgICAgZWwubm9kZVZhbHVlICs9IGVsLm5leHRTaWJsaW5nLm5vZGVWYWx1ZTtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9tKGVsLmZpcnN0Q2hpbGQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgICAgfVxuICAgICAgZG9tKGVsLm5leHRTaWJsaW5nKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBlbGVtZW50IGJhY2tncm91bmQgY29sb3IuXG4gICAgICogQHJldHVybnMge0NTU1N0eWxlRGVjbGFyYXRpb24uYmFja2dyb3VuZENvbG9yfVxuICAgICAqL1xuICAgIGNvbG9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgZG9tIGVsZW1lbnQgZnJvbSBnaXZlbiBodG1sIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgICAqIEByZXR1cm5zIHtOb2RlTGlzdH1cbiAgICAgKi9cbiAgICBmcm9tSFRNTDogZnVuY3Rpb24oaHRtbCkge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgIHJldHVybiBkaXYuY2hpbGROb2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBmaXJzdCByYW5nZSBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7UmFuZ2V9XG4gICAgICovXG4gICAgZ2V0UmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCksXG4gICAgICAgIHJhbmdlO1xuXG4gICAgICBpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgcmFuZ2VzIG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqL1xuICAgIHJlbW92ZUFsbFJhbmdlczogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZG9tKGVsKS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBzZWxlY3Rpb24gb2JqZWN0IG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtTZWxlY3Rpb259XG4gICAgICovXG4gICAgZ2V0U2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpXG4gICAgICAgIC5nZXRXaW5kb3coKVxuICAgICAgICAuZ2V0U2VsZWN0aW9uKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2luZG93IG9mIHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1dpbmRvd31cbiAgICAgKi9cbiAgICBnZXRXaW5kb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRvbShlbCkuZ2V0RG9jdW1lbnQoKS5kZWZhdWx0VmlldztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkb2N1bWVudCBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRG9jdW1lbnR9XG4gICAgICovXG4gICAgZ2V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gaWYgb3duZXJEb2N1bWVudCBpcyBudWxsIHRoZW4gZWwgaXMgdGhlIGRvY3VtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiBlbC5vd25lckRvY3VtZW50IHx8IGVsO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5iaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuIiwiaW1wb3J0IGRvbSwgeyBOT0RFX1RZUEUgfSBmcm9tIFwiLi9kb21cIjtcblxuLyoqXG4gKiBUYWtlcyByYW5nZSBvYmplY3QgYXMgcGFyYW1ldGVyIGFuZCByZWZpbmVzIGl0IGJvdW5kYXJpZXNcbiAqIEBwYXJhbSByYW5nZVxuICogQHJldHVybnMge29iamVjdH0gcmVmaW5lZCBib3VuZGFyaWVzIGFuZCBpbml0aWFsIHN0YXRlIG9mIGhpZ2hsaWdodGluZyBhbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpIHtcbiAgbGV0IHN0YXJ0Q29udGFpbmVyID0gcmFuZ2Uuc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyID0gcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgIGFuY2VzdG9yID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIsXG4gICAgZ29EZWVwZXIgPSB0cnVlO1xuXG4gIGlmIChyYW5nZS5lbmRPZmZzZXQgPT09IDApIHtcbiAgICB3aGlsZSAoXG4gICAgICAhZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgZW5kQ29udGFpbmVyLnBhcmVudE5vZGUgIT09IGFuY2VzdG9yXG4gICAgKSB7XG4gICAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZztcbiAgfSBlbHNlIGlmIChlbmRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGVuZENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2UuZW5kT2Zmc2V0ID4gMCkge1xuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5jaGlsZE5vZGVzLml0ZW0ocmFuZ2UuZW5kT2Zmc2V0IC0gMSk7XG4gIH1cblxuICBpZiAoc3RhcnRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPT09IHN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChyYW5nZS5zdGFydE9mZnNldCA+IDApIHtcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGlmIChlbmRDb250YWluZXIgPT09IHN0YXJ0Q29udGFpbmVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBlbmRDb250YWluZXIgPSBzdGFydENvbnRhaW5lcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPCBzdGFydENvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydENvbnRhaW5lcjogc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyOiBlbmRDb250YWluZXIsXG4gICAgZ29EZWVwZXI6IGdvRGVlcGVyXG4gIH07XG59XG5cbi8qKlxuICogU29ydHMgYXJyYXkgb2YgRE9NIGVsZW1lbnRzIGJ5IGl0cyBkZXB0aCBpbiBET00gdHJlZS5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gYXJyIC0gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVzY2VuZGluZyAtIG9yZGVyIG9mIHNvcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlEZXB0aChhcnIsIGRlc2NlbmRpbmcpIHtcbiAgYXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiAoXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGIgOiBhKS5wYXJlbnRzKCkubGVuZ3RoIC1cbiAgICAgIGRvbShkZXNjZW5kaW5nID8gYSA6IGIpLnBhcmVudHMoKS5sZW5ndGhcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudHMgYSBpIGIgaGF2ZSB0aGUgc2FtZSBjb2xvci5cbiAqIEBwYXJhbSB7Tm9kZX0gYVxuICogQHBhcmFtIHtOb2RlfSBiXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVTYW1lQ29sb3IoYSwgYikge1xuICByZXR1cm4gZG9tKGEpLmNvbG9yKCkgPT09IGRvbShiKS5jb2xvcigpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgd3JhcHBlciBmb3IgaGlnaGxpZ2h0cy5cbiAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAqIGluIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgc2FtZSBvYmplY3QgYXMgaW4gVGV4dEhpZ2hsaWdodGVyIGNvbnN0cnVjdG9yLlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihvcHRpb25zKSB7XG4gIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIHNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgc3Bhbi5jbGFzc05hbWUgPSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3M7XG4gIHJldHVybiBzcGFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRleHROb2RlQXRMb2NhdGlvbihlbGVtZW50LCBsb2NhdGlvbkluQ2hpbGROb2Rlcykge1xuICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgYXMgcGFyYW1ldGVyOiBcIiwgZWxlbWVudCk7XG4gIGxldCB0ZXh0Tm9kZUVsZW1lbnQgPSBlbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICh0ZXh0Tm9kZUVsZW1lbnQgJiYgdGV4dE5vZGVFbGVtZW50Lm5vZGVUeXBlICE9PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgY29uc29sZS5sb2coYHRleHROb2RlRWxlbWVudCBzdGVwICR7aX1gLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICAgIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJzdGFydFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uSW5DaGlsZE5vZGVzID09PSBcImVuZFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgbGFzdEluZGV4ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbbGFzdEluZGV4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHROb2RlRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwidGV4dCBub2RlIGVsZW1lbnQgcmV0dXJuZWQ6IFwiLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICByZXR1cm4gdGV4dE5vZGVFbGVtZW50O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGVyZSB0byBpbmplY3QgYSBoaWdobGlnaHQgYmFzZWQgb24gaXQncyBvZmZzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBoaWdobGlnaHRcbiAqIEBwYXJhbSB7Kn0gcGFyZW50Tm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE5vZGVBbmRPZmZzZXQoaGlnaGxpZ2h0LCBwYXJlbnROb2RlKSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcbiAgbGV0IG9mZnNldFdpdGhpbk5vZGUgPSAwO1xuICBsZXQgbG9jYXRpb25Gb3VuZCA9IGZhbHNlO1xuXG4gIHdoaWxlIChcbiAgICBjdXJyZW50Tm9kZSAmJlxuICAgICFsb2NhdGlvbkZvdW5kICYmXG4gICAgKGN1cnJlbnRPZmZzZXQgPCBoaWdobGlnaHQub2Zmc2V0IHx8XG4gICAgICAoY3VycmVudE9mZnNldCA9PT0gaGlnaGxpZ2h0Lm9mZnNldCAmJiBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA+IDApKVxuICApIHtcbiAgICBjb25zdCBlbmRPZk5vZGVPZmZzZXQgPSBjdXJyZW50T2Zmc2V0ICsgY3VycmVudE5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuXG4gICAgaWYgKGVuZE9mTm9kZU9mZnNldCA+IGhpZ2hsaWdodC5vZmZzZXQpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvZmZzZXRXaXRoaW5Ob2RlID0gaGlnaGxpZ2h0Lm9mZnNldCAtIGN1cnJlbnRPZmZzZXQ7XG4gICAgICAgIGxvY2F0aW9uRm91bmQgPSB0cnVlO1xuICAgICAgICBjdXJyZW50T2Zmc2V0ID0gY3VycmVudE9mZnNldCArIG9mZnNldFdpdGhpbk5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRPZmZzZXQgPSBlbmRPZk5vZGVPZmZzZXQ7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG5vZGU6IGN1cnJlbnROb2RlLCBvZmZzZXQ6IG9mZnNldFdpdGhpbk5vZGUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRPZmZzZXQoY2hpbGRFbGVtZW50LCByb290RWxlbWVudCkge1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgbGV0IGNoaWxkTm9kZXM7XG5cbiAgbGV0IGN1cnJlbnRFbGVtZW50ID0gY2hpbGRFbGVtZW50O1xuICBkbyB7XG4gICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgICAgY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzXG4gICAgKTtcbiAgICBjb25zdCBjaGlsZEVsZW1lbnRJbmRleCA9IGNoaWxkTm9kZXMuaW5kZXhPZihjdXJyZW50RWxlbWVudCk7XG4gICAgY29uc3Qgb2Zmc2V0SW5DdXJyZW50UGFyZW50ID0gZ2V0VGV4dE9mZnNldEJlZm9yZShcbiAgICAgIGNoaWxkTm9kZXMsXG4gICAgICBjaGlsZEVsZW1lbnRJbmRleFxuICAgICk7XG4gICAgb2Zmc2V0ICs9IG9mZnNldEluQ3VycmVudFBhcmVudDtcbiAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGU7XG4gIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50ICE9PSByb290RWxlbWVudCB8fCAhY3VycmVudEVsZW1lbnQpO1xuXG4gIHJldHVybiBvZmZzZXQ7XG59XG5cbmZ1bmN0aW9uIGdldFRleHRPZmZzZXRCZWZvcmUoY2hpbGROb2RlcywgY3V0SW5kZXgpIHtcbiAgbGV0IHRleHRPZmZzZXQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1dEluZGV4OyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZXNbaV07XG4gICAgLy8gVXNlIHRleHRDb250ZW50IGFuZCBub3QgaW5uZXJIVE1MIHRvIGFjY291bnQgZm9yIGludmlzaWJsZSBjaGFyYWN0ZXJzIGFzIHdlbGwuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvdGV4dENvbnRlbnRcbiAgICBjb25zdCB0ZXh0ID0gY3VycmVudE5vZGUudGV4dENvbnRlbnQ7XG4gICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICB0ZXh0T2Zmc2V0ICs9IHRleHQubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dE9mZnNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudChlbGVtZW50cykge1xuICBsZXQgY2hpbGRFbGVtZW50ID0gZWxlbWVudHMuY2hpbGRFbGVtZW50O1xuICBsZXQgb3RoZXJFbGVtZW50ID0gZWxlbWVudHMub3RoZXJFbGVtZW50O1xuICBsZXQgcGFyZW50cyA9IGRvbShjaGlsZEVsZW1lbnQpLnBhcmVudHNXaXRob3V0RG9jdW1lbnQoKTtcbiAgbGV0IGkgPSAwO1xuICBsZXQgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBudWxsO1xuICBsZXQgYWxsUGFyZW50c0FyZVNoYXJlZCA9IGZhbHNlO1xuICB3aGlsZSAoIWZpcnN0Tm9uU2hhcmVkUGFyZW50ICYmICFhbGxQYXJlbnRzQXJlU2hhcmVkICYmIGkgPCBwYXJlbnRzLmxlbmd0aCkge1xuICAgIGNvbnN0IGN1cnJlbnRQYXJlbnQgPSBwYXJlbnRzW2ldO1xuXG4gICAgaWYgKGN1cnJlbnRQYXJlbnQuY29udGFpbnMob3RoZXJFbGVtZW50KSkge1xuICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50UGFyZW50IGNvbnRhaW5zIG90aGVyIGVsZW1lbnQhXCIsIGN1cnJlbnRQYXJlbnQpO1xuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIGZpcnN0Tm9uU2hhcmVkUGFyZW50ID0gcGFyZW50c1tpIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxQYXJlbnRzQXJlU2hhcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0Tm9uU2hhcmVkUGFyZW50O1xufVxuXG5jb25zdCBzaWJsaW5nUmVtb3ZhbERpcmVjdGlvbnMgPSB7XG4gIHN0YXJ0OiBcInByZXZpb3VzU2libGluZ1wiLFxuICBlbmQ6IFwibmV4dFNpYmxpbmdcIlxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodChwYXJhbXMpIHtcbiAgbGV0IGVsZW1lbnQgPSBwYXJhbXMuZWxlbWVudDtcbiAgbGV0IGVsZW1lbnRBbmNlc3RvciA9IHBhcmFtcy5lbGVtZW50QW5jZXN0b3I7XG4gIGxldCBvcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XG4gIGxldCBsb2NhdGlvbkluU2VsZWN0aW9uID0gcGFyYW1zLmxvY2F0aW9uSW5TZWxlY3Rpb247XG5cbiAgbGV0IGVsZW1lbnRBbmNlc3RvckNvcHkgPSBlbGVtZW50QW5jZXN0b3IuY2xvbmVOb2RlKHRydWUpO1xuXG4gIC8vIEJlZ2lubmluZyBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIGVuZCBjb250YWluZXIgaW4gc2VsZWN0aW9uXG4gIC8vIGFuZCBlbmQgb2YgY2hpbGROb2RlcyBsaXN0IGZvciBzdGFydCBjb250YWluZXIgaW4gc2VsZWN0aW9uLlxuICBsZXQgbG9jYXRpb25JbkNoaWxkTm9kZXMgPSBsb2NhdGlvbkluU2VsZWN0aW9uID09PSBcInN0YXJ0XCIgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuICBsZXQgZWxlbWVudENvcHkgPSBmaW5kVGV4dE5vZGVBdExvY2F0aW9uKFxuICAgIGVsZW1lbnRBbmNlc3RvckNvcHksXG4gICAgbG9jYXRpb25JbkNoaWxkTm9kZXNcbiAgKTtcbiAgbGV0IGVsZW1lbnRDb3B5UGFyZW50ID0gZWxlbWVudENvcHkucGFyZW50Tm9kZTtcblxuICBjb25zdCBzaWJsaW5nUmVtb3ZhbERpcmVjdGlvbiA9IHNpYmxpbmdSZW1vdmFsRGlyZWN0aW9uc1tsb2NhdGlvbkluU2VsZWN0aW9uXTtcbiAgbGV0IHNpYmxpbmcgPSBlbGVtZW50Q29weVtzaWJsaW5nUmVtb3ZhbERpcmVjdGlvbl07XG4gIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgZWxlbWVudENvcHlQYXJlbnQucmVtb3ZlQ2hpbGQoc2libGluZyk7XG4gICAgc2libGluZyA9IGVsZW1lbnRDb3B5W3NpYmxpbmdSZW1vdmFsRGlyZWN0aW9uXTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHk6IFwiLCBlbGVtZW50Q29weSk7XG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHlQYXJlbnQ6IFwiLCBlbGVtZW50Q29weVBhcmVudCk7XG5cbiAgLy8gQ2xlYW4gb3V0IGFueSBuZXN0ZWQgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICBpZiAoXG4gICAgZWxlbWVudENvcHlQYXJlbnQgIT09IGVsZW1lbnRBbmNlc3RvckNvcHkgJiZcbiAgICBlbGVtZW50Q29weVBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5oaWdobGlnaHRlZENsYXNzKVxuICApIHtcbiAgICBkb20oZWxlbWVudENvcHlQYXJlbnQpLnVud3JhcCgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0ZXh0IG5vZGUgdGhhdCB3ZSBuZWVkIGZvciB0aGUgbmV3IGhpZ2hsaWdodFxuICAvLyBmcm9tIHRoZSBleGlzdGluZyBoaWdobGlnaHQgb3Igb3RoZXIgZWxlbWVudC5cbiAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXG4gIHJldHVybiBlbGVtZW50QW5jZXN0b3JDb3B5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9kZXNJbkJldHdlZW4oc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gIGlmIChzdGFydE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgLy8gVE9ETzogZ2V0IGFsbCBub2RlcyB0aGF0IGFyZSBpbiBiZXR3ZWVuIHRoZSB0d28gbm9kZXMgYWNyb3NzIGRpZmZlcmVudCBsZXZlbHMgaW4gdGhlIERPTSB0cmVlLlxufVxuXG4vKipcbiAqIEdyb3VwcyBnaXZlbiBoaWdobGlnaHRzIGJ5IHRpbWVzdGFtcC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHNcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBBdHRyXG4gKiBAcmV0dXJucyB7QXJyYXl9IEdyb3VwZWQgaGlnaGxpZ2h0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCB0aW1lc3RhbXBBdHRyKSB7XG4gIGxldCBvcmRlciA9IFtdLFxuICAgIGNodW5rcyA9IHt9LFxuICAgIGdyb3VwZWQgPSBbXTtcblxuICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICBsZXQgdGltZXN0YW1wID0gaGwuZ2V0QXR0cmlidXRlKHRpbWVzdGFtcEF0dHIpO1xuXG4gICAgaWYgKHR5cGVvZiBjaHVua3NbdGltZXN0YW1wXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgY2h1bmtzW3RpbWVzdGFtcF0gPSBbXTtcbiAgICAgIG9yZGVyLnB1c2godGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBjaHVua3NbdGltZXN0YW1wXS5wdXNoKGhsKTtcbiAgfSk7XG5cbiAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICBsZXQgZ3JvdXAgPSBjaHVua3NbdGltZXN0YW1wXTtcblxuICAgIGdyb3VwZWQucHVzaCh7XG4gICAgICBjaHVua3M6IGdyb3VwLFxuICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBncm91cFxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oaCkge1xuICAgICAgICAgICAgcmV0dXJuIGgudGV4dENvbnRlbnQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbihcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGdyb3VwZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXRyaWV2ZUhpZ2hsaWdodHMocGFyYW1zKSB7XG4gIHBhcmFtcyA9IHtcbiAgICBhbmRTZWxmOiB0cnVlLFxuICAgIGdyb3VwZWQ6IGZhbHNlLFxuICAgIC4uLnBhcmFtc1xuICB9O1xuXG4gIGxldCBub2RlTGlzdCA9IHBhcmFtcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIltcIiArIHBhcmFtcy5kYXRhQXR0ciArIFwiXVwiKSxcbiAgICBoaWdobGlnaHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuXG4gIGlmIChcbiAgICBwYXJhbXMuYW5kU2VsZiA9PT0gdHJ1ZSAmJlxuICAgIHBhcmFtcy5jb250YWluZXIuaGFzQXR0cmlidXRlKHBhcmFtcy5kYXRhQXR0cilcbiAgKSB7XG4gICAgaGlnaGxpZ2h0cy5wdXNoKHBhcmFtcy5jb250YWluZXIpO1xuICB9XG5cbiAgaWYgKHBhcmFtcy5ncm91cGVkKSB7XG4gICAgaGlnaGxpZ2h0cyA9IGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCBwYXJhbXMudGltZXN0YW1wQXR0cik7XG4gIH1cblxuICByZXR1cm4gaGlnaGxpZ2h0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudEhpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgcmV0dXJuIChcbiAgICBlbCAmJiBlbC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlRfTk9ERSAmJiBlbC5oYXNBdHRyaWJ1dGUoZGF0YUF0dHIpXG4gICk7XG59XG4iXX0=
