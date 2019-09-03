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
   * Creates an IndependenciaHighlighter instance for functionality that focuses for highlight independence.
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
      wrapperClone.setAttribute(_config.DATA_ATTR, true);
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
        var startOfNewHighlightCopy;

        if (startElementParent) {
          var _extractElementConten = (0, _highlights.extractElementContentForHighlight)({
            element: _startOfNewHighlight,
            elementAncestor: startElementParent,
            options: this.options,
            locationInSelection: "start"
          });

          startElementParentCopy = _extractElementConten.elementAncestorCopy;
          startOfNewHighlightCopy = _extractElementConten.elementCopy;
          console.log("startElementParent:", startElementParent);
          console.log("startElementParentCopy: ", startElementParentCopy);
        }

        var endElementParent = (0, _highlights.findFirstNonSharedParent)({
          childElement: endOfNewHighlight,
          otherElement: _startOfNewHighlight
        });
        var endElementParentCopy;
        var endOfNewHighlightCopy;

        if (endElementParent) {
          var _extractElementConten2 = (0, _highlights.extractElementContentForHighlight)({
            element: endOfNewHighlight,
            elementAncestor: endElementParent,
            options: this.options,
            locationInSelection: "end"
          });

          endElementParentCopy = _extractElementConten2.elementAncestorCopy;
          endOfNewHighlightCopy = _extractElementConten2.elementcopy;
          console.log("Node that is the wrapper of the end of the new highlight: ", endElementParent);
          console.log("Cloned of node that is the wrapper of the end of the new highlight after removing siblings and unwrapping highlight spans: ", endElementParentCopy);
        }

        (0, _highlights.addNodesToHighlightAfterElement)({
          element: startOfNewHighlightCopy || _startOfNewHighlight,
          elementAncestor: startElementParentCopy,
          highlightWrapper: wrapperClone,
          highlightedClass: this.options.highlightedClass
        }); // TODO: add containers in between.

        var containersInBetween = (0, _highlights.nodesInBetween)(startContainer, endContainer);
        console.log("CONTAINERS IN BETWEEN: ", containersInBetween);
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
     * Highlights current range.
     * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "doHighlight",
    value: function doHighlight(keepRange) {
      var range = (0, _dom["default"])(this.el).getRange(),
          wrapper,
          timestamp;

      if (!range || range.collapsed) {
        return;
      }

      if (this.options.onBeforeHighlight(range) === true) {
        timestamp = +new Date();
        wrapper = (0, _highlights.createWrapper)(this.options);
        wrapper.setAttribute(_config.TIMESTAMP_ATTR, timestamp);
        var descriptors = (0, _highlights.createDescriptors)({
          rootElement: this.el,
          range: range,
          wrapper: wrapper
        }); // createdHighlights = this.highlightRange(range, wrapper);
        // normalizedHighlights = this.normalizeHighlights(createdHighlights);

        var processedDescriptors = this.options.onAfterHighlight(range, descriptors, timestamp);
        this.deserializeHighlights(processedDescriptors);
      }

      if (!keepRange) {
        (0, _dom["default"])(this.el).removeAllRanges();
      }
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
            offset = (0, _highlights.getElementOffset)(highlight, refEl),
            // Hl offset from the root element.
        wrapper = highlight.cloneNode(true);
        wrapper.innerHTML = "";
        wrapper = wrapper.outerHTML;

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
     * Highlights current range.
     * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
     * @memberof PrimitivoHighlighter
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

        if (!this.options.onAfterHighlight) {
          console.log("ALSDEbug24: Primitivo: this.options: ", this.options, "\n\n\n\n");
        }

        this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
      }

      if (!keepRange) {
        (0, _dom["default"])(this.el).removeAllRanges();
      }
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
  _createClass(TextHighlighter, null, [{
    key: "createWrapper",

    /**
     * Creates wrapper for highlights.
     * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
     * in constructor.
     *
     * @param {object} options - the same object as in TextHighlighter constructor.
     * @returns {HTMLElement}
     */
    value: function createWrapper(options) {
      return (0, _highlights.createWrapper)(options);
    }
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

  }]);

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
    console.log("\n\n\n\nALSDEbug24: TextHighlighter: options constructor param: ", options);
    console.log("ALSDEbug24: TextHighlighter: this.options: ", this.options);

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
  }, {
    key: "doHighlight",
    value: function doHighlight(keepRange) {
      this.highlighter.doHighlight(keepRange);
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
     * the id is not used in the initial version of the highlighter.
     *
     * @param {string} id - The unique identifier grouping a set of highlight elements together.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
     */

  }, {
    key: "serializeHighlights",
    value: function serializeHighlights(id) {
      return this.highlighter.serializeHighlights(id);
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
      },

      /**
       * Returns whether the provided element comes after the base element.
       *
       * @param {HTMLElement} otherElement
       *
       * @returns {boolean}
       */
      isAfter: function isAfter(otherElement, rootElement) {
        var sibling = el.nextSibling;
        var isAfter = false;

        while (sibling && !isAfter) {
          if (sibling === otherElement) {
            isAfter = true;
          } else {
            if (!sibling.nextSibling) {
              sibling = el.parentNode.nextSibling;
            } else {
              sibling = sibling.nextSibling;
            }
          }
        }

        return isAfter;
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
exports.addNodesToHighlightAfterElement = addNodesToHighlightAfterElement;
exports.getHighlightedText = getHighlightedText;
exports.createDescriptors = createDescriptors;

var _dom = _interopRequireWildcard(require("./dom"));

var _config = require("../config");

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
var siblingTextNodeMergeDirections = {
  start: "nextSibling",
  end: "previousSibling"
};

function removeSiblingsInDirection(startNode, direction) {
  var sibling = startNode[direction];

  while (sibling) {
    startNode.parentNode.removeChild(sibling);
    sibling = sibling[direction];
  }
}
/**
 * Merges the text of all sibling text nodes with the start node.
 *
 * @param {HTMLElement} startNode
 * @param {string} direction
 */


function mergeSiblingTextNodesInDirection(startNode, direction) {
  var sibling = startNode[direction];

  while (sibling) {
    if (sibling.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
      startNode.textContent += sibling.textContent;
      startNode.parentNode.removeChild(sibling);
      sibling = sibling[direction];
    }
  }
}

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
  removeSiblingsInDirection(elementCopy, siblingRemovalDirections[locationInSelection]);
  mergeSiblingTextNodesInDirection(elementCopy, siblingTextNodeMergeDirections[locationInSelection]);
  console.log("elementCopy: ", elementCopy);
  console.log("elementCopyParent: ", elementCopyParent); // Clean out any nested highlight wrappers.

  if (elementCopyParent !== elementAncestorCopy && elementCopyParent.classList.contains(options.highlightedClass)) {
    (0, _dom["default"])(elementCopyParent).unwrap();
  } // Remove the text node that we need for the new highlight
  // from the existing highlight or other element.


  element.parentNode.removeChild(element);
  return {
    elementAncestorCopy: elementAncestorCopy,
    elementCopy: elementCopy
  };
}

function gatherSiblingsUpToEndNode(startNodeOrContainer, endNode) {
  var gatheredSiblings = [];
  var foundEndNodeSibling = false;
  var currentNode = startNodeOrContainer.nextSibling;

  while (currentNode && !foundEndNodeSibling) {
    if (currentNode === endNode || currentNode.contains(endNode)) {
      foundEndNodeSibling = true;
    } else {
      gatheredSiblings.push(currentNode);
      currentNode = currentNode.nextSibling;
    }
  }

  return {
    gatheredSiblings: gatheredSiblings,
    foundEndNodeSibling: foundEndNodeSibling
  };
}
/**
 * Gets all the nodes in between the provided start and end.
 *
 * @param {HTMLElement} startNode
 * @param {HTMLElement} endNode
 * @returns {HTMLElement[]} Nodes that live in between the two.
 */


function nodesInBetween(startNode, endNode) {
  if (startNode === endNode) {
    return [];
  } // First attempt the easiest solution, hoping endNode will be at the same level
  // as the start node or contained in an element at the same level.


  var _gatherSiblingsUpToEn = gatherSiblingsUpToEndNode(startNode, endNode),
      foundEndNodeSiblingOnSameLevel = _gatherSiblingsUpToEn.foundEndNodeSibling,
      gatheredSiblings = _gatherSiblingsUpToEn.gatheredSiblings;

  if (foundEndNodeSiblingOnSameLevel) {
    return gatheredSiblings;
  } // Now go for the route that goes to the highest parent of the start node in the tree
  // that is not the parent of the end node.


  var startNodeParent = findFirstNonSharedParent({
    childElement: startNode,
    otherElement: endNode
  });

  if (startNodeParent) {
    var _gatherSiblingsUpToEn2 = gatherSiblingsUpToEndNode(startNodeParent, endNode),
        foundEndNodeSiblingFromParentLevel = _gatherSiblingsUpToEn2.foundEndNodeSibling,
        gatheredSiblingsFromParent = _gatherSiblingsUpToEn2.gatheredSiblings;

    if (foundEndNodeSiblingFromParentLevel) {
      return gatheredSiblingsFromParent;
    }
  }

  return [];
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

function addNodesToHighlightAfterElement(_ref) {
  var element = _ref.element,
      elementAncestor = _ref.elementAncestor,
      highlightWrapper = _ref.highlightWrapper,
      highlightedClass = _ref.highlightedClass;

  if (elementAncestor) {
    if (elementAncestor.classList.contains(highlightedClass)) {
      // Ensure we only take the children from a parent that is a highlight.
      elementAncestor.childNodes.forEach(function (childNode) {
        if ((0, _dom["default"])(childNode).isAfter(element)) {}

        elementAncestor.appendChild(childNode);
      });
    } else {
      highlightWrapper.appendChild(elementAncestor);
    }
  } else {
    highlightWrapper.appendChild(element);
  }
}
/**
 * Collects the human-readable highlighted text for all nodes in the selected range.
 *
 * @param {Range} range
 *
 * @return {string} The human-readable highlighted text for the given range.
 */


function getHighlightedText(range) {
  var startContainerCopy = range.startContainer.clone(true);
  return "";
}

function createDescriptors(_ref2) {
  var rootElement = _ref2.rootElement,
      range = _ref2.range,
      wrapper = _ref2.wrapper;
  var wrapperClone = wrapper.cloneNode(true);
  var startOffset = getElementOffset(range.startContainer, rootElement) + range.startOffset;
  var endOffset = range.startContainer === range.endContainer ? startOffset + (range.endOffset - range.startOffset) : getElementOffset(range.endContainer, rootElement) + range.endOffset;
  var length = endOffset - startOffset;
  wrapperClone.setAttribute(_config.DATA_ATTR, true);
  wrapperClone.innerHTML = "";
  var wrapperHTML = wrapperClone.outerHTML;
  var descriptor = [wrapperHTML, // retrieve all the text content between the start and end offsets.
  getHighlightedText(range), startOffset, length]; // TODO: chunk up highlights for PDFs (or any element with absolutely positioned elements).

  return [descriptor];
}

},{"../config":1,"./dom":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzIiwic3JjL2dsb2JhbC1zY3JpcHQuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWEuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2by5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUlPLElBQU0sU0FBUyxHQUFHLGtCQUFsQjtBQUVQOzs7Ozs7QUFJTyxJQUFNLGNBQWMsR0FBRyxnQkFBdkI7O0FBRUEsSUFBTSxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsaUJBQXhCO0FBRVA7Ozs7OztBQUlPLElBQU0sV0FBVyxHQUFHLENBQ3pCLFFBRHlCLEVBRXpCLE9BRnlCLEVBR3pCLFFBSHlCLEVBSXpCLFFBSnlCLEVBS3pCLFFBTHlCLEVBTXpCLFFBTnlCLEVBT3pCLFFBUHlCLEVBUXpCLE9BUnlCLEVBU3pCLE9BVHlCLEVBVXpCLFFBVnlCLEVBV3pCLE9BWHlCLEVBWXpCLE9BWnlCLEVBYXpCLE9BYnlCLEVBY3pCLFVBZHlCLENBQXBCOzs7Ozs7O0FDbkJQOztBQVlBOzs7O0FBVkE7Ozs7QUFJQSxNQUFNLENBQUMsZUFBUCxHQUF5QiwyQkFBekI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7O0FBY0E7O0FBTUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLHdCOzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsb0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxP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LGlCQUExQixFQUFxQyxJQUFyQztBQUVBLEVBQUEsWUFBWSxDQUFDLFNBQWIsR0FBeUIsRUFBekI7QUFDQSxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsU0FBakM7QUFFQSxNQUFNLFVBQVUsR0FBRyxDQUNqQixXQURpQixFQUVqQjtBQUNBLEVBQUEsa0JBQWtCLENBQUMsS0FBRCxDQUhELEVBSWpCLFdBSmlCLEVBS2pCLE1BTGlCLENBQW5CLENBZmlFLENBc0JqRTs7QUFDQSxTQUFPLENBQUMsVUFBRCxDQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIEF0dHJpYnV0ZSBhZGRlZCBieSBkZWZhdWx0IHRvIGV2ZXJ5IGhpZ2hsaWdodC5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBEQVRBX0FUVFIgPSBcImRhdGEtaGlnaGxpZ2h0ZWRcIjtcblxuLyoqXG4gKiBBdHRyaWJ1dGUgdXNlZCB0byBncm91cCBoaWdobGlnaHQgd3JhcHBlcnMuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgVElNRVNUQU1QX0FUVFIgPSBcImRhdGEtdGltZXN0YW1wXCI7XG5cbmV4cG9ydCBjb25zdCBTVEFSVF9PRkZTRVRfQVRUUiA9IFwiZGF0YS1zdGFydC1vZmZzZXRcIjtcbmV4cG9ydCBjb25zdCBFTkRfT0ZGU0VUX0FUVFIgPSBcImRhdGEtZW5kLW9mZnNldFwiO1xuXG4vKipcbiAqIERvbid0IGhpZ2hsaWdodCBjb250ZW50IG9mIHRoZXNlIHRhZ3MuXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBJR05PUkVfVEFHUyA9IFtcbiAgXCJTQ1JJUFRcIixcbiAgXCJTVFlMRVwiLFxuICBcIlNFTEVDVFwiLFxuICBcIk9QVElPTlwiLFxuICBcIkJVVFRPTlwiLFxuICBcIk9CSkVDVFwiLFxuICBcIkFQUExFVFwiLFxuICBcIlZJREVPXCIsXG4gIFwiQVVESU9cIixcbiAgXCJDQU5WQVNcIixcbiAgXCJFTUJFRFwiLFxuICBcIlBBUkFNXCIsXG4gIFwiTUVURVJcIixcbiAgXCJQUk9HUkVTU1wiXG5dO1xuIiwiaW1wb3J0IFRleHRIaWdobGlnaHRlciBmcm9tIFwiLi90ZXh0LWhpZ2hsaWdodGVyXCI7XG5cbi8qKlxuICogRXhwb3NlIHRoZSBUZXh0SGlnaGxpZ2h0ZXIgY2xhc3MgZ2xvYmFsbHkgdG8gYmVcbiAqIHVzZWQgaW4gZGVtb3MgYW5kIHRvIGJlIGluamVjdGVkIGRpcmVjdGx5IGludG8gaHRtbCBmaWxlcy5cbiAqL1xuZ2xvYmFsLlRleHRIaWdobGlnaHRlciA9IFRleHRIaWdobGlnaHRlcjtcblxuLyoqXG4gKiBMb2FkIHRoZSBqcXVlcnkgcGx1Z2luIGdsb2JhbGx5IGV4cGVjdGluZyBqUXVlcnkgYW5kIFRleHRIaWdobGlnaHRlciB0byBiZSBnbG9iYWxseVxuICogYXZhaWFibGUsIHRoaXMgbWVhbnMgdGhpcyBsaWJyYXJ5IGRvZXNuJ3QgbmVlZCBhIGhhcmQgcmVxdWlyZW1lbnQgb2YgalF1ZXJ5LlxuICovXG5pbXBvcnQgXCIuL2pxdWVyeS1wbHVnaW5cIjtcbiIsImltcG9ydCB7XG4gIHJldHJpZXZlSGlnaGxpZ2h0cyxcbiAgaXNFbGVtZW50SGlnaGxpZ2h0LFxuICBnZXRFbGVtZW50T2Zmc2V0LFxuICBmaW5kVGV4dE5vZGVBdExvY2F0aW9uLFxuICBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQsXG4gIGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodCxcbiAgbm9kZXNJbkJldHdlZW4sXG4gIHNvcnRCeURlcHRoLFxuICBmaW5kTm9kZUFuZE9mZnNldCxcbiAgYWRkTm9kZXNUb0hpZ2hsaWdodEFmdGVyRWxlbWVudCxcbiAgY3JlYXRlV3JhcHBlcixcbiAgY3JlYXRlRGVzY3JpcHRvcnNcbn0gZnJvbSBcIi4uL3V0aWxzL2hpZ2hsaWdodHNcIjtcbmltcG9ydCB7XG4gIFNUQVJUX09GRlNFVF9BVFRSLFxuICBFTkRfT0ZGU0VUX0FUVFIsXG4gIERBVEFfQVRUUixcbiAgVElNRVNUQU1QX0FUVFJcbn0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IGRvbSBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyB1bmlxdWUgfSBmcm9tIFwiLi4vdXRpbHMvYXJyYXlzXCI7XG5cbi8qKlxuICogSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHNcbiAqIHdpdGggYSBmb2N1cyBvbiByZW1vdmluZyBpbnRlcmRlcGVuZGVuY2UgYmV0d2VlbiBoaWdobGlnaHRzIGFuZCBvdGhlciBlbGVtZW50IG5vZGVzIGluIHRoZSBjb250ZXh0IGVsZW1lbnQuXG4gKi9cbmNsYXNzIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciBpbnN0YW5jZSBmb3IgZnVuY3Rpb25hbGl0eSB0aGF0IGZvY3VzZXMgZm9yIGhpZ2hsaWdodCBpbmRlcGVuZGVuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHRoZSByYW5nZSBhbGxvd2luZyBpc29sYXRpb24gZm9yIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMuXG4gICAqIFRoaXMgc29sdXRpb24gc3RlYWxzIHRoZSB0ZXh0IG9yIG90aGVyIG5vZGVzIGluIHRoZSBET00gZnJvbSBvdmVybGFwcGluZyAoTk9UIE5FU1RFRCkgaGlnaGxpZ2h0c1xuICAgKiBmb3IgcmVwcmVzZW50YXRpb24gaW4gdGhlIERPTS5cbiAgICpcbiAgICogRm9yIHRoZSBwdXJwb3NlIG9mIHNlcmlhbGlzYXRpb24gdGhpcyB3aWxsIG1haW50YWluIGEgZGF0YSBhdHRyaWJ1dGUgb24gdGhlIGhpZ2hsaWdodCB3cmFwcGVyXG4gICAqIHdpdGggdGhlIHN0YXJ0IHRleHQgYW5kIGVuZCB0ZXh0IG9mZnNldHMgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcm9vdCBlbGVtZW50LlxuICAgKlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyOTogUkFOR0U6IFwiLCByYW5nZSk7XG5cbiAgICBsZXQgaGlnaGxpZ2h0cyA9IFtdO1xuICAgIGxldCB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcblxuICAgIGxldCBzdGFydE9mZnNldCA9XG4gICAgICBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLnN0YXJ0Q29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgIGxldCBlbmRPZmZzZXQgPVxuICAgICAgcmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHJhbmdlLmVuZENvbnRhaW5lclxuICAgICAgICA/IHN0YXJ0T2Zmc2V0ICsgKHJhbmdlLmVuZE9mZnNldCAtIHJhbmdlLnN0YXJ0T2Zmc2V0KVxuICAgICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLmVuZE9mZnNldDtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJBTFNEZWJ1ZzI5OiBzdGFydE9mZnNldDogXCIsXG4gICAgICBzdGFydE9mZnNldCxcbiAgICAgIFwiZW5kT2Zmc2V0OiBcIixcbiAgICAgIGVuZE9mZnNldFxuICAgICk7XG5cbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKFNUQVJUX09GRlNFVF9BVFRSLCBzdGFydE9mZnNldCk7XG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShFTkRfT0ZGU0VUX0FUVFIsIGVuZE9mZnNldCk7XG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuXG4gICAgY29uc29sZS5sb2coXCJcXG5cXG5cXG4gRklORElORyBTVEFSVCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLnN0YXJ0Q29udGFpbmVyOiBcIiwgcmFuZ2Uuc3RhcnRDb250YWluZXIpO1xuICAgIGxldCBzdGFydENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2Uuc3RhcnRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIEVORCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLmVuZENvbnRhaW5lcjogXCIsIHJhbmdlLmVuZENvbnRhaW5lcik7XG4gICAgbGV0IGVuZENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2UuZW5kQ29udGFpbmVyLCBcInN0YXJ0XCIpO1xuXG4gICAgaWYgKCFzdGFydENvbnRhaW5lciB8fCAhZW5kQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRmFpbGVkIHRvIGZpbmQgdGhlIHRleHQgbm9kZSBmb3IgdGhlIHN0YXJ0IG9yIHRoZSBlbmQgb2YgdGhlIHNlbGVjdGVkIHJhbmdlXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyTmV3SGlnaGxpZ2h0ID1cbiAgICAgIHJhbmdlLmVuZE9mZnNldCA8IGVuZENvbnRhaW5lci50ZXh0Q29udGVudC5sZW5ndGggLSAxXG4gICAgICAgID8gZW5kQ29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5lbmRPZmZzZXQpXG4gICAgICAgIDogZW5kQ29udGFpbmVyO1xuXG4gICAgaWYgKHN0YXJ0Q29udGFpbmVyID09PSBlbmRDb250YWluZXIpIHtcbiAgICAgIGxldCBzdGFydE9mTmV3SGlnaGxpZ2h0ID1cbiAgICAgICAgcmFuZ2Uuc3RhcnRPZmZzZXQgPiAwXG4gICAgICAgICAgPyBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICAgICAgOiBzdGFydENvbnRhaW5lcjtcbiAgICAgIC8vIFNpbXBseSB3cmFwIHRoZSBzZWxlY3RlZCByYW5nZSBpbiB0aGUgc2FtZSBjb250YWluZXIgYXMgYSBoaWdobGlnaHQuXG4gICAgICBsZXQgaGlnaGxpZ2h0ID0gZG9tKHN0YXJ0T2ZOZXdIaWdobGlnaHQpLndyYXAod3JhcHBlckNsb25lKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH0gZWxzZSBpZiAoZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCA+PSByYW5nZS5lbmRPZmZzZXQpIHtcbiAgICAgIGxldCBzdGFydE9mTmV3SGlnaGxpZ2h0ID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGxldCBlbmRPZk5ld0hpZ2hsaWdodCA9IGFmdGVyTmV3SGlnaGxpZ2h0LnByZXZpb3VzU2libGluZztcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIk5vZGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgc3RhcnRPZk5ld0hpZ2hsaWdodFxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTm9kZSBhdCB0aGUgZW5kIG9mIG5ldyBoaWdobGlnaHQ6IFwiLCBlbmRPZk5ld0hpZ2hsaWdodCk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0RWxlbWVudFBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgICAgIGNoaWxkRWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzdGFydEVsZW1lbnRQYXJlbnRDb3B5O1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHRDb3B5O1xuICAgICAgaWYgKHN0YXJ0RWxlbWVudFBhcmVudCkge1xuICAgICAgICAoe1xuICAgICAgICAgIGVsZW1lbnRBbmNlc3RvckNvcHk6IHN0YXJ0RWxlbWVudFBhcmVudENvcHksXG4gICAgICAgICAgZWxlbWVudENvcHk6IHN0YXJ0T2ZOZXdIaWdobGlnaHRDb3B5XG4gICAgICAgIH0gPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoe1xuICAgICAgICAgIGVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHQsXG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwic3RhcnRcIlxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydEVsZW1lbnRQYXJlbnQ6XCIsIHN0YXJ0RWxlbWVudFBhcmVudCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRFbGVtZW50UGFyZW50Q29weTogXCIsIHN0YXJ0RWxlbWVudFBhcmVudENvcHkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbmRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgbGV0IGVuZEVsZW1lbnRQYXJlbnRDb3B5O1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0Q29weTtcbiAgICAgIGlmIChlbmRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgICh7XG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yQ29weTogZW5kRWxlbWVudFBhcmVudENvcHksXG4gICAgICAgICAgZWxlbWVudGNvcHk6IGVuZE9mTmV3SGlnaGxpZ2h0Q29weVxuICAgICAgICB9ID0gZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0KHtcbiAgICAgICAgICBlbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3I6IGVuZEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwiZW5kXCJcbiAgICAgICAgfSkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIk5vZGUgdGhhdCBpcyB0aGUgd3JhcHBlciBvZiB0aGUgZW5kIG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJDbG9uZWQgb2Ygbm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQgYWZ0ZXIgcmVtb3Zpbmcgc2libGluZ3MgYW5kIHVud3JhcHBpbmcgaGlnaGxpZ2h0IHNwYW5zOiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBhZGROb2Rlc1RvSGlnaGxpZ2h0QWZ0ZXJFbGVtZW50KHtcbiAgICAgICAgZWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodENvcHkgfHwgc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnRDb3B5LFxuICAgICAgICBoaWdobGlnaHRXcmFwcGVyOiB3cmFwcGVyQ2xvbmUsXG4gICAgICAgIGhpZ2hsaWdodGVkQ2xhc3M6IHRoaXMub3B0aW9ucy5oaWdobGlnaHRlZENsYXNzXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETzogYWRkIGNvbnRhaW5lcnMgaW4gYmV0d2Vlbi5cbiAgICAgIGNvbnN0IGNvbnRhaW5lcnNJbkJldHdlZW4gPSBub2Rlc0luQmV0d2VlbihzdGFydENvbnRhaW5lciwgZW5kQ29udGFpbmVyKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ09OVEFJTkVSUyBJTiBCRVRXRUVOOiBcIiwgY29udGFpbmVyc0luQmV0d2Vlbik7XG4gICAgICBjb250YWluZXJzSW5CZXR3ZWVuLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnRDb3B5KSB7XG4gICAgICAgIC8vIE9ubHkgY29weSB0aGUgY2hpbGRyZW4gb2YgYSBoaWdobGlnaHRlZCBzcGFuIGludG8gb3VyIG5ldyBoaWdobGlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZEVsZW1lbnRQYXJlbnRDb3B5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZE9mTmV3SGlnaGxpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgZG9tKHdyYXBwZXJDbG9uZSkuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBlbmRFbGVtZW50UGFyZW50ID8gZW5kRWxlbWVudFBhcmVudCA6IGFmdGVyTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgY3VycmVudCByYW5nZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBrZWVwUmFuZ2UgLSBEb24ndCByZW1vdmUgcmFuZ2UgYWZ0ZXIgaGlnaGxpZ2h0aW5nLiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgZG9IaWdobGlnaHQoa2VlcFJhbmdlKSB7XG4gICAgbGV0IHJhbmdlID0gZG9tKHRoaXMuZWwpLmdldFJhbmdlKCksXG4gICAgICB3cmFwcGVyLFxuICAgICAgdGltZXN0YW1wO1xuXG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0KHJhbmdlKSA9PT0gdHJ1ZSkge1xuICAgICAgdGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG4gICAgICB3cmFwcGVyID0gY3JlYXRlV3JhcHBlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gY3JlYXRlRGVzY3JpcHRvcnMoe1xuICAgICAgICByb290RWxlbWVudDogdGhpcy5lbCxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHdyYXBwZXJcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGVkSGlnaGxpZ2h0cyA9IHRoaXMuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICAgICAgLy8gbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoY3JlYXRlZEhpZ2hsaWdodHMpO1xuXG4gICAgICBjb25zdCBwcm9jZXNzZWREZXNjcmlwdG9ycyA9IHRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KFxuICAgICAgICByYW5nZSxcbiAgICAgICAgZGVzY3JpcHRvcnMsXG4gICAgICAgIHRpbWVzdGFtcFxuICAgICAgKTtcbiAgICAgIHRoaXMuZGVzZXJpYWxpemVIaWdobGlnaHRzKHByb2Nlc3NlZERlc2NyaXB0b3JzKTtcbiAgICB9XG5cbiAgICBpZiAoIWtlZXBSYW5nZSkge1xuICAgICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZXMgdGV4dCBub2RlcyB3aXRoaW4gYW55IGdpdmVuIGVsZW1lbnQgbm9kZSBhcmUgbWVyZ2VkIHRvZ2V0aGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBub3JtYWxpemUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBub3JtYWxpemVkIGhpZ2hsaWdodHMuIE9yZGVyIGFuZCBudW1iZXIgb2YgcmV0dXJuZWQgaGlnaGxpZ2h0cyBtYXkgYmUgZGlmZmVyZW50IHRoYW5cbiAgICogaW5wdXQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgbGV0IG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuXG4gICAgLy9TaW5jZSB3ZSdyZSBub3QgbWVyZ2luZyBvciBmbGF0dGVuaW5nLCB3ZSBuZWVkIHRvIG5vcm1hbGlzZSB0aGUgdGV4dCBub2Rlcy5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICBkb20oaGlnaGxpZ2h0KS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9KTtcblxuICAgIC8vIG9taXQgcmVtb3ZlZCBub2Rlc1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoZnVuY3Rpb24oaGwpIHtcbiAgICAgIHJldHVybiBobC5wYXJlbnRFbGVtZW50ID8gaGwgOiBudWxsO1xuICAgIH0pO1xuXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB1bmlxdWUobm9ybWFsaXplZEhpZ2hsaWdodHMpO1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEub2Zmc2V0VG9wIC0gYi5vZmZzZXRUb3AgfHwgYS5vZmZzZXRMZWZ0IC0gYi5vZmZzZXRMZWZ0O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaGlnaGxpZ2h0cyBmcm9tIGVsZW1lbnQuIElmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBpdCBpcyByZW1vdmVkIGFzIHdlbGwuXG4gICAqIElmIG5vIGVsZW1lbnQgaXMgZ2l2ZW4sIGFsbCBoaWdobGlnaHRzIGFyZSByZW1vdmVkLlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbZWxlbWVudF0gLSBlbGVtZW50IHRvIHJlbW92ZSBoaWdobGlnaHRzIGZyb21cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IGVsZW1lbnQgfHwgdGhpcy5lbCxcbiAgICAgIGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KGhpZ2hsaWdodCkge1xuICAgICAgaWYgKGhpZ2hsaWdodC5jbGFzc05hbWUgPT09IGNvbnRhaW5lci5jbGFzc05hbWUpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkudW53cmFwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0KGhsKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZW1vdmVIaWdobGlnaHQoaGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0cyBmcm9tIGdpdmVuIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbcGFyYW1zLmNvbnRhaW5lcl0gLSByZXR1cm4gaGlnaGxpZ2h0cyBmcm9tIHRoaXMgZWxlbWVudC4gRGVmYXVsdDogdGhlIGVsZW1lbnQgdGhlXG4gICAqIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5hbmRTZWxmXSAtIGlmIHNldCB0byB0cnVlIGFuZCBjb250YWluZXIgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBhZGQgY29udGFpbmVyIHRvXG4gICAqIHJldHVybmVkIHJlc3VsdHMuIERlZmF1bHQ6IHRydWUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5ncm91cGVkXSAtIGlmIHNldCB0byB0cnVlLCBoaWdobGlnaHRzIGFyZSBncm91cGVkIGluIGxvZ2ljYWwgZ3JvdXBzIG9mIGhpZ2hsaWdodHMgYWRkZWRcbiAgICogaW4gdGhlIHNhbWUgbW9tZW50LiBFYWNoIGdyb3VwIGlzIGFuIG9iamVjdCB3aGljaCBoYXMgZ290IGFycmF5IG9mIGhpZ2hsaWdodHMsICd0b1N0cmluZycgbWV0aG9kIGFuZCAndGltZXN0YW1wJ1xuICAgKiBwcm9wZXJ0eS4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRIaWdobGlnaHRzKHBhcmFtcykge1xuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5lbCxcbiAgICAgIGRhdGFBdHRyOiBEQVRBX0FUVFIsXG4gICAgICB0aW1lc3RhbXBBdHRyOiBUSU1FU1RBTVBfQVRUUixcbiAgICAgIC4uLnBhcmFtc1xuICAgIH07XG4gICAgcmV0dXJuIHJldHJpZXZlSGlnaGxpZ2h0cyhtZXJnZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKlxuICAgKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgaXNIaWdobGlnaHQoZWwsIGRhdGFBdHRyKSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudEhpZ2hsaWdodChlbCwgZGF0YUF0dHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKGlkKSB7XG4gICAgbGV0IGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHJlZkVsID0gdGhpcy5lbCxcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBbXTtcblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIGZhbHNlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGxldCBsZW5ndGggPSBoaWdobGlnaHQudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgICBvZmZzZXQgPSBnZXRFbGVtZW50T2Zmc2V0KGhpZ2hsaWdodCwgcmVmRWwpLCAvLyBIbCBvZmZzZXQgZnJvbSB0aGUgcm9vdCBlbGVtZW50LlxuICAgICAgICB3cmFwcGVyID0gaGlnaGxpZ2h0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgd3JhcHBlciA9IHdyYXBwZXIub3V0ZXJIVE1MO1xuXG4gICAgICBpZiAod3JhcHBlci50b1N0cmluZygpLmluZGV4T2YoaWQpID4gLTEpIHtcbiAgICAgICAgaGxEZXNjcmlwdG9ycy5wdXNoKFt3cmFwcGVyLCBoaWdobGlnaHQudGV4dENvbnRlbnQsIG9mZnNldCwgbGVuZ3RoXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaGxEZXNjcmlwdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBpbmRlcGVuZGVudCBmb3JtIG9mIGhpZ2hsaWdodHMuXG4gICAqXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIGxldCBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbkN1c3RvbShobERlc2NyaXB0b3IpIHtcbiAgICAgIGxldCBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIG9mZnNldDogTnVtYmVyLnBhcnNlSW50KGhsRGVzY3JpcHRvclsyXSksXG4gICAgICAgICAgbGVuZ3RoOiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzNdKVxuICAgICAgICB9LFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodDtcblxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHNlbGYuZWw7XG4gICAgICBjb25zdCB7IG5vZGUsIG9mZnNldDogb2Zmc2V0V2l0aGluTm9kZSB9ID0gZmluZE5vZGVBbmRPZmZzZXQoXG4gICAgICAgIGhsLFxuICAgICAgICBwYXJlbnROb2RlXG4gICAgICApO1xuXG4gICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChvZmZzZXRXaXRoaW5Ob2RlKTtcbiAgICAgIGhsTm9kZS5zcGxpdFRleHQoaGwubGVuZ3RoKTtcblxuICAgICAgaWYgKGhsTm9kZS5uZXh0U2libGluZyAmJiAhaGxOb2RlLm5leHRTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcgJiYgIWhsTm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaGlnaGxpZ2h0ID0gZG9tKGhsTm9kZSkud3JhcChkb20oKS5mcm9tSFRNTChobC53cmFwcGVyKVswXSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhpZ2hsaWdodDogXCIsIGhsRGVzY3JpcHRvcik7XG4gICAgICAgIGRlc2VyaWFsaXphdGlvbkZuQ3VzdG9tKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyO1xuIiwiaW1wb3J0IHtcbiAgcmVmaW5lUmFuZ2VCb3VuZGFyaWVzLFxuICByZXRyaWV2ZUhpZ2hsaWdodHMsXG4gIGlzRWxlbWVudEhpZ2hsaWdodCxcbiAgc29ydEJ5RGVwdGgsXG4gIGhhdmVTYW1lQ29sb3IsXG4gIGNyZWF0ZVdyYXBwZXJcbn0gZnJvbSBcIi4uL3V0aWxzL2hpZ2hsaWdodHNcIjtcbmltcG9ydCBkb20sIHsgTk9ERV9UWVBFIH0gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgSUdOT1JFX1RBR1MsIERBVEFfQVRUUiwgVElNRVNUQU1QX0FUVFIgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgeyB1bmlxdWUgfSBmcm9tIFwiLi4vdXRpbHMvYXJyYXlzXCI7XG5cbi8qKlxuICogUHJpbWl0aXZvSGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50c1xuICogZm9yIHNpbXBsZSB1c2UgY2FzZXMuXG4gKi9cbmNsYXNzIFByaW1pdGl2b0hpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBQcmltaXRpdm9IaWdobGlnaHRlciBpbnN0YW5jZSBmb3IgZnVuY3Rpb25hbGl0eSBzcGVjaWZpYyB0byB0aGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHJhbmdlLlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBTFNEZWJ1ZzI4OiByYW5nZSBiZWZvcmUgcmVmaW5lZCEgXCIsIHJhbmdlKTtcblxuICAgIGxldCByZXN1bHQgPSByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpLFxuICAgICAgc3RhcnRDb250YWluZXIgPSByZXN1bHQuc3RhcnRDb250YWluZXIsXG4gICAgICBlbmRDb250YWluZXIgPSByZXN1bHQuZW5kQ29udGFpbmVyLFxuICAgICAgZ29EZWVwZXIgPSByZXN1bHQuZ29EZWVwZXIsXG4gICAgICBkb25lID0gZmFsc2UsXG4gICAgICBub2RlID0gc3RhcnRDb250YWluZXIsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBoaWdobGlnaHQsXG4gICAgICB3cmFwcGVyQ2xvbmUsXG4gICAgICBub2RlUGFyZW50O1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGdvRGVlcGVyICYmIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS5wYXJlbnROb2RlLnRhZ05hbWUpID09PSAtMSAmJlxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIlxuICAgICAgICApIHtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG4gICAgICAgICAgbm9kZVBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICAgIC8vIGhpZ2hsaWdodCBpZiBhIG5vZGUgaXMgaW5zaWRlIHRoZSBlbFxuICAgICAgICAgIGlmIChkb20odGhpcy5lbCkuY29udGFpbnMobm9kZVBhcmVudCkgfHwgbm9kZVBhcmVudCA9PT0gdGhpcy5lbCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ID0gZG9tKG5vZGUpLndyYXAod3JhcHBlckNsb25lKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUgPT09IGVuZENvbnRhaW5lciAmJlxuICAgICAgICAhKGVuZENvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkgJiYgZ29EZWVwZXIpXG4gICAgICApIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFX1RBR1MuaW5kZXhPZihub2RlLnRhZ05hbWUpID4gLTEpIHtcbiAgICAgICAgaWYgKGVuZENvbnRhaW5lci5wYXJlbnROb2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICBnb0RlZXBlciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCFkb25lKTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0aGF0IGhpZ2hsaWdodGluZyBpcyBkb25lIHdpdGggdXNlIG9mIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBudW1iZXIgb2ZcbiAgICogd3JhcHBpbmcgSFRNTCBlbGVtZW50cy5cbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUgYW5kIG1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMuIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gaGlnaGxpZ2h0cy5cbiAgICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0cyAtIGhpZ2hsaWdodHMgdG8gbm9ybWFsaXplLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2Ygbm9ybWFsaXplZCBoaWdobGlnaHRzLiBPcmRlciBhbmQgbnVtYmVyIG9mIHJldHVybmVkIGhpZ2hsaWdodHMgbWF5IGJlIGRpZmZlcmVudCB0aGFuXG4gICAqIGlucHV0IGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuXG4gICAgdGhpcy5mbGF0dGVuTmVzdGVkSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcbiAgICB0aGlzLm1lcmdlU2libGluZ0hpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG5cbiAgICAvLyBvbWl0IHJlbW92ZWQgbm9kZXNcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IGhpZ2hsaWdodHMuZmlsdGVyKGZ1bmN0aW9uKGhsKSB7XG4gICAgICByZXR1cm4gaGwucGFyZW50RWxlbWVudCA/IGhsIDogbnVsbDtcbiAgICB9KTtcblxuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gdW5pcXVlKG5vcm1hbGl6ZWRIaWdobGlnaHRzKTtcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLm9mZnNldFRvcCAtIGIub2Zmc2V0VG9wIHx8IGEub2Zmc2V0TGVmdCAtIGIub2Zmc2V0TGVmdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBub3JtYWxpemVkSGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVucyBoaWdobGlnaHRzIHN0cnVjdHVyZS5cbiAgICogTm90ZTogdGhpcyBtZXRob2QgY2hhbmdlcyBpbnB1dCBoaWdobGlnaHRzIC0gdGhlaXIgb3JkZXIgYW5kIG51bWJlciBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIGZsYXR0ZW4uXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZmxhdHRlbk5lc3RlZEhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIGxldCBhZ2FpbixcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBmbGF0dGVuT25jZSgpIHtcbiAgICAgIGxldCBhZ2FpbiA9IGZhbHNlO1xuXG4gICAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwsIGkpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IGhsLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgcGFyZW50UHJldiA9IHBhcmVudC5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgICAgcGFyZW50TmV4dCA9IHBhcmVudC5uZXh0U2libGluZztcblxuICAgICAgICBpZiAoc2VsZi5pc0hpZ2hsaWdodChwYXJlbnQsIERBVEFfQVRUUikpIHtcbiAgICAgICAgICBpZiAoIWhhdmVTYW1lQ29sb3IocGFyZW50LCBobCkpIHtcbiAgICAgICAgICAgIGlmICghaGwubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnROZXh0KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudE5leHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudE5leHQgfHwgcGFyZW50KTtcbiAgICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWhsLnByZXZpb3VzU2libGluZykge1xuICAgICAgICAgICAgICBpZiAoIXBhcmVudFByZXYpIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50UHJldik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnRQcmV2IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBobC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09IDMgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGxldCBzcGFubGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICBzcGFubGVmdC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyZW50LmF0dHJpYnV0ZXNbVElNRVNUQU1QX0FUVFJdLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKFRJTUVTVEFNUF9BVFRSLCB0aW1lc3RhbXApO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zZXRBdHRyaWJ1dGUoREFUQV9BVFRSLCB0cnVlKTtcblxuICAgICAgICAgICAgICBsZXQgc3BhbnJpZ2h0ID0gc3BhbmxlZnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICAgIGRvbShobC5wcmV2aW91c1NpYmxpbmcpLndyYXAoc3BhbmxlZnQpO1xuICAgICAgICAgICAgICBkb20oaGwubmV4dFNpYmxpbmcpLndyYXAoc3BhbnJpZ2h0KTtcblxuICAgICAgICAgICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChwYXJlbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGRvbShub2RlKS5pbnNlcnRCZWZvcmUobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFwYXJlbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgIGRvbShwYXJlbnQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGhsLmZpcnN0Q2hpbGQsIGhsKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHNbaV0gPSBwYXJlbnQ7XG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFnYWluO1xuICAgIH1cblxuICAgIGRvIHtcbiAgICAgIGFnYWluID0gZmxhdHRlbk9uY2UoKTtcbiAgICB9IHdoaWxlIChhZ2Fpbik7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIHNpYmxpbmcgaGlnaGxpZ2h0cyBhbmQgbm9ybWFsaXplcyBkZXNjZW5kYW50IHRleHQgbm9kZXMuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0c1xuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIG1lcmdlU2libGluZ0hpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHNob3VsZE1lcmdlKGN1cnJlbnQsIG5vZGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIG5vZGUgJiZcbiAgICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlRfTk9ERSAmJlxuICAgICAgICBoYXZlU2FtZUNvbG9yKGN1cnJlbnQsIG5vZGUpICYmXG4gICAgICAgIHNlbGYuaXNIaWdobGlnaHQobm9kZSwgREFUQV9BVFRSKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICB2YXIgcHJldiA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSBoaWdobGlnaHQubmV4dFNpYmxpbmc7XG5cbiAgICAgIGlmIChzaG91bGRNZXJnZShoaWdobGlnaHQsIHByZXYpKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLnByZXBlbmQocHJldi5jaGlsZE5vZGVzKTtcbiAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3VsZE1lcmdlKGhpZ2hsaWdodCwgbmV4dCkpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkuYXBwZW5kKG5leHQuY2hpbGROb2Rlcyk7XG4gICAgICAgIGRvbShuZXh0KS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgZG9tKGhpZ2hsaWdodCkubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyBjdXJyZW50IHJhbmdlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGtlZXBSYW5nZSAtIERvbid0IHJlbW92ZSByYW5nZSBhZnRlciBoaWdobGlnaHRpbmcuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRvSGlnaGxpZ2h0KGtlZXBSYW5nZSkge1xuICAgIGxldCByYW5nZSA9IGRvbSh0aGlzLmVsKS5nZXRSYW5nZSgpLFxuICAgICAgd3JhcHBlcixcbiAgICAgIGNyZWF0ZWRIaWdobGlnaHRzLFxuICAgICAgbm9ybWFsaXplZEhpZ2hsaWdodHMsXG4gICAgICB0aW1lc3RhbXA7XG5cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQocmFuZ2UpID09PSB0cnVlKSB7XG4gICAgICB0aW1lc3RhbXAgPSArbmV3IERhdGUoKTtcbiAgICAgIHdyYXBwZXIgPSBjcmVhdGVXcmFwcGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcblxuICAgICAgY3JlYXRlZEhpZ2hsaWdodHMgPSB0aGlzLmhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKTtcbiAgICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gdGhpcy5ub3JtYWxpemVIaWdobGlnaHRzKGNyZWF0ZWRIaWdobGlnaHRzKTtcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMub25BZnRlckhpZ2hsaWdodCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIkFMU0RFYnVnMjQ6IFByaW1pdGl2bzogdGhpcy5vcHRpb25zOiBcIixcbiAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgXCJcXG5cXG5cXG5cXG5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQocmFuZ2UsIG5vcm1hbGl6ZWRIaWdobGlnaHRzLCB0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGlmICgha2VlcFJhbmdlKSB7XG4gICAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaGlnaGxpZ2h0cyBmcm9tIGVsZW1lbnQuIElmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBpdCBpcyByZW1vdmVkIGFzIHdlbGwuXG4gICAqIElmIG5vIGVsZW1lbnQgaXMgZ2l2ZW4sIGFsbCBoaWdobGlnaHRzIGFsbCByZW1vdmVkLlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbZWxlbWVudF0gLSBlbGVtZW50IHRvIHJlbW92ZSBoaWdobGlnaHRzIGZyb21cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZWxlbWVudCB8fCB0aGlzLmVsLFxuICAgICAgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cyh7IGNvbnRhaW5lcjogY29udGFpbmVyIH0pLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBtZXJnZVNpYmxpbmdUZXh0Tm9kZXModGV4dE5vZGUpIHtcbiAgICAgIHZhciBwcmV2ID0gdGV4dE5vZGUucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICBuZXh0ID0gdGV4dE5vZGUubmV4dFNpYmxpbmc7XG5cbiAgICAgIGlmIChwcmV2ICYmIHByZXYubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgdGV4dE5vZGUubm9kZVZhbHVlID0gcHJldi5ub2RlVmFsdWUgKyB0ZXh0Tm9kZS5ub2RlVmFsdWU7XG4gICAgICAgIGRvbShwcmV2KS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0ICYmIG5leHQubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgdGV4dE5vZGUubm9kZVZhbHVlID0gdGV4dE5vZGUubm9kZVZhbHVlICsgbmV4dC5ub2RlVmFsdWU7XG4gICAgICAgIGRvbShuZXh0KS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoaGlnaGxpZ2h0KSB7XG4gICAgICB2YXIgdGV4dE5vZGVzID0gZG9tKGhpZ2hsaWdodCkudW53cmFwKCk7XG5cbiAgICAgIHRleHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgbWVyZ2VTaWJsaW5nVGV4dE5vZGVzKG5vZGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgdHJ1ZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICAgIGlmIChzZWxmLm9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQoaGwpID09PSB0cnVlKSB7XG4gICAgICAgIHJlbW92ZUhpZ2hsaWdodChobCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgICBjb25zdCBtZXJnZWRQYXJhbXMgPSB7XG4gICAgICBjb250YWluZXI6IHRoaXMuZWwsXG4gICAgICBkYXRhQXR0cjogREFUQV9BVFRSLFxuICAgICAgdGltZXN0YW1wQXR0cjogVElNRVNUQU1QX0FUVFIsXG4gICAgICAuLi5wYXJhbXNcbiAgICB9O1xuICAgIHJldHVybiByZXRyaWV2ZUhpZ2hsaWdodHMobWVyZ2VkUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodC5cbiAgICpcbiAgICogQHBhcmFtIGVsIC0gZWxlbWVudCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgaXNIaWdobGlnaHQoZWwsIGRhdGFBdHRyKSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudEhpZ2hsaWdodChlbCwgZGF0YUF0dHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoKSB7XG4gICAgbGV0IGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHJlZkVsID0gdGhpcy5lbCxcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRQYXRoKGVsLCByZWZFbGVtZW50KSB7XG4gICAgICBsZXQgcGF0aCA9IFtdLFxuICAgICAgICBjaGlsZE5vZGVzO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGNoaWxkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbC5wYXJlbnROb2RlLmNoaWxkTm9kZXMpO1xuICAgICAgICBwYXRoLnVuc2hpZnQoY2hpbGROb2Rlcy5pbmRleE9mKGVsKSk7XG4gICAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICAgIH0gd2hpbGUgKGVsICE9PSByZWZFbGVtZW50IHx8ICFlbCk7XG5cbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH1cblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIGZhbHNlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGxldCBvZmZzZXQgPSAwLCAvLyBIbCBvZmZzZXQgZnJvbSBwcmV2aW91cyBzaWJsaW5nIHdpdGhpbiBwYXJlbnQgbm9kZS5cbiAgICAgICAgbGVuZ3RoID0gaGlnaGxpZ2h0LnRleHRDb250ZW50Lmxlbmd0aCxcbiAgICAgICAgaGxQYXRoID0gZ2V0RWxlbWVudFBhdGgoaGlnaGxpZ2h0LCByZWZFbCksXG4gICAgICAgIHdyYXBwZXIgPSBoaWdobGlnaHQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICB3cmFwcGVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICB3cmFwcGVyID0gd3JhcHBlci5vdXRlckhUTUw7XG5cbiAgICAgIGlmIChcbiAgICAgICAgaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZyAmJlxuICAgICAgICBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICApIHtcbiAgICAgICAgb2Zmc2V0ID0gaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGhsRGVzY3JpcHRvcnMucHVzaChbXG4gICAgICAgIHdyYXBwZXIsXG4gICAgICAgIGhpZ2hsaWdodC50ZXh0Q29udGVudCxcbiAgICAgICAgaGxQYXRoLmpvaW4oXCI6XCIpLFxuICAgICAgICBvZmZzZXQsXG4gICAgICAgIGxlbmd0aFxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaGxEZXNjcmlwdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIGhpZ2hsaWdodHMuXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgbGV0IGhsRGVzY3JpcHRvcnMsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IFwiQ2FuJ3QgcGFyc2UgSlNPTjogXCIgKyBlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXphdGlvbkZuKGhsRGVzY3JpcHRvcikge1xuICAgICAgbGV0IGhsID0ge1xuICAgICAgICAgIHdyYXBwZXI6IGhsRGVzY3JpcHRvclswXSxcbiAgICAgICAgICB0ZXh0OiBobERlc2NyaXB0b3JbMV0sXG4gICAgICAgICAgcGF0aDogaGxEZXNjcmlwdG9yWzJdLnNwbGl0KFwiOlwiKSxcbiAgICAgICAgICBvZmZzZXQ6IGhsRGVzY3JpcHRvclszXSxcbiAgICAgICAgICBsZW5ndGg6IGhsRGVzY3JpcHRvcls0XVxuICAgICAgICB9LFxuICAgICAgICBlbEluZGV4ID0gaGwucGF0aC5wb3AoKSxcbiAgICAgICAgbm9kZSA9IHNlbGYuZWwsXG4gICAgICAgIGhsTm9kZSxcbiAgICAgICAgaGlnaGxpZ2h0LFxuICAgICAgICBpZHg7XG5cbiAgICAgIHdoaWxlICgoaWR4ID0gaGwucGF0aC5zaGlmdCgpKSkge1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZE5vZGVzW2lkeF07XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXggLSAxXSAmJlxuICAgICAgICBub2RlLmNoaWxkTm9kZXNbZWxJbmRleCAtIDFdLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICApIHtcbiAgICAgICAgZWxJbmRleCAtPSAxO1xuICAgICAgfVxuXG4gICAgICBub2RlID0gbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXhdO1xuICAgICAgaGxOb2RlID0gbm9kZS5zcGxpdFRleHQoaGwub2Zmc2V0KTtcbiAgICAgIGhsTm9kZS5zcGxpdFRleHQoaGwubGVuZ3RoKTtcblxuICAgICAgaWYgKGhsTm9kZS5uZXh0U2libGluZyAmJiAhaGxOb2RlLm5leHRTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcgJiYgIWhsTm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaGlnaGxpZ2h0ID0gZG9tKGhsTm9kZSkud3JhcChkb20oKS5mcm9tSFRNTChobC53cmFwcGVyKVswXSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkZXNlcmlhbGl6YXRpb25GbihobERlc2NyaXB0b3IpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW4ndCBkZXNlcmlhbGl6ZSBoaWdobGlnaHQgZGVzY3JpcHRvci4gQ2F1c2U6IFwiICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByaW1pdGl2b0hpZ2hsaWdodGVyO1xuIiwiLyogZ2xvYmFsIGpRdWVyeSBUZXh0SGlnaGxpZ2h0ZXIgKi9cblxuaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgKGZ1bmN0aW9uKCQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IFBMVUdJTl9OQU1FID0gXCJ0ZXh0SGlnaGxpZ2h0ZXJcIjtcblxuICAgIGZ1bmN0aW9uIHdyYXAoZm4sIHdyYXBwZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgd3JhcHBlci5jYWxsKHRoaXMsIGZuKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGpRdWVyeSBwbHVnaW4gbmFtZXNwYWNlLlxuICAgICAqIEBleHRlcm5hbCBcImpRdWVyeS5mblwiXG4gICAgICogQHNlZSB7QGxpbmsgaHR0cDovL2RvY3MuanF1ZXJ5LmNvbS9QbHVnaW5zL0F1dGhvcmluZyBUaGUgalF1ZXJ5IFBsdWdpbiBHdWlkZX1cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGFuZCBhcHBsaWVzIGl0IHRvIHRoZSBnaXZlbiBqUXVlcnkgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIFNhbWUgYXMge0BsaW5rIFRleHRIaWdobGlnaHRlcn0gb3B0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fVxuICAgICAqIEBleGFtcGxlICQoJyNzYW5kYm94JykudGV4dEhpZ2hsaWdodGVyKHsgY29sb3I6ICdyZWQnIH0pO1xuICAgICAqIEBmdW5jdGlvbiBleHRlcm5hbDpcImpRdWVyeS5mblwiLnRleHRIaWdobGlnaHRlclxuICAgICAqL1xuICAgICQuZm4udGV4dEhpZ2hsaWdodGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVsID0gdGhpcyxcbiAgICAgICAgICBobDtcblxuICAgICAgICBpZiAoISQuZGF0YShlbCwgUExVR0lOX05BTUUpKSB7XG4gICAgICAgICAgaGwgPSBuZXcgVGV4dEhpZ2hsaWdodGVyKGVsLCBvcHRpb25zKTtcblxuICAgICAgICAgIGhsLmRlc3Ryb3kgPSB3cmFwKGhsLmRlc3Ryb3ksIGZ1bmN0aW9uKGRlc3Ryb3kpIHtcbiAgICAgICAgICAgIGRlc3Ryb3kuY2FsbChobCk7XG4gICAgICAgICAgICAkKGVsKS5yZW1vdmVEYXRhKFBMVUdJTl9OQU1FKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICQuZGF0YShlbCwgUExVR0lOX05BTUUsIGhsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuZm4uZ2V0SGlnaGxpZ2h0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGEoUExVR0lOX05BTUUpO1xuICAgIH07XG4gIH0pKGpRdWVyeSk7XG59XG4iLCJpbXBvcnQgZG9tIGZyb20gXCIuL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgYmluZEV2ZW50cywgdW5iaW5kRXZlbnRzIH0gZnJvbSBcIi4vdXRpbHMvZXZlbnRzXCI7XG5pbXBvcnQgUHJpbWl0aXZvIGZyb20gXCIuL2hpZ2hsaWdodGVycy9wcmltaXRpdm9cIjtcbmltcG9ydCBJbmRlcGVuZGVuY2lhIGZyb20gXCIuL2hpZ2hsaWdodGVycy9pbmRlcGVuZGVuY2lhXCI7XG5pbXBvcnQgeyBUSU1FU1RBTVBfQVRUUiwgREFUQV9BVFRSIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBjcmVhdGVXcmFwcGVyIH0gZnJvbSBcIi4vdXRpbHMvaGlnaGxpZ2h0c1wiO1xuXG5jb25zdCBoaWdobGlnaHRlcnMgPSB7XG4gIHByaW1pdGl2bzogUHJpbWl0aXZvLFxuICBcInYxLTIwMTRcIjogUHJpbWl0aXZvLFxuICBpbmRlcGVuZGVuY2lhOiBJbmRlcGVuZGVuY2lhLFxuICBcInYyLTIwMTlcIjogSW5kZXBlbmRlbmNpYVxufTtcblxuLyoqXG4gKiBUZXh0SGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50cy5cbiAqL1xuY2xhc3MgVGV4dEhpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgd3JhcHBlciBmb3IgaGlnaGxpZ2h0cy5cbiAgICogVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGNhbGxzIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBpdCBuZWVkcyB0byBjcmVhdGUgaGlnaGxpZ2h0cyBhbmQgcGFzcyBvcHRpb25zIHJldHJpZXZlZFxuICAgKiBpbiBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgc2FtZSBvYmplY3QgYXMgaW4gVGV4dEhpZ2hsaWdodGVyIGNvbnN0cnVjdG9yLlxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgY3JlYXRlV3JhcHBlcihvcHRpb25zKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGJpbmRzIHRvIGdpdmVuIERPTSBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMudmVyc2lvbiAtIFRoZSB2ZXJzaW9uIG9mIHRoZSB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIHVzZS5cbiAgICogVGhlcmUgYXJlIHR3byBvcHRpb25zOlxuICAgKiAgIHByaW1pdGl2byAodjEtMjAxNCkgaXMgZm9yIHRoZSBpbml0aWFsIGltcGxlbWVudGF0aW9uIHVzaW5nIGludGVyZGVwZW5kZW50IGhpZ2hsaWdodCBsb2NhdG9ycy5cbiAgICogICAoTG90cyBvZiBpc3N1ZXMgZm9yIHJlcXVpcmVtZW50cyBiZXlvbmQgc2ltcGxlIGFsbCBvciBub3RoaW5nIGhpZ2hsaWdodHMpXG4gICAqXG4gICAqICAgaW5kZXBlbmRlbmNpYSAodjItMjAxOSkgaXMgZm9yIGFuIGltcHJvdmVkIGltcGxlbWVudGF0aW9uIGZvY3VzaW5nIG9uIG1ha2luZyBoaWdobGlnaHRzIGluZGVwZW5kZW50XG4gICAqICAgZnJvbSBlYWNob3RoZXIgYW5kIG90aGVyIGVsZW1lbnQgbm9kZXMgd2l0aGluIHRoZSBjb250ZXh0IERPTSBvYmplY3QuIHYyIHVzZXMgZGF0YSBhdHRyaWJ1dGVzXG4gICAqICAgYXMgdGhlIHNvdXJjZSBvZiB0cnV0aCBhYm91dCB0aGUgdGV4dCByYW5nZSBzZWxlY3RlZCB0byBjcmVhdGUgdGhlIG9yaWdpbmFsIGhpZ2hsaWdodC5cbiAgICogICBUaGlzIGFsbG93cyB1cyBmcmVlZG9tIHRvIG1hbmlwdWxhdGUgdGhlIERPTSBhdCB3aWxsIGFuZCBoYW5kbGUgb3ZlcmxhcHBpbmcgaGlnaGxpZ2h0cyBhIGxvdCBiZXR0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGFuY2hvciBlbGVtZW50XCIpO1xuICAgIH1cblxuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGNvbG9yOiBcIiNmZmZmN2JcIixcbiAgICAgIGhpZ2hsaWdodGVkQ2xhc3M6IFwiaGlnaGxpZ2h0ZWRcIixcbiAgICAgIGNvbnRleHRDbGFzczogXCJoaWdobGlnaHRlci1jb250ZXh0XCIsXG4gICAgICB2ZXJzaW9uOiBcImluZGVwZW5kZW5jaWFcIixcbiAgICAgIG9uUmVtb3ZlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25CZWZvcmVIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBvbkFmdGVySGlnaGxpZ2h0OiBmdW5jdGlvbigpIHt9LFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIFwiXFxuXFxuXFxuXFxuQUxTREVidWcyNDogVGV4dEhpZ2hsaWdodGVyOiBvcHRpb25zIGNvbnN0cnVjdG9yIHBhcmFtOiBcIixcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICAgIGNvbnNvbGUubG9nKFwiQUxTREVidWcyNDogVGV4dEhpZ2hsaWdodGVyOiB0aGlzLm9wdGlvbnM6IFwiLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKCFoaWdobGlnaHRlcnNbdGhpcy5vcHRpb25zLnZlcnNpb25dKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCB2ZXJzaW9uIG9mIHRoZSB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5XCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5oaWdobGlnaHRlciA9IG5ldyBoaWdobGlnaHRlcnNbdGhpcy5vcHRpb25zLnZlcnNpb25dKFxuICAgICAgdGhpcy5lbCxcbiAgICAgIHRoaXMub3B0aW9uc1xuICAgICk7XG5cbiAgICBkb20odGhpcy5lbCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNvbnRleHRDbGFzcyk7XG4gICAgYmluZEV2ZW50cyh0aGlzLmVsLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJtYW5lbnRseSBkaXNhYmxlcyBoaWdobGlnaHRpbmcuXG4gICAqIFVuYmluZHMgZXZlbnRzIGFuZCByZW1vdmUgY29udGV4dCBlbGVtZW50IGNsYXNzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHVuYmluZEV2ZW50cyh0aGlzLmVsLCB0aGlzKTtcbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNvbnRleHRDbGFzcyk7XG4gIH1cblxuICBoaWdobGlnaHRIYW5kbGVyKCkge1xuICAgIHRoaXMuZG9IaWdobGlnaHQoKTtcbiAgfVxuXG4gIGRvSGlnaGxpZ2h0KGtlZXBSYW5nZSkge1xuICAgIHRoaXMuaGlnaGxpZ2h0ZXIuZG9IaWdobGlnaHQoa2VlcFJhbmdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHJhbmdlLlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5oaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcik7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplcyBoaWdobGlnaHRzLiBFbnN1cmUgYXQgbGVhc3QgdGV4dCBub2RlcyBhcmUgbm9ybWFsaXplZCwgY2FycmllcyBvdXQgc29tZSBmbGF0dGVuaW5nIGFuZCBuZXN0aW5nXG4gICAqIHdoZXJlIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0cyAtIGhpZ2hsaWdodHMgdG8gbm9ybWFsaXplLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2Ygbm9ybWFsaXplZCBoaWdobGlnaHRzLiBPcmRlciBhbmQgbnVtYmVyIG9mIHJldHVybmVkIGhpZ2hsaWdodHMgbWF5IGJlIGRpZmZlcmVudCB0aGFuXG4gICAqIGlucHV0IGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLm5vcm1hbGl6ZUhpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBoaWdobGlnaHRpbmcgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIHZhbGlkIENTUyBjb2xvci5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgc2V0Q29sb3IoY29sb3IpIHtcbiAgICB0aGlzLm9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodGluZyBjb2xvci5cbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGhpZ2hsaWdodHMgZnJvbSBlbGVtZW50LiBJZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgaXQgaXMgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKiBJZiBubyBlbGVtZW50IGlzIGdpdmVuLCBhbGwgaGlnaGxpZ2h0cyBhbGwgcmVtb3ZlZC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2VsZW1lbnRdIC0gZWxlbWVudCB0byByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCkge1xuICAgIHRoaXMuaGlnaGxpZ2h0ZXIucmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodHMgZnJvbSBnaXZlbiBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3BhcmFtcy5jb250YWluZXJdIC0gcmV0dXJuIGhpZ2hsaWdodHMgZnJvbSB0aGlzIGVsZW1lbnQuIERlZmF1bHQ6IHRoZSBlbGVtZW50IHRoZVxuICAgKiBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuYW5kU2VsZl0gLSBpZiBzZXQgdG8gdHJ1ZSBhbmQgY29udGFpbmVyIGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgYWRkIGNvbnRhaW5lciB0b1xuICAgKiByZXR1cm5lZCByZXN1bHRzLiBEZWZhdWx0OiB0cnVlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuZ3JvdXBlZF0gLSBpZiBzZXQgdG8gdHJ1ZSwgaGlnaGxpZ2h0cyBhcmUgZ3JvdXBlZCBpbiBsb2dpY2FsIGdyb3VwcyBvZiBoaWdobGlnaHRzIGFkZGVkXG4gICAqIGluIHRoZSBzYW1lIG1vbWVudC4gRWFjaCBncm91cCBpcyBhbiBvYmplY3Qgd2hpY2ggaGFzIGdvdCBhcnJheSBvZiBoaWdobGlnaHRzLCAndG9TdHJpbmcnIG1ldGhvZCBhbmQgJ3RpbWVzdGFtcCdcbiAgICogcHJvcGVydHkuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5nZXRIaWdobGlnaHRzKHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqIEFsbCBoaWdobGlnaHRzIGhhdmUgJ2RhdGEtaGlnaGxpZ2h0ZWQnIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIGVsIC0gZWxlbWVudCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGlzSGlnaGxpZ2h0KGVsKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuaXNIaWdobGlnaHQoZWwsIERBVEFfQVRUUik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogdGhlIGlkIGlzIG5vdCB1c2VkIGluIHRoZSBpbml0aWFsIHZlcnNpb24gb2YgdGhlIGhpZ2hsaWdodGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBUaGUgdW5pcXVlIGlkZW50aWZpZXIgZ3JvdXBpbmcgYSBzZXQgb2YgaGlnaGxpZ2h0IGVsZW1lbnRzIHRvZ2V0aGVyLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0cyhpZCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLnNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyBoaWdobGlnaHRzLlxuICAgKiBAdGhyb3dzIGV4Y2VwdGlvbiB3aGVuIGNhbid0IHBhcnNlIEpTT04gb3IgSlNPTiBoYXMgaW52YWxpZCBzdHJ1Y3R1cmUuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIC0gSlNPTiBvYmplY3Qgd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBkZXNlcmlhbGl6ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5kZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbik7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW5kIGhpZ2hsaWdodHMgZ2l2ZW4gdGV4dC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSB0ZXh0IHRvIHNlYXJjaCBmb3JcbiAgICogQHBhcmFtIHtib29sZWFufSBbY2FzZVNlbnNpdGl2ZV0gLSBpZiBzZXQgdG8gdHJ1ZSwgcGVyZm9ybXMgY2FzZSBzZW5zaXRpdmUgc2VhcmNoIChkZWZhdWx0OiB0cnVlKVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBmaW5kKHRleHQsIGNhc2VTZW5zaXRpdmUpIHtcbiAgICBsZXQgd25kID0gZG9tKHRoaXMuZWwpLmdldFdpbmRvdygpLFxuICAgICAgc2Nyb2xsWCA9IHduZC5zY3JvbGxYLFxuICAgICAgc2Nyb2xsWSA9IHduZC5zY3JvbGxZLFxuICAgICAgY2FzZVNlbnMgPSB0eXBlb2YgY2FzZVNlbnNpdGl2ZSA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBjYXNlU2Vuc2l0aXZlO1xuXG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuXG4gICAgaWYgKHduZC5maW5kKSB7XG4gICAgICB3aGlsZSAod25kLmZpbmQodGV4dCwgY2FzZVNlbnMpKSB7XG4gICAgICAgIHRoaXMuZG9IaWdobGlnaHQodHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh3bmQuZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UpIHtcbiAgICAgIGxldCB0ZXh0UmFuZ2UgPSB3bmQuZG9jdW1lbnQuYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgIHRleHRSYW5nZS5tb3ZlVG9FbGVtZW50VGV4dCh0aGlzLmVsKTtcbiAgICAgIHdoaWxlICh0ZXh0UmFuZ2UuZmluZFRleHQodGV4dCwgMSwgY2FzZVNlbnMgPyA0IDogMCkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFkb20odGhpcy5lbCkuY29udGFpbnModGV4dFJhbmdlLnBhcmVudEVsZW1lbnQoKSkgJiZcbiAgICAgICAgICB0ZXh0UmFuZ2UucGFyZW50RWxlbWVudCgpICE9PSB0aGlzLmVsXG4gICAgICAgICkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGV4dFJhbmdlLnNlbGVjdCgpO1xuICAgICAgICB0aGlzLmRvSGlnaGxpZ2h0KHRydWUpO1xuICAgICAgICB0ZXh0UmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB3bmQuc2Nyb2xsVG8oc2Nyb2xsWCwgc2Nyb2xsWSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGV4dEhpZ2hsaWdodGVyO1xuIiwiLyoqXG4gKiBSZXR1cm5zIGFycmF5IHdpdGhvdXQgZHVwbGljYXRlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZShhcnIpIHtcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24odmFsdWUsIGlkeCwgc2VsZikge1xuICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpZHg7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IE5PREVfVFlQRSA9IHsgRUxFTUVOVF9OT0RFOiAxLCBURVhUX05PREU6IDMgfTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9ucyB0byBtYWtlIERPTSBtYW5pcHVsYXRpb24gZWFzaWVyLlxuICogQHBhcmFtIHtOb2RlfEhUTUxFbGVtZW50fSBbZWxdIC0gYmFzZSBET00gZWxlbWVudCB0byBtYW5pcHVsYXRlXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5jb25zdCBkb20gPSBmdW5jdGlvbihlbCkge1xuICByZXR1cm4gLyoqIEBsZW5kcyBkb20gKiovIHtcbiAgICAvKipcbiAgICAgKiBBZGRzIGNsYXNzIHRvIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqL1xuICAgIGFkZENsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xhc3NOYW1lO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGNsYXNzIGZyb20gZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShcbiAgICAgICAgICBuZXcgUmVnRXhwKFwiKF58XFxcXGIpXCIgKyBjbGFzc05hbWUgKyBcIihcXFxcYnwkKVwiLCBcImdpXCIpLFxuICAgICAgICAgIFwiIFwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByZXBlbmRzIGNoaWxkIG5vZGVzIHRvIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge05vZGVbXX0gbm9kZXNUb1ByZXBlbmRcbiAgICAgKi9cbiAgICBwcmVwZW5kOiBmdW5jdGlvbihub2Rlc1RvUHJlcGVuZCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXNUb1ByZXBlbmQpLFxuICAgICAgICBpID0gbm9kZXMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGVsLmluc2VydEJlZm9yZShub2Rlc1tpXSwgZWwuZmlyc3RDaGlsZCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGVuZHMgY2hpbGQgbm9kZXMgdG8gYmFzZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7Tm9kZVtdfSBub2Rlc1RvQXBwZW5kXG4gICAgICovXG4gICAgYXBwZW5kOiBmdW5jdGlvbihub2Rlc1RvQXBwZW5kKSB7XG4gICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlc1RvQXBwZW5kKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG5vZGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBiYXNlIGVsZW1lbnQgYWZ0ZXIgcmVmRWwuXG4gICAgICogQHBhcmFtIHtOb2RlfSByZWZFbCAtIG5vZGUgYWZ0ZXIgd2hpY2ggYmFzZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gLSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICovXG4gICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKHJlZkVsKSB7XG4gICAgICByZXR1cm4gcmVmRWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZkVsLm5leHRTaWJsaW5nKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyBiYXNlIGVsZW1lbnQgYmVmb3JlIHJlZkVsLlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcmVmRWwgLSBub2RlIGJlZm9yZSB3aGljaCBiYXNlIGVsZW1lbnQgd2lsbCBiZSBpbnNlcnRlZFxuICAgICAqIEByZXR1cm5zIHtOb2RlfSAtIGluc2VydGVkIGVsZW1lbnRcbiAgICAgKi9cbiAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKHJlZkVsKSB7XG4gICAgICByZXR1cm4gcmVmRWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHJlZkVsKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBiYXNlIGVsZW1lbnQgZnJvbSBET00uXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgZWwgPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgYmFzZSBlbGVtZW50IGNvbnRhaW5zIGdpdmVuIGNoaWxkLlxuICAgICAqIEBwYXJhbSB7Tm9kZXxIVE1MRWxlbWVudH0gY2hpbGRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjb250YWluczogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIHJldHVybiBlbCAhPT0gY2hpbGQgJiYgZWwuY29udGFpbnMoY2hpbGQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBiYXNlIGVsZW1lbnQgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IHdyYXBwZXIgZWxlbWVudFxuICAgICAqL1xuICAgIHdyYXA6IGZ1bmN0aW9uKHdyYXBwZXIpIHtcbiAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICAgIH1cblxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW53cmFwcyBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge05vZGVbXX0gLSBjaGlsZCBub2RlcyBvZiB1bndyYXBwZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICB1bndyYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWwuY2hpbGROb2RlcyksXG4gICAgICAgIHdyYXBwZXI7XG5cbiAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB3cmFwcGVyID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBkb20obm9kZSkuaW5zZXJ0QmVmb3JlKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICB9KTtcbiAgICAgIGRvbSh3cmFwcGVyKS5yZW1vdmUoKTtcblxuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGJhc2UgZWxlbWVudCBwYXJlbnRzLlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHBhcmVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBhcmVudCxcbiAgICAgICAgcGF0aCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKHBhcmVudCA9IGVsLnBhcmVudE5vZGUpKSB7XG4gICAgICAgIHBhdGgucHVzaChwYXJlbnQpO1xuICAgICAgICBlbCA9IHBhcmVudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYXJyYXkgb2YgYmFzZSBlbGVtZW50IHBhcmVudHMsIGV4Y2x1ZGluZyB0aGUgZG9jdW1lbnQuXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgcGFyZW50c1dpdGhvdXREb2N1bWVudDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRzKCkuZmlsdGVyKGVsZW0gPT4gZWxlbSAhPT0gZG9jdW1lbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBOb3JtYWxpemVzIHRleHQgbm9kZXMgd2l0aGluIGJhc2UgZWxlbWVudCwgaWUuIG1lcmdlcyBzaWJsaW5nIHRleHQgbm9kZXMgYW5kIGFzc3VyZXMgdGhhdCBldmVyeVxuICAgICAqIGVsZW1lbnQgbm9kZSBoYXMgb25seSBvbmUgdGV4dCBub2RlLlxuICAgICAqIEl0IHNob3VsZCBkb2VzIHRoZSBzYW1lIGFzIHN0YW5kYXJkIGVsZW1lbnQubm9ybWFsaXplLCBidXQgSUUgaW1wbGVtZW50cyBpdCBpbmNvcnJlY3RseS5cbiAgICAgKi9cbiAgICBub3JtYWxpemVUZXh0Tm9kZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFlbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgZWwubmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICBlbC5uZXh0U2libGluZy5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgICApIHtcbiAgICAgICAgICBlbC5ub2RlVmFsdWUgKz0gZWwubmV4dFNpYmxpbmcubm9kZVZhbHVlO1xuICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwubmV4dFNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb20oZWwuZmlyc3RDaGlsZCkubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgICB9XG4gICAgICBkb20oZWwubmV4dFNpYmxpbmcpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGVsZW1lbnQgYmFja2dyb3VuZCBjb2xvci5cbiAgICAgKiBAcmV0dXJucyB7Q1NTU3R5bGVEZWNsYXJhdGlvbi5iYWNrZ3JvdW5kQ29sb3J9XG4gICAgICovXG4gICAgY29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBkb20gZWxlbWVudCBmcm9tIGdpdmVuIGh0bWwgc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gICAgICogQHJldHVybnMge05vZGVMaXN0fVxuICAgICAqL1xuICAgIGZyb21IVE1MOiBmdW5jdGlvbihodG1sKSB7XG4gICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGRpdi5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgcmV0dXJuIGRpdi5jaGlsZE5vZGVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGZpcnN0IHJhbmdlIG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtSYW5nZX1cbiAgICAgKi9cbiAgICBnZXRSYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZG9tKGVsKS5nZXRTZWxlY3Rpb24oKSxcbiAgICAgICAgcmFuZ2U7XG5cbiAgICAgIGlmIChzZWxlY3Rpb24ucmFuZ2VDb3VudCA+IDApIHtcbiAgICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCByYW5nZXMgb2YgdGhlIHdpbmRvdyBvZiBiYXNlIGVsZW1lbnQuXG4gICAgICovXG4gICAgcmVtb3ZlQWxsUmFuZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzZWxlY3Rpb24gPSBkb20oZWwpLmdldFNlbGVjdGlvbigpO1xuICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHNlbGVjdGlvbiBvYmplY3Qgb2YgdGhlIHdpbmRvdyBvZiBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1NlbGVjdGlvbn1cbiAgICAgKi9cbiAgICBnZXRTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRvbShlbClcbiAgICAgICAgLmdldFdpbmRvdygpXG4gICAgICAgIC5nZXRTZWxlY3Rpb24oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aW5kb3cgb2YgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7V2luZG93fVxuICAgICAqL1xuICAgIGdldFdpbmRvdzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZG9tKGVsKS5nZXREb2N1bWVudCgpLmRlZmF1bHRWaWV3O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRvY3VtZW50IG9mIHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge0hUTUxEb2N1bWVudH1cbiAgICAgKi9cbiAgICBnZXREb2N1bWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBpZiBvd25lckRvY3VtZW50IGlzIG51bGwgdGhlbiBlbCBpcyB0aGUgZG9jdW1lbnQgaXRzZWxmLlxuICAgICAgcmV0dXJuIGVsLm93bmVyRG9jdW1lbnQgfHwgZWw7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHByb3ZpZGVkIGVsZW1lbnQgY29tZXMgYWZ0ZXIgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG90aGVyRWxlbWVudFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNBZnRlcjogZnVuY3Rpb24ob3RoZXJFbGVtZW50LCByb290RWxlbWVudCkge1xuICAgICAgbGV0IHNpYmxpbmcgPSBlbC5uZXh0U2libGluZztcbiAgICAgIGxldCBpc0FmdGVyID0gZmFsc2U7XG4gICAgICB3aGlsZSAoc2libGluZyAmJiAhaXNBZnRlcikge1xuICAgICAgICBpZiAoc2libGluZyA9PT0gb3RoZXJFbGVtZW50KSB7XG4gICAgICAgICAgaXNBZnRlciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFzaWJsaW5nLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBzaWJsaW5nID0gZWwucGFyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXNBZnRlcjtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb207XG4iLCJleHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50cyhlbCwgc2NvcGUpIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYmluZEV2ZW50cyhlbCwgc2NvcGUpIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbn1cbiIsImltcG9ydCBkb20sIHsgTk9ERV9UWVBFIH0gZnJvbSBcIi4vZG9tXCI7XG5pbXBvcnQgeyBTVEFSVF9PRkZTRVRfQVRUUiwgRU5EX09GRlNFVF9BVFRSLCBEQVRBX0FUVFIgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbi8qKlxuICogVGFrZXMgcmFuZ2Ugb2JqZWN0IGFzIHBhcmFtZXRlciBhbmQgcmVmaW5lcyBpdCBib3VuZGFyaWVzXG4gKiBAcGFyYW0gcmFuZ2VcbiAqIEByZXR1cm5zIHtvYmplY3R9IHJlZmluZWQgYm91bmRhcmllcyBhbmQgaW5pdGlhbCBzdGF0ZSBvZiBoaWdobGlnaHRpbmcgYWxnb3JpdGhtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmaW5lUmFuZ2VCb3VuZGFyaWVzKHJhbmdlKSB7XG4gIGxldCBzdGFydENvbnRhaW5lciA9IHJhbmdlLnN0YXJ0Q29udGFpbmVyLFxuICAgIGVuZENvbnRhaW5lciA9IHJhbmdlLmVuZENvbnRhaW5lcixcbiAgICBhbmNlc3RvciA9IHJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyLFxuICAgIGdvRGVlcGVyID0gdHJ1ZTtcblxuICBpZiAocmFuZ2UuZW5kT2Zmc2V0ID09PSAwKSB7XG4gICAgd2hpbGUgKFxuICAgICAgIWVuZENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgIGVuZENvbnRhaW5lci5wYXJlbnROb2RlICE9PSBhbmNlc3RvclxuICAgICkge1xuICAgICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmc7XG4gIH0gZWxzZSBpZiAoZW5kQ29udGFpbmVyLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgaWYgKHJhbmdlLmVuZE9mZnNldCA8IGVuZENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoKSB7XG4gICAgICBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHJhbmdlLmVuZE9mZnNldCA+IDApIHtcbiAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLmVuZE9mZnNldCAtIDEpO1xuICB9XG5cbiAgaWYgKHN0YXJ0Q29udGFpbmVyLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgaWYgKHJhbmdlLnN0YXJ0T2Zmc2V0ID09PSBzdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoKSB7XG4gICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPiAwKSB7XG4gICAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldCk7XG4gICAgICBpZiAoZW5kQ29udGFpbmVyID09PSBzdGFydENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgZW5kQ29udGFpbmVyID0gc3RhcnRDb250YWluZXI7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHJhbmdlLnN0YXJ0T2Zmc2V0IDwgc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLmNoaWxkTm9kZXMuaXRlbShyYW5nZS5zdGFydE9mZnNldCk7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnRDb250YWluZXIgPSBzdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRDb250YWluZXI6IHN0YXJ0Q29udGFpbmVyLFxuICAgIGVuZENvbnRhaW5lcjogZW5kQ29udGFpbmVyLFxuICAgIGdvRGVlcGVyOiBnb0RlZXBlclxuICB9O1xufVxuXG4vKipcbiAqIFNvcnRzIGFycmF5IG9mIERPTSBlbGVtZW50cyBieSBpdHMgZGVwdGggaW4gRE9NIHRyZWUuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IGFyciAtIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRlc2NlbmRpbmcgLSBvcmRlciBvZiBzb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydEJ5RGVwdGgoYXJyLCBkZXNjZW5kaW5nKSB7XG4gIGFyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZG9tKGRlc2NlbmRpbmcgPyBiIDogYSkucGFyZW50cygpLmxlbmd0aCAtXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGEgOiBiKS5wYXJlbnRzKCkubGVuZ3RoXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnRzIGEgaSBiIGhhdmUgdGhlIHNhbWUgY29sb3IuXG4gKiBAcGFyYW0ge05vZGV9IGFcbiAqIEBwYXJhbSB7Tm9kZX0gYlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXZlU2FtZUNvbG9yKGEsIGIpIHtcbiAgcmV0dXJuIGRvbShhKS5jb2xvcigpID09PSBkb20oYikuY29sb3IoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHdyYXBwZXIgZm9yIGhpZ2hsaWdodHMuXG4gKiBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgY2FsbHMgdGhpcyBtZXRob2QgZWFjaCB0aW1lIGl0IG5lZWRzIHRvIGNyZWF0ZSBoaWdobGlnaHRzIGFuZCBwYXNzIG9wdGlvbnMgcmV0cmlldmVkXG4gKiBpbiBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gdGhlIHNhbWUgb2JqZWN0IGFzIGluIFRleHRIaWdobGlnaHRlciBjb25zdHJ1Y3Rvci5cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIob3B0aW9ucykge1xuICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBzcGFuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gIHNwYW4uY2xhc3NOYW1lID0gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzO1xuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24oZWxlbWVudCwgbG9jYXRpb25JbkNoaWxkTm9kZXMpIHtcbiAgY29uc29sZS5sb2coXCJFbGVtZW50IGFzIHBhcmFtZXRlcjogXCIsIGVsZW1lbnQpO1xuICBsZXQgdGV4dE5vZGVFbGVtZW50ID0gZWxlbWVudDtcbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAodGV4dE5vZGVFbGVtZW50ICYmIHRleHROb2RlRWxlbWVudC5ub2RlVHlwZSAhPT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgIGNvbnNvbGUubG9nKGB0ZXh0Tm9kZUVsZW1lbnQgc3RlcCAke2l9YCwgdGV4dE5vZGVFbGVtZW50KTtcbiAgICBpZiAobG9jYXRpb25JbkNoaWxkTm9kZXMgPT09IFwic3RhcnRcIikge1xuICAgICAgaWYgKHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJlbmRcIikge1xuICAgICAgaWYgKHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGxhc3RJbmRleCA9IHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzW2xhc3RJbmRleF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICBpKys7XG4gIH1cblxuICBjb25zb2xlLmxvZyhcInRleHQgbm9kZSBlbGVtZW50IHJldHVybmVkOiBcIiwgdGV4dE5vZGVFbGVtZW50KTtcbiAgcmV0dXJuIHRleHROb2RlRWxlbWVudDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hlcmUgdG8gaW5qZWN0IGEgaGlnaGxpZ2h0IGJhc2VkIG9uIGl0J3Mgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gaGlnaGxpZ2h0XG4gKiBAcGFyYW0geyp9IHBhcmVudE5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmROb2RlQW5kT2Zmc2V0KGhpZ2hsaWdodCwgcGFyZW50Tm9kZSkge1xuICBsZXQgY3VycmVudE5vZGUgPSBwYXJlbnROb2RlO1xuICBsZXQgY3VycmVudE9mZnNldCA9IDA7XG4gIGxldCBvZmZzZXRXaXRoaW5Ob2RlID0gMDtcbiAgbGV0IGxvY2F0aW9uRm91bmQgPSBmYWxzZTtcblxuICB3aGlsZSAoXG4gICAgY3VycmVudE5vZGUgJiZcbiAgICAhbG9jYXRpb25Gb3VuZCAmJlxuICAgIChjdXJyZW50T2Zmc2V0IDwgaGlnaGxpZ2h0Lm9mZnNldCB8fFxuICAgICAgKGN1cnJlbnRPZmZzZXQgPT09IGhpZ2hsaWdodC5vZmZzZXQgJiYgY3VycmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSlcbiAgKSB7XG4gICAgY29uc3QgZW5kT2ZOb2RlT2Zmc2V0ID0gY3VycmVudE9mZnNldCArIGN1cnJlbnROb2RlLnRleHRDb250ZW50Lmxlbmd0aDtcblxuICAgIGlmIChlbmRPZk5vZGVPZmZzZXQgPiBoaWdobGlnaHQub2Zmc2V0KSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgb2Zmc2V0V2l0aGluTm9kZSA9IGhpZ2hsaWdodC5vZmZzZXQgLSBjdXJyZW50T2Zmc2V0O1xuICAgICAgICBsb2NhdGlvbkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudE9mZnNldCA9IGN1cnJlbnRPZmZzZXQgKyBvZmZzZXRXaXRoaW5Ob2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50T2Zmc2V0ID0gZW5kT2ZOb2RlT2Zmc2V0O1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBub2RlOiBjdXJyZW50Tm9kZSwgb2Zmc2V0OiBvZmZzZXRXaXRoaW5Ob2RlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50T2Zmc2V0KGNoaWxkRWxlbWVudCwgcm9vdEVsZW1lbnQpIHtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGxldCBjaGlsZE5vZGVzO1xuXG4gIGxldCBjdXJyZW50RWxlbWVudCA9IGNoaWxkRWxlbWVudDtcbiAgZG8ge1xuICAgIGNoaWxkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgIGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2Rlc1xuICAgICk7XG4gICAgY29uc3QgY2hpbGRFbGVtZW50SW5kZXggPSBjaGlsZE5vZGVzLmluZGV4T2YoY3VycmVudEVsZW1lbnQpO1xuICAgIGNvbnN0IG9mZnNldEluQ3VycmVudFBhcmVudCA9IGdldFRleHRPZmZzZXRCZWZvcmUoXG4gICAgICBjaGlsZE5vZGVzLFxuICAgICAgY2hpbGRFbGVtZW50SW5kZXhcbiAgICApO1xuICAgIG9mZnNldCArPSBvZmZzZXRJbkN1cnJlbnRQYXJlbnQ7XG4gICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnROb2RlO1xuICB9IHdoaWxlIChjdXJyZW50RWxlbWVudCAhPT0gcm9vdEVsZW1lbnQgfHwgIWN1cnJlbnRFbGVtZW50KTtcblxuICByZXR1cm4gb2Zmc2V0O1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0T2Zmc2V0QmVmb3JlKGNoaWxkTm9kZXMsIGN1dEluZGV4KSB7XG4gIGxldCB0ZXh0T2Zmc2V0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXRJbmRleDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuICAgIC8vIFVzZSB0ZXh0Q29udGVudCBhbmQgbm90IGlubmVySFRNTCB0byBhY2NvdW50IGZvciBpbnZpc2libGUgY2hhcmFjdGVycyBhcyB3ZWxsLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL3RleHRDb250ZW50XG4gICAgY29uc3QgdGV4dCA9IGN1cnJlbnROb2RlLnRleHRDb250ZW50O1xuICAgIGlmICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgdGV4dE9mZnNldCArPSB0ZXh0Lmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRleHRPZmZzZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQoZWxlbWVudHMpIHtcbiAgbGV0IGNoaWxkRWxlbWVudCA9IGVsZW1lbnRzLmNoaWxkRWxlbWVudDtcbiAgbGV0IG90aGVyRWxlbWVudCA9IGVsZW1lbnRzLm90aGVyRWxlbWVudDtcbiAgbGV0IHBhcmVudHMgPSBkb20oY2hpbGRFbGVtZW50KS5wYXJlbnRzV2l0aG91dERvY3VtZW50KCk7XG4gIGxldCBpID0gMDtcbiAgbGV0IGZpcnN0Tm9uU2hhcmVkUGFyZW50ID0gbnVsbDtcbiAgbGV0IGFsbFBhcmVudHNBcmVTaGFyZWQgPSBmYWxzZTtcbiAgd2hpbGUgKCFmaXJzdE5vblNoYXJlZFBhcmVudCAmJiAhYWxsUGFyZW50c0FyZVNoYXJlZCAmJiBpIDwgcGFyZW50cy5sZW5ndGgpIHtcbiAgICBjb25zdCBjdXJyZW50UGFyZW50ID0gcGFyZW50c1tpXTtcblxuICAgIGlmIChjdXJyZW50UGFyZW50LmNvbnRhaW5zKG90aGVyRWxlbWVudCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudFBhcmVudCBjb250YWlucyBvdGhlciBlbGVtZW50IVwiLCBjdXJyZW50UGFyZW50KTtcbiAgICAgIGlmIChpID4gMCkge1xuICAgICAgICBmaXJzdE5vblNoYXJlZFBhcmVudCA9IHBhcmVudHNbaSAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsUGFyZW50c0FyZVNoYXJlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIHJldHVybiBmaXJzdE5vblNoYXJlZFBhcmVudDtcbn1cblxuY29uc3Qgc2libGluZ1JlbW92YWxEaXJlY3Rpb25zID0ge1xuICBzdGFydDogXCJwcmV2aW91c1NpYmxpbmdcIixcbiAgZW5kOiBcIm5leHRTaWJsaW5nXCJcbn07XG5cbmNvbnN0IHNpYmxpbmdUZXh0Tm9kZU1lcmdlRGlyZWN0aW9ucyA9IHtcbiAgc3RhcnQ6IFwibmV4dFNpYmxpbmdcIixcbiAgZW5kOiBcInByZXZpb3VzU2libGluZ1wiXG59O1xuXG5mdW5jdGlvbiByZW1vdmVTaWJsaW5nc0luRGlyZWN0aW9uKHN0YXJ0Tm9kZSwgZGlyZWN0aW9uKSB7XG4gIGxldCBzaWJsaW5nID0gc3RhcnROb2RlW2RpcmVjdGlvbl07XG4gIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgc3RhcnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2libGluZyk7XG4gICAgc2libGluZyA9IHNpYmxpbmdbZGlyZWN0aW9uXTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlcyB0aGUgdGV4dCBvZiBhbGwgc2libGluZyB0ZXh0IG5vZGVzIHdpdGggdGhlIHN0YXJ0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhcnROb2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2libGluZ1RleHROb2Rlc0luRGlyZWN0aW9uKHN0YXJ0Tm9kZSwgZGlyZWN0aW9uKSB7XG4gIGxldCBzaWJsaW5nID0gc3RhcnROb2RlW2RpcmVjdGlvbl07XG4gIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgaWYgKHNpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgIHN0YXJ0Tm9kZS50ZXh0Q29udGVudCArPSBzaWJsaW5nLnRleHRDb250ZW50O1xuICAgICAgc3RhcnROb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2libGluZyk7XG4gICAgICBzaWJsaW5nID0gc2libGluZ1tkaXJlY3Rpb25dO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0KHBhcmFtcykge1xuICBsZXQgZWxlbWVudCA9IHBhcmFtcy5lbGVtZW50O1xuICBsZXQgZWxlbWVudEFuY2VzdG9yID0gcGFyYW1zLmVsZW1lbnRBbmNlc3RvcjtcbiAgbGV0IG9wdGlvbnMgPSBwYXJhbXMub3B0aW9ucztcbiAgbGV0IGxvY2F0aW9uSW5TZWxlY3Rpb24gPSBwYXJhbXMubG9jYXRpb25JblNlbGVjdGlvbjtcblxuICBsZXQgZWxlbWVudEFuY2VzdG9yQ29weSA9IGVsZW1lbnRBbmNlc3Rvci5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgLy8gQmVnaW5uaW5nIG9mIGNoaWxkTm9kZXMgbGlzdCBmb3IgZW5kIGNvbnRhaW5lciBpbiBzZWxlY3Rpb25cbiAgLy8gYW5kIGVuZCBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIHN0YXJ0IGNvbnRhaW5lciBpbiBzZWxlY3Rpb24uXG4gIGxldCBsb2NhdGlvbkluQ2hpbGROb2RlcyA9IGxvY2F0aW9uSW5TZWxlY3Rpb24gPT09IFwic3RhcnRcIiA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG4gIGxldCBlbGVtZW50Q29weSA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24oXG4gICAgZWxlbWVudEFuY2VzdG9yQ29weSxcbiAgICBsb2NhdGlvbkluQ2hpbGROb2Rlc1xuICApO1xuICBsZXQgZWxlbWVudENvcHlQYXJlbnQgPSBlbGVtZW50Q29weS5wYXJlbnROb2RlO1xuXG4gIHJlbW92ZVNpYmxpbmdzSW5EaXJlY3Rpb24oXG4gICAgZWxlbWVudENvcHksXG4gICAgc2libGluZ1JlbW92YWxEaXJlY3Rpb25zW2xvY2F0aW9uSW5TZWxlY3Rpb25dXG4gICk7XG5cbiAgbWVyZ2VTaWJsaW5nVGV4dE5vZGVzSW5EaXJlY3Rpb24oXG4gICAgZWxlbWVudENvcHksXG4gICAgc2libGluZ1RleHROb2RlTWVyZ2VEaXJlY3Rpb25zW2xvY2F0aW9uSW5TZWxlY3Rpb25dXG4gICk7XG5cbiAgY29uc29sZS5sb2coXCJlbGVtZW50Q29weTogXCIsIGVsZW1lbnRDb3B5KTtcbiAgY29uc29sZS5sb2coXCJlbGVtZW50Q29weVBhcmVudDogXCIsIGVsZW1lbnRDb3B5UGFyZW50KTtcblxuICAvLyBDbGVhbiBvdXQgYW55IG5lc3RlZCBoaWdobGlnaHQgd3JhcHBlcnMuXG4gIGlmIChcbiAgICBlbGVtZW50Q29weVBhcmVudCAhPT0gZWxlbWVudEFuY2VzdG9yQ29weSAmJlxuICAgIGVsZW1lbnRDb3B5UGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICkge1xuICAgIGRvbShlbGVtZW50Q29weVBhcmVudCkudW53cmFwKCk7XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIHRleHQgbm9kZSB0aGF0IHdlIG5lZWQgZm9yIHRoZSBuZXcgaGlnaGxpZ2h0XG4gIC8vIGZyb20gdGhlIGV4aXN0aW5nIGhpZ2hsaWdodCBvciBvdGhlciBlbGVtZW50LlxuICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cbiAgcmV0dXJuIHsgZWxlbWVudEFuY2VzdG9yQ29weSwgZWxlbWVudENvcHkgfTtcbn1cblxuZnVuY3Rpb24gZ2F0aGVyU2libGluZ3NVcFRvRW5kTm9kZShzdGFydE5vZGVPckNvbnRhaW5lciwgZW5kTm9kZSkge1xuICBjb25zdCBnYXRoZXJlZFNpYmxpbmdzID0gW107XG4gIGxldCBmb3VuZEVuZE5vZGVTaWJsaW5nID0gZmFsc2U7XG5cbiAgbGV0IGN1cnJlbnROb2RlID0gc3RhcnROb2RlT3JDb250YWluZXIubmV4dFNpYmxpbmc7XG4gIHdoaWxlIChjdXJyZW50Tm9kZSAmJiAhZm91bmRFbmROb2RlU2libGluZykge1xuICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSB8fCBjdXJyZW50Tm9kZS5jb250YWlucyhlbmROb2RlKSkge1xuICAgICAgZm91bmRFbmROb2RlU2libGluZyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhdGhlcmVkU2libGluZ3MucHVzaChjdXJyZW50Tm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGdhdGhlcmVkU2libGluZ3MsIGZvdW5kRW5kTm9kZVNpYmxpbmcgfTtcbn1cblxuLyoqXG4gKiBHZXRzIGFsbCB0aGUgbm9kZXMgaW4gYmV0d2VlbiB0aGUgcHJvdmlkZWQgc3RhcnQgYW5kIGVuZC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzdGFydE5vZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVuZE5vZGVcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfSBOb2RlcyB0aGF0IGxpdmUgaW4gYmV0d2VlbiB0aGUgdHdvLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9kZXNJbkJldHdlZW4oc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gIGlmIChzdGFydE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgLy8gRmlyc3QgYXR0ZW1wdCB0aGUgZWFzaWVzdCBzb2x1dGlvbiwgaG9waW5nIGVuZE5vZGUgd2lsbCBiZSBhdCB0aGUgc2FtZSBsZXZlbFxuICAvLyBhcyB0aGUgc3RhcnQgbm9kZSBvciBjb250YWluZWQgaW4gYW4gZWxlbWVudCBhdCB0aGUgc2FtZSBsZXZlbC5cbiAgY29uc3Qge1xuICAgIGZvdW5kRW5kTm9kZVNpYmxpbmc6IGZvdW5kRW5kTm9kZVNpYmxpbmdPblNhbWVMZXZlbCxcbiAgICBnYXRoZXJlZFNpYmxpbmdzXG4gIH0gPSBnYXRoZXJTaWJsaW5nc1VwVG9FbmROb2RlKHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG5cbiAgaWYgKGZvdW5kRW5kTm9kZVNpYmxpbmdPblNhbWVMZXZlbCkge1xuICAgIHJldHVybiBnYXRoZXJlZFNpYmxpbmdzO1xuICB9XG5cbiAgLy8gTm93IGdvIGZvciB0aGUgcm91dGUgdGhhdCBnb2VzIHRvIHRoZSBoaWdoZXN0IHBhcmVudCBvZiB0aGUgc3RhcnQgbm9kZSBpbiB0aGUgdHJlZVxuICAvLyB0aGF0IGlzIG5vdCB0aGUgcGFyZW50IG9mIHRoZSBlbmQgbm9kZS5cbiAgY29uc3Qgc3RhcnROb2RlUGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICBjaGlsZEVsZW1lbnQ6IHN0YXJ0Tm9kZSxcbiAgICBvdGhlckVsZW1lbnQ6IGVuZE5vZGVcbiAgfSk7XG5cbiAgaWYgKHN0YXJ0Tm9kZVBhcmVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGZvdW5kRW5kTm9kZVNpYmxpbmc6IGZvdW5kRW5kTm9kZVNpYmxpbmdGcm9tUGFyZW50TGV2ZWwsXG4gICAgICBnYXRoZXJlZFNpYmxpbmdzOiBnYXRoZXJlZFNpYmxpbmdzRnJvbVBhcmVudFxuICAgIH0gPSBnYXRoZXJTaWJsaW5nc1VwVG9FbmROb2RlKHN0YXJ0Tm9kZVBhcmVudCwgZW5kTm9kZSk7XG5cbiAgICBpZiAoZm91bmRFbmROb2RlU2libGluZ0Zyb21QYXJlbnRMZXZlbCkge1xuICAgICAgcmV0dXJuIGdhdGhlcmVkU2libGluZ3NGcm9tUGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBHcm91cHMgZ2l2ZW4gaGlnaGxpZ2h0cyBieSB0aW1lc3RhbXAuXG4gKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wQXR0clxuICogQHJldHVybnMge0FycmF5fSBHcm91cGVkIGhpZ2hsaWdodHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEhpZ2hsaWdodHMoaGlnaGxpZ2h0cywgdGltZXN0YW1wQXR0cikge1xuICBsZXQgb3JkZXIgPSBbXSxcbiAgICBjaHVua3MgPSB7fSxcbiAgICBncm91cGVkID0gW107XG5cbiAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsKSB7XG4gICAgbGV0IHRpbWVzdGFtcCA9IGhsLmdldEF0dHJpYnV0ZSh0aW1lc3RhbXBBdHRyKTtcblxuICAgIGlmICh0eXBlb2YgY2h1bmtzW3RpbWVzdGFtcF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNodW5rc1t0aW1lc3RhbXBdID0gW107XG4gICAgICBvcmRlci5wdXNoKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgY2h1bmtzW3RpbWVzdGFtcF0ucHVzaChobCk7XG4gIH0pO1xuXG4gIG9yZGVyLmZvckVhY2goZnVuY3Rpb24odGltZXN0YW1wKSB7XG4gICAgbGV0IGdyb3VwID0gY2h1bmtzW3RpbWVzdGFtcF07XG5cbiAgICBncm91cGVkLnB1c2goe1xuICAgICAgY2h1bmtzOiBncm91cCxcbiAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wLFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZ3JvdXBcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKGgpIHtcbiAgICAgICAgICAgIHJldHVybiBoLnRleHRDb250ZW50O1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmpvaW4oXCJcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBncm91cGVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmVIaWdobGlnaHRzKHBhcmFtcykge1xuICBwYXJhbXMgPSB7XG4gICAgYW5kU2VsZjogdHJ1ZSxcbiAgICBncm91cGVkOiBmYWxzZSxcbiAgICAuLi5wYXJhbXNcbiAgfTtcblxuICBsZXQgbm9kZUxpc3QgPSBwYXJhbXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbXCIgKyBwYXJhbXMuZGF0YUF0dHIgKyBcIl1cIiksXG4gICAgaGlnaGxpZ2h0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVMaXN0KTtcblxuICBpZiAoXG4gICAgcGFyYW1zLmFuZFNlbGYgPT09IHRydWUgJiZcbiAgICBwYXJhbXMuY29udGFpbmVyLmhhc0F0dHJpYnV0ZShwYXJhbXMuZGF0YUF0dHIpXG4gICkge1xuICAgIGhpZ2hsaWdodHMucHVzaChwYXJhbXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGlmIChwYXJhbXMuZ3JvdXBlZCkge1xuICAgIGhpZ2hsaWdodHMgPSBncm91cEhpZ2hsaWdodHMoaGlnaGxpZ2h0cywgcGFyYW1zLnRpbWVzdGFtcEF0dHIpO1xuICB9XG5cbiAgcmV0dXJuIGhpZ2hsaWdodHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnRIaWdobGlnaHQoZWwsIGRhdGFBdHRyKSB7XG4gIHJldHVybiAoXG4gICAgZWwgJiYgZWwubm9kZVR5cGUgPT09IE5PREVfVFlQRS5FTEVNRU5UX05PREUgJiYgZWwuaGFzQXR0cmlidXRlKGRhdGFBdHRyKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkTm9kZXNUb0hpZ2hsaWdodEFmdGVyRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIGVsZW1lbnRBbmNlc3RvcixcbiAgaGlnaGxpZ2h0V3JhcHBlcixcbiAgaGlnaGxpZ2h0ZWRDbGFzc1xufSkge1xuICBpZiAoZWxlbWVudEFuY2VzdG9yKSB7XG4gICAgaWYgKGVsZW1lbnRBbmNlc3Rvci5jbGFzc0xpc3QuY29udGFpbnMoaGlnaGxpZ2h0ZWRDbGFzcykpIHtcbiAgICAgIC8vIEVuc3VyZSB3ZSBvbmx5IHRha2UgdGhlIGNoaWxkcmVuIGZyb20gYSBwYXJlbnQgdGhhdCBpcyBhIGhpZ2hsaWdodC5cbiAgICAgIGVsZW1lbnRBbmNlc3Rvci5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgaWYgKGRvbShjaGlsZE5vZGUpLmlzQWZ0ZXIoZWxlbWVudCkpIHtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50QW5jZXN0b3IuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWdobGlnaHRXcmFwcGVyLmFwcGVuZENoaWxkKGVsZW1lbnRBbmNlc3Rvcik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhpZ2hsaWdodFdyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb2xsZWN0cyB0aGUgaHVtYW4tcmVhZGFibGUgaGlnaGxpZ2h0ZWQgdGV4dCBmb3IgYWxsIG5vZGVzIGluIHRoZSBzZWxlY3RlZCByYW5nZS5cbiAqXG4gKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGh1bWFuLXJlYWRhYmxlIGhpZ2hsaWdodGVkIHRleHQgZm9yIHRoZSBnaXZlbiByYW5nZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEhpZ2hsaWdodGVkVGV4dChyYW5nZSkge1xuICBjb25zdCBzdGFydENvbnRhaW5lckNvcHkgPSByYW5nZS5zdGFydENvbnRhaW5lci5jbG9uZSh0cnVlKTtcbiAgcmV0dXJuIFwiXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZXNjcmlwdG9ycyh7IHJvb3RFbGVtZW50LCByYW5nZSwgd3JhcHBlciB9KSB7XG4gIGxldCB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcblxuICBjb25zdCBzdGFydE9mZnNldCA9XG4gICAgZ2V0RWxlbWVudE9mZnNldChyYW5nZS5zdGFydENvbnRhaW5lciwgcm9vdEVsZW1lbnQpICsgcmFuZ2Uuc3RhcnRPZmZzZXQ7XG4gIGNvbnN0IGVuZE9mZnNldCA9XG4gICAgcmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHJhbmdlLmVuZENvbnRhaW5lclxuICAgICAgPyBzdGFydE9mZnNldCArIChyYW5nZS5lbmRPZmZzZXQgLSByYW5nZS5zdGFydE9mZnNldClcbiAgICAgIDogZ2V0RWxlbWVudE9mZnNldChyYW5nZS5lbmRDb250YWluZXIsIHJvb3RFbGVtZW50KSArIHJhbmdlLmVuZE9mZnNldDtcbiAgY29uc3QgbGVuZ3RoID0gZW5kT2Zmc2V0IC0gc3RhcnRPZmZzZXQ7XG4gIHdyYXBwZXJDbG9uZS5zZXRBdHRyaWJ1dGUoREFUQV9BVFRSLCB0cnVlKTtcblxuICB3cmFwcGVyQ2xvbmUuaW5uZXJIVE1MID0gXCJcIjtcbiAgY29uc3Qgd3JhcHBlckhUTUwgPSB3cmFwcGVyQ2xvbmUub3V0ZXJIVE1MO1xuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBbXG4gICAgd3JhcHBlckhUTUwsXG4gICAgLy8gcmV0cmlldmUgYWxsIHRoZSB0ZXh0IGNvbnRlbnQgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZmZzZXRzLlxuICAgIGdldEhpZ2hsaWdodGVkVGV4dChyYW5nZSksXG4gICAgc3RhcnRPZmZzZXQsXG4gICAgbGVuZ3RoXG4gIF07XG4gIC8vIFRPRE86IGNodW5rIHVwIGhpZ2hsaWdodHMgZm9yIFBERnMgKG9yIGFueSBlbGVtZW50IHdpdGggYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzKS5cbiAgcmV0dXJuIFtkZXNjcmlwdG9yXTtcbn1cbiJdfQ==
