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
        var containsIdAsClass = wrapper.classList.contains(id);
        wrapper.innerHTML = "";
        wrapper = wrapper.outerHTML;

        if (containsIdAsClass) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzIiwic3JjL2dsb2JhbC1zY3JpcHQuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWEuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2by5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUlPLElBQU0sU0FBUyxHQUFHLGtCQUFsQjtBQUVQOzs7Ozs7QUFJTyxJQUFNLGNBQWMsR0FBRyxnQkFBdkI7O0FBRUEsSUFBTSxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsaUJBQXhCO0FBRVA7Ozs7OztBQUlPLElBQU0sV0FBVyxHQUFHLENBQ3pCLFFBRHlCLEVBRXpCLE9BRnlCLEVBR3pCLFFBSHlCLEVBSXpCLFFBSnlCLEVBS3pCLFFBTHlCLEVBTXpCLFFBTnlCLEVBT3pCLFFBUHlCLEVBUXpCLE9BUnlCLEVBU3pCLE9BVHlCLEVBVXpCLFFBVnlCLEVBV3pCLE9BWHlCLEVBWXpCLE9BWnlCLEVBYXpCLE9BYnlCLEVBY3pCLFVBZHlCLENBQXBCOzs7Ozs7O0FDbkJQOztBQVlBOzs7O0FBVkE7Ozs7QUFJQSxNQUFNLENBQUMsZUFBUCxHQUF5QiwyQkFBekI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7O0FBY0E7O0FBTUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLHdCOzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsb0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxP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WSxDQUFDLFlBQWIsQ0FBMEIsaUJBQTFCLEVBQXFDLElBQXJDO0FBRUEsRUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixFQUF6QjtBQUNBLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxTQUFqQztBQUVBLE1BQU0sVUFBVSxHQUFHLENBQ2pCLFdBRGlCLEVBRWpCO0FBQ0EsRUFBQSxrQkFBa0IsQ0FBQyxLQUFELENBSEQsRUFJakIsV0FKaUIsRUFLakIsTUFMaUIsQ0FBbkIsQ0FmaUUsQ0FzQmpFOztBQUNBLFNBQU8sQ0FBQyxVQUFELENBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQXR0cmlidXRlIGFkZGVkIGJ5IGRlZmF1bHQgdG8gZXZlcnkgaGlnaGxpZ2h0LlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IERBVEFfQVRUUiA9IFwiZGF0YS1oaWdobGlnaHRlZFwiO1xuXG4vKipcbiAqIEF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIGhpZ2hsaWdodCB3cmFwcGVycy5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBUSU1FU1RBTVBfQVRUUiA9IFwiZGF0YS10aW1lc3RhbXBcIjtcblxuZXhwb3J0IGNvbnN0IFNUQVJUX09GRlNFVF9BVFRSID0gXCJkYXRhLXN0YXJ0LW9mZnNldFwiO1xuZXhwb3J0IGNvbnN0IEVORF9PRkZTRVRfQVRUUiA9IFwiZGF0YS1lbmQtb2Zmc2V0XCI7XG5cbi8qKlxuICogRG9uJ3QgaGlnaGxpZ2h0IGNvbnRlbnQgb2YgdGhlc2UgdGFncy5cbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqL1xuZXhwb3J0IGNvbnN0IElHTk9SRV9UQUdTID0gW1xuICBcIlNDUklQVFwiLFxuICBcIlNUWUxFXCIsXG4gIFwiU0VMRUNUXCIsXG4gIFwiT1BUSU9OXCIsXG4gIFwiQlVUVE9OXCIsXG4gIFwiT0JKRUNUXCIsXG4gIFwiQVBQTEVUXCIsXG4gIFwiVklERU9cIixcbiAgXCJBVURJT1wiLFxuICBcIkNBTlZBU1wiLFxuICBcIkVNQkVEXCIsXG4gIFwiUEFSQU1cIixcbiAgXCJNRVRFUlwiLFxuICBcIlBST0dSRVNTXCJcbl07XG4iLCJpbXBvcnQgVGV4dEhpZ2hsaWdodGVyIGZyb20gXCIuL3RleHQtaGlnaGxpZ2h0ZXJcIjtcblxuLyoqXG4gKiBFeHBvc2UgdGhlIFRleHRIaWdobGlnaHRlciBjbGFzcyBnbG9iYWxseSB0byBiZVxuICogdXNlZCBpbiBkZW1vcyBhbmQgdG8gYmUgaW5qZWN0ZWQgZGlyZWN0bHkgaW50byBodG1sIGZpbGVzLlxuICovXG5nbG9iYWwuVGV4dEhpZ2hsaWdodGVyID0gVGV4dEhpZ2hsaWdodGVyO1xuXG4vKipcbiAqIExvYWQgdGhlIGpxdWVyeSBwbHVnaW4gZ2xvYmFsbHkgZXhwZWN0aW5nIGpRdWVyeSBhbmQgVGV4dEhpZ2hsaWdodGVyIHRvIGJlIGdsb2JhbGx5XG4gKiBhdmFpYWJsZSwgdGhpcyBtZWFucyB0aGlzIGxpYnJhcnkgZG9lc24ndCBuZWVkIGEgaGFyZCByZXF1aXJlbWVudCBvZiBqUXVlcnkuXG4gKi9cbmltcG9ydCBcIi4vanF1ZXJ5LXBsdWdpblwiO1xuIiwiaW1wb3J0IHtcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIGdldEVsZW1lbnRPZmZzZXQsXG4gIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24sXG4gIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCxcbiAgZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0LFxuICBub2Rlc0luQmV0d2VlbixcbiAgc29ydEJ5RGVwdGgsXG4gIGZpbmROb2RlQW5kT2Zmc2V0LFxuICBhZGROb2Rlc1RvSGlnaGxpZ2h0QWZ0ZXJFbGVtZW50LFxuICBjcmVhdGVXcmFwcGVyLFxuICBjcmVhdGVEZXNjcmlwdG9yc1xufSBmcm9tIFwiLi4vdXRpbHMvaGlnaGxpZ2h0c1wiO1xuaW1wb3J0IHtcbiAgU1RBUlRfT0ZGU0VUX0FUVFIsXG4gIEVORF9PRkZTRVRfQVRUUixcbiAgREFUQV9BVFRSLFxuICBUSU1FU1RBTVBfQVRUUlxufSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgZG9tIGZyb20gXCIuLi91dGlscy9kb21cIjtcbmltcG9ydCB7IHVuaXF1ZSB9IGZyb20gXCIuLi91dGlscy9hcnJheXNcIjtcblxuLyoqXG4gKiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50c1xuICogd2l0aCBhIGZvY3VzIG9uIHJlbW92aW5nIGludGVyZGVwZW5kZW5jZSBiZXR3ZWVuIGhpZ2hsaWdodHMgYW5kIG90aGVyIGVsZW1lbnQgbm9kZXMgaW4gdGhlIGNvbnRleHQgZWxlbWVudC5cbiAqL1xuY2xhc3MgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIGluc3RhbmNlIGZvciBmdW5jdGlvbmFsaXR5IHRoYXQgZm9jdXNlcyBmb3IgaGlnaGxpZ2h0IGluZGVwZW5kZW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBoaWdobGlnaHQgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MgLSBjbGFzcyBhZGRlZCB0byBoaWdobGlnaHQsICdoaWdobGlnaHRlZCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGV4dENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlciBpcyBhcHBsaWVkLFxuICAgKiAgJ2hpZ2hsaWdodGVyLWNvbnRleHQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyByZW1vdmVkLiBIaWdobGlnaHQgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIGlmIGhpZ2hsaWdodCBzaG91bGQgYmUgcmVtb3ZlZCwgb3IgZmFsc2UgLSB0byBwcmV2ZW50IHJlbW92YWwuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBSYW5nZSBvYmplY3QgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcsIG9yIGZhbHNlIC0gdG8gcHJldmVudCBoaWdobGlnaHRpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25BZnRlckhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBoaWdobGlnaHQgaXMgY3JlYXRlZC4gQXJyYXkgb2YgY3JlYXRlZFxuICAgKiB3cmFwcGVycyBpcyBwYXNzZWQgYXMgcGFyYW0uXG4gICAqIEBjbGFzcyBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgdGhlIHJhbmdlIGFsbG93aW5nIGlzb2xhdGlvbiBmb3Igb3ZlcmxhcHBpbmcgaGlnaGxpZ2h0cy5cbiAgICogVGhpcyBzb2x1dGlvbiBzdGVhbHMgdGhlIHRleHQgb3Igb3RoZXIgbm9kZXMgaW4gdGhlIERPTSBmcm9tIG92ZXJsYXBwaW5nIChOT1QgTkVTVEVEKSBoaWdobGlnaHRzXG4gICAqIGZvciByZXByZXNlbnRhdGlvbiBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBGb3IgdGhlIHB1cnBvc2Ugb2Ygc2VyaWFsaXNhdGlvbiB0aGlzIHdpbGwgbWFpbnRhaW4gYSBkYXRhIGF0dHJpYnV0ZSBvbiB0aGUgaGlnaGxpZ2h0IHdyYXBwZXJcbiAgICogd2l0aCB0aGUgc3RhcnQgdGV4dCBhbmQgZW5kIHRleHQgb2Zmc2V0cyByZWxhdGl2ZSB0byB0aGUgY29udGV4dCByb290IGVsZW1lbnQuXG4gICAqXG4gICAqIFdyYXBzIHRleHQgb2YgZ2l2ZW4gcmFuZ2Ugb2JqZWN0IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgY3JlYXRlZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBTFNEZWJ1ZzI5OiBSQU5HRTogXCIsIHJhbmdlKTtcblxuICAgIGxldCBoaWdobGlnaHRzID0gW107XG4gICAgbGV0IHdyYXBwZXJDbG9uZSA9IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgbGV0IHN0YXJ0T2Zmc2V0ID1cbiAgICAgIGdldEVsZW1lbnRPZmZzZXQocmFuZ2Uuc3RhcnRDb250YWluZXIsIHRoaXMuZWwpICsgcmFuZ2Uuc3RhcnRPZmZzZXQ7XG4gICAgbGV0IGVuZE9mZnNldCA9XG4gICAgICByYW5nZS5zdGFydENvbnRhaW5lciA9PT0gcmFuZ2UuZW5kQ29udGFpbmVyXG4gICAgICAgID8gc3RhcnRPZmZzZXQgKyAocmFuZ2UuZW5kT2Zmc2V0IC0gcmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICAgIDogZ2V0RWxlbWVudE9mZnNldChyYW5nZS5lbmRDb250YWluZXIsIHRoaXMuZWwpICsgcmFuZ2UuZW5kT2Zmc2V0O1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBcIkFMU0RlYnVnMjk6IHN0YXJ0T2Zmc2V0OiBcIixcbiAgICAgIHN0YXJ0T2Zmc2V0LFxuICAgICAgXCJlbmRPZmZzZXQ6IFwiLFxuICAgICAgZW5kT2Zmc2V0XG4gICAgKTtcblxuICAgIHdyYXBwZXJDbG9uZS5zZXRBdHRyaWJ1dGUoU1RBUlRfT0ZGU0VUX0FUVFIsIHN0YXJ0T2Zmc2V0KTtcbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKEVORF9PRkZTRVRfQVRUUiwgZW5kT2Zmc2V0KTtcbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIFNUQVJUIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2Uuc3RhcnRDb250YWluZXI6IFwiLCByYW5nZS5zdGFydENvbnRhaW5lcik7XG4gICAgbGV0IHN0YXJ0Q29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5zdGFydENvbnRhaW5lciwgXCJzdGFydFwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuXFxuIEZJTkRJTkcgRU5EIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2UuZW5kQ29udGFpbmVyOiBcIiwgcmFuZ2UuZW5kQ29udGFpbmVyKTtcbiAgICBsZXQgZW5kQ29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5lbmRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBpZiAoIXN0YXJ0Q29udGFpbmVyIHx8ICFlbmRDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJGYWlsZWQgdG8gZmluZCB0aGUgdGV4dCBub2RlIGZvciB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgc2VsZWN0ZWQgcmFuZ2VcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJOZXdIaWdobGlnaHQgPVxuICAgICAgcmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCAtIDFcbiAgICAgICAgPyBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldClcbiAgICAgICAgOiBlbmRDb250YWluZXI7XG5cbiAgICBpZiAoc3RhcnRDb250YWluZXIgPT09IGVuZENvbnRhaW5lcikge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPVxuICAgICAgICByYW5nZS5zdGFydE9mZnNldCA+IDBcbiAgICAgICAgICA/IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldClcbiAgICAgICAgICA6IHN0YXJ0Q29udGFpbmVyO1xuICAgICAgLy8gU2ltcGx5IHdyYXAgdGhlIHNlbGVjdGVkIHJhbmdlIGluIHRoZSBzYW1lIGNvbnRhaW5lciBhcyBhIGhpZ2hsaWdodC5cbiAgICAgIGxldCBoaWdobGlnaHQgPSBkb20oc3RhcnRPZk5ld0hpZ2hsaWdodCkud3JhcCh3cmFwcGVyQ2xvbmUpO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfSBlbHNlIGlmIChlbmRDb250YWluZXIudGV4dENvbnRlbnQubGVuZ3RoID49IHJhbmdlLmVuZE9mZnNldCkge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPSBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0ID0gYWZ0ZXJOZXdIaWdobGlnaHQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiTm9kZSBhdCB0aGUgc3RhcnQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJOb2RlIGF0IHRoZSBlbmQgb2YgbmV3IGhpZ2hsaWdodDogXCIsIGVuZE9mTmV3SGlnaGxpZ2h0KTtcblxuICAgICAgY29uc3Qgc3RhcnRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN0YXJ0RWxlbWVudFBhcmVudENvcHk7XG4gICAgICBsZXQgc3RhcnRPZk5ld0hpZ2hsaWdodENvcHk7XG4gICAgICBpZiAoc3RhcnRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgICh7XG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yQ29weTogc3RhcnRFbGVtZW50UGFyZW50Q29weSxcbiAgICAgICAgICBlbGVtZW50Q29weTogc3RhcnRPZk5ld0hpZ2hsaWdodENvcHlcbiAgICAgICAgfSA9IGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodCh7XG4gICAgICAgICAgZWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3I6IHN0YXJ0RWxlbWVudFBhcmVudCxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgbG9jYXRpb25JblNlbGVjdGlvbjogXCJzdGFydFwiXG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0RWxlbWVudFBhcmVudDpcIiwgc3RhcnRFbGVtZW50UGFyZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydEVsZW1lbnRQYXJlbnRDb3B5OiBcIiwgc3RhcnRFbGVtZW50UGFyZW50Q29weSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVuZEVsZW1lbnRQYXJlbnQgPSBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQoe1xuICAgICAgICBjaGlsZEVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHRcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZW5kRWxlbWVudFBhcmVudENvcHk7XG4gICAgICBsZXQgZW5kT2ZOZXdIaWdobGlnaHRDb3B5O1xuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnQpIHtcbiAgICAgICAgKHtcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3JDb3B5OiBlbmRFbGVtZW50UGFyZW50Q29weSxcbiAgICAgICAgICBlbGVtZW50Y29weTogZW5kT2ZOZXdIaWdobGlnaHRDb3B5XG4gICAgICAgIH0gPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoe1xuICAgICAgICAgIGVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICAgIGVsZW1lbnRBbmNlc3RvcjogZW5kRWxlbWVudFBhcmVudCxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgbG9jYXRpb25JblNlbGVjdGlvbjogXCJlbmRcIlxuICAgICAgICB9KSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiTm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIkNsb25lZCBvZiBub2RlIHRoYXQgaXMgdGhlIHdyYXBwZXIgb2YgdGhlIGVuZCBvZiB0aGUgbmV3IGhpZ2hsaWdodCBhZnRlciByZW1vdmluZyBzaWJsaW5ncyBhbmQgdW53cmFwcGluZyBoaWdobGlnaHQgc3BhbnM6IFwiLFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGFkZE5vZGVzVG9IaWdobGlnaHRBZnRlckVsZW1lbnQoe1xuICAgICAgICBlbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0Q29weSB8fCBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBlbGVtZW50QW5jZXN0b3I6IHN0YXJ0RWxlbWVudFBhcmVudENvcHksXG4gICAgICAgIGhpZ2hsaWdodFdyYXBwZXI6IHdyYXBwZXJDbG9uZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRDbGFzczogdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3NcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUT0RPOiBhZGQgY29udGFpbmVycyBpbiBiZXR3ZWVuLlxuICAgICAgY29uc3QgY29udGFpbmVyc0luQmV0d2VlbiA9IG5vZGVzSW5CZXR3ZWVuKHN0YXJ0Q29udGFpbmVyLCBlbmRDb250YWluZXIpO1xuICAgICAgY29uc29sZS5sb2coXCJDT05UQUlORVJTIElOIEJFVFdFRU46IFwiLCBjb250YWluZXJzSW5CZXR3ZWVuKTtcbiAgICAgIGNvbnRhaW5lcnNJbkJldHdlZW4uZm9yRWFjaChjb250YWluZXIgPT4ge1xuICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZW5kRWxlbWVudFBhcmVudENvcHkpIHtcbiAgICAgICAgLy8gT25seSBjb3B5IHRoZSBjaGlsZHJlbiBvZiBhIGhpZ2hsaWdodGVkIHNwYW4gaW50byBvdXIgbmV3IGhpZ2hsaWdodC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcylcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW5kRWxlbWVudFBhcmVudENvcHkuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoZW5kRWxlbWVudFBhcmVudENvcHkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoZW5kT2ZOZXdIaWdobGlnaHQpO1xuICAgICAgfVxuXG4gICAgICBkb20od3JhcHBlckNsb25lKS5pbnNlcnRCZWZvcmUoXG4gICAgICAgIGVuZEVsZW1lbnRQYXJlbnQgPyBlbmRFbGVtZW50UGFyZW50IDogYWZ0ZXJOZXdIaWdobGlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyBjdXJyZW50IHJhbmdlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGtlZXBSYW5nZSAtIERvbid0IHJlbW92ZSByYW5nZSBhZnRlciBoaWdobGlnaHRpbmcuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb20odGhpcy5lbCkuZ2V0UmFuZ2UoKSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICB0aW1lc3RhbXA7XG5cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQocmFuZ2UpID09PSB0cnVlKSB7XG4gICAgICB0aW1lc3RhbXAgPSArbmV3IERhdGUoKTtcbiAgICAgIHdyYXBwZXIgPSBjcmVhdGVXcmFwcGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcblxuICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSBjcmVhdGVEZXNjcmlwdG9ycyh7XG4gICAgICAgIHJvb3RFbGVtZW50OiB0aGlzLmVsLFxuICAgICAgICByYW5nZSxcbiAgICAgICAgd3JhcHBlclxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZWRIaWdobGlnaHRzID0gdGhpcy5oaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcik7XG4gICAgICAvLyBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhjcmVhdGVkSGlnaGxpZ2h0cyk7XG5cbiAgICAgIGNvbnN0IHByb2Nlc3NlZERlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQoXG4gICAgICAgIHJhbmdlLFxuICAgICAgICBkZXNjcmlwdG9ycyxcbiAgICAgICAgdGltZXN0YW1wXG4gICAgICApO1xuICAgICAgdGhpcy5kZXNlcmlhbGl6ZUhpZ2hsaWdodHMocHJvY2Vzc2VkRGVzY3JpcHRvcnMpO1xuICAgIH1cblxuICAgIGlmICgha2VlcFJhbmdlKSB7XG4gICAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0ZXh0IG5vZGVzIHdpdGhpbiBhbnkgZ2l2ZW4gZWxlbWVudCBub2RlIGFyZSBtZXJnZWQgdG9nZXRoZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgbm9ybWFsaXplZEhpZ2hsaWdodHM7XG5cbiAgICAvL1NpbmNlIHdlJ3JlIG5vdCBtZXJnaW5nIG9yIGZsYXR0ZW5pbmcsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIHRoZSB0ZXh0IG5vZGVzLlxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYXJlIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZWxlbWVudCB8fCB0aGlzLmVsLFxuICAgICAgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoaGlnaGxpZ2h0KSB7XG4gICAgICBpZiAoaGlnaGxpZ2h0LmNsYXNzTmFtZSA9PT0gY29udGFpbmVyLmNsYXNzTmFtZSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICAgIGlmIChzZWxmLm9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQoaGwpID09PSB0cnVlKSB7XG4gICAgICAgIHJlbW92ZUhpZ2hsaWdodChobCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgY29uc3QgbWVyZ2VkUGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgZGF0YUF0dHI6IERBVEFfQVRUUixcbiAgICAgIHRpbWVzdGFtcEF0dHI6IFRJTUVTVEFNUF9BVFRSLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgICByZXR1cm4gcmV0cmlldmVIaWdobGlnaHRzKG1lcmdlZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpIHtcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgbGV0IGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIG9mZnNldCA9IGdldEVsZW1lbnRPZmZzZXQoaGlnaGxpZ2h0LCByZWZFbCksIC8vIEhsIG9mZnNldCBmcm9tIHRoZSByb290IGVsZW1lbnQuXG4gICAgICAgIHdyYXBwZXIgPSBoaWdobGlnaHQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICBjb25zdCBjb250YWluc0lkQXNDbGFzcyA9IHdyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKGlkKTtcbiAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIHdyYXBwZXIgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgICAgaWYgKGNvbnRhaW5zSWRBc0NsYXNzKSB7XG4gICAgICAgIGhsRGVzY3JpcHRvcnMucHVzaChbd3JhcHBlciwgaGlnaGxpZ2h0LnRleHRDb250ZW50LCBvZmZzZXQsIGxlbmd0aF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhsRGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyB0aGUgaW5kZXBlbmRlbnQgZm9ybSBvZiBoaWdobGlnaHRzLlxuICAgKlxuICAgKiBAdGhyb3dzIGV4Y2VwdGlvbiB3aGVuIGNhbid0IHBhcnNlIEpTT04gb3IgSlNPTiBoYXMgaW52YWxpZCBzdHJ1Y3R1cmUuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIC0gSlNPTiBvYmplY3Qgd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBkZXNlcmlhbGl6ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pIHtcbiAgICBsZXQgaGxEZXNjcmlwdG9ycyxcbiAgICAgIGhpZ2hsaWdodHMgPSBbXSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaGxEZXNjcmlwdG9ycyA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgXCJDYW4ndCBwYXJzZSBKU09OOiBcIiArIGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemF0aW9uRm5DdXN0b20oaGxEZXNjcmlwdG9yKSB7XG4gICAgICBsZXQgaGwgPSB7XG4gICAgICAgICAgd3JhcHBlcjogaGxEZXNjcmlwdG9yWzBdLFxuICAgICAgICAgIHRleHQ6IGhsRGVzY3JpcHRvclsxXSxcbiAgICAgICAgICBvZmZzZXQ6IE51bWJlci5wYXJzZUludChobERlc2NyaXB0b3JbMl0pLFxuICAgICAgICAgIGxlbmd0aDogTnVtYmVyLnBhcnNlSW50KGhsRGVzY3JpcHRvclszXSlcbiAgICAgICAgfSxcbiAgICAgICAgaGxOb2RlLFxuICAgICAgICBoaWdobGlnaHQ7XG5cbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBzZWxmLmVsO1xuICAgICAgY29uc3QgeyBub2RlLCBvZmZzZXQ6IG9mZnNldFdpdGhpbk5vZGUgfSA9IGZpbmROb2RlQW5kT2Zmc2V0KFxuICAgICAgICBobCxcbiAgICAgICAgcGFyZW50Tm9kZVxuICAgICAgKTtcblxuICAgICAgaGxOb2RlID0gbm9kZS5zcGxpdFRleHQob2Zmc2V0V2l0aGluTm9kZSk7XG4gICAgICBobE5vZGUuc3BsaXRUZXh0KGhsLmxlbmd0aCk7XG5cbiAgICAgIGlmIChobE5vZGUubmV4dFNpYmxpbmcgJiYgIWhsTm9kZS5uZXh0U2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5uZXh0U2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChobE5vZGUucHJldmlvdXNTaWJsaW5nICYmICFobE5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLnByZXZpb3VzU2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGhpZ2hsaWdodCA9IGRvbShobE5vZGUpLndyYXAoZG9tKCkuZnJvbUhUTUwoaGwud3JhcHBlcilbMF0pO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfVxuXG4gICAgaGxEZXNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGhsRGVzY3JpcHRvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIaWdobGlnaHQ6IFwiLCBobERlc2NyaXB0b3IpO1xuICAgICAgICBkZXNlcmlhbGl6YXRpb25GbkN1c3RvbShobERlc2NyaXB0b3IpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW4ndCBkZXNlcmlhbGl6ZSBoaWdobGlnaHQgZGVzY3JpcHRvci4gQ2F1c2U6IFwiICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGVwZW5kZW5jaWFIaWdobGlnaHRlcjtcbiIsImltcG9ydCB7XG4gIHJlZmluZVJhbmdlQm91bmRhcmllcyxcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIHNvcnRCeURlcHRoLFxuICBoYXZlU2FtZUNvbG9yLFxuICBjcmVhdGVXcmFwcGVyXG59IGZyb20gXCIuLi91dGlscy9oaWdobGlnaHRzXCI7XG5pbXBvcnQgZG9tLCB7IE5PREVfVFlQRSB9IGZyb20gXCIuLi91dGlscy9kb21cIjtcbmltcG9ydCB7IElHTk9SRV9UQUdTLCBEQVRBX0FUVFIsIFRJTUVTVEFNUF9BVFRSIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgdW5pcXVlIH0gZnJvbSBcIi4uL3V0aWxzL2FycmF5c1wiO1xuXG4vKipcbiAqIFByaW1pdGl2b0hpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHNcbiAqIGZvciBzaW1wbGUgdXNlIGNhc2VzLlxuICovXG5jbGFzcyBQcmltaXRpdm9IaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgUHJpbWl0aXZvSGlnaGxpZ2h0ZXIgaW5zdGFuY2UgZm9yIGZ1bmN0aW9uYWxpdHkgc3BlY2lmaWMgdG8gdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gRE9NIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZWQgd2lsbCBiZSBhcHBsaWVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gYWRkaXRpb25hbCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb2xvciAtIGhpZ2hsaWdodCBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGhpZ2hsaWdodCwgJ2hpZ2hsaWdodGVkJyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb250ZXh0Q2xhc3MgLSBjbGFzcyBhZGRlZCB0byBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQsXG4gICAqICAnaGlnaGxpZ2h0ZXItY29udGV4dCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIHJlbW92ZWQuIEhpZ2hsaWdodCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgaWYgaGlnaGxpZ2h0IHNob3VsZCBiZSByZW1vdmVkLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgcmVtb3ZhbC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIFJhbmdlIG9iamVjdCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gY29udGludWUgcHJvY2Vzc2luZywgb3IgZmFsc2UgLSB0byBwcmV2ZW50IGhpZ2hsaWdodGluZy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGFmdGVyIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBBcnJheSBvZiBjcmVhdGVkXG4gICAqIHdyYXBwZXJzIGlzIHBhc3NlZCBhcyBwYXJhbS5cbiAgICogQGNsYXNzIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyByYW5nZS5cbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyODogcmFuZ2UgYmVmb3JlIHJlZmluZWQhIFwiLCByYW5nZSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gcmVmaW5lUmFuZ2VCb3VuZGFyaWVzKHJhbmdlKSxcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gcmVzdWx0LnN0YXJ0Q29udGFpbmVyLFxuICAgICAgZW5kQ29udGFpbmVyID0gcmVzdWx0LmVuZENvbnRhaW5lcixcbiAgICAgIGdvRGVlcGVyID0gcmVzdWx0LmdvRGVlcGVyLFxuICAgICAgZG9uZSA9IGZhbHNlLFxuICAgICAgbm9kZSA9IHN0YXJ0Q29udGFpbmVyLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgaGlnaGxpZ2h0LFxuICAgICAgd3JhcHBlckNsb25lLFxuICAgICAgbm9kZVBhcmVudDtcblxuICAgIGRvIHtcbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBJR05PUkVfVEFHUy5pbmRleE9mKG5vZGUucGFyZW50Tm9kZS50YWdOYW1lKSA9PT0gLTEgJiZcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuICAgICAgICAgIG5vZGVQYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAvLyBoaWdobGlnaHQgaWYgYSBub2RlIGlzIGluc2lkZSB0aGUgZWxcbiAgICAgICAgICBpZiAoZG9tKHRoaXMuZWwpLmNvbnRhaW5zKG5vZGVQYXJlbnQpIHx8IG5vZGVQYXJlbnQgPT09IHRoaXMuZWwpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodCA9IGRvbShub2RlKS53cmFwKHdyYXBwZXJDbG9uZSk7XG4gICAgICAgICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBub2RlID09PSBlbmRDb250YWluZXIgJiZcbiAgICAgICAgIShlbmRDb250YWluZXIuaGFzQ2hpbGROb2RlcygpICYmIGdvRGVlcGVyKVxuICAgICAgKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS50YWdOYW1lKSA+IC0xKSB7XG4gICAgICAgIGlmIChlbmRDb250YWluZXIucGFyZW50Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZ29EZWVwZXIgJiYgbm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgZ29EZWVwZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICghZG9uZSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZXMgdGhhdCBoaWdobGlnaHRpbmcgaXMgZG9uZSB3aXRoIHVzZSBvZiB0aGUgc21hbGxlc3QgcG9zc2libGUgbnVtYmVyIG9mXG4gICAqIHdyYXBwaW5nIEhUTUwgZWxlbWVudHMuXG4gICAqIEZsYXR0ZW5zIGhpZ2hsaWdodHMgc3RydWN0dXJlIGFuZCBtZXJnZXMgc2libGluZyBoaWdobGlnaHRzLiBOb3JtYWxpemVzIHRleHQgbm9kZXMgd2l0aGluIGhpZ2hsaWdodHMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIHZhciBub3JtYWxpemVkSGlnaGxpZ2h0cztcblxuICAgIHRoaXMuZmxhdHRlbk5lc3RlZEhpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG4gICAgdGhpcy5tZXJnZVNpYmxpbmdIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBmbGF0dGVuLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGZsYXR0ZW5OZXN0ZWRIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgYWdhaW4sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZmxhdHRlbk9uY2UoKSB7XG4gICAgICBsZXQgYWdhaW4gPSBmYWxzZTtcblxuICAgICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsLCBpKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBobC5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgIHBhcmVudFByZXYgPSBwYXJlbnQucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgIHBhcmVudE5leHQgPSBwYXJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKHNlbGYuaXNIaWdobGlnaHQocGFyZW50LCBEQVRBX0FUVFIpKSB7XG4gICAgICAgICAgaWYgKCFoYXZlU2FtZUNvbG9yKHBhcmVudCwgaGwpKSB7XG4gICAgICAgICAgICBpZiAoIWhsLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICAgIGlmICghcGFyZW50TmV4dCkge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnROZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnROZXh0IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFobC5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnRQcmV2KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudFByZXYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50UHJldiB8fCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PSAzICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBsZXQgc3BhbmxlZnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyZW50LnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHBhcmVudC5hdHRyaWJ1dGVzW1RJTUVTVEFNUF9BVFRSXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgbGV0IHNwYW5yaWdodCA9IHNwYW5sZWZ0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgICBkb20oaGwucHJldmlvdXNTaWJsaW5nKS53cmFwKHNwYW5sZWZ0KTtcbiAgICAgICAgICAgICAgZG9tKGhsLm5leHRTaWJsaW5nKS53cmFwKHNwYW5yaWdodCk7XG5cbiAgICAgICAgICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGFyZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20obm9kZSkuaW5zZXJ0QmVmb3JlKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcGFyZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICBkb20ocGFyZW50KS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChobC5maXJzdENoaWxkLCBobCk7XG4gICAgICAgICAgICBoaWdobGlnaHRzW2ldID0gcGFyZW50O1xuICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhZ2FpbjtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICBhZ2FpbiA9IGZsYXR0ZW5PbmNlKCk7XG4gICAgfSB3aGlsZSAoYWdhaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMgYW5kIG5vcm1hbGl6ZXMgZGVzY2VuZGFudCB0ZXh0IG5vZGVzLlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjaGFuZ2VzIGlucHV0IGhpZ2hsaWdodHMgLSB0aGVpciBvcmRlciBhbmQgbnVtYmVyIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGNoYW5nZS5cbiAgICogQHBhcmFtIGhpZ2hsaWdodHNcbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBtZXJnZVNpYmxpbmdIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBzaG91bGRNZXJnZShjdXJyZW50LCBub2RlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlICYmXG4gICAgICAgIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgaGF2ZVNhbWVDb2xvcihjdXJyZW50LCBub2RlKSAmJlxuICAgICAgICBzZWxmLmlzSGlnaGxpZ2h0KG5vZGUsIERBVEFfQVRUUilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgdmFyIHByZXYgPSBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICBuZXh0ID0gaGlnaGxpZ2h0Lm5leHRTaWJsaW5nO1xuXG4gICAgICBpZiAoc2hvdWxkTWVyZ2UoaGlnaGxpZ2h0LCBwcmV2KSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS5wcmVwZW5kKHByZXYuY2hpbGROb2Rlcyk7XG4gICAgICAgIGRvbShwcmV2KS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG91bGRNZXJnZShoaWdobGlnaHQsIG5leHQpKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLmFwcGVuZChuZXh0LmNoaWxkTm9kZXMpO1xuICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgY3VycmVudCByYW5nZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBrZWVwUmFuZ2UgLSBEb24ndCByZW1vdmUgcmFuZ2UgYWZ0ZXIgaGlnaGxpZ2h0aW5nLiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb20odGhpcy5lbCkuZ2V0UmFuZ2UoKSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICBjcmVhdGVkSGlnaGxpZ2h0cyxcbiAgICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLFxuICAgICAgdGltZXN0YW1wO1xuXG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0KHJhbmdlKSA9PT0gdHJ1ZSkge1xuICAgICAgdGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG4gICAgICB3cmFwcGVyID0gY3JlYXRlV3JhcHBlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG5cbiAgICAgIGNyZWF0ZWRIaWdobGlnaHRzID0gdGhpcy5oaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcik7XG4gICAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhjcmVhdGVkSGlnaGxpZ2h0cyk7XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJBTFNERWJ1ZzI0OiBQcmltaXRpdm86IHRoaXMub3B0aW9uczogXCIsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgIFwiXFxuXFxuXFxuXFxuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KHJhbmdlLCBub3JtYWxpemVkSGlnaGxpZ2h0cywgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBpZiAoIWtlZXBSYW5nZSkge1xuICAgICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGhpZ2hsaWdodHMgZnJvbSBlbGVtZW50LiBJZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgaXQgaXMgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKiBJZiBubyBlbGVtZW50IGlzIGdpdmVuLCBhbGwgaGlnaGxpZ2h0cyBhbGwgcmVtb3ZlZC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2VsZW1lbnRdIC0gZWxlbWVudCB0byByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGVsZW1lbnQgfHwgdGhpcy5lbCxcbiAgICAgIGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoeyBjb250YWluZXI6IGNvbnRhaW5lciB9KSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gbWVyZ2VTaWJsaW5nVGV4dE5vZGVzKHRleHROb2RlKSB7XG4gICAgICB2YXIgcHJldiA9IHRleHROb2RlLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgbmV4dCA9IHRleHROb2RlLm5leHRTaWJsaW5nO1xuXG4gICAgICBpZiAocHJldiAmJiBwcmV2Lm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IHByZXYubm9kZVZhbHVlICsgdGV4dE5vZGUubm9kZVZhbHVlO1xuICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCAmJiBuZXh0Lm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IHRleHROb2RlLm5vZGVWYWx1ZSArIG5leHQubm9kZVZhbHVlO1xuICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KGhpZ2hsaWdodCkge1xuICAgICAgdmFyIHRleHROb2RlcyA9IGRvbShoaWdobGlnaHQpLnVud3JhcCgpO1xuXG4gICAgICB0ZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIG1lcmdlU2libGluZ1RleHROb2Rlcyhub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIHRydWUpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0KGhsKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZW1vdmVIaWdobGlnaHQoaGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0cyBmcm9tIGdpdmVuIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbcGFyYW1zLmNvbnRhaW5lcl0gLSByZXR1cm4gaGlnaGxpZ2h0cyBmcm9tIHRoaXMgZWxlbWVudC4gRGVmYXVsdDogdGhlIGVsZW1lbnQgdGhlXG4gICAqIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5hbmRTZWxmXSAtIGlmIHNldCB0byB0cnVlIGFuZCBjb250YWluZXIgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBhZGQgY29udGFpbmVyIHRvXG4gICAqIHJldHVybmVkIHJlc3VsdHMuIERlZmF1bHQ6IHRydWUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5ncm91cGVkXSAtIGlmIHNldCB0byB0cnVlLCBoaWdobGlnaHRzIGFyZSBncm91cGVkIGluIGxvZ2ljYWwgZ3JvdXBzIG9mIGhpZ2hsaWdodHMgYWRkZWRcbiAgICogaW4gdGhlIHNhbWUgbW9tZW50LiBFYWNoIGdyb3VwIGlzIGFuIG9iamVjdCB3aGljaCBoYXMgZ290IGFycmF5IG9mIGhpZ2hsaWdodHMsICd0b1N0cmluZycgbWV0aG9kIGFuZCAndGltZXN0YW1wJ1xuICAgKiBwcm9wZXJ0eS4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgY29uc3QgbWVyZ2VkUGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgZGF0YUF0dHI6IERBVEFfQVRUUixcbiAgICAgIHRpbWVzdGFtcEF0dHI6IFRJTUVTVEFNUF9BVFRSLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgICByZXR1cm4gcmV0cmlldmVIaWdobGlnaHRzKG1lcmdlZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGlzSGlnaGxpZ2h0KGVsLCBkYXRhQXR0cikge1xuICAgIHJldHVybiBpc0VsZW1lbnRIaWdobGlnaHQoZWwsIGRhdGFBdHRyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKCkge1xuICAgIGxldCBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKCksXG4gICAgICByZWZFbCA9IHRoaXMuZWwsXG4gICAgICBobERlc2NyaXB0b3JzID0gW107XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50UGF0aChlbCwgcmVmRWxlbWVudCkge1xuICAgICAgbGV0IHBhdGggPSBbXSxcbiAgICAgICAgY2hpbGROb2RlcztcblxuICAgICAgZG8ge1xuICAgICAgICBjaGlsZE5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWwucGFyZW50Tm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgcGF0aC51bnNoaWZ0KGNoaWxkTm9kZXMuaW5kZXhPZihlbCkpO1xuICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICB9IHdoaWxlIChlbCAhPT0gcmVmRWxlbWVudCB8fCAhZWwpO1xuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCBmYWxzZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMCwgLy8gSGwgb2Zmc2V0IGZyb20gcHJldmlvdXMgc2libGluZyB3aXRoaW4gcGFyZW50IG5vZGUuXG4gICAgICAgIGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIGhsUGF0aCA9IGdldEVsZW1lbnRQYXRoKGhpZ2hsaWdodCwgcmVmRWwpLFxuICAgICAgICB3cmFwcGVyID0gaGlnaGxpZ2h0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgd3JhcHBlciA9IHdyYXBwZXIub3V0ZXJIVE1MO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIG9mZnNldCA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBobERlc2NyaXB0b3JzLnB1c2goW1xuICAgICAgICB3cmFwcGVyLFxuICAgICAgICBoaWdobGlnaHQudGV4dENvbnRlbnQsXG4gICAgICAgIGhsUGF0aC5qb2luKFwiOlwiKSxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBsZW5ndGhcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhsRGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyBoaWdobGlnaHRzLlxuICAgKiBAdGhyb3dzIGV4Y2VwdGlvbiB3aGVuIGNhbid0IHBhcnNlIEpTT04gb3IgSlNPTiBoYXMgaW52YWxpZCBzdHJ1Y3R1cmUuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIC0gSlNPTiBvYmplY3Qgd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBkZXNlcmlhbGl6ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIGxldCBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbihobERlc2NyaXB0b3IpIHtcbiAgICAgIGxldCBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIHBhdGg6IGhsRGVzY3JpcHRvclsyXS5zcGxpdChcIjpcIiksXG4gICAgICAgICAgb2Zmc2V0OiBobERlc2NyaXB0b3JbM10sXG4gICAgICAgICAgbGVuZ3RoOiBobERlc2NyaXB0b3JbNF1cbiAgICAgICAgfSxcbiAgICAgICAgZWxJbmRleCA9IGhsLnBhdGgucG9wKCksXG4gICAgICAgIG5vZGUgPSBzZWxmLmVsLFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodCxcbiAgICAgICAgaWR4O1xuXG4gICAgICB3aGlsZSAoKGlkeCA9IGhsLnBhdGguc2hpZnQoKSkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tpZHhdO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4IC0gMV0gJiZcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXggLSAxXS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIGVsSW5kZXggLT0gMTtcbiAgICAgIH1cblxuICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4XTtcbiAgICAgIGhsTm9kZSA9IG5vZGUuc3BsaXRUZXh0KGhsLm9mZnNldCk7XG4gICAgICBobE5vZGUuc3BsaXRUZXh0KGhsLmxlbmd0aCk7XG5cbiAgICAgIGlmIChobE5vZGUubmV4dFNpYmxpbmcgJiYgIWhsTm9kZS5uZXh0U2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5uZXh0U2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChobE5vZGUucHJldmlvdXNTaWJsaW5nICYmICFobE5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLnByZXZpb3VzU2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGhpZ2hsaWdodCA9IGRvbShobE5vZGUpLndyYXAoZG9tKCkuZnJvbUhUTUwoaGwud3JhcHBlcilbMF0pO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfVxuXG4gICAgaGxEZXNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGhsRGVzY3JpcHRvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVzZXJpYWxpemF0aW9uRm4oaGxEZXNjcmlwdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZGVzZXJpYWxpemUgaGlnaGxpZ2h0IGRlc2NyaXB0b3IuIENhdXNlOiBcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcmltaXRpdm9IaWdobGlnaHRlcjtcbiIsIi8qIGdsb2JhbCBqUXVlcnkgVGV4dEhpZ2hsaWdodGVyICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIChmdW5jdGlvbigkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zdCBQTFVHSU5fTkFNRSA9IFwidGV4dEhpZ2hsaWdodGVyXCI7XG5cbiAgICBmdW5jdGlvbiB3cmFwKGZuLCB3cmFwcGVyKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHdyYXBwZXIuY2FsbCh0aGlzLCBmbik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBqUXVlcnkgcGx1Z2luIG5hbWVzcGFjZS5cbiAgICAgKiBAZXh0ZXJuYWwgXCJqUXVlcnkuZm5cIlxuICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kb2NzLmpxdWVyeS5jb20vUGx1Z2lucy9BdXRob3JpbmcgVGhlIGpRdWVyeSBQbHVnaW4gR3VpZGV9XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBhbmQgYXBwbGllcyBpdCB0byB0aGUgZ2l2ZW4galF1ZXJ5IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBTYW1lIGFzIHtAbGluayBUZXh0SGlnaGxpZ2h0ZXJ9IG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge2pRdWVyeX1cbiAgICAgKiBAZXhhbXBsZSAkKCcjc2FuZGJveCcpLnRleHRIaWdobGlnaHRlcih7IGNvbG9yOiAncmVkJyB9KTtcbiAgICAgKiBAZnVuY3Rpb24gZXh0ZXJuYWw6XCJqUXVlcnkuZm5cIi50ZXh0SGlnaGxpZ2h0ZXJcbiAgICAgKi9cbiAgICAkLmZuLnRleHRIaWdobGlnaHRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbCA9IHRoaXMsXG4gICAgICAgICAgaGw7XG5cbiAgICAgICAgaWYgKCEkLmRhdGEoZWwsIFBMVUdJTl9OQU1FKSkge1xuICAgICAgICAgIGhsID0gbmV3IFRleHRIaWdobGlnaHRlcihlbCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICBobC5kZXN0cm95ID0gd3JhcChobC5kZXN0cm95LCBmdW5jdGlvbihkZXN0cm95KSB7XG4gICAgICAgICAgICBkZXN0cm95LmNhbGwoaGwpO1xuICAgICAgICAgICAgJChlbCkucmVtb3ZlRGF0YShQTFVHSU5fTkFNRSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkLmRhdGEoZWwsIFBMVUdJTl9OQU1FLCBobCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmZuLmdldEhpZ2hsaWdodGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhKFBMVUdJTl9OQU1FKTtcbiAgICB9O1xuICB9KShqUXVlcnkpO1xufVxuIiwiaW1wb3J0IGRvbSBmcm9tIFwiLi91dGlscy9kb21cIjtcbmltcG9ydCB7IGJpbmRFdmVudHMsIHVuYmluZEV2ZW50cyB9IGZyb20gXCIuL3V0aWxzL2V2ZW50c1wiO1xuaW1wb3J0IFByaW1pdGl2byBmcm9tIFwiLi9oaWdobGlnaHRlcnMvcHJpbWl0aXZvXCI7XG5pbXBvcnQgSW5kZXBlbmRlbmNpYSBmcm9tIFwiLi9oaWdobGlnaHRlcnMvaW5kZXBlbmRlbmNpYVwiO1xuaW1wb3J0IHsgVElNRVNUQU1QX0FUVFIsIERBVEFfQVRUUiB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgY3JlYXRlV3JhcHBlciB9IGZyb20gXCIuL3V0aWxzL2hpZ2hsaWdodHNcIjtcblxuY29uc3QgaGlnaGxpZ2h0ZXJzID0ge1xuICBwcmltaXRpdm86IFByaW1pdGl2byxcbiAgXCJ2MS0yMDE0XCI6IFByaW1pdGl2byxcbiAgaW5kZXBlbmRlbmNpYTogSW5kZXBlbmRlbmNpYSxcbiAgXCJ2Mi0yMDE5XCI6IEluZGVwZW5kZW5jaWFcbn07XG5cbi8qKlxuICogVGV4dEhpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHMuXG4gKi9cbmNsYXNzIFRleHRIaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIHdyYXBwZXIgZm9yIGhpZ2hsaWdodHMuXG4gICAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAgICogaW4gY29uc3RydWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gdGhlIHNhbWUgb2JqZWN0IGFzIGluIFRleHRIaWdobGlnaHRlciBjb25zdHJ1Y3Rvci5cbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZVdyYXBwZXIob3B0aW9ucykge1xuICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGFuZCBiaW5kcyB0byBnaXZlbiBET00gZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnZlcnNpb24gLSBUaGUgdmVyc2lvbiBvZiB0aGUgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byB1c2UuXG4gICAqIFRoZXJlIGFyZSB0d28gb3B0aW9uczpcbiAgICogICBwcmltaXRpdm8gKHYxLTIwMTQpIGlzIGZvciB0aGUgaW5pdGlhbCBpbXBsZW1lbnRhdGlvbiB1c2luZyBpbnRlcmRlcGVuZGVudCBoaWdobGlnaHQgbG9jYXRvcnMuXG4gICAqICAgKExvdHMgb2YgaXNzdWVzIGZvciByZXF1aXJlbWVudHMgYmV5b25kIHNpbXBsZSBhbGwgb3Igbm90aGluZyBoaWdobGlnaHRzKVxuICAgKlxuICAgKiAgIGluZGVwZW5kZW5jaWEgKHYyLTIwMTkpIGlzIGZvciBhbiBpbXByb3ZlZCBpbXBsZW1lbnRhdGlvbiBmb2N1c2luZyBvbiBtYWtpbmcgaGlnaGxpZ2h0cyBpbmRlcGVuZGVudFxuICAgKiAgIGZyb20gZWFjaG90aGVyIGFuZCBvdGhlciBlbGVtZW50IG5vZGVzIHdpdGhpbiB0aGUgY29udGV4dCBET00gb2JqZWN0LiB2MiB1c2VzIGRhdGEgYXR0cmlidXRlc1xuICAgKiAgIGFzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggYWJvdXQgdGhlIHRleHQgcmFuZ2Ugc2VsZWN0ZWQgdG8gY3JlYXRlIHRoZSBvcmlnaW5hbCBoaWdobGlnaHQuXG4gICAqICAgVGhpcyBhbGxvd3MgdXMgZnJlZWRvbSB0byBtYW5pcHVsYXRlIHRoZSBET00gYXQgd2lsbCBhbmQgaGFuZGxlIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMgYSBsb3QgYmV0dGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb2xvciAtIGhpZ2hsaWdodCBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGhpZ2hsaWdodCwgJ2hpZ2hsaWdodGVkJyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb250ZXh0Q2xhc3MgLSBjbGFzcyBhZGRlZCB0byBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQsXG4gICAqICAnaGlnaGxpZ2h0ZXItY29udGV4dCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIHJlbW92ZWQuIEhpZ2hsaWdodCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgaWYgaGlnaGxpZ2h0IHNob3VsZCBiZSByZW1vdmVkLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgcmVtb3ZhbC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIFJhbmdlIG9iamVjdCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gY29udGludWUgcHJvY2Vzc2luZywgb3IgZmFsc2UgLSB0byBwcmV2ZW50IGhpZ2hsaWdodGluZy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGFmdGVyIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBBcnJheSBvZiBjcmVhdGVkXG4gICAqIHdyYXBwZXJzIGlzIHBhc3NlZCBhcyBwYXJhbS5cbiAgICogQGNsYXNzIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBhbmNob3IgZWxlbWVudFwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBjb2xvcjogXCIjZmZmZjdiXCIsXG4gICAgICBoaWdobGlnaHRlZENsYXNzOiBcImhpZ2hsaWdodGVkXCIsXG4gICAgICBjb250ZXh0Q2xhc3M6IFwiaGlnaGxpZ2h0ZXItY29udGV4dFwiLFxuICAgICAgdmVyc2lvbjogXCJpbmRlcGVuZGVuY2lhXCIsXG4gICAgICBvblJlbW92ZUhpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIG9uQmVmb3JlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25BZnRlckhpZ2hsaWdodDogZnVuY3Rpb24oKSB7fSxcbiAgICAgIC4uLm9wdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBcIlxcblxcblxcblxcbkFMU0RFYnVnMjQ6IFRleHRIaWdobGlnaHRlcjogb3B0aW9ucyBjb25zdHJ1Y3RvciBwYXJhbTogXCIsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhcIkFMU0RFYnVnMjQ6IFRleHRIaWdobGlnaHRlcjogdGhpcy5vcHRpb25zOiBcIiwgdGhpcy5vcHRpb25zKTtcblxuICAgIGlmICghaGlnaGxpZ2h0ZXJzW3RoaXMub3B0aW9ucy52ZXJzaW9uXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgdmVyc2lvbiBvZiB0aGUgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eVwiXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSBuZXcgaGlnaGxpZ2h0ZXJzW3RoaXMub3B0aW9ucy52ZXJzaW9uXShcbiAgICAgIHRoaXMuZWwsXG4gICAgICB0aGlzLm9wdGlvbnNcbiAgICApO1xuXG4gICAgZG9tKHRoaXMuZWwpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICAgIGJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWFuZW50bHkgZGlzYWJsZXMgaGlnaGxpZ2h0aW5nLlxuICAgKiBVbmJpbmRzIGV2ZW50cyBhbmQgcmVtb3ZlIGNvbnRleHQgZWxlbWVudCBjbGFzcy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB1bmJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICB9XG5cbiAgaGlnaGxpZ2h0SGFuZGxlcigpIHtcbiAgICB0aGlzLmRvSGlnaGxpZ2h0KCk7XG4gIH1cblxuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICB0aGlzLmhpZ2hsaWdodGVyLmRvSGlnaGxpZ2h0KGtlZXBSYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyByYW5nZS5cbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlIGF0IGxlYXN0IHRleHQgbm9kZXMgYXJlIG5vcm1hbGl6ZWQsIGNhcnJpZXMgb3V0IHNvbWUgZmxhdHRlbmluZyBhbmQgbmVzdGluZ1xuICAgKiB3aGVyZSBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5ub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaGlnaGxpZ2h0aW5nIGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB2YWxpZCBDU1MgY29sb3IuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5vcHRpb25zLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRpbmcgY29sb3IuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYWxsIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICB0aGlzLmhpZ2hsaWdodGVyLnJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKiBBbGwgaGlnaGxpZ2h0cyBoYXZlICdkYXRhLWhpZ2hsaWdodGVkJyBhdHRyaWJ1dGUuXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmlzSGlnaGxpZ2h0KGVsLCBEQVRBX0FUVFIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIHRoZSBpZCBpcyBub3QgdXNlZCBpbiB0aGUgaW5pdGlhbCB2ZXJzaW9uIG9mIHRoZSBoaWdobGlnaHRlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gVGhlIHVuaXF1ZSBpZGVudGlmaWVyIGdyb3VwaW5nIGEgc2V0IG9mIGhpZ2hsaWdodCBlbGVtZW50cyB0b2dldGhlci5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5zZXJpYWxpemVIaWdobGlnaHRzKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBoaWdobGlnaHRzIGdpdmVuIHRleHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGV4dCB0byBzZWFyY2ggZm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nhc2VTZW5zaXRpdmVdIC0gaWYgc2V0IHRvIHRydWUsIHBlcmZvcm1zIGNhc2Ugc2Vuc2l0aXZlIHNlYXJjaCAoZGVmYXVsdDogdHJ1ZSlcbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZmluZCh0ZXh0LCBjYXNlU2Vuc2l0aXZlKSB7XG4gICAgbGV0IHduZCA9IGRvbSh0aGlzLmVsKS5nZXRXaW5kb3coKSxcbiAgICAgIHNjcm9sbFggPSB3bmQuc2Nyb2xsWCxcbiAgICAgIHNjcm9sbFkgPSB3bmQuc2Nyb2xsWSxcbiAgICAgIGNhc2VTZW5zID0gdHlwZW9mIGNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2FzZVNlbnNpdGl2ZTtcblxuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcblxuICAgIGlmICh3bmQuZmluZCkge1xuICAgICAgd2hpbGUgKHduZC5maW5kKHRleHQsIGNhc2VTZW5zKSkge1xuICAgICAgICB0aGlzLmRvSGlnaGxpZ2h0KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBsZXQgdGV4dFJhbmdlID0gd25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQodGhpcy5lbCk7XG4gICAgICB3aGlsZSAodGV4dFJhbmdlLmZpbmRUZXh0KHRleHQsIDEsIGNhc2VTZW5zID8gNCA6IDApKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZG9tKHRoaXMuZWwpLmNvbnRhaW5zKHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkpICYmXG4gICAgICAgICAgdGV4dFJhbmdlLnBhcmVudEVsZW1lbnQoKSAhPT0gdGhpcy5lbFxuICAgICAgICApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgd25kLnNjcm9sbFRvKHNjcm9sbFgsIHNjcm9sbFkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRIaWdobGlnaHRlcjtcbiIsIi8qKlxuICogUmV0dXJucyBhcnJheSB3aXRob3V0IGR1cGxpY2F0ZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpZHgsIHNlbGYpIHtcbiAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaWR4O1xuICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBOT0RFX1RZUEUgPSB7IEVMRU1FTlRfTk9ERTogMSwgVEVYVF9OT0RFOiAzIH07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFrZSBET00gbWFuaXB1bGF0aW9uIGVhc2llci5cbiAqIEBwYXJhbSB7Tm9kZXxIVE1MRWxlbWVudH0gW2VsXSAtIGJhc2UgRE9NIGVsZW1lbnQgdG8gbWFuaXB1bGF0ZVxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuY29uc3QgZG9tID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIC8qKiBAbGVuZHMgZG9tICoqLyB7XG4gICAgLyoqXG4gICAgICogQWRkcyBjbGFzcyB0byBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxiKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXGJ8JClcIiwgXCJnaVwiKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9QcmVwZW5kXG4gICAgICovXG4gICAgcHJlcGVuZDogZnVuY3Rpb24obm9kZXNUb1ByZXBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9QcmVwZW5kKSxcbiAgICAgICAgaSA9IG5vZGVzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbC5pbnNlcnRCZWZvcmUobm9kZXNbaV0sIGVsLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIGNoaWxkIG5vZGVzIHRvIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge05vZGVbXX0gbm9kZXNUb0FwcGVuZFxuICAgICAqL1xuICAgIGFwcGVuZDogZnVuY3Rpb24obm9kZXNUb0FwcGVuZCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXNUb0FwcGVuZCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGFmdGVyIHJlZkVsLlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcmVmRWwgLSBub2RlIGFmdGVyIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbC5uZXh0U2libGluZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGJlZm9yZSByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBiZWZvcmUgd2hpY2ggYmFzZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gLSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICovXG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYmFzZSBlbGVtZW50IGZyb20gRE9NLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIGVsID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIGJhc2UgZWxlbWVudCBjb250YWlucyBnaXZlbiBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IGNoaWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gZWwgIT09IGNoaWxkICYmIGVsLmNvbnRhaW5zKGNoaWxkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYmFzZSBlbGVtZW50IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKi9cbiAgICB3cmFwOiBmdW5jdGlvbih3cmFwcGVyKSB7XG4gICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgICB9XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVud3JhcHMgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtOb2RlW119IC0gY2hpbGQgbm9kZXMgb2YgdW53cmFwcGVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW53cmFwOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLmNoaWxkTm9kZXMpLFxuICAgICAgICB3cmFwcGVyO1xuXG4gICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgd3JhcHBlciA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZG9tKG5vZGUpLmluc2VydEJlZm9yZShub2RlLnBhcmVudE5vZGUpO1xuICAgICAgfSk7XG4gICAgICBkb20od3JhcHBlcikucmVtb3ZlKCk7XG5cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cy5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwYXJlbnQsXG4gICAgICAgIHBhdGggPSBbXTtcblxuICAgICAgd2hpbGUgKChwYXJlbnQgPSBlbC5wYXJlbnROb2RlKSkge1xuICAgICAgICBwYXRoLnB1c2gocGFyZW50KTtcbiAgICAgICAgZWwgPSBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGJhc2UgZWxlbWVudCBwYXJlbnRzLCBleGNsdWRpbmcgdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHBhcmVudHNXaXRob3V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50cygpLmZpbHRlcihlbGVtID0+IGVsZW0gIT09IGRvY3VtZW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplcyB0ZXh0IG5vZGVzIHdpdGhpbiBiYXNlIGVsZW1lbnQsIGllLiBtZXJnZXMgc2libGluZyB0ZXh0IG5vZGVzIGFuZCBhc3N1cmVzIHRoYXQgZXZlcnlcbiAgICAgKiBlbGVtZW50IG5vZGUgaGFzIG9ubHkgb25lIHRleHQgbm9kZS5cbiAgICAgKiBJdCBzaG91bGQgZG9lcyB0aGUgc2FtZSBhcyBzdGFuZGFyZCBlbGVtZW50Lm5vcm1hbGl6ZSwgYnV0IElFIGltcGxlbWVudHMgaXQgaW5jb3JyZWN0bHkuXG4gICAgICovXG4gICAgbm9ybWFsaXplVGV4dE5vZGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgZWwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICAgKSB7XG4gICAgICAgICAgZWwubm9kZVZhbHVlICs9IGVsLm5leHRTaWJsaW5nLm5vZGVWYWx1ZTtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9tKGVsLmZpcnN0Q2hpbGQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgICAgfVxuICAgICAgZG9tKGVsLm5leHRTaWJsaW5nKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBlbGVtZW50IGJhY2tncm91bmQgY29sb3IuXG4gICAgICogQHJldHVybnMge0NTU1N0eWxlRGVjbGFyYXRpb24uYmFja2dyb3VuZENvbG9yfVxuICAgICAqL1xuICAgIGNvbG9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgZG9tIGVsZW1lbnQgZnJvbSBnaXZlbiBodG1sIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgICAqIEByZXR1cm5zIHtOb2RlTGlzdH1cbiAgICAgKi9cbiAgICBmcm9tSFRNTDogZnVuY3Rpb24oaHRtbCkge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgIHJldHVybiBkaXYuY2hpbGROb2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBmaXJzdCByYW5nZSBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7UmFuZ2V9XG4gICAgICovXG4gICAgZ2V0UmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCksXG4gICAgICAgIHJhbmdlO1xuXG4gICAgICBpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgcmFuZ2VzIG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqL1xuICAgIHJlbW92ZUFsbFJhbmdlczogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZG9tKGVsKS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBzZWxlY3Rpb24gb2JqZWN0IG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtTZWxlY3Rpb259XG4gICAgICovXG4gICAgZ2V0U2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpXG4gICAgICAgIC5nZXRXaW5kb3coKVxuICAgICAgICAuZ2V0U2VsZWN0aW9uKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2luZG93IG9mIHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1dpbmRvd31cbiAgICAgKi9cbiAgICBnZXRXaW5kb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRvbShlbCkuZ2V0RG9jdW1lbnQoKS5kZWZhdWx0VmlldztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkb2N1bWVudCBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRG9jdW1lbnR9XG4gICAgICovXG4gICAgZ2V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gaWYgb3duZXJEb2N1bWVudCBpcyBudWxsIHRoZW4gZWwgaXMgdGhlIGRvY3VtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiBlbC5vd25lckRvY3VtZW50IHx8IGVsO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBwcm92aWRlZCBlbGVtZW50IGNvbWVzIGFmdGVyIHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvdGhlckVsZW1lbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uKG90aGVyRWxlbWVudCwgcm9vdEVsZW1lbnQpIHtcbiAgICAgIGxldCBzaWJsaW5nID0gZWwubmV4dFNpYmxpbmc7XG4gICAgICBsZXQgaXNBZnRlciA9IGZhbHNlO1xuICAgICAgd2hpbGUgKHNpYmxpbmcgJiYgIWlzQWZ0ZXIpIHtcbiAgICAgICAgaWYgKHNpYmxpbmcgPT09IG90aGVyRWxlbWVudCkge1xuICAgICAgICAgIGlzQWZ0ZXIgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghc2libGluZy5uZXh0U2libGluZykge1xuICAgICAgICAgICAgc2libGluZyA9IGVsLnBhcmVudE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nLm5leHRTaWJsaW5nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlzQWZ0ZXI7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGJpbmRFdmVudHMoZWwsIHNjb3BlKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmJpbmRFdmVudHMoZWwsIHNjb3BlKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG59XG4iLCJpbXBvcnQgZG9tLCB7IE5PREVfVFlQRSB9IGZyb20gXCIuL2RvbVwiO1xuaW1wb3J0IHsgU1RBUlRfT0ZGU0VUX0FUVFIsIEVORF9PRkZTRVRfQVRUUiwgREFUQV9BVFRSIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuXG4vKipcbiAqIFRha2VzIHJhbmdlIG9iamVjdCBhcyBwYXJhbWV0ZXIgYW5kIHJlZmluZXMgaXQgYm91bmRhcmllc1xuICogQHBhcmFtIHJhbmdlXG4gKiBAcmV0dXJucyB7b2JqZWN0fSByZWZpbmVkIGJvdW5kYXJpZXMgYW5kIGluaXRpYWwgc3RhdGUgb2YgaGlnaGxpZ2h0aW5nIGFsZ29yaXRobS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZmluZVJhbmdlQm91bmRhcmllcyhyYW5nZSkge1xuICBsZXQgc3RhcnRDb250YWluZXIgPSByYW5nZS5zdGFydENvbnRhaW5lcixcbiAgICBlbmRDb250YWluZXIgPSByYW5nZS5lbmRDb250YWluZXIsXG4gICAgYW5jZXN0b3IgPSByYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcixcbiAgICBnb0RlZXBlciA9IHRydWU7XG5cbiAgaWYgKHJhbmdlLmVuZE9mZnNldCA9PT0gMCkge1xuICAgIHdoaWxlIChcbiAgICAgICFlbmRDb250YWluZXIucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICBlbmRDb250YWluZXIucGFyZW50Tm9kZSAhPT0gYW5jZXN0b3JcbiAgICApIHtcbiAgICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5wYXJlbnROb2RlO1xuICAgIH1cbiAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIucHJldmlvdXNTaWJsaW5nO1xuICB9IGVsc2UgaWYgKGVuZENvbnRhaW5lci5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgIGlmIChyYW5nZS5lbmRPZmZzZXQgPCBlbmRDb250YWluZXIubm9kZVZhbHVlLmxlbmd0aCkge1xuICAgICAgZW5kQ29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5lbmRPZmZzZXQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChyYW5nZS5lbmRPZmZzZXQgPiAwKSB7XG4gICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLmNoaWxkTm9kZXMuaXRlbShyYW5nZS5lbmRPZmZzZXQgLSAxKTtcbiAgfVxuXG4gIGlmIChzdGFydENvbnRhaW5lci5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgIGlmIChyYW5nZS5zdGFydE9mZnNldCA9PT0gc3RhcnRDb250YWluZXIubm9kZVZhbHVlLmxlbmd0aCkge1xuICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHJhbmdlLnN0YXJ0T2Zmc2V0ID4gMCkge1xuICAgICAgc3RhcnRDb250YWluZXIgPSBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgaWYgKGVuZENvbnRhaW5lciA9PT0gc3RhcnRDb250YWluZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGVuZENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChyYW5nZS5zdGFydE9mZnNldCA8IHN0YXJ0Q29udGFpbmVyLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgc3RhcnRDb250YWluZXIgPSBzdGFydENvbnRhaW5lci5jaGlsZE5vZGVzLml0ZW0ocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIubmV4dFNpYmxpbmc7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0Q29udGFpbmVyOiBzdGFydENvbnRhaW5lcixcbiAgICBlbmRDb250YWluZXI6IGVuZENvbnRhaW5lcixcbiAgICBnb0RlZXBlcjogZ29EZWVwZXJcbiAgfTtcbn1cblxuLyoqXG4gKiBTb3J0cyBhcnJheSBvZiBET00gZWxlbWVudHMgYnkgaXRzIGRlcHRoIGluIERPTSB0cmVlLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudFtdfSBhcnIgLSBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtib29sZWFufSBkZXNjZW5kaW5nIC0gb3JkZXIgb2Ygc29ydC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRCeURlcHRoKGFyciwgZGVzY2VuZGluZykge1xuICBhcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGRvbShkZXNjZW5kaW5nID8gYiA6IGEpLnBhcmVudHMoKS5sZW5ndGggLVxuICAgICAgZG9tKGRlc2NlbmRpbmcgPyBhIDogYikucGFyZW50cygpLmxlbmd0aFxuICAgICk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50cyBhIGkgYiBoYXZlIHRoZSBzYW1lIGNvbG9yLlxuICogQHBhcmFtIHtOb2RlfSBhXG4gKiBAcGFyYW0ge05vZGV9IGJcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGF2ZVNhbWVDb2xvcihhLCBiKSB7XG4gIHJldHVybiBkb20oYSkuY29sb3IoKSA9PT0gZG9tKGIpLmNvbG9yKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB3cmFwcGVyIGZvciBoaWdobGlnaHRzLlxuICogVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGNhbGxzIHRoaXMgbWV0aG9kIGVhY2ggdGltZSBpdCBuZWVkcyB0byBjcmVhdGUgaGlnaGxpZ2h0cyBhbmQgcGFzcyBvcHRpb25zIHJldHJpZXZlZFxuICogaW4gY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIHRoZSBzYW1lIG9iamVjdCBhcyBpbiBUZXh0SGlnaGxpZ2h0ZXIgY29uc3RydWN0b3IuXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXcmFwcGVyKG9wdGlvbnMpIHtcbiAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgc3Bhbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICBzcGFuLmNsYXNzTmFtZSA9IG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcztcbiAgcmV0dXJuIHNwYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGV4dE5vZGVBdExvY2F0aW9uKGVsZW1lbnQsIGxvY2F0aW9uSW5DaGlsZE5vZGVzKSB7XG4gIGNvbnNvbGUubG9nKFwiRWxlbWVudCBhcyBwYXJhbWV0ZXI6IFwiLCBlbGVtZW50KTtcbiAgbGV0IHRleHROb2RlRWxlbWVudCA9IGVsZW1lbnQ7XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKHRleHROb2RlRWxlbWVudCAmJiB0ZXh0Tm9kZUVsZW1lbnQubm9kZVR5cGUgIT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBjb25zb2xlLmxvZyhgdGV4dE5vZGVFbGVtZW50IHN0ZXAgJHtpfWAsIHRleHROb2RlRWxlbWVudCk7XG4gICAgaWYgKGxvY2F0aW9uSW5DaGlsZE5vZGVzID09PSBcInN0YXJ0XCIpIHtcbiAgICAgIGlmICh0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50Lm5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobG9jYXRpb25JbkNoaWxkTm9kZXMgPT09IFwiZW5kXCIpIHtcbiAgICAgIGlmICh0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBsYXN0SW5kZXggPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlc1tsYXN0SW5kZXhdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LnByZXZpb3VzU2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dE5vZGVFbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gICAgaSsrO1xuICB9XG5cbiAgY29uc29sZS5sb2coXCJ0ZXh0IG5vZGUgZWxlbWVudCByZXR1cm5lZDogXCIsIHRleHROb2RlRWxlbWVudCk7XG4gIHJldHVybiB0ZXh0Tm9kZUVsZW1lbnQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXJlIHRvIGluamVjdCBhIGhpZ2hsaWdodCBiYXNlZCBvbiBpdCdzIG9mZnNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGhpZ2hsaWdodFxuICogQHBhcmFtIHsqfSBwYXJlbnROb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTm9kZUFuZE9mZnNldChoaWdobGlnaHQsIHBhcmVudE5vZGUpIHtcbiAgbGV0IGN1cnJlbnROb2RlID0gcGFyZW50Tm9kZTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSAwO1xuICBsZXQgb2Zmc2V0V2l0aGluTm9kZSA9IDA7XG4gIGxldCBsb2NhdGlvbkZvdW5kID0gZmFsc2U7XG5cbiAgd2hpbGUgKFxuICAgIGN1cnJlbnROb2RlICYmXG4gICAgIWxvY2F0aW9uRm91bmQgJiZcbiAgICAoY3VycmVudE9mZnNldCA8IGhpZ2hsaWdodC5vZmZzZXQgfHxcbiAgICAgIChjdXJyZW50T2Zmc2V0ID09PSBoaWdobGlnaHQub2Zmc2V0ICYmIGN1cnJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkpXG4gICkge1xuICAgIGNvbnN0IGVuZE9mTm9kZU9mZnNldCA9IGN1cnJlbnRPZmZzZXQgKyBjdXJyZW50Tm9kZS50ZXh0Q29udGVudC5sZW5ndGg7XG5cbiAgICBpZiAoZW5kT2ZOb2RlT2Zmc2V0ID4gaGlnaGxpZ2h0Lm9mZnNldCkge1xuICAgICAgaWYgKGN1cnJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG9mZnNldFdpdGhpbk5vZGUgPSBoaWdobGlnaHQub2Zmc2V0IC0gY3VycmVudE9mZnNldDtcbiAgICAgICAgbG9jYXRpb25Gb3VuZCA9IHRydWU7XG4gICAgICAgIGN1cnJlbnRPZmZzZXQgPSBjdXJyZW50T2Zmc2V0ICsgb2Zmc2V0V2l0aGluTm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUuY2hpbGROb2Rlc1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE9mZnNldCA9IGVuZE9mTm9kZU9mZnNldDtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgbm9kZTogY3VycmVudE5vZGUsIG9mZnNldDogb2Zmc2V0V2l0aGluTm9kZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudE9mZnNldChjaGlsZEVsZW1lbnQsIHJvb3RFbGVtZW50KSB7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBsZXQgY2hpbGROb2RlcztcblxuICBsZXQgY3VycmVudEVsZW1lbnQgPSBjaGlsZEVsZW1lbnQ7XG4gIGRvIHtcbiAgICBjaGlsZE5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICBjdXJyZW50RWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXNcbiAgICApO1xuICAgIGNvbnN0IGNoaWxkRWxlbWVudEluZGV4ID0gY2hpbGROb2Rlcy5pbmRleE9mKGN1cnJlbnRFbGVtZW50KTtcbiAgICBjb25zdCBvZmZzZXRJbkN1cnJlbnRQYXJlbnQgPSBnZXRUZXh0T2Zmc2V0QmVmb3JlKFxuICAgICAgY2hpbGROb2RlcyxcbiAgICAgIGNoaWxkRWxlbWVudEluZGV4XG4gICAgKTtcbiAgICBvZmZzZXQgKz0gb2Zmc2V0SW5DdXJyZW50UGFyZW50O1xuICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZTtcbiAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQgIT09IHJvb3RFbGVtZW50IHx8ICFjdXJyZW50RWxlbWVudCk7XG5cbiAgcmV0dXJuIG9mZnNldDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dE9mZnNldEJlZm9yZShjaGlsZE5vZGVzLCBjdXRJbmRleCkge1xuICBsZXQgdGV4dE9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0SW5kZXg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gY2hpbGROb2Rlc1tpXTtcbiAgICAvLyBVc2UgdGV4dENvbnRlbnQgYW5kIG5vdCBpbm5lckhUTUwgdG8gYWNjb3VudCBmb3IgaW52aXNpYmxlIGNoYXJhY3RlcnMgYXMgd2VsbC5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS90ZXh0Q29udGVudFxuICAgIGNvbnN0IHRleHQgPSBjdXJyZW50Tm9kZS50ZXh0Q29udGVudDtcbiAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRleHRPZmZzZXQgKz0gdGV4dC5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiB0ZXh0T2Zmc2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KGVsZW1lbnRzKSB7XG4gIGxldCBjaGlsZEVsZW1lbnQgPSBlbGVtZW50cy5jaGlsZEVsZW1lbnQ7XG4gIGxldCBvdGhlckVsZW1lbnQgPSBlbGVtZW50cy5vdGhlckVsZW1lbnQ7XG4gIGxldCBwYXJlbnRzID0gZG9tKGNoaWxkRWxlbWVudCkucGFyZW50c1dpdGhvdXREb2N1bWVudCgpO1xuICBsZXQgaSA9IDA7XG4gIGxldCBmaXJzdE5vblNoYXJlZFBhcmVudCA9IG51bGw7XG4gIGxldCBhbGxQYXJlbnRzQXJlU2hhcmVkID0gZmFsc2U7XG4gIHdoaWxlICghZmlyc3ROb25TaGFyZWRQYXJlbnQgJiYgIWFsbFBhcmVudHNBcmVTaGFyZWQgJiYgaSA8IHBhcmVudHMubGVuZ3RoKSB7XG4gICAgY29uc3QgY3VycmVudFBhcmVudCA9IHBhcmVudHNbaV07XG5cbiAgICBpZiAoY3VycmVudFBhcmVudC5jb250YWlucyhvdGhlckVsZW1lbnQpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRQYXJlbnQgY29udGFpbnMgb3RoZXIgZWxlbWVudCFcIiwgY3VycmVudFBhcmVudCk7XG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBwYXJlbnRzW2kgLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsbFBhcmVudHNBcmVTaGFyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpKys7XG4gIH1cblxuICByZXR1cm4gZmlyc3ROb25TaGFyZWRQYXJlbnQ7XG59XG5cbmNvbnN0IHNpYmxpbmdSZW1vdmFsRGlyZWN0aW9ucyA9IHtcbiAgc3RhcnQ6IFwicHJldmlvdXNTaWJsaW5nXCIsXG4gIGVuZDogXCJuZXh0U2libGluZ1wiXG59O1xuXG5jb25zdCBzaWJsaW5nVGV4dE5vZGVNZXJnZURpcmVjdGlvbnMgPSB7XG4gIHN0YXJ0OiBcIm5leHRTaWJsaW5nXCIsXG4gIGVuZDogXCJwcmV2aW91c1NpYmxpbmdcIlxufTtcblxuZnVuY3Rpb24gcmVtb3ZlU2libGluZ3NJbkRpcmVjdGlvbihzdGFydE5vZGUsIGRpcmVjdGlvbikge1xuICBsZXQgc2libGluZyA9IHN0YXJ0Tm9kZVtkaXJlY3Rpb25dO1xuICB3aGlsZSAoc2libGluZykge1xuICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNpYmxpbmcpO1xuICAgIHNpYmxpbmcgPSBzaWJsaW5nW2RpcmVjdGlvbl07XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZXMgdGhlIHRleHQgb2YgYWxsIHNpYmxpbmcgdGV4dCBub2RlcyB3aXRoIHRoZSBzdGFydCBub2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YXJ0Tm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvblxuICovXG5mdW5jdGlvbiBtZXJnZVNpYmxpbmdUZXh0Tm9kZXNJbkRpcmVjdGlvbihzdGFydE5vZGUsIGRpcmVjdGlvbikge1xuICBsZXQgc2libGluZyA9IHN0YXJ0Tm9kZVtkaXJlY3Rpb25dO1xuICB3aGlsZSAoc2libGluZykge1xuICAgIGlmIChzaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICBzdGFydE5vZGUudGV4dENvbnRlbnQgKz0gc2libGluZy50ZXh0Q29udGVudDtcbiAgICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNpYmxpbmcpO1xuICAgICAgc2libGluZyA9IHNpYmxpbmdbZGlyZWN0aW9uXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodChwYXJhbXMpIHtcbiAgbGV0IGVsZW1lbnQgPSBwYXJhbXMuZWxlbWVudDtcbiAgbGV0IGVsZW1lbnRBbmNlc3RvciA9IHBhcmFtcy5lbGVtZW50QW5jZXN0b3I7XG4gIGxldCBvcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XG4gIGxldCBsb2NhdGlvbkluU2VsZWN0aW9uID0gcGFyYW1zLmxvY2F0aW9uSW5TZWxlY3Rpb247XG5cbiAgbGV0IGVsZW1lbnRBbmNlc3RvckNvcHkgPSBlbGVtZW50QW5jZXN0b3IuY2xvbmVOb2RlKHRydWUpO1xuXG4gIC8vIEJlZ2lubmluZyBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIGVuZCBjb250YWluZXIgaW4gc2VsZWN0aW9uXG4gIC8vIGFuZCBlbmQgb2YgY2hpbGROb2RlcyBsaXN0IGZvciBzdGFydCBjb250YWluZXIgaW4gc2VsZWN0aW9uLlxuICBsZXQgbG9jYXRpb25JbkNoaWxkTm9kZXMgPSBsb2NhdGlvbkluU2VsZWN0aW9uID09PSBcInN0YXJ0XCIgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuICBsZXQgZWxlbWVudENvcHkgPSBmaW5kVGV4dE5vZGVBdExvY2F0aW9uKFxuICAgIGVsZW1lbnRBbmNlc3RvckNvcHksXG4gICAgbG9jYXRpb25JbkNoaWxkTm9kZXNcbiAgKTtcbiAgbGV0IGVsZW1lbnRDb3B5UGFyZW50ID0gZWxlbWVudENvcHkucGFyZW50Tm9kZTtcblxuICByZW1vdmVTaWJsaW5nc0luRGlyZWN0aW9uKFxuICAgIGVsZW1lbnRDb3B5LFxuICAgIHNpYmxpbmdSZW1vdmFsRGlyZWN0aW9uc1tsb2NhdGlvbkluU2VsZWN0aW9uXVxuICApO1xuXG4gIG1lcmdlU2libGluZ1RleHROb2Rlc0luRGlyZWN0aW9uKFxuICAgIGVsZW1lbnRDb3B5LFxuICAgIHNpYmxpbmdUZXh0Tm9kZU1lcmdlRGlyZWN0aW9uc1tsb2NhdGlvbkluU2VsZWN0aW9uXVxuICApO1xuXG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHk6IFwiLCBlbGVtZW50Q29weSk7XG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHlQYXJlbnQ6IFwiLCBlbGVtZW50Q29weVBhcmVudCk7XG5cbiAgLy8gQ2xlYW4gb3V0IGFueSBuZXN0ZWQgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICBpZiAoXG4gICAgZWxlbWVudENvcHlQYXJlbnQgIT09IGVsZW1lbnRBbmNlc3RvckNvcHkgJiZcbiAgICBlbGVtZW50Q29weVBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5oaWdobGlnaHRlZENsYXNzKVxuICApIHtcbiAgICBkb20oZWxlbWVudENvcHlQYXJlbnQpLnVud3JhcCgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0ZXh0IG5vZGUgdGhhdCB3ZSBuZWVkIGZvciB0aGUgbmV3IGhpZ2hsaWdodFxuICAvLyBmcm9tIHRoZSBleGlzdGluZyBoaWdobGlnaHQgb3Igb3RoZXIgZWxlbWVudC5cbiAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXG4gIHJldHVybiB7IGVsZW1lbnRBbmNlc3RvckNvcHksIGVsZW1lbnRDb3B5IH07XG59XG5cbmZ1bmN0aW9uIGdhdGhlclNpYmxpbmdzVXBUb0VuZE5vZGUoc3RhcnROb2RlT3JDb250YWluZXIsIGVuZE5vZGUpIHtcbiAgY29uc3QgZ2F0aGVyZWRTaWJsaW5ncyA9IFtdO1xuICBsZXQgZm91bmRFbmROb2RlU2libGluZyA9IGZhbHNlO1xuXG4gIGxldCBjdXJyZW50Tm9kZSA9IHN0YXJ0Tm9kZU9yQ29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgIWZvdW5kRW5kTm9kZVNpYmxpbmcpIHtcbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUgfHwgY3VycmVudE5vZGUuY29udGFpbnMoZW5kTm9kZSkpIHtcbiAgICAgIGZvdW5kRW5kTm9kZVNpYmxpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBnYXRoZXJlZFNpYmxpbmdzLnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBnYXRoZXJlZFNpYmxpbmdzLCBmb3VuZEVuZE5vZGVTaWJsaW5nIH07XG59XG5cbi8qKlxuICogR2V0cyBhbGwgdGhlIG5vZGVzIGluIGJldHdlZW4gdGhlIHByb3ZpZGVkIHN0YXJ0IGFuZCBlbmQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhcnROb2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbmROb2RlXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX0gTm9kZXMgdGhhdCBsaXZlIGluIGJldHdlZW4gdGhlIHR3by5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vZGVzSW5CZXR3ZWVuKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8vIEZpcnN0IGF0dGVtcHQgdGhlIGVhc2llc3Qgc29sdXRpb24sIGhvcGluZyBlbmROb2RlIHdpbGwgYmUgYXQgdGhlIHNhbWUgbGV2ZWxcbiAgLy8gYXMgdGhlIHN0YXJ0IG5vZGUgb3IgY29udGFpbmVkIGluIGFuIGVsZW1lbnQgYXQgdGhlIHNhbWUgbGV2ZWwuXG4gIGNvbnN0IHtcbiAgICBmb3VuZEVuZE5vZGVTaWJsaW5nOiBmb3VuZEVuZE5vZGVTaWJsaW5nT25TYW1lTGV2ZWwsXG4gICAgZ2F0aGVyZWRTaWJsaW5nc1xuICB9ID0gZ2F0aGVyU2libGluZ3NVcFRvRW5kTm9kZShzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gIGlmIChmb3VuZEVuZE5vZGVTaWJsaW5nT25TYW1lTGV2ZWwpIHtcbiAgICByZXR1cm4gZ2F0aGVyZWRTaWJsaW5ncztcbiAgfVxuXG4gIC8vIE5vdyBnbyBmb3IgdGhlIHJvdXRlIHRoYXQgZ29lcyB0byB0aGUgaGlnaGVzdCBwYXJlbnQgb2YgdGhlIHN0YXJ0IG5vZGUgaW4gdGhlIHRyZWVcbiAgLy8gdGhhdCBpcyBub3QgdGhlIHBhcmVudCBvZiB0aGUgZW5kIG5vZGUuXG4gIGNvbnN0IHN0YXJ0Tm9kZVBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgY2hpbGRFbGVtZW50OiBzdGFydE5vZGUsXG4gICAgb3RoZXJFbGVtZW50OiBlbmROb2RlXG4gIH0pO1xuXG4gIGlmIChzdGFydE5vZGVQYXJlbnQpIHtcbiAgICBjb25zdCB7XG4gICAgICBmb3VuZEVuZE5vZGVTaWJsaW5nOiBmb3VuZEVuZE5vZGVTaWJsaW5nRnJvbVBhcmVudExldmVsLFxuICAgICAgZ2F0aGVyZWRTaWJsaW5nczogZ2F0aGVyZWRTaWJsaW5nc0Zyb21QYXJlbnRcbiAgICB9ID0gZ2F0aGVyU2libGluZ3NVcFRvRW5kTm9kZShzdGFydE5vZGVQYXJlbnQsIGVuZE5vZGUpO1xuXG4gICAgaWYgKGZvdW5kRW5kTm9kZVNpYmxpbmdGcm9tUGFyZW50TGV2ZWwpIHtcbiAgICAgIHJldHVybiBnYXRoZXJlZFNpYmxpbmdzRnJvbVBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogR3JvdXBzIGdpdmVuIGhpZ2hsaWdodHMgYnkgdGltZXN0YW1wLlxuICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0c1xuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcEF0dHJcbiAqIEByZXR1cm5zIHtBcnJheX0gR3JvdXBlZCBoaWdobGlnaHRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIHRpbWVzdGFtcEF0dHIpIHtcbiAgbGV0IG9yZGVyID0gW10sXG4gICAgY2h1bmtzID0ge30sXG4gICAgZ3JvdXBlZCA9IFtdO1xuXG4gIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgIGxldCB0aW1lc3RhbXAgPSBobC5nZXRBdHRyaWJ1dGUodGltZXN0YW1wQXR0cik7XG5cbiAgICBpZiAodHlwZW9mIGNodW5rc1t0aW1lc3RhbXBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjaHVua3NbdGltZXN0YW1wXSA9IFtdO1xuICAgICAgb3JkZXIucHVzaCh0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGNodW5rc1t0aW1lc3RhbXBdLnB1c2goaGwpO1xuICB9KTtcblxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgIGxldCBncm91cCA9IGNodW5rc1t0aW1lc3RhbXBdO1xuXG4gICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAgIGNodW5rczogZ3JvdXAsXG4gICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihoKSB7XG4gICAgICAgICAgICByZXR1cm4gaC50ZXh0Q29udGVudDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gZ3JvdXBlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldHJpZXZlSGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgcGFyYW1zID0ge1xuICAgIGFuZFNlbGY6IHRydWUsXG4gICAgZ3JvdXBlZDogZmFsc2UsXG4gICAgLi4ucGFyYW1zXG4gIH07XG5cbiAgbGV0IG5vZGVMaXN0ID0gcGFyYW1zLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiW1wiICsgcGFyYW1zLmRhdGFBdHRyICsgXCJdXCIpLFxuICAgIGhpZ2hsaWdodHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG5cbiAgaWYgKFxuICAgIHBhcmFtcy5hbmRTZWxmID09PSB0cnVlICYmXG4gICAgcGFyYW1zLmNvbnRhaW5lci5oYXNBdHRyaWJ1dGUocGFyYW1zLmRhdGFBdHRyKVxuICApIHtcbiAgICBoaWdobGlnaHRzLnB1c2gocGFyYW1zLmNvbnRhaW5lcik7XG4gIH1cblxuICBpZiAocGFyYW1zLmdyb3VwZWQpIHtcbiAgICBoaWdobGlnaHRzID0gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIHBhcmFtcy50aW1lc3RhbXBBdHRyKTtcbiAgfVxuXG4gIHJldHVybiBoaWdobGlnaHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cikge1xuICByZXR1cm4gKFxuICAgIGVsICYmIGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShkYXRhQXR0cilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZE5vZGVzVG9IaWdobGlnaHRBZnRlckVsZW1lbnQoe1xuICBlbGVtZW50LFxuICBlbGVtZW50QW5jZXN0b3IsXG4gIGhpZ2hsaWdodFdyYXBwZXIsXG4gIGhpZ2hsaWdodGVkQ2xhc3Ncbn0pIHtcbiAgaWYgKGVsZW1lbnRBbmNlc3Rvcikge1xuICAgIGlmIChlbGVtZW50QW5jZXN0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKGhpZ2hsaWdodGVkQ2xhc3MpKSB7XG4gICAgICAvLyBFbnN1cmUgd2Ugb25seSB0YWtlIHRoZSBjaGlsZHJlbiBmcm9tIGEgcGFyZW50IHRoYXQgaXMgYSBoaWdobGlnaHQuXG4gICAgICBlbGVtZW50QW5jZXN0b3IuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmIChkb20oY2hpbGROb2RlKS5pc0FmdGVyKGVsZW1lbnQpKSB7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudEFuY2VzdG9yLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaGxpZ2h0V3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50QW5jZXN0b3IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoaWdobGlnaHRXcmFwcGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICB9XG59XG5cbi8qKlxuICogQ29sbGVjdHMgdGhlIGh1bWFuLXJlYWRhYmxlIGhpZ2hsaWdodGVkIHRleHQgZm9yIGFsbCBub2RlcyBpbiB0aGUgc2VsZWN0ZWQgcmFuZ2UuXG4gKlxuICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBodW1hbi1yZWFkYWJsZSBoaWdobGlnaHRlZCB0ZXh0IGZvciB0aGUgZ2l2ZW4gcmFuZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaWdobGlnaHRlZFRleHQocmFuZ2UpIHtcbiAgY29uc3Qgc3RhcnRDb250YWluZXJDb3B5ID0gcmFuZ2Uuc3RhcnRDb250YWluZXIuY2xvbmUodHJ1ZSk7XG4gIHJldHVybiBcIlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVzY3JpcHRvcnMoeyByb290RWxlbWVudCwgcmFuZ2UsIHdyYXBwZXIgfSkge1xuICBsZXQgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgY29uc3Qgc3RhcnRPZmZzZXQgPVxuICAgIGdldEVsZW1lbnRPZmZzZXQocmFuZ2Uuc3RhcnRDb250YWluZXIsIHJvb3RFbGVtZW50KSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICBjb25zdCBlbmRPZmZzZXQgPVxuICAgIHJhbmdlLnN0YXJ0Q29udGFpbmVyID09PSByYW5nZS5lbmRDb250YWluZXJcbiAgICAgID8gc3RhcnRPZmZzZXQgKyAocmFuZ2UuZW5kT2Zmc2V0IC0gcmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCByb290RWxlbWVudCkgKyByYW5nZS5lbmRPZmZzZXQ7XG4gIGNvbnN0IGxlbmd0aCA9IGVuZE9mZnNldCAtIHN0YXJ0T2Zmc2V0O1xuICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgd3JhcHBlckNsb25lLmlubmVySFRNTCA9IFwiXCI7XG4gIGNvbnN0IHdyYXBwZXJIVE1MID0gd3JhcHBlckNsb25lLm91dGVySFRNTDtcblxuICBjb25zdCBkZXNjcmlwdG9yID0gW1xuICAgIHdyYXBwZXJIVE1MLFxuICAgIC8vIHJldHJpZXZlIGFsbCB0aGUgdGV4dCBjb250ZW50IGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Zmc2V0cy5cbiAgICBnZXRIaWdobGlnaHRlZFRleHQocmFuZ2UpLFxuICAgIHN0YXJ0T2Zmc2V0LFxuICAgIGxlbmd0aFxuICBdO1xuICAvLyBUT0RPOiBjaHVuayB1cCBoaWdobGlnaHRzIGZvciBQREZzIChvciBhbnkgZWxlbWVudCB3aXRoIGFic29sdXRlbHkgcG9zaXRpb25lZCBlbGVtZW50cykuXG4gIHJldHVybiBbZGVzY3JpcHRvcl07XG59XG4iXX0=
