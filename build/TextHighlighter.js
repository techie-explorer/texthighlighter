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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzIiwic3JjL2dsb2JhbC1zY3JpcHQuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWEuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2by5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUlPLElBQU0sU0FBUyxHQUFHLGtCQUFsQjtBQUVQOzs7Ozs7QUFJTyxJQUFNLGNBQWMsR0FBRyxnQkFBdkI7O0FBRUEsSUFBTSxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsaUJBQXhCO0FBRVA7Ozs7OztBQUlPLElBQU0sV0FBVyxHQUFHLENBQ3pCLFFBRHlCLEVBRXpCLE9BRnlCLEVBR3pCLFFBSHlCLEVBSXpCLFFBSnlCLEVBS3pCLFFBTHlCLEVBTXpCLFFBTnlCLEVBT3pCLFFBUHlCLEVBUXpCLE9BUnlCLEVBU3pCLE9BVHlCLEVBVXpCLFFBVnlCLEVBV3pCLE9BWHlCLEVBWXpCLE9BWnlCLEVBYXpCLE9BYnlCLEVBY3pCLFVBZHlCLENBQXBCOzs7Ozs7O0FDbkJQOztBQVlBOzs7O0FBVkE7Ozs7QUFJQSxNQUFNLENBQUMsZUFBUCxHQUF5QiwyQkFBekI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7O0FBY0E7O0FBTUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLHdCOzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsb0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxPQUFWO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBZWUsSyxFQUFPLE8sRUFBUztBQUM3QixVQUFJLENBQUMsS0FBRCxJQUFVLEtBQUssQ0FBQyxTQUFwQixFQUErQjtBQUM3QixlQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosRUFBbUMsS0FBbkM7QUFFQSxVQUFJLFVBQVUsR0FBRyxFQUFqQjtBQUNBLFVBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFSLENBQWtCLElBQWxCLENBQW5CO0FBRUEsVUFBSSxXQUFXLEdBQ2Isa0NBQWlCLEtBQUssQ0FBQyxjQUF2QixFQUF1QyxLQUFLLEVBQTVDLElBQWtELEtBQUssQ0FBQyxXQUQxRDtBQUVBLFVBQUksU0FBUyxHQUNYLEtBQUssQ0FBQyxjQUFOLEtBQXlCLEtBQUssQ0FBQyxZQUEvQixHQUNJLFdBQVcsSUFBSSxLQUFLLENBQUMsU0FBTixHQUFrQixLQUFLLENBQUMsV0FBNUIsQ0FEZixHQUVJLGtDQUFpQixLQUFLLENBQUMsWUFBdkIsRUFBcUMsS0FBSyxFQUExQyxJQUFnRCxLQUFLLENBQUMsU0FINUQ7QUFLQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQ0UsMkJBREYsRUFFRSxXQUZGLEVBR0UsYUFIRixFQUlFLFNBSkY7QUFPQSxNQUFBLFlBQVksQ0FBQyxZQUFiLENBQTBCLHlCQUExQixFQUE2QyxXQUE3QztBQUNBLE1BQUEsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsdUJBQTFCLEVBQTJDLFNBQTNDO0FBQ0EsTUFBQSxZQUFZLENBQUMsWUFBYixDQUEwQixpQkFBMUIsRUFBcUMsSUFBckM7QUFFQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksaURBQVo7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksd0JBQVosRUFBc0MsS0FBSyxDQUFDLGNBQTVDO0FBQ0EsVUFBSSxjQUFjLEdBQUcsd0NBQXVCLEtBQUssQ0FBQyxjQUE3QixFQUE2QyxPQUE3QyxDQUFyQjtBQUVBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxLQUFLLENBQUMsWUFBMUM7QUFDQSxVQUFJLFlBQVksR0FBRyx3Q0FBdUIsS0FBSyxDQUFDLFlBQTdCLEVBQTJDLE9BQTNDLENBQW5COztBQUVBLFVBQUksQ0FBQyxjQUFELElBQW1CLENBQUMsWUFBeEIsRUFBc0M7QUFDcEMsY0FBTSxJQUFJLEtBQUosQ0FDSiw2RUFESSxDQUFOO0FBR0Q7O0FBRUQsVUFBSSxpQkFBaUIsR0FDbkIsS0FBSyxDQUFDLFNBQU4sR0FBa0IsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsTUFBekIsR0FBa0MsQ0FBcEQsR0FDSSxZQUFZLENBQUMsU0FBYixDQUF1QixLQUFLLENBQUMsU0FBN0IsQ0FESixHQUVJLFlBSE47O0FBS0EsVUFBSSxjQUFjLEtBQUssWUFBdkIsRUFBcUM7QUFDbkMsWUFBSSxtQkFBbUIsR0FDckIsS0FBSyxDQUFDLFdBQU4sR0FBb0IsQ0FBcEIsR0FDSSxjQUFjLENBQUMsU0FBZixDQUF5QixLQUFLLENBQUMsV0FBL0IsQ0FESixHQUVJLGNBSE4sQ0FEbUMsQ0FLbkM7O0FBQ0EsWUFBSSxTQUFTLEdBQUcscUJBQUksbUJBQUosRUFBeUIsSUFBekIsQ0FBOEIsWUFBOUIsQ0FBaEI7QUFDQSxRQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCO0FBQ0QsT0FSRCxNQVFPLElBQUksWUFBWSxDQUFDLFdBQWIsQ0FBeUIsTUFBekIsSUFBbUMsS0FBSyxDQUFDLFNBQTdDLEVBQXdEO0FBQzdELFlBQUksb0JBQW1CLEdBQUcsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsS0FBSyxDQUFDLFdBQS9CLENBQTFCOztBQUNBLFlBQUksaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsZUFBMUM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQ0UsMENBREYsRUFFRSxvQkFGRjtBQUlBLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxvQ0FBWixFQUFrRCxpQkFBbEQ7QUFFQSxZQUFNLGtCQUFrQixHQUFHLDBDQUF5QjtBQUNsRCxVQUFBLFlBQVksRUFBRSxvQkFEb0M7QUFFbEQsVUFBQSxZQUFZLEVBQUU7QUFGb0MsU0FBekIsQ0FBM0I7QUFLQSxZQUFJLHNCQUFKO0FBQ0EsWUFBSSx1QkFBSjs7QUFDQSxZQUFJLGtCQUFKLEVBQXdCO0FBQUEsc0NBSWxCLG1EQUFrQztBQUNwQyxZQUFBLE9BQU8sRUFBRSxvQkFEMkI7QUFFcEMsWUFBQSxlQUFlLEVBQUUsa0JBRm1CO0FBR3BDLFlBQUEsT0FBTyxFQUFFLEtBQUssT0FIc0I7QUFJcEMsWUFBQSxtQkFBbUIsRUFBRTtBQUplLFdBQWxDLENBSmtCOztBQUVDLFVBQUEsc0JBRkQseUJBRXBCLG1CQUZvQjtBQUdQLFVBQUEsdUJBSE8seUJBR3BCLFdBSG9CO0FBV3RCLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxrQkFBbkM7QUFDQSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMEJBQVosRUFBd0Msc0JBQXhDO0FBQ0Q7O0FBRUQsWUFBTSxnQkFBZ0IsR0FBRywwQ0FBeUI7QUFDaEQsVUFBQSxZQUFZLEVBQUUsaUJBRGtDO0FBRWhELFVBQUEsWUFBWSxFQUFFO0FBRmtDLFNBQXpCLENBQXpCO0FBS0EsWUFBSSxvQkFBSjtBQUNBLFlBQUkscUJBQUo7O0FBQ0EsWUFBSSxnQkFBSixFQUFzQjtBQUFBLHVDQUloQixtREFBa0M7QUFDcEMsWUFBQSxPQUFPLEVBQUUsaUJBRDJCO0FBRXBDLFlBQUEsZUFBZSxFQUFFLGdCQUZtQjtBQUdwQyxZQUFBLE9BQU8sRUFBRSxLQUFLLE9BSHNCO0FBSXBDLFlBQUEsbUJBQW1CLEVBQUU7QUFKZSxXQUFsQyxDQUpnQjs7QUFFRyxVQUFBLG9CQUZILDBCQUVsQixtQkFGa0I7QUFHTCxVQUFBLHFCQUhLLDBCQUdsQixXQUhrQjtBQVVwQixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQ0UsNERBREYsRUFFRSxnQkFGRjtBQUtBLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FDRSw2SEFERixFQUVFLG9CQUZGO0FBSUQ7O0FBRUQseURBQWdDO0FBQzlCLFVBQUEsT0FBTyxFQUFFLHVCQUF1QixJQUFJLG9CQUROO0FBRTlCLFVBQUEsZUFBZSxFQUFFLHNCQUZhO0FBRzlCLFVBQUEsZ0JBQWdCLEVBQUUsWUFIWTtBQUk5QixVQUFBLGdCQUFnQixFQUFFLEtBQUssT0FBTCxDQUFhO0FBSkQsU0FBaEMsRUEzRDZELENBa0U3RDs7QUFDQSxZQUFNLG1CQUFtQixHQUFHLGdDQUFlLGNBQWYsRUFBK0IsWUFBL0IsQ0FBNUI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVosRUFBdUMsbUJBQXZDO0FBQ0EsUUFBQSxtQkFBbUIsQ0FBQyxPQUFwQixDQUE0QixVQUFBLFNBQVMsRUFBSTtBQUN2QyxVQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFNBQXpCO0FBQ0QsU0FGRDs7QUFJQSxZQUFJLG9CQUFKLEVBQTBCO0FBQ3hCO0FBQ0EsY0FDRSxvQkFBb0IsQ0FBQyxTQUFyQixDQUErQixRQUEvQixDQUF3QyxLQUFLLE9BQUwsQ0FBYSxnQkFBckQsQ0FERixFQUVFO0FBQ0EsWUFBQSxvQkFBb0IsQ0FBQyxVQUFyQixDQUFnQyxPQUFoQyxDQUF3QyxVQUFBLFNBQVMsRUFBSTtBQUNuRCxjQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFNBQXpCO0FBQ0QsYUFGRDtBQUdELFdBTkQsTUFNTztBQUNMLFlBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsb0JBQXpCO0FBQ0Q7QUFDRixTQVhELE1BV087QUFDTCxVQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGlCQUF6QjtBQUNEOztBQUVELDZCQUFJLFlBQUosRUFBa0IsWUFBbEIsQ0FDRSxnQkFBZ0IsR0FBRyxnQkFBSCxHQUFzQixpQkFEeEM7QUFHRDs7QUFFRCxhQUFPLFVBQVA7QUFDRDtBQUVEOzs7Ozs7OztnQ0FLWSxTLEVBQVc7QUFDckIsVUFBSSxLQUFLLEdBQUcscUJBQUksS0FBSyxFQUFULEVBQWEsUUFBYixFQUFaO0FBQUEsVUFDRSxPQURGO0FBQUEsVUFFRSxTQUZGOztBQUlBLFVBQUksQ0FBQyxLQUFELElBQVUsS0FBSyxDQUFDLFNBQXBCLEVBQStCO0FBQzdCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLE9BQUwsQ0FBYSxpQkFBYixDQUErQixLQUEvQixNQUEwQyxJQUE5QyxFQUFvRDtBQUNsRCxRQUFBLFNBQVMsR0FBRyxDQUFDLElBQUksSUFBSixFQUFiO0FBQ0EsUUFBQSxPQUFPLEdBQUcsK0JBQWMsS0FBSyxPQUFuQixDQUFWO0FBQ0EsUUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixzQkFBckIsRUFBcUMsU0FBckM7QUFFQSxZQUFNLFdBQVcsR0FBRyxtQ0FBa0I7QUFDcEMsVUFBQSxXQUFXLEVBQUUsS0FBSyxFQURrQjtBQUVwQyxVQUFBLEtBQUssRUFBTCxLQUZvQztBQUdwQyxVQUFBLE9BQU8sRUFBUDtBQUhvQyxTQUFsQixDQUFwQixDQUxrRCxDQVdsRDtBQUNBOztBQUVBLFlBQU0sb0JBQW9CLEdBQUcsS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FDM0IsS0FEMkIsRUFFM0IsV0FGMkIsRUFHM0IsU0FIMkIsQ0FBN0I7QUFLQSxhQUFLLHFCQUFMLENBQTJCLG9CQUEzQjtBQUNEOztBQUVELFVBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2QsNkJBQUksS0FBSyxFQUFULEVBQWEsZUFBYjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7d0NBUW9CLFUsRUFBWTtBQUM5QixVQUFJLG9CQUFKLENBRDhCLENBRzlCOztBQUNBLE1BQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBUyxTQUFULEVBQW9CO0FBQ3JDLDZCQUFJLFNBQUosRUFBZSxrQkFBZjtBQUNELE9BRkQsRUFKOEIsQ0FROUI7O0FBQ0EsTUFBQSxvQkFBb0IsR0FBRyxVQUFVLENBQUMsTUFBWCxDQUFrQixVQUFTLEVBQVQsRUFBYTtBQUNwRCxlQUFPLEVBQUUsQ0FBQyxhQUFILEdBQW1CLEVBQW5CLEdBQXdCLElBQS9CO0FBQ0QsT0FGc0IsQ0FBdkI7QUFJQSxNQUFBLG9CQUFvQixHQUFHLG9CQUFPLG9CQUFQLENBQXZCO0FBQ0EsTUFBQSxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWU7QUFDdkMsZUFBTyxDQUFDLENBQUMsU0FBRixHQUFjLENBQUMsQ0FBQyxTQUFoQixJQUE2QixDQUFDLENBQUMsVUFBRixHQUFlLENBQUMsQ0FBQyxVQUFyRDtBQUNELE9BRkQ7QUFJQSxhQUFPLG9CQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7O3FDQU1pQixPLEVBQVM7QUFDeEIsVUFBSSxTQUFTLEdBQUcsT0FBTyxJQUFJLEtBQUssRUFBaEM7QUFBQSxVQUNFLFVBQVUsR0FBRyxLQUFLLGFBQUwsRUFEZjtBQUFBLFVBRUUsSUFBSSxHQUFHLElBRlQ7O0FBSUEsZUFBUyxlQUFULENBQXlCLFNBQXpCLEVBQW9DO0FBQ2xDLFlBQUksU0FBUyxDQUFDLFNBQVYsS0FBd0IsU0FBUyxDQUFDLFNBQXRDLEVBQWlEO0FBQy9DLCtCQUFJLFNBQUosRUFBZSxNQUFmO0FBQ0Q7QUFDRjs7QUFFRCxNQUFBLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFVBQVMsRUFBVCxFQUFhO0FBQzlCLFlBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBYixDQUErQixFQUEvQixNQUF1QyxJQUEzQyxFQUFpRDtBQUMvQyxVQUFBLGVBQWUsQ0FBQyxFQUFELENBQWY7QUFDRDtBQUNGLE9BSkQ7QUFLRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O2tDQWFjLE0sRUFBUTtBQUNwQixVQUFNLFlBQVk7QUFDaEIsUUFBQSxTQUFTLEVBQUUsS0FBSyxFQURBO0FBRWhCLFFBQUEsUUFBUSxFQUFFLGlCQUZNO0FBR2hCLFFBQUEsYUFBYSxFQUFFO0FBSEMsU0FJYixNQUphLENBQWxCOztBQU1BLGFBQU8sb0NBQW1CLFlBQW5CLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7O2dDQU9ZLEUsRUFBSSxRLEVBQVU7QUFDeEIsYUFBTyxvQ0FBbUIsRUFBbkIsRUFBdUIsUUFBdkIsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7O3dDQUtvQixFLEVBQUk7QUFDdEIsVUFBSSxVQUFVLEdBQUcsS0FBSyxhQUFMLEVBQWpCO0FBQUEsVUFDRSxLQUFLLEdBQUcsS0FBSyxFQURmO0FBQUEsVUFFRSxhQUFhLEdBQUcsRUFGbEI7QUFJQSxtQ0FBWSxVQUFaLEVBQXdCLEtBQXhCO0FBRUEsTUFBQSxVQUFVLENBQUMsT0FBWCxDQUFtQixVQUFTLFNBQVQsRUFBb0I7QUFDckMsWUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsTUFBbkM7QUFBQSxZQUNFLE1BQU0sR0FBRyxrQ0FBaUIsU0FBakIsRUFBNEIsS0FBNUIsQ0FEWDtBQUFBLFlBQytDO0FBQzdDLFFBQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFWLENBQW9CLElBQXBCLENBRlo7QUFJQSxRQUFBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLEVBQXBCO0FBQ0EsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQWxCO0FBRUEsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHdDQUFaLEVBQXNELE1BQXREO0FBQ0EsUUFBQSxPQUFPLENBQUMsR0FBUixzQ0FDZ0MsRUFEaEMsU0FFRSxPQUFPLENBQUMsUUFBUixHQUFtQixPQUFuQixDQUEyQixFQUEzQixDQUZGOztBQUlBLFlBQUksT0FBTyxDQUFDLFFBQVIsR0FBbUIsT0FBbkIsQ0FBMkIsRUFBM0IsSUFBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUN2QyxVQUFBLGFBQWEsQ0FBQyxJQUFkLENBQW1CLENBQUMsT0FBRCxFQUFVLFNBQVMsQ0FBQyxXQUFwQixFQUFpQyxNQUFqQyxFQUF5QyxNQUF6QyxDQUFuQjtBQUNEO0FBQ0YsT0FoQkQ7QUFrQkEsYUFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLGFBQWYsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7OzBDQVFzQixJLEVBQU07QUFDMUIsVUFBSSxhQUFKO0FBQUEsVUFDRSxVQUFVLEdBQUcsRUFEZjtBQUFBLFVBRUUsSUFBSSxHQUFHLElBRlQ7O0FBSUEsVUFBSSxDQUFDLElBQUwsRUFBVztBQUNULGVBQU8sVUFBUDtBQUNEOztBQUVELFVBQUk7QUFDRixRQUFBLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaEI7QUFDRCxPQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDVixjQUFNLHVCQUF1QixDQUE3QjtBQUNEOztBQUVELGVBQVMsdUJBQVQsQ0FBaUMsWUFBakMsRUFBK0M7QUFDN0MsWUFBSSxFQUFFLEdBQUc7QUFDTCxVQUFBLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBRCxDQURoQjtBQUVMLFVBQUEsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFELENBRmI7QUFHTCxVQUFBLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUCxDQUFnQixZQUFZLENBQUMsQ0FBRCxDQUE1QixDQUhIO0FBSUwsVUFBQSxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsWUFBWSxDQUFDLENBQUQsQ0FBNUI7QUFKSCxTQUFUO0FBQUEsWUFNRSxNQU5GO0FBQUEsWUFPRSxTQVBGO0FBU0EsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQXhCOztBQVY2QyxpQ0FXRixtQ0FDekMsRUFEeUMsRUFFekMsVUFGeUMsQ0FYRTtBQUFBLFlBV3JDLElBWHFDLHNCQVdyQyxJQVhxQztBQUFBLFlBV3ZCLGdCQVh1QixzQkFXL0IsTUFYK0I7O0FBZ0I3QyxRQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBTCxDQUFlLGdCQUFmLENBQVQ7QUFDQSxRQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEVBQUUsQ0FBQyxNQUFwQjs7QUFFQSxZQUFJLE1BQU0sQ0FBQyxXQUFQLElBQXNCLENBQUMsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsU0FBOUMsRUFBeUQ7QUFDdkQsK0JBQUksTUFBTSxDQUFDLFdBQVgsRUFBd0IsTUFBeEI7QUFDRDs7QUFFRCxZQUFJLE1BQU0sQ0FBQyxlQUFQLElBQTBCLENBQUMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsU0FBdEQsRUFBaUU7QUFDL0QsK0JBQUksTUFBTSxDQUFDLGVBQVgsRUFBNEIsTUFBNUI7QUFDRDs7QUFFRCxRQUFBLFNBQVMsR0FBRyxxQkFBSSxNQUFKLEVBQVksSUFBWixDQUFpQix1QkFBTSxRQUFOLENBQWUsRUFBRSxDQUFDLE9BQWxCLEVBQTJCLENBQTNCLENBQWpCLENBQVo7QUFDQSxRQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCO0FBQ0Q7O0FBRUQsTUFBQSxhQUFhLENBQUMsT0FBZCxDQUFzQixVQUFTLFlBQVQsRUFBdUI7QUFDM0MsWUFBSTtBQUNGLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCLFlBQTNCO0FBQ0EsVUFBQSx1QkFBdUIsQ0FBQyxZQUFELENBQXZCO0FBQ0QsU0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsY0FBSSxPQUFPLElBQUksT0FBTyxDQUFDLElBQXZCLEVBQTZCO0FBQzNCLFlBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxvREFBb0QsQ0FBakU7QUFDRDtBQUNGO0FBQ0YsT0FURDtBQVdBLGFBQU8sVUFBUDtBQUNEOzs7Ozs7ZUFHWSx3Qjs7Ozs7Ozs7Ozs7QUM5YmY7O0FBUUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLG9COzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsZ0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxPQUFWO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7OzttQ0FRZSxLLEVBQU8sTyxFQUFTO0FBQzdCLFVBQUksQ0FBQyxLQUFELElBQVUsS0FBSyxDQUFDLFNBQXBCLEVBQStCO0FBQzdCLGVBQU8sRUFBUDtBQUNEOztBQUVELE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxvQ0FBWixFQUFrRCxLQUFsRDtBQUVBLFVBQUksTUFBTSxHQUFHLHVDQUFzQixLQUF0QixDQUFiO0FBQUEsVUFDRSxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBRDFCO0FBQUEsVUFFRSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBRnhCO0FBQUEsVUFHRSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBSHBCO0FBQUEsVUFJRSxJQUFJLEdBQUcsS0FKVDtBQUFBLFVBS0UsSUFBSSxHQUFHLGNBTFQ7QUFBQSxVQU1FLFVBQVUsR0FBRyxFQU5mO0FBQUEsVUFPRSxTQVBGO0FBQUEsVUFRRSxZQVJGO0FBQUEsVUFTRSxVQVRGOztBQVdBLFNBQUc7QUFDRCxZQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBTCxLQUFrQixlQUFVLFNBQTVDLEVBQXVEO0FBQ3JELGNBQ0Usb0JBQVksT0FBWixDQUFvQixJQUFJLENBQUMsVUFBTCxDQUFnQixPQUFwQyxNQUFpRCxDQUFDLENBQWxELElBQ0EsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLE9BQTBCLEVBRjVCLEVBR0U7QUFDQSxZQUFBLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFsQixDQUFmO0FBQ0EsWUFBQSxZQUFZLENBQUMsWUFBYixDQUEwQixpQkFBMUIsRUFBcUMsSUFBckM7QUFDQSxZQUFBLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBbEIsQ0FIQSxDQUtBOztBQUNBLGdCQUFJLHFCQUFJLEtBQUssRUFBVCxFQUFhLFFBQWIsQ0FBc0IsVUFBdEIsS0FBcUMsVUFBVSxLQUFLLEtBQUssRUFBN0QsRUFBaUU7QUFDL0QsY0FBQSxTQUFTLEdBQUcscUJBQUksSUFBSixFQUFVLElBQVYsQ0FBZSxZQUFmLENBQVo7QUFDQSxjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxVQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBQ0QsWUFDRSxJQUFJLEtBQUssWUFBVCxJQUNBLEVBQUUsWUFBWSxDQUFDLGFBQWIsTUFBZ0MsUUFBbEMsQ0FGRixFQUdFO0FBQ0EsVUFBQSxJQUFJLEdBQUcsSUFBUDtBQUNEOztBQUVELFlBQUksSUFBSSxDQUFDLE9BQUwsSUFBZ0Isb0JBQVksT0FBWixDQUFvQixJQUFJLENBQUMsT0FBekIsSUFBb0MsQ0FBQyxDQUF6RCxFQUE0RDtBQUMxRCxjQUFJLFlBQVksQ0FBQyxVQUFiLEtBQTRCLElBQWhDLEVBQXNDO0FBQ3BDLFlBQUEsSUFBSSxHQUFHLElBQVA7QUFDRDs7QUFDRCxVQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBQ0QsWUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLGFBQUwsRUFBaEIsRUFBc0M7QUFDcEMsVUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVo7QUFDRCxTQUZELE1BRU8sSUFBSSxJQUFJLENBQUMsV0FBVCxFQUFzQjtBQUMzQixVQUFBLElBQUksR0FBRyxJQUFJLENBQUMsV0FBWjtBQUNBLFVBQUEsUUFBUSxHQUFHLElBQVg7QUFDRCxTQUhNLE1BR0E7QUFDTCxVQUFBLElBQUksR0FBRyxJQUFJLENBQUMsVUFBWjtBQUNBLFVBQUEsUUFBUSxHQUFHLEtBQVg7QUFDRDtBQUNGLE9BekNELFFBeUNTLENBQUMsSUF6Q1Y7O0FBMkNBLGFBQU8sVUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozt3Q0FTb0IsVSxFQUFZO0FBQzlCLFVBQUksb0JBQUo7QUFFQSxXQUFLLHVCQUFMLENBQTZCLFVBQTdCO0FBQ0EsV0FBSyxzQkFBTCxDQUE0QixVQUE1QixFQUo4QixDQU05Qjs7QUFDQSxNQUFBLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxNQUFYLENBQWtCLFVBQVMsRUFBVCxFQUFhO0FBQ3BELGVBQU8sRUFBRSxDQUFDLGFBQUgsR0FBbUIsRUFBbkIsR0FBd0IsSUFBL0I7QUFDRCxPQUZzQixDQUF2QjtBQUlBLE1BQUEsb0JBQW9CLEdBQUcsb0JBQU8sb0JBQVAsQ0FBdkI7QUFDQSxNQUFBLG9CQUFvQixDQUFDLElBQXJCLENBQTBCLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUN2QyxlQUFPLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBQyxDQUFDLFNBQWhCLElBQTZCLENBQUMsQ0FBQyxVQUFGLEdBQWUsQ0FBQyxDQUFDLFVBQXJEO0FBQ0QsT0FGRDtBQUlBLGFBQU8sb0JBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7NENBTXdCLFUsRUFBWTtBQUNsQyxVQUFJLEtBQUo7QUFBQSxVQUNFLElBQUksR0FBRyxJQURUO0FBR0EsbUNBQVksVUFBWixFQUF3QixJQUF4Qjs7QUFFQSxlQUFTLFdBQVQsR0FBdUI7QUFDckIsWUFBSSxLQUFLLEdBQUcsS0FBWjtBQUVBLFFBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBUyxFQUFULEVBQWEsQ0FBYixFQUFnQjtBQUNqQyxjQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsYUFBaEI7QUFBQSxjQUNFLFVBQVUsR0FBRyxNQUFNLENBQUMsZUFEdEI7QUFBQSxjQUVFLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FGdEI7O0FBSUEsY0FBSSxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFqQixFQUF5QixpQkFBekIsQ0FBSixFQUF5QztBQUN2QyxnQkFBSSxDQUFDLCtCQUFjLE1BQWQsRUFBc0IsRUFBdEIsQ0FBTCxFQUFnQztBQUM5QixrQkFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFSLEVBQXFCO0FBQ25CLG9CQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNmLHVDQUFJLEVBQUosRUFBUSxXQUFSLENBQW9CLE1BQXBCO0FBQ0QsaUJBRkQsTUFFTztBQUNMLHVDQUFJLEVBQUosRUFBUSxZQUFSLENBQXFCLFVBQXJCO0FBQ0Q7O0FBQ0QscUNBQUksRUFBSixFQUFRLFlBQVIsQ0FBcUIsVUFBVSxJQUFJLE1BQW5DO0FBQ0EsZ0JBQUEsS0FBSyxHQUFHLElBQVI7QUFDRDs7QUFFRCxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFSLEVBQXlCO0FBQ3ZCLG9CQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNmLHVDQUFJLEVBQUosRUFBUSxZQUFSLENBQXFCLE1BQXJCO0FBQ0QsaUJBRkQsTUFFTztBQUNMLHVDQUFJLEVBQUosRUFBUSxXQUFSLENBQW9CLFVBQXBCO0FBQ0Q7O0FBQ0QscUNBQUksRUFBSixFQUFRLFdBQVIsQ0FBb0IsVUFBVSxJQUFJLE1BQWxDO0FBQ0EsZ0JBQUEsS0FBSyxHQUFHLElBQVI7QUFDRDs7QUFFRCxrQkFDRSxFQUFFLENBQUMsZUFBSCxJQUNBLEVBQUUsQ0FBQyxlQUFILENBQW1CLFFBQW5CLElBQStCLENBRC9CLElBRUEsRUFBRSxDQUFDLFdBRkgsSUFHQSxFQUFFLENBQUMsV0FBSCxDQUFlLFFBQWYsSUFBMkIsQ0FKN0IsRUFLRTtBQUNBLG9CQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFmO0FBQ0EsZ0JBQUEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxlQUFmLEdBQWlDLE1BQU0sQ0FBQyxLQUFQLENBQWEsZUFBOUM7QUFDQSxnQkFBQSxRQUFRLENBQUMsU0FBVCxHQUFxQixNQUFNLENBQUMsU0FBNUI7QUFDQSxvQkFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0Isc0JBQWxCLEVBQWtDLFNBQWxEO0FBQ0EsZ0JBQUEsUUFBUSxDQUFDLFlBQVQsQ0FBc0Isc0JBQXRCLEVBQXNDLFNBQXRDO0FBQ0EsZ0JBQUEsUUFBUSxDQUFDLFlBQVQsQ0FBc0IsaUJBQXRCLEVBQWlDLElBQWpDO0FBRUEsb0JBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFULENBQW1CLElBQW5CLENBQWhCO0FBRUEscUNBQUksRUFBRSxDQUFDLGVBQVAsRUFBd0IsSUFBeEIsQ0FBNkIsUUFBN0I7QUFDQSxxQ0FBSSxFQUFFLENBQUMsV0FBUCxFQUFvQixJQUFwQixDQUF5QixTQUF6QjtBQUVBLG9CQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBTixDQUFnQixLQUFoQixDQUFzQixJQUF0QixDQUEyQixNQUFNLENBQUMsVUFBbEMsQ0FBWjtBQUNBLGdCQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsVUFBUyxJQUFULEVBQWU7QUFDM0IsdUNBQUksSUFBSixFQUFVLFlBQVYsQ0FBdUIsSUFBSSxDQUFDLFVBQTVCO0FBQ0QsaUJBRkQ7QUFHQSxnQkFBQSxLQUFLLEdBQUcsSUFBUjtBQUNEOztBQUVELGtCQUFJLENBQUMsTUFBTSxDQUFDLGFBQVAsRUFBTCxFQUE2QjtBQUMzQixxQ0FBSSxNQUFKLEVBQVksTUFBWjtBQUNEO0FBQ0YsYUFqREQsTUFpRE87QUFDTCxjQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEVBQUUsQ0FBQyxVQUF2QixFQUFtQyxFQUFuQztBQUNBLGNBQUEsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQixNQUFoQjtBQUNBLGNBQUEsS0FBSyxHQUFHLElBQVI7QUFDRDtBQUNGO0FBQ0YsU0E3REQ7QUErREEsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBRztBQUNELFFBQUEsS0FBSyxHQUFHLFdBQVcsRUFBbkI7QUFDRCxPQUZELFFBRVMsS0FGVDtBQUdEO0FBRUQ7Ozs7Ozs7OzsyQ0FNdUIsVSxFQUFZO0FBQ2pDLFVBQUksSUFBSSxHQUFHLElBQVg7O0FBRUEsZUFBUyxXQUFULENBQXFCLE9BQXJCLEVBQThCLElBQTlCLEVBQW9DO0FBQ2xDLGVBQ0UsSUFBSSxJQUNKLElBQUksQ0FBQyxRQUFMLEtBQWtCLGVBQVUsWUFENUIsSUFFQSwrQkFBYyxPQUFkLEVBQXVCLElBQXZCLENBRkEsSUFHQSxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFqQixFQUF1QixpQkFBdkIsQ0FKRjtBQU1EOztBQUVELE1BQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBUyxTQUFULEVBQW9CO0FBQ3JDLFlBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxlQUFyQjtBQUFBLFlBQ0UsSUFBSSxHQUFHLFNBQVMsQ0FBQyxXQURuQjs7QUFHQSxZQUFJLFdBQVcsQ0FBQyxTQUFELEVBQVksSUFBWixDQUFmLEVBQWtDO0FBQ2hDLCtCQUFJLFNBQUosRUFBZSxPQUFmLENBQXVCLElBQUksQ0FBQyxVQUE1QjtBQUNBLCtCQUFJLElBQUosRUFBVSxNQUFWO0FBQ0Q7O0FBQ0QsWUFBSSxXQUFXLENBQUMsU0FBRCxFQUFZLElBQVosQ0FBZixFQUFrQztBQUNoQywrQkFBSSxTQUFKLEVBQWUsTUFBZixDQUFzQixJQUFJLENBQUMsVUFBM0I7QUFDQSwrQkFBSSxJQUFKLEVBQVUsTUFBVjtBQUNEOztBQUVELDZCQUFJLFNBQUosRUFBZSxrQkFBZjtBQUNELE9BZEQ7QUFlRDtBQUVEOzs7Ozs7OztnQ0FLWSxTLEVBQVc7QUFDckIsVUFBSSxLQUFLLEdBQUcscUJBQUksS0FBSyxFQUFULEVBQWEsUUFBYixFQUFaO0FBQUEsVUFDRSxPQURGO0FBQUEsVUFFRSxpQkFGRjtBQUFBLFVBR0Usb0JBSEY7QUFBQSxVQUlFLFNBSkY7O0FBTUEsVUFBSSxDQUFDLEtBQUQsSUFBVSxLQUFLLENBQUMsU0FBcEIsRUFBK0I7QUFDN0I7QUFDRDs7QUFFRCxVQUFJLEtBQUssT0FBTCxDQUFhLGlCQUFiLENBQStCLEtBQS9CLE1BQTBDLElBQTlDLEVBQW9EO0FBQ2xELFFBQUEsU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFKLEVBQWI7QUFDQSxRQUFBLE9BQU8sR0FBRywrQkFBYyxLQUFLLE9BQW5CLENBQVY7QUFDQSxRQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLHNCQUFyQixFQUFxQyxTQUFyQztBQUVBLFFBQUEsaUJBQWlCLEdBQUcsS0FBSyxjQUFMLENBQW9CLEtBQXBCLEVBQTJCLE9BQTNCLENBQXBCO0FBQ0EsUUFBQSxvQkFBb0IsR0FBRyxLQUFLLG1CQUFMLENBQXlCLGlCQUF6QixDQUF2Qjs7QUFFQSxZQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsZ0JBQWxCLEVBQW9DO0FBQ2xDLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FDRSx1Q0FERixFQUVFLEtBQUssT0FGUCxFQUdFLFVBSEY7QUFLRDs7QUFDRCxhQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixLQUE5QixFQUFxQyxvQkFBckMsRUFBMkQsU0FBM0Q7QUFDRDs7QUFFRCxVQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkLDZCQUFJLEtBQUssRUFBVCxFQUFhLGVBQWI7QUFDRDtBQUNGO0FBRUQ7Ozs7Ozs7OztxQ0FNaUIsTyxFQUFTO0FBQ3hCLFVBQUksU0FBUyxHQUFHLE9BQU8sSUFBSSxLQUFLLEVBQWhDO0FBQUEsVUFDRSxVQUFVLEdBQUcsS0FBSyxhQUFMLENBQW1CO0FBQUUsUUFBQSxTQUFTLEVBQUU7QUFBYixPQUFuQixDQURmO0FBQUEsVUFFRSxJQUFJLEdBQUcsSUFGVDs7QUFJQSxlQUFTLHFCQUFULENBQStCLFFBQS9CLEVBQXlDO0FBQ3ZDLFlBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFwQjtBQUFBLFlBQ0UsSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQURsQjs7QUFHQSxZQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBTCxLQUFrQixlQUFVLFNBQXhDLEVBQW1EO0FBQ2pELFVBQUEsUUFBUSxDQUFDLFNBQVQsR0FBcUIsSUFBSSxDQUFDLFNBQUwsR0FBaUIsUUFBUSxDQUFDLFNBQS9DO0FBQ0EsK0JBQUksSUFBSixFQUFVLE1BQVY7QUFDRDs7QUFDRCxZQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBTCxLQUFrQixlQUFVLFNBQXhDLEVBQW1EO0FBQ2pELFVBQUEsUUFBUSxDQUFDLFNBQVQsR0FBcUIsUUFBUSxDQUFDLFNBQVQsR0FBcUIsSUFBSSxDQUFDLFNBQS9DO0FBQ0EsK0JBQUksSUFBSixFQUFVLE1BQVY7QUFDRDtBQUNGOztBQUVELGVBQVMsZUFBVCxDQUF5QixTQUF6QixFQUFvQztBQUNsQyxZQUFJLFNBQVMsR0FBRyxxQkFBSSxTQUFKLEVBQWUsTUFBZixFQUFoQjtBQUVBLFFBQUEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsVUFBUyxJQUFULEVBQWU7QUFDL0IsVUFBQSxxQkFBcUIsQ0FBQyxJQUFELENBQXJCO0FBQ0QsU0FGRDtBQUdEOztBQUVELG1DQUFZLFVBQVosRUFBd0IsSUFBeEI7QUFFQSxNQUFBLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFVBQVMsRUFBVCxFQUFhO0FBQzlCLFlBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQkFBYixDQUErQixFQUEvQixNQUF1QyxJQUEzQyxFQUFpRDtBQUMvQyxVQUFBLGVBQWUsQ0FBQyxFQUFELENBQWY7QUFDRDtBQUNGLE9BSkQ7QUFLRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O2tDQWFjLE0sRUFBUTtBQUNwQixVQUFNLFlBQVk7QUFDaEIsUUFBQSxTQUFTLEVBQUUsS0FBSyxFQURBO0FBRWhCLFFBQUEsUUFBUSxFQUFFLGlCQUZNO0FBR2hCLFFBQUEsYUFBYSxFQUFFO0FBSEMsU0FJYixNQUphLENBQWxCOztBQU1BLGFBQU8sb0NBQW1CLFlBQW5CLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7O2dDQU9ZLEUsRUFBSSxRLEVBQVU7QUFDeEIsYUFBTyxvQ0FBbUIsRUFBbkIsRUFBdUIsUUFBdkIsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7OzBDQUtzQjtBQUNwQixVQUFJLFVBQVUsR0FBRyxLQUFLLGFBQUwsRUFBakI7QUFBQSxVQUNFLEtBQUssR0FBRyxLQUFLLEVBRGY7QUFBQSxVQUVFLGFBQWEsR0FBRyxFQUZsQjs7QUFJQSxlQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsVUFBNUIsRUFBd0M7QUFDdEMsWUFBSSxJQUFJLEdBQUcsRUFBWDtBQUFBLFlBQ0UsVUFERjs7QUFHQSxXQUFHO0FBQ0QsVUFBQSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUF6QyxDQUFiO0FBQ0EsVUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEVBQW5CLENBQWI7QUFDQSxVQUFBLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBUjtBQUNELFNBSkQsUUFJUyxFQUFFLEtBQUssVUFBUCxJQUFxQixDQUFDLEVBSi9COztBQU1BLGVBQU8sSUFBUDtBQUNEOztBQUVELG1DQUFZLFVBQVosRUFBd0IsS0FBeEI7QUFFQSxNQUFBLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFVBQVMsU0FBVCxFQUFvQjtBQUNyQyxZQUFJLE1BQU0sR0FBRyxDQUFiO0FBQUEsWUFBZ0I7QUFDZCxRQUFBLE1BQU0sR0FBRyxTQUFTLENBQUMsV0FBVixDQUFzQixNQURqQztBQUFBLFlBRUUsTUFBTSxHQUFHLGNBQWMsQ0FBQyxTQUFELEVBQVksS0FBWixDQUZ6QjtBQUFBLFlBR0UsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFWLENBQW9CLElBQXBCLENBSFo7QUFLQSxRQUFBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLEVBQXBCO0FBQ0EsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQWxCOztBQUVBLFlBQ0UsU0FBUyxDQUFDLGVBQVYsSUFDQSxTQUFTLENBQUMsZUFBVixDQUEwQixRQUExQixLQUF1QyxlQUFVLFNBRm5ELEVBR0U7QUFDQSxVQUFBLE1BQU0sR0FBRyxTQUFTLENBQUMsZUFBVixDQUEwQixNQUFuQztBQUNEOztBQUVELFFBQUEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FDakIsT0FEaUIsRUFFakIsU0FBUyxDQUFDLFdBRk8sRUFHakIsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBSGlCLEVBSWpCLE1BSmlCLEVBS2pCLE1BTGlCLENBQW5CO0FBT0QsT0F2QkQ7QUF5QkEsYUFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLGFBQWYsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7MENBT3NCLEksRUFBTTtBQUMxQixVQUFJLGFBQUo7QUFBQSxVQUNFLFVBQVUsR0FBRyxFQURmO0FBQUEsVUFFRSxJQUFJLEdBQUcsSUFGVDs7QUFJQSxVQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1QsZUFBTyxVQUFQO0FBQ0Q7O0FBRUQsVUFBSTtBQUNGLFFBQUEsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFoQjtBQUNELE9BRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLGNBQU0sdUJBQXVCLENBQTdCO0FBQ0Q7O0FBRUQsZUFBUyxpQkFBVCxDQUEyQixZQUEzQixFQUF5QztBQUN2QyxZQUFJLEVBQUUsR0FBRztBQUNMLFVBQUEsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFELENBRGhCO0FBRUwsVUFBQSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUQsQ0FGYjtBQUdMLFVBQUEsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFELENBQVosQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FIRDtBQUlMLFVBQUEsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFELENBSmY7QUFLTCxVQUFBLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBRDtBQUxmLFNBQVQ7QUFBQSxZQU9FLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSCxDQUFRLEdBQVIsRUFQWjtBQUFBLFlBUUUsSUFBSSxHQUFHLElBQUksQ0FBQyxFQVJkO0FBQUEsWUFTRSxNQVRGO0FBQUEsWUFVRSxTQVZGO0FBQUEsWUFXRSxHQVhGOztBQWFBLGVBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsS0FBUixFQUFkLEVBQWdDO0FBQzlCLFVBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLENBQVA7QUFDRDs7QUFFRCxZQUNFLElBQUksQ0FBQyxVQUFMLENBQWdCLE9BQU8sR0FBRyxDQUExQixLQUNBLElBQUksQ0FBQyxVQUFMLENBQWdCLE9BQU8sR0FBRyxDQUExQixFQUE2QixRQUE3QixLQUEwQyxlQUFVLFNBRnRELEVBR0U7QUFDQSxVQUFBLE9BQU8sSUFBSSxDQUFYO0FBQ0Q7O0FBRUQsUUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBUDtBQUNBLFFBQUEsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFMLENBQWUsRUFBRSxDQUFDLE1BQWxCLENBQVQ7QUFDQSxRQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEVBQUUsQ0FBQyxNQUFwQjs7QUFFQSxZQUFJLE1BQU0sQ0FBQyxXQUFQLElBQXNCLENBQUMsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsU0FBOUMsRUFBeUQ7QUFDdkQsK0JBQUksTUFBTSxDQUFDLFdBQVgsRUFBd0IsTUFBeEI7QUFDRDs7QUFFRCxZQUFJLE1BQU0sQ0FBQyxlQUFQLElBQTBCLENBQUMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsU0FBdEQsRUFBaUU7QUFDL0QsK0JBQUksTUFBTSxDQUFDLGVBQVgsRUFBNEIsTUFBNUI7QUFDRDs7QUFFRCxRQUFBLFNBQVMsR0FBRyxxQkFBSSxNQUFKLEVBQVksSUFBWixDQUFpQix1QkFBTSxRQUFOLENBQWUsRUFBRSxDQUFDLE9BQWxCLEVBQTJCLENBQTNCLENBQWpCLENBQVo7QUFDQSxRQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCO0FBQ0Q7O0FBRUQsTUFBQSxhQUFhLENBQUMsT0FBZCxDQUFzQixVQUFTLFlBQVQsRUFBdUI7QUFDM0MsWUFBSTtBQUNGLFVBQUEsaUJBQWlCLENBQUMsWUFBRCxDQUFqQjtBQUNELFNBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLGNBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUF2QixFQUE2QjtBQUMzQixZQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsb0RBQW9ELENBQWpFO0FBQ0Q7QUFDRjtBQUNGLE9BUkQ7QUFVQSxhQUFPLFVBQVA7QUFDRDs7Ozs7O2VBR1ksb0I7Ozs7OztBQ3pmZjtBQUVBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLEdBQUMsVUFBUyxDQUFULEVBQVk7QUFDWDs7QUFFQSxRQUFNLFdBQVcsR0FBRyxpQkFBcEI7O0FBRUEsYUFBUyxJQUFULENBQWMsRUFBZCxFQUFrQixPQUFsQixFQUEyQjtBQUN6QixhQUFPLFlBQVc7QUFDaEIsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsRUFBbkI7QUFDRCxPQUZEO0FBR0Q7QUFFRDs7Ozs7O0FBTUE7Ozs7Ozs7OztBQU9BLElBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBSyxlQUFMLEdBQXVCLFVBQVMsT0FBVCxFQUFrQjtBQUN2QyxhQUFPLEtBQUssSUFBTCxDQUFVLFlBQVc7QUFDMUIsWUFBSSxFQUFFLEdBQUcsSUFBVDtBQUFBLFlBQ0UsRUFERjs7QUFHQSxZQUFJLENBQUMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQVcsV0FBWCxDQUFMLEVBQThCO0FBQzVCLFVBQUEsRUFBRSxHQUFHLElBQUksZUFBSixDQUFvQixFQUFwQixFQUF3QixPQUF4QixDQUFMO0FBRUEsVUFBQSxFQUFFLENBQUMsT0FBSCxHQUFhLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBSixFQUFhLFVBQVMsT0FBVCxFQUFrQjtBQUM5QyxZQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsRUFBYjtBQUNBLFlBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxDQUFNLFVBQU4sQ0FBaUIsV0FBakI7QUFDRCxXQUhnQixDQUFqQjtBQUtBLFVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLEVBQVcsV0FBWCxFQUF3QixFQUF4QjtBQUNEO0FBQ0YsT0FkTSxDQUFQO0FBZUQsS0FoQkQ7O0FBa0JBLElBQUEsQ0FBQyxDQUFDLEVBQUYsQ0FBSyxjQUFMLEdBQXNCLFlBQVc7QUFDL0IsYUFBTyxLQUFLLElBQUwsQ0FBVSxXQUFWLENBQVA7QUFDRCxLQUZEO0FBR0QsR0E3Q0QsRUE2Q0csTUE3Q0g7QUE4Q0Q7Ozs7Ozs7Ozs7QUNqREQ7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFlBQVksR0FBRztBQUNuQixFQUFBLFNBQVMsRUFBRSxxQkFEUTtBQUVuQixhQUFXLHFCQUZRO0FBR25CLEVBQUEsYUFBYSxFQUFFLHlCQUhJO0FBSW5CLGFBQVc7QUFKUSxDQUFyQjtBQU9BOzs7O0lBR00sZTs7Ozs7O0FBQ0o7Ozs7Ozs7O2tDQVFxQixPLEVBQVM7QUFDNUIsYUFBTywrQkFBYyxPQUFkLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsMkJBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixRQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1osWUFBTSxJQUFJLEtBQUosQ0FBVSx3QkFBVixDQUFOO0FBQ0Q7O0FBRUQsU0FBSyxFQUFMLEdBQVUsT0FBVjtBQUNBLFNBQUssT0FBTDtBQUNFLE1BQUEsS0FBSyxFQUFFLFNBRFQ7QUFFRSxNQUFBLGdCQUFnQixFQUFFLGFBRnBCO0FBR0UsTUFBQSxZQUFZLEVBQUUscUJBSGhCO0FBSUUsTUFBQSxPQUFPLEVBQUUsZUFKWDtBQUtFLE1BQUEsaUJBQWlCLEVBQUUsNkJBQVc7QUFDNUIsZUFBTyxJQUFQO0FBQ0QsT0FQSDtBQVFFLE1BQUEsaUJBQWlCLEVBQUUsNkJBQVc7QUFDNUIsZUFBTyxJQUFQO0FBQ0QsT0FWSDtBQVdFLE1BQUEsZ0JBQWdCLEVBQUUsNEJBQVcsQ0FBRTtBQVhqQyxPQVlLLE9BWkw7QUFlQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQ0Usa0VBREYsRUFFRSxPQUZGO0FBSUEsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDZDQUFaLEVBQTJELEtBQUssT0FBaEU7O0FBRUEsUUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxPQUFkLENBQWpCLEVBQXlDO0FBQ3ZDLFlBQU0sSUFBSSxLQUFKLENBQ0osdUVBREksQ0FBTjtBQUdEOztBQUVELFNBQUssV0FBTCxHQUFtQixJQUFJLFlBQVksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxPQUFkLENBQWhCLENBQ2pCLEtBQUssRUFEWSxFQUVqQixLQUFLLE9BRlksQ0FBbkI7QUFLQSx5QkFBSSxLQUFLLEVBQVQsRUFBYSxRQUFiLENBQXNCLEtBQUssT0FBTCxDQUFhLFlBQW5DO0FBQ0EsNEJBQVcsS0FBSyxFQUFoQixFQUFvQixJQUFwQjtBQUNEO0FBRUQ7Ozs7Ozs7Ozs4QkFLVTtBQUNSLGdDQUFhLEtBQUssRUFBbEIsRUFBc0IsSUFBdEI7QUFDQSwyQkFBSSxLQUFLLEVBQVQsRUFBYSxXQUFiLENBQXlCLEtBQUssT0FBTCxDQUFhLFlBQXRDO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsV0FBSyxXQUFMO0FBQ0Q7OztnQ0FFVyxTLEVBQVc7QUFDckIsV0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTZCLFNBQTdCO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7bUNBUWUsSyxFQUFPLE8sRUFBUztBQUM3QixhQUFPLEtBQUssV0FBTCxDQUFpQixjQUFqQixDQUFnQyxLQUFoQyxFQUF1QyxPQUF2QyxDQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7O3dDQVNvQixVLEVBQVk7QUFDOUIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsbUJBQWpCLENBQXFDLFVBQXJDLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs2QkFLUyxLLEVBQU87QUFDZCxXQUFLLE9BQUwsQ0FBYSxLQUFiLEdBQXFCLEtBQXJCO0FBQ0Q7QUFFRDs7Ozs7Ozs7K0JBS1c7QUFDVCxhQUFPLEtBQUssT0FBTCxDQUFhLEtBQXBCO0FBQ0Q7QUFFRDs7Ozs7Ozs7O3FDQU1pQixPLEVBQVM7QUFDeEIsV0FBSyxXQUFMLENBQWlCLGdCQUFqQixDQUFrQyxPQUFsQztBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBYWMsTSxFQUFRO0FBQ3BCLGFBQU8sS0FBSyxXQUFMLENBQWlCLGFBQWpCLENBQStCLE1BQS9CLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7O2dDQU9ZLEUsRUFBSTtBQUNkLGFBQU8sS0FBSyxXQUFMLENBQWlCLFdBQWpCLENBQTZCLEVBQTdCLEVBQWlDLGlCQUFqQyxDQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7d0NBUW9CLEUsRUFBSTtBQUN0QixhQUFPLEtBQUssV0FBTCxDQUFpQixtQkFBakIsQ0FBcUMsRUFBckMsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7MENBT3NCLEksRUFBTTtBQUMxQixhQUFPLEtBQUssV0FBTCxDQUFpQixxQkFBakIsQ0FBdUMsSUFBdkMsQ0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozt5QkFNSyxJLEVBQU0sYSxFQUFlO0FBQ3hCLFVBQUksR0FBRyxHQUFHLHFCQUFJLEtBQUssRUFBVCxFQUFhLFNBQWIsRUFBVjtBQUFBLFVBQ0UsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQURoQjtBQUFBLFVBRUUsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUZoQjtBQUFBLFVBR0UsUUFBUSxHQUFHLE9BQU8sYUFBUCxLQUF5QixXQUF6QixHQUF1QyxJQUF2QyxHQUE4QyxhQUgzRDtBQUtBLDJCQUFJLEtBQUssRUFBVCxFQUFhLGVBQWI7O0FBRUEsVUFBSSxHQUFHLENBQUMsSUFBUixFQUFjO0FBQ1osZUFBTyxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsRUFBZSxRQUFmLENBQVAsRUFBaUM7QUFDL0IsZUFBSyxXQUFMLENBQWlCLElBQWpCO0FBQ0Q7QUFDRixPQUpELE1BSU8sSUFBSSxHQUFHLENBQUMsUUFBSixDQUFhLElBQWIsQ0FBa0IsZUFBdEIsRUFBdUM7QUFDNUMsWUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQUosQ0FBYSxJQUFiLENBQWtCLGVBQWxCLEVBQWhCO0FBQ0EsUUFBQSxTQUFTLENBQUMsaUJBQVYsQ0FBNEIsS0FBSyxFQUFqQzs7QUFDQSxlQUFPLFNBQVMsQ0FBQyxRQUFWLENBQW1CLElBQW5CLEVBQXlCLENBQXpCLEVBQTRCLFFBQVEsR0FBRyxDQUFILEdBQU8sQ0FBM0MsQ0FBUCxFQUFzRDtBQUNwRCxjQUNFLENBQUMscUJBQUksS0FBSyxFQUFULEVBQWEsUUFBYixDQUFzQixTQUFTLENBQUMsYUFBVixFQUF0QixDQUFELElBQ0EsU0FBUyxDQUFDLGFBQVYsT0FBOEIsS0FBSyxFQUZyQyxFQUdFO0FBQ0E7QUFDRDs7QUFFRCxVQUFBLFNBQVMsQ0FBQyxNQUFWO0FBQ0EsZUFBSyxXQUFMLENBQWlCLElBQWpCO0FBQ0EsVUFBQSxTQUFTLENBQUMsUUFBVixDQUFtQixLQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsMkJBQUksS0FBSyxFQUFULEVBQWEsZUFBYjtBQUNBLE1BQUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLE9BQXRCO0FBQ0Q7Ozs7OztlQUdZLGU7Ozs7Ozs7Ozs7O0FDclFmOzs7OztBQUtPLFNBQVMsTUFBVCxDQUFnQixHQUFoQixFQUFxQjtBQUMxQixTQUFPLEdBQUcsQ0FBQyxNQUFKLENBQVcsVUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCLElBQXJCLEVBQTJCO0FBQzNDLFdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLE1BQXdCLEdBQS9CO0FBQ0QsR0FGTSxDQUFQO0FBR0Q7Ozs7Ozs7OztBQ1RNLElBQU0sU0FBUyxHQUFHO0FBQUUsRUFBQSxZQUFZLEVBQUUsQ0FBaEI7QUFBbUIsRUFBQSxTQUFTLEVBQUU7QUFBOUIsQ0FBbEI7QUFFUDs7Ozs7Ozs7QUFLQSxJQUFNLEdBQUcsR0FBRyxTQUFOLEdBQU0sQ0FBUyxFQUFULEVBQWE7QUFDdkI7QUFBTztBQUFtQjtBQUN4Qjs7OztBQUlBLE1BQUEsUUFBUSxFQUFFLGtCQUFTLFNBQVQsRUFBb0I7QUFDNUIsWUFBSSxFQUFFLENBQUMsU0FBUCxFQUFrQjtBQUNoQixVQUFBLEVBQUUsQ0FBQyxTQUFILENBQWEsR0FBYixDQUFpQixTQUFqQjtBQUNELFNBRkQsTUFFTztBQUNMLFVBQUEsRUFBRSxDQUFDLFNBQUgsSUFBZ0IsTUFBTSxTQUF0QjtBQUNEO0FBQ0YsT0FYdUI7O0FBYXhCOzs7O0FBSUEsTUFBQSxXQUFXLEVBQUUscUJBQVMsU0FBVCxFQUFvQjtBQUMvQixZQUFJLEVBQUUsQ0FBQyxTQUFQLEVBQWtCO0FBQ2hCLFVBQUEsRUFBRSxDQUFDLFNBQUgsQ0FBYSxNQUFiLENBQW9CLFNBQXBCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsVUFBQSxFQUFFLENBQUMsU0FBSCxHQUFlLEVBQUUsQ0FBQyxTQUFILENBQWEsT0FBYixDQUNiLElBQUksTUFBSixDQUFXLFlBQVksU0FBWixHQUF3QixTQUFuQyxFQUE4QyxJQUE5QyxDQURhLEVBRWIsR0FGYSxDQUFmO0FBSUQ7QUFDRixPQTFCdUI7O0FBNEJ4Qjs7OztBQUlBLE1BQUEsT0FBTyxFQUFFLGlCQUFTLGNBQVQsRUFBeUI7QUFDaEMsWUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsY0FBM0IsQ0FBWjtBQUFBLFlBQ0UsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQURaOztBQUdBLGVBQU8sQ0FBQyxFQUFSLEVBQVk7QUFDVixVQUFBLEVBQUUsQ0FBQyxZQUFILENBQWdCLEtBQUssQ0FBQyxDQUFELENBQXJCLEVBQTBCLEVBQUUsQ0FBQyxVQUE3QjtBQUNEO0FBQ0YsT0F2Q3VCOztBQXlDeEI7Ozs7QUFJQSxNQUFBLE1BQU0sRUFBRSxnQkFBUyxhQUFULEVBQXdCO0FBQzlCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLGFBQTNCLENBQVo7O0FBRUEsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFSLEVBQVcsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUE1QixFQUFvQyxDQUFDLEdBQUcsR0FBeEMsRUFBNkMsRUFBRSxDQUEvQyxFQUFrRDtBQUNoRCxVQUFBLEVBQUUsQ0FBQyxXQUFILENBQWUsS0FBSyxDQUFDLENBQUQsQ0FBcEI7QUFDRDtBQUNGLE9BbkR1Qjs7QUFxRHhCOzs7OztBQUtBLE1BQUEsV0FBVyxFQUFFLHFCQUFTLEtBQVQsRUFBZ0I7QUFDM0IsZUFBTyxLQUFLLENBQUMsVUFBTixDQUFpQixZQUFqQixDQUE4QixFQUE5QixFQUFrQyxLQUFLLENBQUMsV0FBeEMsQ0FBUDtBQUNELE9BNUR1Qjs7QUE4RHhCOzs7OztBQUtBLE1BQUEsWUFBWSxFQUFFLHNCQUFTLEtBQVQsRUFBZ0I7QUFDNUIsZUFBTyxLQUFLLENBQUMsVUFBTixDQUFpQixZQUFqQixDQUE4QixFQUE5QixFQUFrQyxLQUFsQyxDQUFQO0FBQ0QsT0FyRXVCOztBQXVFeEI7OztBQUdBLE1BQUEsTUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFFBQUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxXQUFkLENBQTBCLEVBQTFCO0FBQ0EsUUFBQSxFQUFFLEdBQUcsSUFBTDtBQUNELE9BN0V1Qjs7QUErRXhCOzs7OztBQUtBLE1BQUEsUUFBUSxFQUFFLGtCQUFTLEtBQVQsRUFBZ0I7QUFDeEIsZUFBTyxFQUFFLEtBQUssS0FBUCxJQUFnQixFQUFFLENBQUMsUUFBSCxDQUFZLEtBQVosQ0FBdkI7QUFDRCxPQXRGdUI7O0FBd0Z4Qjs7Ozs7QUFLQSxNQUFBLElBQUksRUFBRSxjQUFTLE9BQVQsRUFBa0I7QUFDdEIsWUFBSSxFQUFFLENBQUMsVUFBUCxFQUFtQjtBQUNqQixVQUFBLEVBQUUsQ0FBQyxVQUFILENBQWMsWUFBZCxDQUEyQixPQUEzQixFQUFvQyxFQUFwQztBQUNEOztBQUVELFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsRUFBcEI7QUFDQSxlQUFPLE9BQVA7QUFDRCxPQXBHdUI7O0FBc0d4Qjs7OztBQUlBLE1BQUEsTUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLEVBQUUsQ0FBQyxVQUE5QixDQUFaO0FBQUEsWUFDRSxPQURGO0FBR0EsUUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQVMsSUFBVCxFQUFlO0FBQzNCLFVBQUEsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFmO0FBQ0EsVUFBQSxHQUFHLENBQUMsSUFBRCxDQUFILENBQVUsWUFBVixDQUF1QixJQUFJLENBQUMsVUFBNUI7QUFDRCxTQUhEO0FBSUEsUUFBQSxHQUFHLENBQUMsT0FBRCxDQUFILENBQWEsTUFBYjtBQUVBLGVBQU8sS0FBUDtBQUNELE9Bckh1Qjs7QUF1SHhCOzs7O0FBSUEsTUFBQSxPQUFPLEVBQUUsbUJBQVc7QUFDbEIsWUFBSSxNQUFKO0FBQUEsWUFDRSxJQUFJLEdBQUcsRUFEVDs7QUFHQSxlQUFRLE1BQU0sR0FBRyxFQUFFLENBQUMsVUFBcEIsRUFBaUM7QUFDL0IsVUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVY7QUFDQSxVQUFBLEVBQUUsR0FBRyxNQUFMO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0QsT0FySXVCOztBQXVJeEI7Ozs7QUFJQSxNQUFBLHNCQUFzQixFQUFFLGtDQUFXO0FBQ2pDLGVBQU8sS0FBSyxPQUFMLEdBQWUsTUFBZixDQUFzQixVQUFBLElBQUk7QUFBQSxpQkFBSSxJQUFJLEtBQUssUUFBYjtBQUFBLFNBQTFCLENBQVA7QUFDRCxPQTdJdUI7O0FBK0l4Qjs7Ozs7QUFLQSxNQUFBLGtCQUFrQixFQUFFLDhCQUFXO0FBQzdCLFlBQUksQ0FBQyxFQUFMLEVBQVM7QUFDUDtBQUNEOztBQUVELFlBQUksRUFBRSxDQUFDLFFBQUgsS0FBZ0IsU0FBUyxDQUFDLFNBQTlCLEVBQXlDO0FBQ3ZDLGlCQUNFLEVBQUUsQ0FBQyxXQUFILElBQ0EsRUFBRSxDQUFDLFdBQUgsQ0FBZSxRQUFmLEtBQTRCLFNBQVMsQ0FBQyxTQUZ4QyxFQUdFO0FBQ0EsWUFBQSxFQUFFLENBQUMsU0FBSCxJQUFnQixFQUFFLENBQUMsV0FBSCxDQUFlLFNBQS9CO0FBQ0EsWUFBQSxFQUFFLENBQUMsVUFBSCxDQUFjLFdBQWQsQ0FBMEIsRUFBRSxDQUFDLFdBQTdCO0FBQ0Q7QUFDRixTQVJELE1BUU87QUFDTCxVQUFBLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBSixDQUFILENBQW1CLGtCQUFuQjtBQUNEOztBQUNELFFBQUEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFKLENBQUgsQ0FBb0Isa0JBQXBCO0FBQ0QsT0FyS3VCOztBQXVLeEI7Ozs7QUFJQSxNQUFBLEtBQUssRUFBRSxpQkFBVztBQUNoQixlQUFPLEVBQUUsQ0FBQyxLQUFILENBQVMsZUFBaEI7QUFDRCxPQTdLdUI7O0FBK0t4Qjs7Ozs7QUFLQSxNQUFBLFFBQVEsRUFBRSxrQkFBUyxJQUFULEVBQWU7QUFDdkIsWUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjtBQUNBLFFBQUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsSUFBaEI7QUFDQSxlQUFPLEdBQUcsQ0FBQyxVQUFYO0FBQ0QsT0F4THVCOztBQTBMeEI7Ozs7QUFJQSxNQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixZQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRCxDQUFILENBQVEsWUFBUixFQUFoQjtBQUFBLFlBQ0UsS0FERjs7QUFHQSxZQUFJLFNBQVMsQ0FBQyxVQUFWLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCLFVBQUEsS0FBSyxHQUFHLFNBQVMsQ0FBQyxVQUFWLENBQXFCLENBQXJCLENBQVI7QUFDRDs7QUFFRCxlQUFPLEtBQVA7QUFDRCxPQXZNdUI7O0FBeU14Qjs7O0FBR0EsTUFBQSxlQUFlLEVBQUUsMkJBQVc7QUFDMUIsWUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLEVBQUQsQ0FBSCxDQUFRLFlBQVIsRUFBaEI7QUFDQSxRQUFBLFNBQVMsQ0FBQyxlQUFWO0FBQ0QsT0EvTXVCOztBQWlOeEI7Ozs7QUFJQSxNQUFBLFlBQVksRUFBRSx3QkFBVztBQUN2QixlQUFPLEdBQUcsQ0FBQyxFQUFELENBQUgsQ0FDSixTQURJLEdBRUosWUFGSSxFQUFQO0FBR0QsT0F6TnVCOztBQTJOeEI7Ozs7QUFJQSxNQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQixlQUFPLEdBQUcsQ0FBQyxFQUFELENBQUgsQ0FBUSxXQUFSLEdBQXNCLFdBQTdCO0FBQ0QsT0FqT3VCOztBQW1PeEI7Ozs7QUFJQSxNQUFBLFdBQVcsRUFBRSx1QkFBVztBQUN0QjtBQUNBLGVBQU8sRUFBRSxDQUFDLGFBQUgsSUFBb0IsRUFBM0I7QUFDRCxPQTFPdUI7O0FBMk94Qjs7Ozs7OztBQU9BLE1BQUEsT0FBTyxFQUFFLGlCQUFTLFlBQVQsRUFBdUIsV0FBdkIsRUFBb0M7QUFDM0MsWUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFdBQWpCO0FBQ0EsWUFBSSxPQUFPLEdBQUcsS0FBZDs7QUFDQSxlQUFPLE9BQU8sSUFBSSxDQUFDLE9BQW5CLEVBQTRCO0FBQzFCLGNBQUksT0FBTyxLQUFLLFlBQWhCLEVBQThCO0FBQzVCLFlBQUEsT0FBTyxHQUFHLElBQVY7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFiLEVBQTBCO0FBQ3hCLGNBQUEsT0FBTyxHQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsV0FBeEI7QUFDRCxhQUZELE1BRU87QUFDTCxjQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBbEI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0QsZUFBTyxPQUFQO0FBQ0Q7QUFqUXVCO0FBQTFCO0FBbVFELENBcFFEOztlQXNRZSxHOzs7Ozs7Ozs7Ozs7QUM3UVIsU0FBUyxVQUFULENBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLEVBQStCO0FBQ3BDLEVBQUEsRUFBRSxDQUFDLGdCQUFILENBQW9CLFNBQXBCLEVBQStCLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUF2QixDQUE0QixLQUE1QixDQUEvQjtBQUNBLEVBQUEsRUFBRSxDQUFDLGdCQUFILENBQW9CLFVBQXBCLEVBQWdDLEtBQUssQ0FBQyxnQkFBTixDQUF1QixJQUF2QixDQUE0QixLQUE1QixDQUFoQztBQUNEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixFQUF0QixFQUEwQixLQUExQixFQUFpQztBQUN0QyxFQUFBLEVBQUUsQ0FBQyxtQkFBSCxDQUF1QixTQUF2QixFQUFrQyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsSUFBdkIsQ0FBNEIsS0FBNUIsQ0FBbEM7QUFDQSxFQUFBLEVBQUUsQ0FBQyxtQkFBSCxDQUF1QixVQUF2QixFQUFtQyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsSUFBdkIsQ0FBNEIsS0FBNUIsQ0FBbkM7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JEOztBQUNBOzs7Ozs7Ozs7O0FBRUE7Ozs7O0FBS08sU0FBUyxxQkFBVCxDQUErQixLQUEvQixFQUFzQztBQUMzQyxNQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBM0I7QUFBQSxNQUNFLFlBQVksR0FBRyxLQUFLLENBQUMsWUFEdkI7QUFBQSxNQUVFLFFBQVEsR0FBRyxLQUFLLENBQUMsdUJBRm5CO0FBQUEsTUFHRSxRQUFRLEdBQUcsSUFIYjs7QUFLQSxNQUFJLEtBQUssQ0FBQyxTQUFOLEtBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLFdBQ0UsQ0FBQyxZQUFZLENBQUMsZUFBZCxJQUNBLFlBQVksQ0FBQyxVQUFiLEtBQTRCLFFBRjlCLEVBR0U7QUFDQSxNQUFBLFlBQVksR0FBRyxZQUFZLENBQUMsVUFBNUI7QUFDRDs7QUFDRCxJQUFBLFlBQVksR0FBRyxZQUFZLENBQUMsZUFBNUI7QUFDRCxHQVJELE1BUU8sSUFBSSxZQUFZLENBQUMsUUFBYixLQUEwQixlQUFVLFNBQXhDLEVBQW1EO0FBQ3hELFFBQUksS0FBSyxDQUFDLFNBQU4sR0FBa0IsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsTUFBN0MsRUFBcUQ7QUFDbkQsTUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixLQUFLLENBQUMsU0FBN0I7QUFDRDtBQUNGLEdBSk0sTUFJQSxJQUFJLEtBQUssQ0FBQyxTQUFOLEdBQWtCLENBQXRCLEVBQXlCO0FBQzlCLElBQUEsWUFBWSxHQUFHLFlBQVksQ0FBQyxVQUFiLENBQXdCLElBQXhCLENBQTZCLEtBQUssQ0FBQyxTQUFOLEdBQWtCLENBQS9DLENBQWY7QUFDRDs7QUFFRCxNQUFJLGNBQWMsQ0FBQyxRQUFmLEtBQTRCLGVBQVUsU0FBMUMsRUFBcUQ7QUFDbkQsUUFBSSxLQUFLLENBQUMsV0FBTixLQUFzQixjQUFjLENBQUMsU0FBZixDQUF5QixNQUFuRCxFQUEyRDtBQUN6RCxNQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0QsS0FGRCxNQUVPLElBQUksS0FBSyxDQUFDLFdBQU4sR0FBb0IsQ0FBeEIsRUFBMkI7QUFDaEMsTUFBQSxjQUFjLEdBQUcsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsS0FBSyxDQUFDLFdBQS9CLENBQWpCOztBQUNBLFVBQUksWUFBWSxLQUFLLGNBQWMsQ0FBQyxlQUFwQyxFQUFxRDtBQUNuRCxRQUFBLFlBQVksR0FBRyxjQUFmO0FBQ0Q7QUFDRjtBQUNGLEdBVEQsTUFTTyxJQUFJLEtBQUssQ0FBQyxXQUFOLEdBQW9CLGNBQWMsQ0FBQyxVQUFmLENBQTBCLE1BQWxELEVBQTBEO0FBQy9ELElBQUEsY0FBYyxHQUFHLGNBQWMsQ0FBQyxVQUFmLENBQTBCLElBQTFCLENBQStCLEtBQUssQ0FBQyxXQUFyQyxDQUFqQjtBQUNELEdBRk0sTUFFQTtBQUNMLElBQUEsY0FBYyxHQUFHLGNBQWMsQ0FBQyxXQUFoQztBQUNEOztBQUVELFNBQU87QUFDTCxJQUFBLGNBQWMsRUFBRSxjQURYO0FBRUwsSUFBQSxZQUFZLEVBQUUsWUFGVDtBQUdMLElBQUEsUUFBUSxFQUFFO0FBSEwsR0FBUDtBQUtEO0FBRUQ7Ozs7Ozs7QUFLTyxTQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEIsVUFBMUIsRUFBc0M7QUFDM0MsRUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUN0QixXQUNFLHFCQUFJLFVBQVUsR0FBRyxDQUFILEdBQU8sQ0FBckIsRUFBd0IsT0FBeEIsR0FBa0MsTUFBbEMsR0FDQSxxQkFBSSxVQUFVLEdBQUcsQ0FBSCxHQUFPLENBQXJCLEVBQXdCLE9BQXhCLEdBQWtDLE1BRnBDO0FBSUQsR0FMRDtBQU1EO0FBRUQ7Ozs7Ozs7O0FBTU8sU0FBUyxhQUFULENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCO0FBQ2xDLFNBQU8scUJBQUksQ0FBSixFQUFPLEtBQVAsT0FBbUIscUJBQUksQ0FBSixFQUFPLEtBQVAsRUFBMUI7QUFDRDtBQUVEOzs7Ozs7Ozs7QUFPTyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDckMsTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBWDtBQUNBLEVBQUEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxlQUFYLEdBQTZCLE9BQU8sQ0FBQyxLQUFyQztBQUNBLEVBQUEsSUFBSSxDQUFDLFNBQUwsR0FBaUIsT0FBTyxDQUFDLGdCQUF6QjtBQUNBLFNBQU8sSUFBUDtBQUNEOztBQUVNLFNBQVMsc0JBQVQsQ0FBZ0MsT0FBaEMsRUFBeUMsb0JBQXpDLEVBQStEO0FBQ3BFLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx3QkFBWixFQUFzQyxPQUF0QztBQUNBLE1BQUksZUFBZSxHQUFHLE9BQXRCO0FBQ0EsTUFBSSxDQUFDLEdBQUcsQ0FBUjs7QUFDQSxTQUFPLGVBQWUsSUFBSSxlQUFlLENBQUMsUUFBaEIsS0FBNkIsZUFBVSxTQUFqRSxFQUE0RTtBQUMxRSxJQUFBLE9BQU8sQ0FBQyxHQUFSLGdDQUFvQyxDQUFwQyxHQUF5QyxlQUF6Qzs7QUFDQSxRQUFJLG9CQUFvQixLQUFLLE9BQTdCLEVBQXNDO0FBQ3BDLFVBQUksZUFBZSxDQUFDLFVBQWhCLENBQTJCLE1BQTNCLEdBQW9DLENBQXhDLEVBQTJDO0FBQ3pDLFFBQUEsZUFBZSxHQUFHLGVBQWUsQ0FBQyxVQUFoQixDQUEyQixDQUEzQixDQUFsQjtBQUNELE9BRkQsTUFFTztBQUNMLFFBQUEsZUFBZSxHQUFHLGVBQWUsQ0FBQyxXQUFsQztBQUNEO0FBQ0YsS0FORCxNQU1PLElBQUksb0JBQW9CLEtBQUssS0FBN0IsRUFBb0M7QUFDekMsVUFBSSxlQUFlLENBQUMsVUFBaEIsQ0FBMkIsTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkM7QUFDekMsWUFBSSxTQUFTLEdBQUcsZUFBZSxDQUFDLFVBQWhCLENBQTJCLE1BQTNCLEdBQW9DLENBQXBEO0FBQ0EsUUFBQSxlQUFlLEdBQUcsZUFBZSxDQUFDLFVBQWhCLENBQTJCLFNBQTNCLENBQWxCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsUUFBQSxlQUFlLEdBQUcsZUFBZSxDQUFDLGVBQWxDO0FBQ0Q7QUFDRixLQVBNLE1BT0E7QUFDTCxNQUFBLGVBQWUsR0FBRyxJQUFsQjtBQUNEOztBQUNELElBQUEsQ0FBQztBQUNGOztBQUVELEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw4QkFBWixFQUE0QyxlQUE1QztBQUNBLFNBQU8sZUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7O0FBTU8sU0FBUyxpQkFBVCxDQUEyQixTQUEzQixFQUFzQyxVQUF0QyxFQUFrRDtBQUN2RCxNQUFJLFdBQVcsR0FBRyxVQUFsQjtBQUNBLE1BQUksYUFBYSxHQUFHLENBQXBCO0FBQ0EsTUFBSSxnQkFBZ0IsR0FBRyxDQUF2QjtBQUNBLE1BQUksYUFBYSxHQUFHLEtBQXBCOztBQUVBLFNBQ0UsV0FBVyxJQUNYLENBQUMsYUFERCxLQUVDLGFBQWEsR0FBRyxTQUFTLENBQUMsTUFBMUIsSUFDRSxhQUFhLEtBQUssU0FBUyxDQUFDLE1BQTVCLElBQXNDLFdBQVcsQ0FBQyxVQUFaLENBQXVCLE1BQXZCLEdBQWdDLENBSHpFLENBREYsRUFLRTtBQUNBLFFBQU0sZUFBZSxHQUFHLGFBQWEsR0FBRyxXQUFXLENBQUMsV0FBWixDQUF3QixNQUFoRTs7QUFFQSxRQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsTUFBaEMsRUFBd0M7QUFDdEMsVUFBSSxXQUFXLENBQUMsVUFBWixDQUF1QixNQUF2QixLQUFrQyxDQUF0QyxFQUF5QztBQUN2QyxRQUFBLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLGFBQXRDO0FBQ0EsUUFBQSxhQUFhLEdBQUcsSUFBaEI7QUFDQSxRQUFBLGFBQWEsR0FBRyxhQUFhLEdBQUcsZ0JBQWhDO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsUUFBQSxXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVosQ0FBdUIsQ0FBdkIsQ0FBZDtBQUNEO0FBQ0YsS0FSRCxNQVFPO0FBQ0wsTUFBQSxhQUFhLEdBQUcsZUFBaEI7QUFDQSxNQUFBLFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBMUI7QUFDRDtBQUNGOztBQUVELFNBQU87QUFBRSxJQUFBLElBQUksRUFBRSxXQUFSO0FBQXFCLElBQUEsTUFBTSxFQUFFO0FBQTdCLEdBQVA7QUFDRDs7QUFFTSxTQUFTLGdCQUFULENBQTBCLFlBQTFCLEVBQXdDLFdBQXhDLEVBQXFEO0FBQzFELE1BQUksTUFBTSxHQUFHLENBQWI7QUFDQSxNQUFJLFVBQUo7QUFFQSxNQUFJLGNBQWMsR0FBRyxZQUFyQjs7QUFDQSxLQUFHO0FBQ0QsSUFBQSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FDWCxjQUFjLENBQUMsVUFBZixDQUEwQixVQURmLENBQWI7QUFHQSxRQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLGNBQW5CLENBQTFCO0FBQ0EsUUFBTSxxQkFBcUIsR0FBRyxtQkFBbUIsQ0FDL0MsVUFEK0MsRUFFL0MsaUJBRitDLENBQWpEO0FBSUEsSUFBQSxNQUFNLElBQUkscUJBQVY7QUFDQSxJQUFBLGNBQWMsR0FBRyxjQUFjLENBQUMsVUFBaEM7QUFDRCxHQVhELFFBV1MsY0FBYyxLQUFLLFdBQW5CLElBQWtDLENBQUMsY0FYNUM7O0FBYUEsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsU0FBUyxtQkFBVCxDQUE2QixVQUE3QixFQUF5QyxRQUF6QyxFQUFtRDtBQUNqRCxNQUFJLFVBQVUsR0FBRyxDQUFqQjs7QUFDQSxPQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFFBQXBCLEVBQThCLENBQUMsRUFBL0IsRUFBbUM7QUFDakMsUUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLENBQUQsQ0FBOUIsQ0FEaUMsQ0FFakM7QUFDQTs7QUFDQSxRQUFNLElBQUksR0FBRyxXQUFXLENBQUMsV0FBekI7O0FBQ0EsUUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUExQixFQUE2QjtBQUMzQixNQUFBLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBbkI7QUFDRDtBQUNGOztBQUNELFNBQU8sVUFBUDtBQUNEOztBQUVNLFNBQVMsd0JBQVQsQ0FBa0MsUUFBbEMsRUFBNEM7QUFDakQsTUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQTVCO0FBQ0EsTUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQTVCO0FBQ0EsTUFBSSxPQUFPLEdBQUcscUJBQUksWUFBSixFQUFrQixzQkFBbEIsRUFBZDtBQUNBLE1BQUksQ0FBQyxHQUFHLENBQVI7QUFDQSxNQUFJLG9CQUFvQixHQUFHLElBQTNCO0FBQ0EsTUFBSSxtQkFBbUIsR0FBRyxLQUExQjs7QUFDQSxTQUFPLENBQUMsb0JBQUQsSUFBeUIsQ0FBQyxtQkFBMUIsSUFBaUQsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFwRSxFQUE0RTtBQUMxRSxRQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBRCxDQUE3Qjs7QUFFQSxRQUFJLGFBQWEsQ0FBQyxRQUFkLENBQXVCLFlBQXZCLENBQUosRUFBMEM7QUFDeEMsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHVDQUFaLEVBQXFELGFBQXJEOztBQUNBLFVBQUksQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNULFFBQUEsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFMLENBQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxtQkFBbUIsR0FBRyxJQUF0QjtBQUNEO0FBQ0Y7O0FBQ0QsSUFBQSxDQUFDO0FBQ0Y7O0FBRUQsU0FBTyxvQkFBUDtBQUNEOztBQUVELElBQU0sd0JBQXdCLEdBQUc7QUFDL0IsRUFBQSxLQUFLLEVBQUUsaUJBRHdCO0FBRS9CLEVBQUEsR0FBRyxFQUFFO0FBRjBCLENBQWpDO0FBS0EsSUFBTSw4QkFBOEIsR0FBRztBQUNyQyxFQUFBLEtBQUssRUFBRSxhQUQ4QjtBQUVyQyxFQUFBLEdBQUcsRUFBRTtBQUZnQyxDQUF2Qzs7QUFLQSxTQUFTLHlCQUFULENBQW1DLFNBQW5DLEVBQThDLFNBQTlDLEVBQXlEO0FBQ3ZELE1BQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFELENBQXZCOztBQUNBLFNBQU8sT0FBUCxFQUFnQjtBQUNkLElBQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsV0FBckIsQ0FBaUMsT0FBakM7QUFDQSxJQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFqQjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7QUFNQSxTQUFTLGdDQUFULENBQTBDLFNBQTFDLEVBQXFELFNBQXJELEVBQWdFO0FBQzlELE1BQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFELENBQXZCOztBQUNBLFNBQU8sT0FBUCxFQUFnQjtBQUNkLFFBQUksT0FBTyxDQUFDLFFBQVIsS0FBcUIsZUFBVSxTQUFuQyxFQUE4QztBQUM1QyxNQUFBLFNBQVMsQ0FBQyxXQUFWLElBQXlCLE9BQU8sQ0FBQyxXQUFqQztBQUNBLE1BQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsV0FBckIsQ0FBaUMsT0FBakM7QUFDQSxNQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFqQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFTSxTQUFTLGlDQUFULENBQTJDLE1BQTNDLEVBQW1EO0FBQ3hELE1BQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFyQjtBQUNBLE1BQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxlQUE3QjtBQUNBLE1BQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFyQjtBQUNBLE1BQUksbUJBQW1CLEdBQUcsTUFBTSxDQUFDLG1CQUFqQztBQUVBLE1BQUksbUJBQW1CLEdBQUcsZUFBZSxDQUFDLFNBQWhCLENBQTBCLElBQTFCLENBQTFCLENBTndELENBUXhEO0FBQ0E7O0FBQ0EsTUFBSSxvQkFBb0IsR0FBRyxtQkFBbUIsS0FBSyxPQUF4QixHQUFrQyxLQUFsQyxHQUEwQyxPQUFyRTtBQUNBLE1BQUksV0FBVyxHQUFHLHNCQUFzQixDQUN0QyxtQkFEc0MsRUFFdEMsb0JBRnNDLENBQXhDO0FBSUEsTUFBSSxpQkFBaUIsR0FBRyxXQUFXLENBQUMsVUFBcEM7QUFFQSxFQUFBLHlCQUF5QixDQUN2QixXQUR1QixFQUV2Qix3QkFBd0IsQ0FBQyxtQkFBRCxDQUZELENBQXpCO0FBS0EsRUFBQSxnQ0FBZ0MsQ0FDOUIsV0FEOEIsRUFFOUIsOEJBQThCLENBQUMsbUJBQUQsQ0FGQSxDQUFoQztBQUtBLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLFdBQTdCO0FBQ0EsRUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHFCQUFaLEVBQW1DLGlCQUFuQyxFQTVCd0QsQ0E4QnhEOztBQUNBLE1BQ0UsaUJBQWlCLEtBQUssbUJBQXRCLElBQ0EsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsUUFBNUIsQ0FBcUMsT0FBTyxDQUFDLGdCQUE3QyxDQUZGLEVBR0U7QUFDQSx5QkFBSSxpQkFBSixFQUF1QixNQUF2QjtBQUNELEdBcEN1RCxDQXNDeEQ7QUFDQTs7O0FBQ0EsRUFBQSxPQUFPLENBQUMsVUFBUixDQUFtQixXQUFuQixDQUErQixPQUEvQjtBQUVBLFNBQU87QUFBRSxJQUFBLG1CQUFtQixFQUFuQixtQkFBRjtBQUF1QixJQUFBLFdBQVcsRUFBWDtBQUF2QixHQUFQO0FBQ0Q7O0FBRUQsU0FBUyx5QkFBVCxDQUFtQyxvQkFBbkMsRUFBeUQsT0FBekQsRUFBa0U7QUFDaEUsTUFBTSxnQkFBZ0IsR0FBRyxFQUF6QjtBQUNBLE1BQUksbUJBQW1CLEdBQUcsS0FBMUI7QUFFQSxNQUFJLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQyxXQUF2Qzs7QUFDQSxTQUFPLFdBQVcsSUFBSSxDQUFDLG1CQUF2QixFQUE0QztBQUMxQyxRQUFJLFdBQVcsS0FBSyxPQUFoQixJQUEyQixXQUFXLENBQUMsUUFBWixDQUFxQixPQUFyQixDQUEvQixFQUE4RDtBQUM1RCxNQUFBLG1CQUFtQixHQUFHLElBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsTUFBQSxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixXQUF0QjtBQUNBLE1BQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUExQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTztBQUFFLElBQUEsZ0JBQWdCLEVBQWhCLGdCQUFGO0FBQW9CLElBQUEsbUJBQW1CLEVBQW5CO0FBQXBCLEdBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7QUFPTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsRUFBbUMsT0FBbkMsRUFBNEM7QUFDakQsTUFBSSxTQUFTLEtBQUssT0FBbEIsRUFBMkI7QUFDekIsV0FBTyxFQUFQO0FBQ0QsR0FIZ0QsQ0FJakQ7QUFDQTs7O0FBTGlELDhCQVM3Qyx5QkFBeUIsQ0FBQyxTQUFELEVBQVksT0FBWixDQVRvQjtBQUFBLE1BTzFCLDhCQVAwQix5QkFPL0MsbUJBUCtDO0FBQUEsTUFRL0MsZ0JBUitDLHlCQVEvQyxnQkFSK0M7O0FBV2pELE1BQUksOEJBQUosRUFBb0M7QUFDbEMsV0FBTyxnQkFBUDtBQUNELEdBYmdELENBZWpEO0FBQ0E7OztBQUNBLE1BQU0sZUFBZSxHQUFHLHdCQUF3QixDQUFDO0FBQy9DLElBQUEsWUFBWSxFQUFFLFNBRGlDO0FBRS9DLElBQUEsWUFBWSxFQUFFO0FBRmlDLEdBQUQsQ0FBaEQ7O0FBS0EsTUFBSSxlQUFKLEVBQXFCO0FBQUEsaUNBSWYseUJBQXlCLENBQUMsZUFBRCxFQUFrQixPQUFsQixDQUpWO0FBQUEsUUFFSSxrQ0FGSiwwQkFFakIsbUJBRmlCO0FBQUEsUUFHQywwQkFIRCwwQkFHakIsZ0JBSGlCOztBQU1uQixRQUFJLGtDQUFKLEVBQXdDO0FBQ3RDLGFBQU8sMEJBQVA7QUFDRDtBQUNGOztBQUVELFNBQU8sRUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7O0FBTU8sU0FBUyxlQUFULENBQXlCLFVBQXpCLEVBQXFDLGFBQXJDLEVBQW9EO0FBQ3pELE1BQUksS0FBSyxHQUFHLEVBQVo7QUFBQSxNQUNFLE1BQU0sR0FBRyxFQURYO0FBQUEsTUFFRSxPQUFPLEdBQUcsRUFGWjtBQUlBLEVBQUEsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsVUFBUyxFQUFULEVBQWE7QUFDOUIsUUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsYUFBaEIsQ0FBaEI7O0FBRUEsUUFBSSxPQUFPLE1BQU0sQ0FBQyxTQUFELENBQWIsS0FBNkIsV0FBakMsRUFBOEM7QUFDNUMsTUFBQSxNQUFNLENBQUMsU0FBRCxDQUFOLEdBQW9CLEVBQXBCO0FBQ0EsTUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFNBQVg7QUFDRDs7QUFFRCxJQUFBLE1BQU0sQ0FBQyxTQUFELENBQU4sQ0FBa0IsSUFBbEIsQ0FBdUIsRUFBdkI7QUFDRCxHQVREO0FBV0EsRUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLFVBQVMsU0FBVCxFQUFvQjtBQUNoQyxRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBRCxDQUFsQjtBQUVBLElBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYTtBQUNYLE1BQUEsTUFBTSxFQUFFLEtBREc7QUFFWCxNQUFBLFNBQVMsRUFBRSxTQUZBO0FBR1gsTUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDbkIsZUFBTyxLQUFLLENBQ1QsR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsaUJBQU8sQ0FBQyxDQUFDLFdBQVQ7QUFDRCxTQUhJLEVBSUosSUFKSSxDQUlDLEVBSkQsQ0FBUDtBQUtEO0FBVFUsS0FBYjtBQVdELEdBZEQ7QUFnQkEsU0FBTyxPQUFQO0FBQ0Q7O0FBRU0sU0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQztBQUN6QyxFQUFBLE1BQU07QUFDSixJQUFBLE9BQU8sRUFBRSxJQURMO0FBRUosSUFBQSxPQUFPLEVBQUU7QUFGTCxLQUdELE1BSEMsQ0FBTjtBQU1BLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGdCQUFqQixDQUFrQyxNQUFNLE1BQU0sQ0FBQyxRQUFiLEdBQXdCLEdBQTFELENBQWY7QUFBQSxNQUNFLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBTixDQUFnQixLQUFoQixDQUFzQixJQUF0QixDQUEyQixRQUEzQixDQURmOztBQUdBLE1BQ0UsTUFBTSxDQUFDLE9BQVAsS0FBbUIsSUFBbkIsSUFDQSxNQUFNLENBQUMsU0FBUCxDQUFpQixZQUFqQixDQUE4QixNQUFNLENBQUMsUUFBckMsQ0FGRixFQUdFO0FBQ0EsSUFBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixNQUFNLENBQUMsU0FBdkI7QUFDRDs7QUFFRCxNQUFJLE1BQU0sQ0FBQyxPQUFYLEVBQW9CO0FBQ2xCLElBQUEsVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFELEVBQWEsTUFBTSxDQUFDLGFBQXBCLENBQTVCO0FBQ0Q7O0FBRUQsU0FBTyxVQUFQO0FBQ0Q7O0FBRU0sU0FBUyxrQkFBVCxDQUE0QixFQUE1QixFQUFnQyxRQUFoQyxFQUEwQztBQUMvQyxTQUNFLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBSCxLQUFnQixlQUFVLFlBQWhDLElBQWdELEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLENBRGxEO0FBR0Q7O0FBRU0sU0FBUywrQkFBVCxPQUtKO0FBQUEsTUFKRCxPQUlDLFFBSkQsT0FJQztBQUFBLE1BSEQsZUFHQyxRQUhELGVBR0M7QUFBQSxNQUZELGdCQUVDLFFBRkQsZ0JBRUM7QUFBQSxNQURELGdCQUNDLFFBREQsZ0JBQ0M7O0FBQ0QsTUFBSSxlQUFKLEVBQXFCO0FBQ25CLFFBQUksZUFBZSxDQUFDLFNBQWhCLENBQTBCLFFBQTFCLENBQW1DLGdCQUFuQyxDQUFKLEVBQTBEO0FBQ3hEO0FBQ0EsTUFBQSxlQUFlLENBQUMsVUFBaEIsQ0FBMkIsT0FBM0IsQ0FBbUMsVUFBQSxTQUFTLEVBQUk7QUFDOUMsWUFBSSxxQkFBSSxTQUFKLEVBQWUsT0FBZixDQUF1QixPQUF2QixDQUFKLEVBQXFDLENBQ3BDOztBQUNELFFBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLFNBQTVCO0FBQ0QsT0FKRDtBQUtELEtBUEQsTUFPTztBQUNMLE1BQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsZUFBN0I7QUFDRDtBQUNGLEdBWEQsTUFXTztBQUNMLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0I7QUFDRDtBQUNGO0FBRUQ7Ozs7Ozs7OztBQU9PLFNBQVMsa0JBQVQsQ0FBNEIsS0FBNUIsRUFBbUM7QUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsY0FBTixDQUFxQixLQUFyQixDQUEyQixJQUEzQixDQUEzQjtBQUNBLFNBQU8sRUFBUDtBQUNEOztBQUVNLFNBQVMsaUJBQVQsUUFBNEQ7QUFBQSxNQUEvQixXQUErQixTQUEvQixXQUErQjtBQUFBLE1BQWxCLEtBQWtCLFNBQWxCLEtBQWtCO0FBQUEsTUFBWCxPQUFXLFNBQVgsT0FBVztBQUNqRSxNQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFsQixDQUFuQjtBQUVBLE1BQU0sV0FBVyxHQUNmLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxjQUFQLEVBQXVCLFdBQXZCLENBQWhCLEdBQXNELEtBQUssQ0FBQyxXQUQ5RDtBQUVBLE1BQU0sU0FBUyxHQUNiLEtBQUssQ0FBQyxjQUFOLEtBQXlCLEtBQUssQ0FBQyxZQUEvQixHQUNJLFdBQVcsSUFBSSxLQUFLLENBQUMsU0FBTixHQUFrQixLQUFLLENBQUMsV0FBNUIsQ0FEZixHQUVJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxZQUFQLEVBQXFCLFdBQXJCLENBQWhCLEdBQW9ELEtBQUssQ0FBQyxTQUhoRTtBQUlBLE1BQU0sTUFBTSxHQUFHLFNBQVMsR0FBRyxXQUEzQjtBQUNBLEVBQUEsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsaUJBQTFCLEVBQXFDLElBQXJDO0FBRUEsRUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixFQUF6QjtBQUNBLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxTQUFqQztBQUVBLE1BQU0sVUFBVSxHQUFHLENBQ2pCLFdBRGlCLEVBRWpCO0FBQ0EsRUFBQSxrQkFBa0IsQ0FBQyxLQUFELENBSEQsRUFJakIsV0FKaUIsRUFLakIsTUFMaUIsQ0FBbkIsQ0FmaUUsQ0FzQmpFOztBQUNBLFNBQU8sQ0FBQyxVQUFELENBQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQXR0cmlidXRlIGFkZGVkIGJ5IGRlZmF1bHQgdG8gZXZlcnkgaGlnaGxpZ2h0LlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IERBVEFfQVRUUiA9IFwiZGF0YS1oaWdobGlnaHRlZFwiO1xuXG4vKipcbiAqIEF0dHJpYnV0ZSB1c2VkIHRvIGdyb3VwIGhpZ2hsaWdodCB3cmFwcGVycy5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBUSU1FU1RBTVBfQVRUUiA9IFwiZGF0YS10aW1lc3RhbXBcIjtcblxuZXhwb3J0IGNvbnN0IFNUQVJUX09GRlNFVF9BVFRSID0gXCJkYXRhLXN0YXJ0LW9mZnNldFwiO1xuZXhwb3J0IGNvbnN0IEVORF9PRkZTRVRfQVRUUiA9IFwiZGF0YS1lbmQtb2Zmc2V0XCI7XG5cbi8qKlxuICogRG9uJ3QgaGlnaGxpZ2h0IGNvbnRlbnQgb2YgdGhlc2UgdGFncy5cbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqL1xuZXhwb3J0IGNvbnN0IElHTk9SRV9UQUdTID0gW1xuICBcIlNDUklQVFwiLFxuICBcIlNUWUxFXCIsXG4gIFwiU0VMRUNUXCIsXG4gIFwiT1BUSU9OXCIsXG4gIFwiQlVUVE9OXCIsXG4gIFwiT0JKRUNUXCIsXG4gIFwiQVBQTEVUXCIsXG4gIFwiVklERU9cIixcbiAgXCJBVURJT1wiLFxuICBcIkNBTlZBU1wiLFxuICBcIkVNQkVEXCIsXG4gIFwiUEFSQU1cIixcbiAgXCJNRVRFUlwiLFxuICBcIlBST0dSRVNTXCJcbl07XG4iLCJpbXBvcnQgVGV4dEhpZ2hsaWdodGVyIGZyb20gXCIuL3RleHQtaGlnaGxpZ2h0ZXJcIjtcblxuLyoqXG4gKiBFeHBvc2UgdGhlIFRleHRIaWdobGlnaHRlciBjbGFzcyBnbG9iYWxseSB0byBiZVxuICogdXNlZCBpbiBkZW1vcyBhbmQgdG8gYmUgaW5qZWN0ZWQgZGlyZWN0bHkgaW50byBodG1sIGZpbGVzLlxuICovXG5nbG9iYWwuVGV4dEhpZ2hsaWdodGVyID0gVGV4dEhpZ2hsaWdodGVyO1xuXG4vKipcbiAqIExvYWQgdGhlIGpxdWVyeSBwbHVnaW4gZ2xvYmFsbHkgZXhwZWN0aW5nIGpRdWVyeSBhbmQgVGV4dEhpZ2hsaWdodGVyIHRvIGJlIGdsb2JhbGx5XG4gKiBhdmFpYWJsZSwgdGhpcyBtZWFucyB0aGlzIGxpYnJhcnkgZG9lc24ndCBuZWVkIGEgaGFyZCByZXF1aXJlbWVudCBvZiBqUXVlcnkuXG4gKi9cbmltcG9ydCBcIi4vanF1ZXJ5LXBsdWdpblwiO1xuIiwiaW1wb3J0IHtcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIGdldEVsZW1lbnRPZmZzZXQsXG4gIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24sXG4gIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCxcbiAgZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0LFxuICBub2Rlc0luQmV0d2VlbixcbiAgc29ydEJ5RGVwdGgsXG4gIGZpbmROb2RlQW5kT2Zmc2V0LFxuICBhZGROb2Rlc1RvSGlnaGxpZ2h0QWZ0ZXJFbGVtZW50LFxuICBjcmVhdGVXcmFwcGVyLFxuICBjcmVhdGVEZXNjcmlwdG9yc1xufSBmcm9tIFwiLi4vdXRpbHMvaGlnaGxpZ2h0c1wiO1xuaW1wb3J0IHtcbiAgU1RBUlRfT0ZGU0VUX0FUVFIsXG4gIEVORF9PRkZTRVRfQVRUUixcbiAgREFUQV9BVFRSLFxuICBUSU1FU1RBTVBfQVRUUlxufSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgZG9tIGZyb20gXCIuLi91dGlscy9kb21cIjtcbmltcG9ydCB7IHVuaXF1ZSB9IGZyb20gXCIuLi91dGlscy9hcnJheXNcIjtcblxuLyoqXG4gKiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50c1xuICogd2l0aCBhIGZvY3VzIG9uIHJlbW92aW5nIGludGVyZGVwZW5kZW5jZSBiZXR3ZWVuIGhpZ2hsaWdodHMgYW5kIG90aGVyIGVsZW1lbnQgbm9kZXMgaW4gdGhlIGNvbnRleHQgZWxlbWVudC5cbiAqL1xuY2xhc3MgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIGluc3RhbmNlIGZvciBmdW5jdGlvbmFsaXR5IHRoYXQgZm9jdXNlcyBmb3IgaGlnaGxpZ2h0IGluZGVwZW5kZW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBoaWdobGlnaHQgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MgLSBjbGFzcyBhZGRlZCB0byBoaWdobGlnaHQsICdoaWdobGlnaHRlZCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGV4dENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlciBpcyBhcHBsaWVkLFxuICAgKiAgJ2hpZ2hsaWdodGVyLWNvbnRleHQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyByZW1vdmVkLiBIaWdobGlnaHQgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIGlmIGhpZ2hsaWdodCBzaG91bGQgYmUgcmVtb3ZlZCwgb3IgZmFsc2UgLSB0byBwcmV2ZW50IHJlbW92YWwuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBSYW5nZSBvYmplY3QgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcsIG9yIGZhbHNlIC0gdG8gcHJldmVudCBoaWdobGlnaHRpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25BZnRlckhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBoaWdobGlnaHQgaXMgY3JlYXRlZC4gQXJyYXkgb2YgY3JlYXRlZFxuICAgKiB3cmFwcGVycyBpcyBwYXNzZWQgYXMgcGFyYW0uXG4gICAqIEBjbGFzcyBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgdGhlIHJhbmdlIGFsbG93aW5nIGlzb2xhdGlvbiBmb3Igb3ZlcmxhcHBpbmcgaGlnaGxpZ2h0cy5cbiAgICogVGhpcyBzb2x1dGlvbiBzdGVhbHMgdGhlIHRleHQgb3Igb3RoZXIgbm9kZXMgaW4gdGhlIERPTSBmcm9tIG92ZXJsYXBwaW5nIChOT1QgTkVTVEVEKSBoaWdobGlnaHRzXG4gICAqIGZvciByZXByZXNlbnRhdGlvbiBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBGb3IgdGhlIHB1cnBvc2Ugb2Ygc2VyaWFsaXNhdGlvbiB0aGlzIHdpbGwgbWFpbnRhaW4gYSBkYXRhIGF0dHJpYnV0ZSBvbiB0aGUgaGlnaGxpZ2h0IHdyYXBwZXJcbiAgICogd2l0aCB0aGUgc3RhcnQgdGV4dCBhbmQgZW5kIHRleHQgb2Zmc2V0cyByZWxhdGl2ZSB0byB0aGUgY29udGV4dCByb290IGVsZW1lbnQuXG4gICAqXG4gICAqIFdyYXBzIHRleHQgb2YgZ2l2ZW4gcmFuZ2Ugb2JqZWN0IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgY3JlYXRlZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBTFNEZWJ1ZzI5OiBSQU5HRTogXCIsIHJhbmdlKTtcblxuICAgIGxldCBoaWdobGlnaHRzID0gW107XG4gICAgbGV0IHdyYXBwZXJDbG9uZSA9IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgbGV0IHN0YXJ0T2Zmc2V0ID1cbiAgICAgIGdldEVsZW1lbnRPZmZzZXQocmFuZ2Uuc3RhcnRDb250YWluZXIsIHRoaXMuZWwpICsgcmFuZ2Uuc3RhcnRPZmZzZXQ7XG4gICAgbGV0IGVuZE9mZnNldCA9XG4gICAgICByYW5nZS5zdGFydENvbnRhaW5lciA9PT0gcmFuZ2UuZW5kQ29udGFpbmVyXG4gICAgICAgID8gc3RhcnRPZmZzZXQgKyAocmFuZ2UuZW5kT2Zmc2V0IC0gcmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICAgIDogZ2V0RWxlbWVudE9mZnNldChyYW5nZS5lbmRDb250YWluZXIsIHRoaXMuZWwpICsgcmFuZ2UuZW5kT2Zmc2V0O1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBcIkFMU0RlYnVnMjk6IHN0YXJ0T2Zmc2V0OiBcIixcbiAgICAgIHN0YXJ0T2Zmc2V0LFxuICAgICAgXCJlbmRPZmZzZXQ6IFwiLFxuICAgICAgZW5kT2Zmc2V0XG4gICAgKTtcblxuICAgIHdyYXBwZXJDbG9uZS5zZXRBdHRyaWJ1dGUoU1RBUlRfT0ZGU0VUX0FUVFIsIHN0YXJ0T2Zmc2V0KTtcbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKEVORF9PRkZTRVRfQVRUUiwgZW5kT2Zmc2V0KTtcbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIFNUQVJUIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2Uuc3RhcnRDb250YWluZXI6IFwiLCByYW5nZS5zdGFydENvbnRhaW5lcik7XG4gICAgbGV0IHN0YXJ0Q29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5zdGFydENvbnRhaW5lciwgXCJzdGFydFwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuXFxuIEZJTkRJTkcgRU5EIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2UuZW5kQ29udGFpbmVyOiBcIiwgcmFuZ2UuZW5kQ29udGFpbmVyKTtcbiAgICBsZXQgZW5kQ29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5lbmRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBpZiAoIXN0YXJ0Q29udGFpbmVyIHx8ICFlbmRDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJGYWlsZWQgdG8gZmluZCB0aGUgdGV4dCBub2RlIGZvciB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgc2VsZWN0ZWQgcmFuZ2VcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJOZXdIaWdobGlnaHQgPVxuICAgICAgcmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCAtIDFcbiAgICAgICAgPyBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldClcbiAgICAgICAgOiBlbmRDb250YWluZXI7XG5cbiAgICBpZiAoc3RhcnRDb250YWluZXIgPT09IGVuZENvbnRhaW5lcikge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPVxuICAgICAgICByYW5nZS5zdGFydE9mZnNldCA+IDBcbiAgICAgICAgICA/IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldClcbiAgICAgICAgICA6IHN0YXJ0Q29udGFpbmVyO1xuICAgICAgLy8gU2ltcGx5IHdyYXAgdGhlIHNlbGVjdGVkIHJhbmdlIGluIHRoZSBzYW1lIGNvbnRhaW5lciBhcyBhIGhpZ2hsaWdodC5cbiAgICAgIGxldCBoaWdobGlnaHQgPSBkb20oc3RhcnRPZk5ld0hpZ2hsaWdodCkud3JhcCh3cmFwcGVyQ2xvbmUpO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfSBlbHNlIGlmIChlbmRDb250YWluZXIudGV4dENvbnRlbnQubGVuZ3RoID49IHJhbmdlLmVuZE9mZnNldCkge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPSBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0ID0gYWZ0ZXJOZXdIaWdobGlnaHQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiTm9kZSBhdCB0aGUgc3RhcnQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJOb2RlIGF0IHRoZSBlbmQgb2YgbmV3IGhpZ2hsaWdodDogXCIsIGVuZE9mTmV3SGlnaGxpZ2h0KTtcblxuICAgICAgY29uc3Qgc3RhcnRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN0YXJ0RWxlbWVudFBhcmVudENvcHk7XG4gICAgICBsZXQgc3RhcnRPZk5ld0hpZ2hsaWdodENvcHk7XG4gICAgICBpZiAoc3RhcnRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgICh7XG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yQ29weTogc3RhcnRFbGVtZW50UGFyZW50Q29weSxcbiAgICAgICAgICBlbGVtZW50Q29weTogc3RhcnRPZk5ld0hpZ2hsaWdodENvcHlcbiAgICAgICAgfSA9IGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodCh7XG4gICAgICAgICAgZWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3I6IHN0YXJ0RWxlbWVudFBhcmVudCxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgbG9jYXRpb25JblNlbGVjdGlvbjogXCJzdGFydFwiXG4gICAgICAgIH0pKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0RWxlbWVudFBhcmVudDpcIiwgc3RhcnRFbGVtZW50UGFyZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydEVsZW1lbnRQYXJlbnRDb3B5OiBcIiwgc3RhcnRFbGVtZW50UGFyZW50Q29weSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVuZEVsZW1lbnRQYXJlbnQgPSBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQoe1xuICAgICAgICBjaGlsZEVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHRcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgZW5kRWxlbWVudFBhcmVudENvcHk7XG4gICAgICBsZXQgZW5kT2ZOZXdIaWdobGlnaHRDb3B5O1xuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnQpIHtcbiAgICAgICAgKHtcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3JDb3B5OiBlbmRFbGVtZW50UGFyZW50Q29weSxcbiAgICAgICAgICBlbGVtZW50Y29weTogZW5kT2ZOZXdIaWdobGlnaHRDb3B5XG4gICAgICAgIH0gPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoe1xuICAgICAgICAgIGVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICAgIGVsZW1lbnRBbmNlc3RvcjogZW5kRWxlbWVudFBhcmVudCxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgbG9jYXRpb25JblNlbGVjdGlvbjogXCJlbmRcIlxuICAgICAgICB9KSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiTm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIkNsb25lZCBvZiBub2RlIHRoYXQgaXMgdGhlIHdyYXBwZXIgb2YgdGhlIGVuZCBvZiB0aGUgbmV3IGhpZ2hsaWdodCBhZnRlciByZW1vdmluZyBzaWJsaW5ncyBhbmQgdW53cmFwcGluZyBoaWdobGlnaHQgc3BhbnM6IFwiLFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGFkZE5vZGVzVG9IaWdobGlnaHRBZnRlckVsZW1lbnQoe1xuICAgICAgICBlbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0Q29weSB8fCBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBlbGVtZW50QW5jZXN0b3I6IHN0YXJ0RWxlbWVudFBhcmVudENvcHksXG4gICAgICAgIGhpZ2hsaWdodFdyYXBwZXI6IHdyYXBwZXJDbG9uZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRDbGFzczogdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3NcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUT0RPOiBhZGQgY29udGFpbmVycyBpbiBiZXR3ZWVuLlxuICAgICAgY29uc3QgY29udGFpbmVyc0luQmV0d2VlbiA9IG5vZGVzSW5CZXR3ZWVuKHN0YXJ0Q29udGFpbmVyLCBlbmRDb250YWluZXIpO1xuICAgICAgY29uc29sZS5sb2coXCJDT05UQUlORVJTIElOIEJFVFdFRU46IFwiLCBjb250YWluZXJzSW5CZXR3ZWVuKTtcbiAgICAgIGNvbnRhaW5lcnNJbkJldHdlZW4uZm9yRWFjaChjb250YWluZXIgPT4ge1xuICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZW5kRWxlbWVudFBhcmVudENvcHkpIHtcbiAgICAgICAgLy8gT25seSBjb3B5IHRoZSBjaGlsZHJlbiBvZiBhIGhpZ2hsaWdodGVkIHNwYW4gaW50byBvdXIgbmV3IGhpZ2hsaWdodC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcylcbiAgICAgICAgKSB7XG4gICAgICAgICAgZW5kRWxlbWVudFBhcmVudENvcHkuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoZW5kRWxlbWVudFBhcmVudENvcHkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVyQ2xvbmUuYXBwZW5kQ2hpbGQoZW5kT2ZOZXdIaWdobGlnaHQpO1xuICAgICAgfVxuXG4gICAgICBkb20od3JhcHBlckNsb25lKS5pbnNlcnRCZWZvcmUoXG4gICAgICAgIGVuZEVsZW1lbnRQYXJlbnQgPyBlbmRFbGVtZW50UGFyZW50IDogYWZ0ZXJOZXdIaWdobGlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyBjdXJyZW50IHJhbmdlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGtlZXBSYW5nZSAtIERvbid0IHJlbW92ZSByYW5nZSBhZnRlciBoaWdobGlnaHRpbmcuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb20odGhpcy5lbCkuZ2V0UmFuZ2UoKSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICB0aW1lc3RhbXA7XG5cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQocmFuZ2UpID09PSB0cnVlKSB7XG4gICAgICB0aW1lc3RhbXAgPSArbmV3IERhdGUoKTtcbiAgICAgIHdyYXBwZXIgPSBjcmVhdGVXcmFwcGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcblxuICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSBjcmVhdGVEZXNjcmlwdG9ycyh7XG4gICAgICAgIHJvb3RFbGVtZW50OiB0aGlzLmVsLFxuICAgICAgICByYW5nZSxcbiAgICAgICAgd3JhcHBlclxuICAgICAgfSk7XG5cbiAgICAgIC8vIGNyZWF0ZWRIaWdobGlnaHRzID0gdGhpcy5oaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcik7XG4gICAgICAvLyBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhjcmVhdGVkSGlnaGxpZ2h0cyk7XG5cbiAgICAgIGNvbnN0IHByb2Nlc3NlZERlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQoXG4gICAgICAgIHJhbmdlLFxuICAgICAgICBkZXNjcmlwdG9ycyxcbiAgICAgICAgdGltZXN0YW1wXG4gICAgICApO1xuICAgICAgdGhpcy5kZXNlcmlhbGl6ZUhpZ2hsaWdodHMocHJvY2Vzc2VkRGVzY3JpcHRvcnMpO1xuICAgIH1cblxuICAgIGlmICgha2VlcFJhbmdlKSB7XG4gICAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0ZXh0IG5vZGVzIHdpdGhpbiBhbnkgZ2l2ZW4gZWxlbWVudCBub2RlIGFyZSBtZXJnZWQgdG9nZXRoZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgbm9ybWFsaXplZEhpZ2hsaWdodHM7XG5cbiAgICAvL1NpbmNlIHdlJ3JlIG5vdCBtZXJnaW5nIG9yIGZsYXR0ZW5pbmcsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIHRoZSB0ZXh0IG5vZGVzLlxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYXJlIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICBsZXQgY29udGFpbmVyID0gZWxlbWVudCB8fCB0aGlzLmVsLFxuICAgICAgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoaGlnaGxpZ2h0KSB7XG4gICAgICBpZiAoaGlnaGxpZ2h0LmNsYXNzTmFtZSA9PT0gY29udGFpbmVyLmNsYXNzTmFtZSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICAgIGlmIChzZWxmLm9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQoaGwpID09PSB0cnVlKSB7XG4gICAgICAgIHJlbW92ZUhpZ2hsaWdodChobCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgY29uc3QgbWVyZ2VkUGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgZGF0YUF0dHI6IERBVEFfQVRUUixcbiAgICAgIHRpbWVzdGFtcEF0dHI6IFRJTUVTVEFNUF9BVFRSLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgICByZXR1cm4gcmV0cmlldmVIaWdobGlnaHRzKG1lcmdlZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpIHtcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgbGV0IGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIG9mZnNldCA9IGdldEVsZW1lbnRPZmZzZXQoaGlnaGxpZ2h0LCByZWZFbCksIC8vIEhsIG9mZnNldCBmcm9tIHRoZSByb290IGVsZW1lbnQuXG4gICAgICAgIHdyYXBwZXIgPSBoaWdobGlnaHQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICB3cmFwcGVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICB3cmFwcGVyID0gd3JhcHBlci5vdXRlckhUTUw7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiSGlnaGxpZ2h0IHRleHQgb2Zmc2V0IGZyb20gcm9vdCBub2RlOiBcIiwgb2Zmc2V0KTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgd3JhcHBlci50b1N0cmluZygpLmluZGV4T2YoJHtpZH0pOmAsXG4gICAgICAgIHdyYXBwZXIudG9TdHJpbmcoKS5pbmRleE9mKGlkKVxuICAgICAgKTtcbiAgICAgIGlmICh3cmFwcGVyLnRvU3RyaW5nKCkuaW5kZXhPZihpZCkgPiAtMSkge1xuICAgICAgICBobERlc2NyaXB0b3JzLnB1c2goW3dyYXBwZXIsIGhpZ2hsaWdodC50ZXh0Q29udGVudCwgb2Zmc2V0LCBsZW5ndGhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShobERlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGluZGVwZW5kZW50IGZvcm0gb2YgaGlnaGxpZ2h0cy5cbiAgICpcbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgbGV0IGhsRGVzY3JpcHRvcnMsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IFwiQ2FuJ3QgcGFyc2UgSlNPTjogXCIgKyBlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXphdGlvbkZuQ3VzdG9tKGhsRGVzY3JpcHRvcikge1xuICAgICAgbGV0IGhsID0ge1xuICAgICAgICAgIHdyYXBwZXI6IGhsRGVzY3JpcHRvclswXSxcbiAgICAgICAgICB0ZXh0OiBobERlc2NyaXB0b3JbMV0sXG4gICAgICAgICAgb2Zmc2V0OiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzJdKSxcbiAgICAgICAgICBsZW5ndGg6IE51bWJlci5wYXJzZUludChobERlc2NyaXB0b3JbM10pXG4gICAgICAgIH0sXG4gICAgICAgIGhsTm9kZSxcbiAgICAgICAgaGlnaGxpZ2h0O1xuXG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gc2VsZi5lbDtcbiAgICAgIGNvbnN0IHsgbm9kZSwgb2Zmc2V0OiBvZmZzZXRXaXRoaW5Ob2RlIH0gPSBmaW5kTm9kZUFuZE9mZnNldChcbiAgICAgICAgaGwsXG4gICAgICAgIHBhcmVudE5vZGVcbiAgICAgICk7XG5cbiAgICAgIGhsTm9kZSA9IG5vZGUuc3BsaXRUZXh0KG9mZnNldFdpdGhpbk5vZGUpO1xuICAgICAgaGxOb2RlLnNwbGl0VGV4dChobC5sZW5ndGgpO1xuXG4gICAgICBpZiAoaGxOb2RlLm5leHRTaWJsaW5nICYmICFobE5vZGUubmV4dFNpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUubmV4dFNpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGxOb2RlLnByZXZpb3VzU2libGluZyAmJiAhaGxOb2RlLnByZXZpb3VzU2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBoaWdobGlnaHQgPSBkb20oaGxOb2RlKS53cmFwKGRvbSgpLmZyb21IVE1MKGhsLndyYXBwZXIpWzBdKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH1cblxuICAgIGhsRGVzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbihobERlc2NyaXB0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGlnaGxpZ2h0OiBcIiwgaGxEZXNjcmlwdG9yKTtcbiAgICAgICAgZGVzZXJpYWxpemF0aW9uRm5DdXN0b20oaGxEZXNjcmlwdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZGVzZXJpYWxpemUgaGlnaGxpZ2h0IGRlc2NyaXB0b3IuIENhdXNlOiBcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXI7XG4iLCJpbXBvcnQge1xuICByZWZpbmVSYW5nZUJvdW5kYXJpZXMsXG4gIHJldHJpZXZlSGlnaGxpZ2h0cyxcbiAgaXNFbGVtZW50SGlnaGxpZ2h0LFxuICBzb3J0QnlEZXB0aCxcbiAgaGF2ZVNhbWVDb2xvcixcbiAgY3JlYXRlV3JhcHBlclxufSBmcm9tIFwiLi4vdXRpbHMvaGlnaGxpZ2h0c1wiO1xuaW1wb3J0IGRvbSwgeyBOT0RFX1RZUEUgfSBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyBJR05PUkVfVEFHUywgREFUQV9BVFRSLCBUSU1FU1RBTVBfQVRUUiB9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IHVuaXF1ZSB9IGZyb20gXCIuLi91dGlscy9hcnJheXNcIjtcblxuLyoqXG4gKiBQcmltaXRpdm9IaWdobGlnaHRlciB0aGF0IHByb3ZpZGVzIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gZG9tIGVsZW1lbnRzXG4gKiBmb3Igc2ltcGxlIHVzZSBjYXNlcy5cbiAqL1xuY2xhc3MgUHJpbWl0aXZvSGlnaGxpZ2h0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFByaW1pdGl2b0hpZ2hsaWdodGVyIGluc3RhbmNlIGZvciBmdW5jdGlvbmFsaXR5IHNwZWNpZmljIHRvIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBoaWdobGlnaHQgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MgLSBjbGFzcyBhZGRlZCB0byBoaWdobGlnaHQsICdoaWdobGlnaHRlZCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGV4dENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlciBpcyBhcHBsaWVkLFxuICAgKiAgJ2hpZ2hsaWdodGVyLWNvbnRleHQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyByZW1vdmVkLiBIaWdobGlnaHQgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIGlmIGhpZ2hsaWdodCBzaG91bGQgYmUgcmVtb3ZlZCwgb3IgZmFsc2UgLSB0byBwcmV2ZW50IHJlbW92YWwuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBSYW5nZSBvYmplY3QgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcsIG9yIGZhbHNlIC0gdG8gcHJldmVudCBoaWdobGlnaHRpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25BZnRlckhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBoaWdobGlnaHQgaXMgY3JlYXRlZC4gQXJyYXkgb2YgY3JlYXRlZFxuICAgKiB3cmFwcGVycyBpcyBwYXNzZWQgYXMgcGFyYW0uXG4gICAqIEBjbGFzcyBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgcmFuZ2UuXG4gICAqIFdyYXBzIHRleHQgb2YgZ2l2ZW4gcmFuZ2Ugb2JqZWN0IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgY3JlYXRlZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKSB7XG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIkFMU0RlYnVnMjg6IHJhbmdlIGJlZm9yZSByZWZpbmVkISBcIiwgcmFuZ2UpO1xuXG4gICAgbGV0IHJlc3VsdCA9IHJlZmluZVJhbmdlQm91bmRhcmllcyhyYW5nZSksXG4gICAgICBzdGFydENvbnRhaW5lciA9IHJlc3VsdC5zdGFydENvbnRhaW5lcixcbiAgICAgIGVuZENvbnRhaW5lciA9IHJlc3VsdC5lbmRDb250YWluZXIsXG4gICAgICBnb0RlZXBlciA9IHJlc3VsdC5nb0RlZXBlcixcbiAgICAgIGRvbmUgPSBmYWxzZSxcbiAgICAgIG5vZGUgPSBzdGFydENvbnRhaW5lcixcbiAgICAgIGhpZ2hsaWdodHMgPSBbXSxcbiAgICAgIGhpZ2hsaWdodCxcbiAgICAgIHdyYXBwZXJDbG9uZSxcbiAgICAgIG5vZGVQYXJlbnQ7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZ29EZWVwZXIgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgSUdOT1JFX1RBR1MuaW5kZXhPZihub2RlLnBhcmVudE5vZGUudGFnTmFtZSkgPT09IC0xICYmXG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiXG4gICAgICAgICkge1xuICAgICAgICAgIHdyYXBwZXJDbG9uZSA9IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIHdyYXBwZXJDbG9uZS5zZXRBdHRyaWJ1dGUoREFUQV9BVFRSLCB0cnVlKTtcbiAgICAgICAgICBub2RlUGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgLy8gaGlnaGxpZ2h0IGlmIGEgbm9kZSBpcyBpbnNpZGUgdGhlIGVsXG4gICAgICAgICAgaWYgKGRvbSh0aGlzLmVsKS5jb250YWlucyhub2RlUGFyZW50KSB8fCBub2RlUGFyZW50ID09PSB0aGlzLmVsKSB7XG4gICAgICAgICAgICBoaWdobGlnaHQgPSBkb20obm9kZSkud3JhcCh3cmFwcGVyQ2xvbmUpO1xuICAgICAgICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZSA9PT0gZW5kQ29udGFpbmVyICYmXG4gICAgICAgICEoZW5kQ29udGFpbmVyLmhhc0NoaWxkTm9kZXMoKSAmJiBnb0RlZXBlcilcbiAgICAgICkge1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUudGFnTmFtZSAmJiBJR05PUkVfVEFHUy5pbmRleE9mKG5vZGUudGFnTmFtZSkgPiAtMSkge1xuICAgICAgICBpZiAoZW5kQ29udGFpbmVyLnBhcmVudE5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGdvRGVlcGVyICYmIG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIGdvRGVlcGVyID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoIWRvbmUpO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplcyBoaWdobGlnaHRzLiBFbnN1cmVzIHRoYXQgaGlnaGxpZ2h0aW5nIGlzIGRvbmUgd2l0aCB1c2Ugb2YgdGhlIHNtYWxsZXN0IHBvc3NpYmxlIG51bWJlciBvZlxuICAgKiB3cmFwcGluZyBIVE1MIGVsZW1lbnRzLlxuICAgKiBGbGF0dGVucyBoaWdobGlnaHRzIHN0cnVjdHVyZSBhbmQgbWVyZ2VzIHNpYmxpbmcgaGlnaGxpZ2h0cy4gTm9ybWFsaXplcyB0ZXh0IG5vZGVzIHdpdGhpbiBoaWdobGlnaHRzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBub3JtYWxpemUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBub3JtYWxpemVkIGhpZ2hsaWdodHMuIE9yZGVyIGFuZCBudW1iZXIgb2YgcmV0dXJuZWQgaGlnaGxpZ2h0cyBtYXkgYmUgZGlmZmVyZW50IHRoYW5cbiAgICogaW5wdXQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICB2YXIgbm9ybWFsaXplZEhpZ2hsaWdodHM7XG5cbiAgICB0aGlzLmZsYXR0ZW5OZXN0ZWRIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuICAgIHRoaXMubWVyZ2VTaWJsaW5nSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcblxuICAgIC8vIG9taXQgcmVtb3ZlZCBub2Rlc1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoZnVuY3Rpb24oaGwpIHtcbiAgICAgIHJldHVybiBobC5wYXJlbnRFbGVtZW50ID8gaGwgOiBudWxsO1xuICAgIH0pO1xuXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB1bmlxdWUobm9ybWFsaXplZEhpZ2hsaWdodHMpO1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEub2Zmc2V0VG9wIC0gYi5vZmZzZXRUb3AgfHwgYS5vZmZzZXRMZWZ0IC0gYi5vZmZzZXRMZWZ0O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsYXR0ZW5zIGhpZ2hsaWdodHMgc3RydWN0dXJlLlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjaGFuZ2VzIGlucHV0IGhpZ2hsaWdodHMgLSB0aGVpciBvcmRlciBhbmQgbnVtYmVyIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGNoYW5nZS5cbiAgICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0cyAtIGhpZ2hsaWdodHMgdG8gZmxhdHRlbi5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBmbGF0dGVuTmVzdGVkSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgbGV0IGFnYWluLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIGZsYXR0ZW5PbmNlKCkge1xuICAgICAgbGV0IGFnYWluID0gZmFsc2U7XG5cbiAgICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCwgaSkge1xuICAgICAgICBsZXQgcGFyZW50ID0gaGwucGFyZW50RWxlbWVudCxcbiAgICAgICAgICBwYXJlbnRQcmV2ID0gcGFyZW50LnByZXZpb3VzU2libGluZyxcbiAgICAgICAgICBwYXJlbnROZXh0ID0gcGFyZW50Lm5leHRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChzZWxmLmlzSGlnaGxpZ2h0KHBhcmVudCwgREFUQV9BVFRSKSkge1xuICAgICAgICAgIGlmICghaGF2ZVNhbWVDb2xvcihwYXJlbnQsIGhsKSkge1xuICAgICAgICAgICAgaWYgKCFobC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgICBpZiAoIXBhcmVudE5leHQpIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50TmV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50TmV4dCB8fCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaGwucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgICAgICAgIGlmICghcGFyZW50UHJldikge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnRQcmV2KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudFByZXYgfHwgcGFyZW50KTtcbiAgICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGhsLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgICAgICAgICBobC5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT0gMyAmJlxuICAgICAgICAgICAgICBobC5uZXh0U2libGluZyAmJlxuICAgICAgICAgICAgICBobC5uZXh0U2libGluZy5ub2RlVHlwZSA9PSAzXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgbGV0IHNwYW5sZWZ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBhcmVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LmNsYXNzTmFtZSA9IHBhcmVudC5jbGFzc05hbWU7XG4gICAgICAgICAgICAgIGxldCB0aW1lc3RhbXAgPSBwYXJlbnQuYXR0cmlidXRlc1tUSU1FU1RBTVBfQVRUUl0ubm9kZVZhbHVlO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuXG4gICAgICAgICAgICAgIGxldCBzcGFucmlnaHQgPSBzcGFubGVmdC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgZG9tKGhsLnByZXZpb3VzU2libGluZykud3JhcChzcGFubGVmdCk7XG4gICAgICAgICAgICAgIGRvbShobC5uZXh0U2libGluZykud3JhcChzcGFucmlnaHQpO1xuXG4gICAgICAgICAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHBhcmVudC5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgZG9tKG5vZGUpLmluc2VydEJlZm9yZShub2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXBhcmVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgZG9tKHBhcmVudCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoaGwuZmlyc3RDaGlsZCwgaGwpO1xuICAgICAgICAgICAgaGlnaGxpZ2h0c1tpXSA9IHBhcmVudDtcbiAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWdhaW47XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgYWdhaW4gPSBmbGF0dGVuT25jZSgpO1xuICAgIH0gd2hpbGUgKGFnYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXJnZXMgc2libGluZyBoaWdobGlnaHRzIGFuZCBub3JtYWxpemVzIGRlc2NlbmRhbnQgdGV4dCBub2Rlcy5cbiAgICogTm90ZTogdGhpcyBtZXRob2QgY2hhbmdlcyBpbnB1dCBoaWdobGlnaHRzIC0gdGhlaXIgb3JkZXIgYW5kIG51bWJlciBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBjaGFuZ2UuXG4gICAqIEBwYXJhbSBoaWdobGlnaHRzXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgbWVyZ2VTaWJsaW5nSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2hvdWxkTWVyZ2UoY3VycmVudCwgbm9kZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbm9kZSAmJlxuICAgICAgICBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAgIGhhdmVTYW1lQ29sb3IoY3VycmVudCwgbm9kZSkgJiZcbiAgICAgICAgc2VsZi5pc0hpZ2hsaWdodChub2RlLCBEQVRBX0FUVFIpXG4gICAgICApO1xuICAgIH1cblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIHZhciBwcmV2ID0gaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZyxcbiAgICAgICAgbmV4dCA9IGhpZ2hsaWdodC5uZXh0U2libGluZztcblxuICAgICAgaWYgKHNob3VsZE1lcmdlKGhpZ2hsaWdodCwgcHJldikpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkucHJlcGVuZChwcmV2LmNoaWxkTm9kZXMpO1xuICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkTWVyZ2UoaGlnaGxpZ2h0LCBuZXh0KSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS5hcHBlbmQobmV4dC5jaGlsZE5vZGVzKTtcbiAgICAgICAgZG9tKG5leHQpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBkb20oaGlnaGxpZ2h0KS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIGN1cnJlbnQgcmFuZ2UuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0ga2VlcFJhbmdlIC0gRG9uJ3QgcmVtb3ZlIHJhbmdlIGFmdGVyIGhpZ2hsaWdodGluZy4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZG9IaWdobGlnaHQoa2VlcFJhbmdlKSB7XG4gICAgbGV0IHJhbmdlID0gZG9tKHRoaXMuZWwpLmdldFJhbmdlKCksXG4gICAgICB3cmFwcGVyLFxuICAgICAgY3JlYXRlZEhpZ2hsaWdodHMsXG4gICAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyxcbiAgICAgIHRpbWVzdGFtcDtcblxuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodChyYW5nZSkgPT09IHRydWUpIHtcbiAgICAgIHRpbWVzdGFtcCA9ICtuZXcgRGF0ZSgpO1xuICAgICAgd3JhcHBlciA9IGNyZWF0ZVdyYXBwZXIodGhpcy5vcHRpb25zKTtcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFRJTUVTVEFNUF9BVFRSLCB0aW1lc3RhbXApO1xuXG4gICAgICBjcmVhdGVkSGlnaGxpZ2h0cyA9IHRoaXMuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICAgICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoY3JlYXRlZEhpZ2hsaWdodHMpO1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiQUxTREVidWcyNDogUHJpbWl0aXZvOiB0aGlzLm9wdGlvbnM6IFwiLFxuICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBcIlxcblxcblxcblxcblwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMub25BZnRlckhpZ2hsaWdodChyYW5nZSwgbm9ybWFsaXplZEhpZ2hsaWdodHMsIHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgaWYgKCFrZWVwUmFuZ2UpIHtcbiAgICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYWxsIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIHJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCkge1xuICAgIHZhciBjb250YWluZXIgPSBlbGVtZW50IHx8IHRoaXMuZWwsXG4gICAgICBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKHsgY29udGFpbmVyOiBjb250YWluZXIgfSksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIG1lcmdlU2libGluZ1RleHROb2Rlcyh0ZXh0Tm9kZSkge1xuICAgICAgdmFyIHByZXYgPSB0ZXh0Tm9kZS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSB0ZXh0Tm9kZS5uZXh0U2libGluZztcblxuICAgICAgaWYgKHByZXYgJiYgcHJldi5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICB0ZXh0Tm9kZS5ub2RlVmFsdWUgPSBwcmV2Lm5vZGVWYWx1ZSArIHRleHROb2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQgJiYgbmV4dC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICB0ZXh0Tm9kZS5ub2RlVmFsdWUgPSB0ZXh0Tm9kZS5ub2RlVmFsdWUgKyBuZXh0Lm5vZGVWYWx1ZTtcbiAgICAgICAgZG9tKG5leHQpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodChoaWdobGlnaHQpIHtcbiAgICAgIHZhciB0ZXh0Tm9kZXMgPSBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcblxuICAgICAgdGV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBtZXJnZVNpYmxpbmdUZXh0Tm9kZXMobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCB0cnVlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodChobCkgPT09IHRydWUpIHtcbiAgICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGhsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodHMgZnJvbSBnaXZlbiBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3BhcmFtcy5jb250YWluZXJdIC0gcmV0dXJuIGhpZ2hsaWdodHMgZnJvbSB0aGlzIGVsZW1lbnQuIERlZmF1bHQ6IHRoZSBlbGVtZW50IHRoZVxuICAgKiBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuYW5kU2VsZl0gLSBpZiBzZXQgdG8gdHJ1ZSBhbmQgY29udGFpbmVyIGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgYWRkIGNvbnRhaW5lciB0b1xuICAgKiByZXR1cm5lZCByZXN1bHRzLiBEZWZhdWx0OiB0cnVlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuZ3JvdXBlZF0gLSBpZiBzZXQgdG8gdHJ1ZSwgaGlnaGxpZ2h0cyBhcmUgZ3JvdXBlZCBpbiBsb2dpY2FsIGdyb3VwcyBvZiBoaWdobGlnaHRzIGFkZGVkXG4gICAqIGluIHRoZSBzYW1lIG1vbWVudC4gRWFjaCBncm91cCBpcyBhbiBvYmplY3Qgd2hpY2ggaGFzIGdvdCBhcnJheSBvZiBoaWdobGlnaHRzLCAndG9TdHJpbmcnIG1ldGhvZCBhbmQgJ3RpbWVzdGFtcCdcbiAgICogcHJvcGVydHkuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRIaWdobGlnaHRzKHBhcmFtcykge1xuICAgIGNvbnN0IG1lcmdlZFBhcmFtcyA9IHtcbiAgICAgIGNvbnRhaW5lcjogdGhpcy5lbCxcbiAgICAgIGRhdGFBdHRyOiBEQVRBX0FUVFIsXG4gICAgICB0aW1lc3RhbXBBdHRyOiBUSU1FU1RBTVBfQVRUUixcbiAgICAgIC4uLnBhcmFtc1xuICAgIH07XG4gICAgcmV0dXJuIHJldHJpZXZlSGlnaGxpZ2h0cyhtZXJnZWRQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKlxuICAgKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cik7XG4gIH1cblxuICAvKipcbiAgICogU2VyaWFsaXplcyBhbGwgaGlnaGxpZ2h0cyBpbiB0aGUgZWxlbWVudCB0aGUgaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0cygpIHtcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFBhdGgoZWwsIHJlZkVsZW1lbnQpIHtcbiAgICAgIGxldCBwYXRoID0gW10sXG4gICAgICAgIGNoaWxkTm9kZXM7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLnBhcmVudE5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICAgIHBhdGgudW5zaGlmdChjaGlsZE5vZGVzLmluZGV4T2YoZWwpKTtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgfSB3aGlsZSAoZWwgIT09IHJlZkVsZW1lbnQgfHwgIWVsKTtcblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgbGV0IG9mZnNldCA9IDAsIC8vIEhsIG9mZnNldCBmcm9tIHByZXZpb3VzIHNpYmxpbmcgd2l0aGluIHBhcmVudCBub2RlLlxuICAgICAgICBsZW5ndGggPSBoaWdobGlnaHQudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgICBobFBhdGggPSBnZXRFbGVtZW50UGF0aChoaWdobGlnaHQsIHJlZkVsKSxcbiAgICAgICAgd3JhcHBlciA9IGhpZ2hsaWdodC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIHdyYXBwZXIgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgICAgaWYgKFxuICAgICAgICBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgPSBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaGxEZXNjcmlwdG9ycy5wdXNoKFtcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgaGlnaGxpZ2h0LnRleHRDb250ZW50LFxuICAgICAgICBobFBhdGguam9pbihcIjpcIiksXG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgbGVuZ3RoXG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShobERlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pIHtcbiAgICBsZXQgaGxEZXNjcmlwdG9ycyxcbiAgICAgIGhpZ2hsaWdodHMgPSBbXSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaGxEZXNjcmlwdG9ycyA9IEpTT04ucGFyc2UoanNvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgXCJDYW4ndCBwYXJzZSBKU09OOiBcIiArIGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemF0aW9uRm4oaGxEZXNjcmlwdG9yKSB7XG4gICAgICBsZXQgaGwgPSB7XG4gICAgICAgICAgd3JhcHBlcjogaGxEZXNjcmlwdG9yWzBdLFxuICAgICAgICAgIHRleHQ6IGhsRGVzY3JpcHRvclsxXSxcbiAgICAgICAgICBwYXRoOiBobERlc2NyaXB0b3JbMl0uc3BsaXQoXCI6XCIpLFxuICAgICAgICAgIG9mZnNldDogaGxEZXNjcmlwdG9yWzNdLFxuICAgICAgICAgIGxlbmd0aDogaGxEZXNjcmlwdG9yWzRdXG4gICAgICAgIH0sXG4gICAgICAgIGVsSW5kZXggPSBobC5wYXRoLnBvcCgpLFxuICAgICAgICBub2RlID0gc2VsZi5lbCxcbiAgICAgICAgaGxOb2RlLFxuICAgICAgICBoaWdobGlnaHQsXG4gICAgICAgIGlkeDtcblxuICAgICAgd2hpbGUgKChpZHggPSBobC5wYXRoLnNoaWZ0KCkpKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmNoaWxkTm9kZXNbaWR4XTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBub2RlLmNoaWxkTm9kZXNbZWxJbmRleCAtIDFdICYmXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4IC0gMV0ubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICkge1xuICAgICAgICBlbEluZGV4IC09IDE7XG4gICAgICB9XG5cbiAgICAgIG5vZGUgPSBub2RlLmNoaWxkTm9kZXNbZWxJbmRleF07XG4gICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChobC5vZmZzZXQpO1xuICAgICAgaGxOb2RlLnNwbGl0VGV4dChobC5sZW5ndGgpO1xuXG4gICAgICBpZiAoaGxOb2RlLm5leHRTaWJsaW5nICYmICFobE5vZGUubmV4dFNpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUubmV4dFNpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGxOb2RlLnByZXZpb3VzU2libGluZyAmJiAhaGxOb2RlLnByZXZpb3VzU2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBoaWdobGlnaHQgPSBkb20oaGxOb2RlKS53cmFwKGRvbSgpLmZyb21IVE1MKGhsLndyYXBwZXIpWzBdKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH1cblxuICAgIGhsRGVzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbihobERlc2NyaXB0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRlc2VyaWFsaXphdGlvbkZuKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJpbWl0aXZvSGlnaGxpZ2h0ZXI7XG4iLCIvKiBnbG9iYWwgalF1ZXJ5IFRleHRIaWdobGlnaHRlciAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoZnVuY3Rpb24oJCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3QgUExVR0lOX05BTUUgPSBcInRleHRIaWdobGlnaHRlclwiO1xuXG4gICAgZnVuY3Rpb24gd3JhcChmbiwgd3JhcHBlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB3cmFwcGVyLmNhbGwodGhpcywgZm4pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgalF1ZXJ5IHBsdWdpbiBuYW1lc3BhY2UuXG4gICAgICogQGV4dGVybmFsIFwialF1ZXJ5LmZuXCJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vZG9jcy5qcXVlcnkuY29tL1BsdWdpbnMvQXV0aG9yaW5nIFRoZSBqUXVlcnkgUGx1Z2luIEd1aWRlfVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGFwcGxpZXMgaXQgdG8gdGhlIGdpdmVuIGpRdWVyeSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgU2FtZSBhcyB7QGxpbmsgVGV4dEhpZ2hsaWdodGVyfSBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtqUXVlcnl9XG4gICAgICogQGV4YW1wbGUgJCgnI3NhbmRib3gnKS50ZXh0SGlnaGxpZ2h0ZXIoeyBjb2xvcjogJ3JlZCcgfSk7XG4gICAgICogQGZ1bmN0aW9uIGV4dGVybmFsOlwialF1ZXJ5LmZuXCIudGV4dEhpZ2hsaWdodGVyXG4gICAgICovXG4gICAgJC5mbi50ZXh0SGlnaGxpZ2h0ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZWwgPSB0aGlzLFxuICAgICAgICAgIGhsO1xuXG4gICAgICAgIGlmICghJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSkpIHtcbiAgICAgICAgICBobCA9IG5ldyBUZXh0SGlnaGxpZ2h0ZXIoZWwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgaGwuZGVzdHJveSA9IHdyYXAoaGwuZGVzdHJveSwgZnVuY3Rpb24oZGVzdHJveSkge1xuICAgICAgICAgICAgZGVzdHJveS5jYWxsKGhsKTtcbiAgICAgICAgICAgICQoZWwpLnJlbW92ZURhdGEoUExVR0lOX05BTUUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSwgaGwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5mbi5nZXRIaWdobGlnaHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YShQTFVHSU5fTkFNRSk7XG4gICAgfTtcbiAgfSkoalF1ZXJ5KTtcbn1cbiIsImltcG9ydCBkb20gZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyBiaW5kRXZlbnRzLCB1bmJpbmRFdmVudHMgfSBmcm9tIFwiLi91dGlscy9ldmVudHNcIjtcbmltcG9ydCBQcmltaXRpdm8gZnJvbSBcIi4vaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2b1wiO1xuaW1wb3J0IEluZGVwZW5kZW5jaWEgZnJvbSBcIi4vaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWFcIjtcbmltcG9ydCB7IFRJTUVTVEFNUF9BVFRSLCBEQVRBX0FUVFIgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IGNyZWF0ZVdyYXBwZXIgfSBmcm9tIFwiLi91dGlscy9oaWdobGlnaHRzXCI7XG5cbmNvbnN0IGhpZ2hsaWdodGVycyA9IHtcbiAgcHJpbWl0aXZvOiBQcmltaXRpdm8sXG4gIFwidjEtMjAxNFwiOiBQcmltaXRpdm8sXG4gIGluZGVwZW5kZW5jaWE6IEluZGVwZW5kZW5jaWEsXG4gIFwidjItMjAxOVwiOiBJbmRlcGVuZGVuY2lhXG59O1xuXG4vKipcbiAqIFRleHRIaWdobGlnaHRlciB0aGF0IHByb3ZpZGVzIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gZG9tIGVsZW1lbnRzLlxuICovXG5jbGFzcyBUZXh0SGlnaGxpZ2h0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyB3cmFwcGVyIGZvciBoaWdobGlnaHRzLlxuICAgKiBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgY2FsbHMgdGhpcyBtZXRob2QgZWFjaCB0aW1lIGl0IG5lZWRzIHRvIGNyZWF0ZSBoaWdobGlnaHRzIGFuZCBwYXNzIG9wdGlvbnMgcmV0cmlldmVkXG4gICAqIGluIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIHRoZSBzYW1lIG9iamVjdCBhcyBpbiBUZXh0SGlnaGxpZ2h0ZXIgY29uc3RydWN0b3IuXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVXcmFwcGVyKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gY3JlYXRlV3JhcHBlcihvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBhbmQgYmluZHMgdG8gZ2l2ZW4gRE9NIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gRE9NIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZWQgd2lsbCBiZSBhcHBsaWVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gYWRkaXRpb25hbCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy52ZXJzaW9uIC0gVGhlIHZlcnNpb24gb2YgdGhlIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gdXNlLlxuICAgKiBUaGVyZSBhcmUgdHdvIG9wdGlvbnM6XG4gICAqICAgcHJpbWl0aXZvICh2MS0yMDE0KSBpcyBmb3IgdGhlIGluaXRpYWwgaW1wbGVtZW50YXRpb24gdXNpbmcgaW50ZXJkZXBlbmRlbnQgaGlnaGxpZ2h0IGxvY2F0b3JzLlxuICAgKiAgIChMb3RzIG9mIGlzc3VlcyBmb3IgcmVxdWlyZW1lbnRzIGJleW9uZCBzaW1wbGUgYWxsIG9yIG5vdGhpbmcgaGlnaGxpZ2h0cylcbiAgICpcbiAgICogICBpbmRlcGVuZGVuY2lhICh2Mi0yMDE5KSBpcyBmb3IgYW4gaW1wcm92ZWQgaW1wbGVtZW50YXRpb24gZm9jdXNpbmcgb24gbWFraW5nIGhpZ2hsaWdodHMgaW5kZXBlbmRlbnRcbiAgICogICBmcm9tIGVhY2hvdGhlciBhbmQgb3RoZXIgZWxlbWVudCBub2RlcyB3aXRoaW4gdGhlIGNvbnRleHQgRE9NIG9iamVjdC4gdjIgdXNlcyBkYXRhIGF0dHJpYnV0ZXNcbiAgICogICBhcyB0aGUgc291cmNlIG9mIHRydXRoIGFib3V0IHRoZSB0ZXh0IHJhbmdlIHNlbGVjdGVkIHRvIGNyZWF0ZSB0aGUgb3JpZ2luYWwgaGlnaGxpZ2h0LlxuICAgKiAgIFRoaXMgYWxsb3dzIHVzIGZyZWVkb20gdG8gbWFuaXB1bGF0ZSB0aGUgRE9NIGF0IHdpbGwgYW5kIGhhbmRsZSBvdmVybGFwcGluZyBoaWdobGlnaHRzIGEgbG90IGJldHRlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBoaWdobGlnaHQgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MgLSBjbGFzcyBhZGRlZCB0byBoaWdobGlnaHQsICdoaWdobGlnaHRlZCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGV4dENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlciBpcyBhcHBsaWVkLFxuICAgKiAgJ2hpZ2hsaWdodGVyLWNvbnRleHQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyByZW1vdmVkLiBIaWdobGlnaHQgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIGlmIGhpZ2hsaWdodCBzaG91bGQgYmUgcmVtb3ZlZCwgb3IgZmFsc2UgLSB0byBwcmV2ZW50IHJlbW92YWwuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBSYW5nZSBvYmplY3QgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcsIG9yIGZhbHNlIC0gdG8gcHJldmVudCBoaWdobGlnaHRpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25BZnRlckhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBoaWdobGlnaHQgaXMgY3JlYXRlZC4gQXJyYXkgb2YgY3JlYXRlZFxuICAgKiB3cmFwcGVycyBpcyBwYXNzZWQgYXMgcGFyYW0uXG4gICAqIEBjbGFzcyBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgYW5jaG9yIGVsZW1lbnRcIik7XG4gICAgfVxuXG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgY29sb3I6IFwiI2ZmZmY3YlwiLFxuICAgICAgaGlnaGxpZ2h0ZWRDbGFzczogXCJoaWdobGlnaHRlZFwiLFxuICAgICAgY29udGV4dENsYXNzOiBcImhpZ2hsaWdodGVyLWNvbnRleHRcIixcbiAgICAgIHZlcnNpb246IFwiaW5kZXBlbmRlbmNpYVwiLFxuICAgICAgb25SZW1vdmVIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBvbkJlZm9yZUhpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIG9uQWZ0ZXJIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge30sXG4gICAgICAuLi5vcHRpb25zXG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJcXG5cXG5cXG5cXG5BTFNERWJ1ZzI0OiBUZXh0SGlnaGxpZ2h0ZXI6IG9wdGlvbnMgY29uc3RydWN0b3IgcGFyYW06IFwiLFxuICAgICAgb3B0aW9uc1xuICAgICk7XG4gICAgY29uc29sZS5sb2coXCJBTFNERWJ1ZzI0OiBUZXh0SGlnaGxpZ2h0ZXI6IHRoaXMub3B0aW9uczogXCIsIHRoaXMub3B0aW9ucyk7XG5cbiAgICBpZiAoIWhpZ2hsaWdodGVyc1t0aGlzLm9wdGlvbnMudmVyc2lvbl0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIHZlcnNpb24gb2YgdGhlIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHlcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZ2hsaWdodGVyID0gbmV3IGhpZ2hsaWdodGVyc1t0aGlzLm9wdGlvbnMudmVyc2lvbl0oXG4gICAgICB0aGlzLmVsLFxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgKTtcblxuICAgIGRvbSh0aGlzLmVsKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29udGV4dENsYXNzKTtcbiAgICBiaW5kRXZlbnRzKHRoaXMuZWwsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcm1hbmVudGx5IGRpc2FibGVzIGhpZ2hsaWdodGluZy5cbiAgICogVW5iaW5kcyBldmVudHMgYW5kIHJlbW92ZSBjb250ZXh0IGVsZW1lbnQgY2xhc3MuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdW5iaW5kRXZlbnRzKHRoaXMuZWwsIHRoaXMpO1xuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29udGV4dENsYXNzKTtcbiAgfVxuXG4gIGhpZ2hsaWdodEhhbmRsZXIoKSB7XG4gICAgdGhpcy5kb0hpZ2hsaWdodCgpO1xuICB9XG5cbiAgZG9IaWdobGlnaHQoa2VlcFJhbmdlKSB7XG4gICAgdGhpcy5oaWdobGlnaHRlci5kb0hpZ2hsaWdodChrZWVwUmFuZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgcmFuZ2UuXG4gICAqIFdyYXBzIHRleHQgb2YgZ2l2ZW4gcmFuZ2Ugb2JqZWN0IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgY3JlYXRlZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZSBhdCBsZWFzdCB0ZXh0IG5vZGVzIGFyZSBub3JtYWxpemVkLCBjYXJyaWVzIG91dCBzb21lIGZsYXR0ZW5pbmcgYW5kIG5lc3RpbmdcbiAgICogd2hlcmUgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBub3JtYWxpemUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBub3JtYWxpemVkIGhpZ2hsaWdodHMuIE9yZGVyIGFuZCBudW1iZXIgb2YgcmV0dXJuZWQgaGlnaGxpZ2h0cyBtYXkgYmUgZGlmZmVyZW50IHRoYW5cbiAgICogaW5wdXQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIubm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGhpZ2hsaWdodGluZyBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdmFsaWQgQ1NTIGNvbG9yLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXRDb2xvcihjb2xvcikge1xuICAgIHRoaXMub3B0aW9ucy5jb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0aW5nIGNvbG9yLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRDb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaGlnaGxpZ2h0cyBmcm9tIGVsZW1lbnQuIElmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBpdCBpcyByZW1vdmVkIGFzIHdlbGwuXG4gICAqIElmIG5vIGVsZW1lbnQgaXMgZ2l2ZW4sIGFsbCBoaWdobGlnaHRzIGFsbCByZW1vdmVkLlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbZWxlbWVudF0gLSBlbGVtZW50IHRvIHJlbW92ZSBoaWdobGlnaHRzIGZyb21cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgdGhpcy5oaWdobGlnaHRlci5yZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0cyBmcm9tIGdpdmVuIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbcGFyYW1zLmNvbnRhaW5lcl0gLSByZXR1cm4gaGlnaGxpZ2h0cyBmcm9tIHRoaXMgZWxlbWVudC4gRGVmYXVsdDogdGhlIGVsZW1lbnQgdGhlXG4gICAqIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5hbmRTZWxmXSAtIGlmIHNldCB0byB0cnVlIGFuZCBjb250YWluZXIgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBhZGQgY29udGFpbmVyIHRvXG4gICAqIHJldHVybmVkIHJlc3VsdHMuIERlZmF1bHQ6IHRydWUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5ncm91cGVkXSAtIGlmIHNldCB0byB0cnVlLCBoaWdobGlnaHRzIGFyZSBncm91cGVkIGluIGxvZ2ljYWwgZ3JvdXBzIG9mIGhpZ2hsaWdodHMgYWRkZWRcbiAgICogaW4gdGhlIHNhbWUgbW9tZW50LiBFYWNoIGdyb3VwIGlzIGFuIG9iamVjdCB3aGljaCBoYXMgZ290IGFycmF5IG9mIGhpZ2hsaWdodHMsICd0b1N0cmluZycgbWV0aG9kIGFuZCAndGltZXN0YW1wJ1xuICAgKiBwcm9wZXJ0eS4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRIaWdobGlnaHRzKHBhcmFtcykge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmdldEhpZ2hsaWdodHMocGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodC5cbiAgICogQWxsIGhpZ2hsaWdodHMgaGF2ZSAnZGF0YS1oaWdobGlnaHRlZCcgYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgaXNIaWdobGlnaHQoZWwpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5pc0hpZ2hsaWdodChlbCwgREFUQV9BVFRSKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiB0aGUgaWQgaXMgbm90IHVzZWQgaW4gdGhlIGluaXRpYWwgdmVyc2lvbiBvZiB0aGUgaGlnaGxpZ2h0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFRoZSB1bmlxdWUgaWRlbnRpZmllciBncm91cGluZyBhIHNldCBvZiBoaWdobGlnaHQgZWxlbWVudHMgdG9nZXRoZXIuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuc2VyaWFsaXplSGlnaGxpZ2h0cyhpZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIGhpZ2hsaWdodHMuXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgaGlnaGxpZ2h0cyBnaXZlbiB0ZXh0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRleHQgdG8gc2VhcmNoIGZvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYXNlU2Vuc2l0aXZlXSAtIGlmIHNldCB0byB0cnVlLCBwZXJmb3JtcyBjYXNlIHNlbnNpdGl2ZSBzZWFyY2ggKGRlZmF1bHQ6IHRydWUpXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGZpbmQodGV4dCwgY2FzZVNlbnNpdGl2ZSkge1xuICAgIGxldCB3bmQgPSBkb20odGhpcy5lbCkuZ2V0V2luZG93KCksXG4gICAgICBzY3JvbGxYID0gd25kLnNjcm9sbFgsXG4gICAgICBzY3JvbGxZID0gd25kLnNjcm9sbFksXG4gICAgICBjYXNlU2VucyA9IHR5cGVvZiBjYXNlU2Vuc2l0aXZlID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IGNhc2VTZW5zaXRpdmU7XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG5cbiAgICBpZiAod25kLmZpbmQpIHtcbiAgICAgIHdoaWxlICh3bmQuZmluZCh0ZXh0LCBjYXNlU2VucykpIHtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHduZC5kb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgbGV0IHRleHRSYW5nZSA9IHduZC5kb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgdGV4dFJhbmdlLm1vdmVUb0VsZW1lbnRUZXh0KHRoaXMuZWwpO1xuICAgICAgd2hpbGUgKHRleHRSYW5nZS5maW5kVGV4dCh0ZXh0LCAxLCBjYXNlU2VucyA/IDQgOiAwKSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWRvbSh0aGlzLmVsKS5jb250YWlucyh0ZXh0UmFuZ2UucGFyZW50RWxlbWVudCgpKSAmJlxuICAgICAgICAgIHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkgIT09IHRoaXMuZWxcbiAgICAgICAgKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0UmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMuZG9IaWdobGlnaHQodHJ1ZSk7XG4gICAgICAgIHRleHRSYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHduZC5zY3JvbGxUbyhzY3JvbGxYLCBzY3JvbGxZKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZXh0SGlnaGxpZ2h0ZXI7XG4iLCIvKipcbiAqIFJldHVybnMgYXJyYXkgd2l0aG91dCBkdXBsaWNhdGVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlKGFycikge1xuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaWR4LCBzZWxmKSB7XG4gICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGlkeDtcbiAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgTk9ERV9UWVBFID0geyBFTEVNRU5UX05PREU6IDEsIFRFWFRfTk9ERTogMyB9O1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zIHRvIG1ha2UgRE9NIG1hbmlwdWxhdGlvbiBlYXNpZXIuXG4gKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IFtlbF0gLSBiYXNlIERPTSBlbGVtZW50IHRvIG1hbmlwdWxhdGVcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmNvbnN0IGRvbSA9IGZ1bmN0aW9uKGVsKSB7XG4gIHJldHVybiAvKiogQGxlbmRzIGRvbSAqKi8ge1xuICAgIC8qKlxuICAgICAqIEFkZHMgY2xhc3MgdG8gZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc05hbWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgY2xhc3MgZnJvbSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIiArIGNsYXNzTmFtZSArIFwiKFxcXFxifCQpXCIsIFwiZ2lcIiksXG4gICAgICAgICAgXCIgXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJlcGVuZHMgY2hpbGQgbm9kZXMgdG8gYmFzZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7Tm9kZVtdfSBub2Rlc1RvUHJlcGVuZFxuICAgICAqL1xuICAgIHByZXBlbmQ6IGZ1bmN0aW9uKG5vZGVzVG9QcmVwZW5kKSB7XG4gICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlc1RvUHJlcGVuZCksXG4gICAgICAgIGkgPSBub2Rlcy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgZWwuaW5zZXJ0QmVmb3JlKG5vZGVzW2ldLCBlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9BcHBlbmRcbiAgICAgKi9cbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKG5vZGVzVG9BcHBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9BcHBlbmQpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbm9kZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZXNbaV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIGJhc2UgZWxlbWVudCBhZnRlciByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBhZnRlciB3aGljaCBiYXNlIGVsZW1lbnQgd2lsbCBiZSBpbnNlcnRlZFxuICAgICAqIEByZXR1cm5zIHtOb2RlfSAtIGluc2VydGVkIGVsZW1lbnRcbiAgICAgKi9cbiAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24ocmVmRWwpIHtcbiAgICAgIHJldHVybiByZWZFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmRWwubmV4dFNpYmxpbmcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIGJhc2UgZWxlbWVudCBiZWZvcmUgcmVmRWwuXG4gICAgICogQHBhcmFtIHtOb2RlfSByZWZFbCAtIG5vZGUgYmVmb3JlIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24ocmVmRWwpIHtcbiAgICAgIHJldHVybiByZWZFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmRWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGJhc2UgZWxlbWVudCBmcm9tIERPTS5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICBlbCA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiBiYXNlIGVsZW1lbnQgY29udGFpbnMgZ2l2ZW4gY2hpbGQuXG4gICAgICogQHBhcmFtIHtOb2RlfEhUTUxFbGVtZW50fSBjaGlsZFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGVsICE9PSBjaGlsZCAmJiBlbC5jb250YWlucyhjaGlsZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGJhc2UgZWxlbWVudCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gd3JhcHBlciBlbGVtZW50XG4gICAgICovXG4gICAgd3JhcDogZnVuY3Rpb24od3JhcHBlcikge1xuICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgZWwpO1xuICAgICAgfVxuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbndyYXBzIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7Tm9kZVtdfSAtIGNoaWxkIG5vZGVzIG9mIHVud3JhcHBlZCBlbGVtZW50LlxuICAgICAqL1xuICAgIHVud3JhcDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbC5jaGlsZE5vZGVzKSxcbiAgICAgICAgd3JhcHBlcjtcblxuICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHdyYXBwZXIgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgIGRvbShub2RlKS5pbnNlcnRCZWZvcmUobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIH0pO1xuICAgICAgZG9tKHdyYXBwZXIpLnJlbW92ZSgpO1xuXG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYXJyYXkgb2YgYmFzZSBlbGVtZW50IHBhcmVudHMuXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgcGFyZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGFyZW50LFxuICAgICAgICBwYXRoID0gW107XG5cbiAgICAgIHdoaWxlICgocGFyZW50ID0gZWwucGFyZW50Tm9kZSkpIHtcbiAgICAgICAgcGF0aC5wdXNoKHBhcmVudCk7XG4gICAgICAgIGVsID0gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cywgZXhjbHVkaW5nIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzV2l0aG91dERvY3VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudHMoKS5maWx0ZXIoZWxlbSA9PiBlbGVtICE9PSBkb2N1bWVudCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gYmFzZSBlbGVtZW50LCBpZS4gbWVyZ2VzIHNpYmxpbmcgdGV4dCBub2RlcyBhbmQgYXNzdXJlcyB0aGF0IGV2ZXJ5XG4gICAgICogZWxlbWVudCBub2RlIGhhcyBvbmx5IG9uZSB0ZXh0IG5vZGUuXG4gICAgICogSXQgc2hvdWxkIGRvZXMgdGhlIHNhbWUgYXMgc3RhbmRhcmQgZWxlbWVudC5ub3JtYWxpemUsIGJ1dCBJRSBpbXBsZW1lbnRzIGl0IGluY29ycmVjdGx5LlxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVRleHROb2RlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICBlbC5uZXh0U2libGluZyAmJlxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICAgICkge1xuICAgICAgICAgIGVsLm5vZGVWYWx1ZSArPSBlbC5uZXh0U2libGluZy5ub2RlVmFsdWU7XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbC5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbShlbC5maXJzdENoaWxkKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICAgIH1cbiAgICAgIGRvbShlbC5uZXh0U2libGluZykubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZWxlbWVudCBiYWNrZ3JvdW5kIGNvbG9yLlxuICAgICAqIEByZXR1cm5zIHtDU1NTdHlsZURlY2xhcmF0aW9uLmJhY2tncm91bmRDb2xvcn1cbiAgICAgKi9cbiAgICBjb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGRvbSBlbGVtZW50IGZyb20gZ2l2ZW4gaHRtbCBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICAgKiBAcmV0dXJucyB7Tm9kZUxpc3R9XG4gICAgICovXG4gICAgZnJvbUhUTUw6IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICByZXR1cm4gZGl2LmNoaWxkTm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZmlyc3QgcmFuZ2Ugb2YgdGhlIHdpbmRvdyBvZiBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1JhbmdlfVxuICAgICAqL1xuICAgIGdldFJhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzZWxlY3Rpb24gPSBkb20oZWwpLmdldFNlbGVjdGlvbigpLFxuICAgICAgICByYW5nZTtcblxuICAgICAgaWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xuICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHJhbmdlcyBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKi9cbiAgICByZW1vdmVBbGxSYW5nZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgc2VsZWN0aW9uIG9iamVjdCBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7U2VsZWN0aW9ufVxuICAgICAqL1xuICAgIGdldFNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZG9tKGVsKVxuICAgICAgICAuZ2V0V2luZG93KClcbiAgICAgICAgLmdldFNlbGVjdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdpbmRvdyBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtXaW5kb3d9XG4gICAgICovXG4gICAgZ2V0V2luZG93OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpLmdldERvY3VtZW50KCkuZGVmYXVsdFZpZXc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZG9jdW1lbnQgb2YgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTERvY3VtZW50fVxuICAgICAqL1xuICAgIGdldERvY3VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGlmIG93bmVyRG9jdW1lbnQgaXMgbnVsbCB0aGVuIGVsIGlzIHRoZSBkb2N1bWVudCBpdHNlbGYuXG4gICAgICByZXR1cm4gZWwub3duZXJEb2N1bWVudCB8fCBlbDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgcHJvdmlkZWQgZWxlbWVudCBjb21lcyBhZnRlciB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb3RoZXJFbGVtZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FmdGVyOiBmdW5jdGlvbihvdGhlckVsZW1lbnQsIHJvb3RFbGVtZW50KSB7XG4gICAgICBsZXQgc2libGluZyA9IGVsLm5leHRTaWJsaW5nO1xuICAgICAgbGV0IGlzQWZ0ZXIgPSBmYWxzZTtcbiAgICAgIHdoaWxlIChzaWJsaW5nICYmICFpc0FmdGVyKSB7XG4gICAgICAgIGlmIChzaWJsaW5nID09PSBvdGhlckVsZW1lbnQpIHtcbiAgICAgICAgICBpc0FmdGVyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXNpYmxpbmcubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBlbC5wYXJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpc0FmdGVyO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5iaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuIiwiaW1wb3J0IGRvbSwgeyBOT0RFX1RZUEUgfSBmcm9tIFwiLi9kb21cIjtcbmltcG9ydCB7IFNUQVJUX09GRlNFVF9BVFRSLCBFTkRfT0ZGU0VUX0FUVFIsIERBVEFfQVRUUiB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuLyoqXG4gKiBUYWtlcyByYW5nZSBvYmplY3QgYXMgcGFyYW1ldGVyIGFuZCByZWZpbmVzIGl0IGJvdW5kYXJpZXNcbiAqIEBwYXJhbSByYW5nZVxuICogQHJldHVybnMge29iamVjdH0gcmVmaW5lZCBib3VuZGFyaWVzIGFuZCBpbml0aWFsIHN0YXRlIG9mIGhpZ2hsaWdodGluZyBhbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpIHtcbiAgbGV0IHN0YXJ0Q29udGFpbmVyID0gcmFuZ2Uuc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyID0gcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgIGFuY2VzdG9yID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIsXG4gICAgZ29EZWVwZXIgPSB0cnVlO1xuXG4gIGlmIChyYW5nZS5lbmRPZmZzZXQgPT09IDApIHtcbiAgICB3aGlsZSAoXG4gICAgICAhZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgZW5kQ29udGFpbmVyLnBhcmVudE5vZGUgIT09IGFuY2VzdG9yXG4gICAgKSB7XG4gICAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZztcbiAgfSBlbHNlIGlmIChlbmRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGVuZENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2UuZW5kT2Zmc2V0ID4gMCkge1xuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5jaGlsZE5vZGVzLml0ZW0ocmFuZ2UuZW5kT2Zmc2V0IC0gMSk7XG4gIH1cblxuICBpZiAoc3RhcnRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPT09IHN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChyYW5nZS5zdGFydE9mZnNldCA+IDApIHtcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGlmIChlbmRDb250YWluZXIgPT09IHN0YXJ0Q29udGFpbmVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBlbmRDb250YWluZXIgPSBzdGFydENvbnRhaW5lcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPCBzdGFydENvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydENvbnRhaW5lcjogc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyOiBlbmRDb250YWluZXIsXG4gICAgZ29EZWVwZXI6IGdvRGVlcGVyXG4gIH07XG59XG5cbi8qKlxuICogU29ydHMgYXJyYXkgb2YgRE9NIGVsZW1lbnRzIGJ5IGl0cyBkZXB0aCBpbiBET00gdHJlZS5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gYXJyIC0gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVzY2VuZGluZyAtIG9yZGVyIG9mIHNvcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlEZXB0aChhcnIsIGRlc2NlbmRpbmcpIHtcbiAgYXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiAoXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGIgOiBhKS5wYXJlbnRzKCkubGVuZ3RoIC1cbiAgICAgIGRvbShkZXNjZW5kaW5nID8gYSA6IGIpLnBhcmVudHMoKS5sZW5ndGhcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudHMgYSBpIGIgaGF2ZSB0aGUgc2FtZSBjb2xvci5cbiAqIEBwYXJhbSB7Tm9kZX0gYVxuICogQHBhcmFtIHtOb2RlfSBiXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVTYW1lQ29sb3IoYSwgYikge1xuICByZXR1cm4gZG9tKGEpLmNvbG9yKCkgPT09IGRvbShiKS5jb2xvcigpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgd3JhcHBlciBmb3IgaGlnaGxpZ2h0cy5cbiAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAqIGluIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgc2FtZSBvYmplY3QgYXMgaW4gVGV4dEhpZ2hsaWdodGVyIGNvbnN0cnVjdG9yLlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihvcHRpb25zKSB7XG4gIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIHNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgc3Bhbi5jbGFzc05hbWUgPSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3M7XG4gIHJldHVybiBzcGFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRleHROb2RlQXRMb2NhdGlvbihlbGVtZW50LCBsb2NhdGlvbkluQ2hpbGROb2Rlcykge1xuICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgYXMgcGFyYW1ldGVyOiBcIiwgZWxlbWVudCk7XG4gIGxldCB0ZXh0Tm9kZUVsZW1lbnQgPSBlbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICh0ZXh0Tm9kZUVsZW1lbnQgJiYgdGV4dE5vZGVFbGVtZW50Lm5vZGVUeXBlICE9PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgY29uc29sZS5sb2coYHRleHROb2RlRWxlbWVudCBzdGVwICR7aX1gLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICAgIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJzdGFydFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uSW5DaGlsZE5vZGVzID09PSBcImVuZFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgbGFzdEluZGV4ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbbGFzdEluZGV4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHROb2RlRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwidGV4dCBub2RlIGVsZW1lbnQgcmV0dXJuZWQ6IFwiLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICByZXR1cm4gdGV4dE5vZGVFbGVtZW50O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGVyZSB0byBpbmplY3QgYSBoaWdobGlnaHQgYmFzZWQgb24gaXQncyBvZmZzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBoaWdobGlnaHRcbiAqIEBwYXJhbSB7Kn0gcGFyZW50Tm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE5vZGVBbmRPZmZzZXQoaGlnaGxpZ2h0LCBwYXJlbnROb2RlKSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcbiAgbGV0IG9mZnNldFdpdGhpbk5vZGUgPSAwO1xuICBsZXQgbG9jYXRpb25Gb3VuZCA9IGZhbHNlO1xuXG4gIHdoaWxlIChcbiAgICBjdXJyZW50Tm9kZSAmJlxuICAgICFsb2NhdGlvbkZvdW5kICYmXG4gICAgKGN1cnJlbnRPZmZzZXQgPCBoaWdobGlnaHQub2Zmc2V0IHx8XG4gICAgICAoY3VycmVudE9mZnNldCA9PT0gaGlnaGxpZ2h0Lm9mZnNldCAmJiBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA+IDApKVxuICApIHtcbiAgICBjb25zdCBlbmRPZk5vZGVPZmZzZXQgPSBjdXJyZW50T2Zmc2V0ICsgY3VycmVudE5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuXG4gICAgaWYgKGVuZE9mTm9kZU9mZnNldCA+IGhpZ2hsaWdodC5vZmZzZXQpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvZmZzZXRXaXRoaW5Ob2RlID0gaGlnaGxpZ2h0Lm9mZnNldCAtIGN1cnJlbnRPZmZzZXQ7XG4gICAgICAgIGxvY2F0aW9uRm91bmQgPSB0cnVlO1xuICAgICAgICBjdXJyZW50T2Zmc2V0ID0gY3VycmVudE9mZnNldCArIG9mZnNldFdpdGhpbk5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRPZmZzZXQgPSBlbmRPZk5vZGVPZmZzZXQ7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG5vZGU6IGN1cnJlbnROb2RlLCBvZmZzZXQ6IG9mZnNldFdpdGhpbk5vZGUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRPZmZzZXQoY2hpbGRFbGVtZW50LCByb290RWxlbWVudCkge1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgbGV0IGNoaWxkTm9kZXM7XG5cbiAgbGV0IGN1cnJlbnRFbGVtZW50ID0gY2hpbGRFbGVtZW50O1xuICBkbyB7XG4gICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgICAgY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzXG4gICAgKTtcbiAgICBjb25zdCBjaGlsZEVsZW1lbnRJbmRleCA9IGNoaWxkTm9kZXMuaW5kZXhPZihjdXJyZW50RWxlbWVudCk7XG4gICAgY29uc3Qgb2Zmc2V0SW5DdXJyZW50UGFyZW50ID0gZ2V0VGV4dE9mZnNldEJlZm9yZShcbiAgICAgIGNoaWxkTm9kZXMsXG4gICAgICBjaGlsZEVsZW1lbnRJbmRleFxuICAgICk7XG4gICAgb2Zmc2V0ICs9IG9mZnNldEluQ3VycmVudFBhcmVudDtcbiAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGU7XG4gIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50ICE9PSByb290RWxlbWVudCB8fCAhY3VycmVudEVsZW1lbnQpO1xuXG4gIHJldHVybiBvZmZzZXQ7XG59XG5cbmZ1bmN0aW9uIGdldFRleHRPZmZzZXRCZWZvcmUoY2hpbGROb2RlcywgY3V0SW5kZXgpIHtcbiAgbGV0IHRleHRPZmZzZXQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1dEluZGV4OyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZXNbaV07XG4gICAgLy8gVXNlIHRleHRDb250ZW50IGFuZCBub3QgaW5uZXJIVE1MIHRvIGFjY291bnQgZm9yIGludmlzaWJsZSBjaGFyYWN0ZXJzIGFzIHdlbGwuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvdGV4dENvbnRlbnRcbiAgICBjb25zdCB0ZXh0ID0gY3VycmVudE5vZGUudGV4dENvbnRlbnQ7XG4gICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICB0ZXh0T2Zmc2V0ICs9IHRleHQubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dE9mZnNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudChlbGVtZW50cykge1xuICBsZXQgY2hpbGRFbGVtZW50ID0gZWxlbWVudHMuY2hpbGRFbGVtZW50O1xuICBsZXQgb3RoZXJFbGVtZW50ID0gZWxlbWVudHMub3RoZXJFbGVtZW50O1xuICBsZXQgcGFyZW50cyA9IGRvbShjaGlsZEVsZW1lbnQpLnBhcmVudHNXaXRob3V0RG9jdW1lbnQoKTtcbiAgbGV0IGkgPSAwO1xuICBsZXQgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBudWxsO1xuICBsZXQgYWxsUGFyZW50c0FyZVNoYXJlZCA9IGZhbHNlO1xuICB3aGlsZSAoIWZpcnN0Tm9uU2hhcmVkUGFyZW50ICYmICFhbGxQYXJlbnRzQXJlU2hhcmVkICYmIGkgPCBwYXJlbnRzLmxlbmd0aCkge1xuICAgIGNvbnN0IGN1cnJlbnRQYXJlbnQgPSBwYXJlbnRzW2ldO1xuXG4gICAgaWYgKGN1cnJlbnRQYXJlbnQuY29udGFpbnMob3RoZXJFbGVtZW50KSkge1xuICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50UGFyZW50IGNvbnRhaW5zIG90aGVyIGVsZW1lbnQhXCIsIGN1cnJlbnRQYXJlbnQpO1xuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIGZpcnN0Tm9uU2hhcmVkUGFyZW50ID0gcGFyZW50c1tpIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxQYXJlbnRzQXJlU2hhcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0Tm9uU2hhcmVkUGFyZW50O1xufVxuXG5jb25zdCBzaWJsaW5nUmVtb3ZhbERpcmVjdGlvbnMgPSB7XG4gIHN0YXJ0OiBcInByZXZpb3VzU2libGluZ1wiLFxuICBlbmQ6IFwibmV4dFNpYmxpbmdcIlxufTtcblxuY29uc3Qgc2libGluZ1RleHROb2RlTWVyZ2VEaXJlY3Rpb25zID0ge1xuICBzdGFydDogXCJuZXh0U2libGluZ1wiLFxuICBlbmQ6IFwicHJldmlvdXNTaWJsaW5nXCJcbn07XG5cbmZ1bmN0aW9uIHJlbW92ZVNpYmxpbmdzSW5EaXJlY3Rpb24oc3RhcnROb2RlLCBkaXJlY3Rpb24pIHtcbiAgbGV0IHNpYmxpbmcgPSBzdGFydE5vZGVbZGlyZWN0aW9uXTtcbiAgd2hpbGUgKHNpYmxpbmcpIHtcbiAgICBzdGFydE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzaWJsaW5nKTtcbiAgICBzaWJsaW5nID0gc2libGluZ1tkaXJlY3Rpb25dO1xuICB9XG59XG5cbi8qKlxuICogTWVyZ2VzIHRoZSB0ZXh0IG9mIGFsbCBzaWJsaW5nIHRleHQgbm9kZXMgd2l0aCB0aGUgc3RhcnQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzdGFydE5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb25cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTaWJsaW5nVGV4dE5vZGVzSW5EaXJlY3Rpb24oc3RhcnROb2RlLCBkaXJlY3Rpb24pIHtcbiAgbGV0IHNpYmxpbmcgPSBzdGFydE5vZGVbZGlyZWN0aW9uXTtcbiAgd2hpbGUgKHNpYmxpbmcpIHtcbiAgICBpZiAoc2libGluZy5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgc3RhcnROb2RlLnRleHRDb250ZW50ICs9IHNpYmxpbmcudGV4dENvbnRlbnQ7XG4gICAgICBzdGFydE5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzaWJsaW5nKTtcbiAgICAgIHNpYmxpbmcgPSBzaWJsaW5nW2RpcmVjdGlvbl07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQocGFyYW1zKSB7XG4gIGxldCBlbGVtZW50ID0gcGFyYW1zLmVsZW1lbnQ7XG4gIGxldCBlbGVtZW50QW5jZXN0b3IgPSBwYXJhbXMuZWxlbWVudEFuY2VzdG9yO1xuICBsZXQgb3B0aW9ucyA9IHBhcmFtcy5vcHRpb25zO1xuICBsZXQgbG9jYXRpb25JblNlbGVjdGlvbiA9IHBhcmFtcy5sb2NhdGlvbkluU2VsZWN0aW9uO1xuXG4gIGxldCBlbGVtZW50QW5jZXN0b3JDb3B5ID0gZWxlbWVudEFuY2VzdG9yLmNsb25lTm9kZSh0cnVlKTtcblxuICAvLyBCZWdpbm5pbmcgb2YgY2hpbGROb2RlcyBsaXN0IGZvciBlbmQgY29udGFpbmVyIGluIHNlbGVjdGlvblxuICAvLyBhbmQgZW5kIG9mIGNoaWxkTm9kZXMgbGlzdCBmb3Igc3RhcnQgY29udGFpbmVyIGluIHNlbGVjdGlvbi5cbiAgbGV0IGxvY2F0aW9uSW5DaGlsZE5vZGVzID0gbG9jYXRpb25JblNlbGVjdGlvbiA9PT0gXCJzdGFydFwiID8gXCJlbmRcIiA6IFwic3RhcnRcIjtcbiAgbGV0IGVsZW1lbnRDb3B5ID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihcbiAgICBlbGVtZW50QW5jZXN0b3JDb3B5LFxuICAgIGxvY2F0aW9uSW5DaGlsZE5vZGVzXG4gICk7XG4gIGxldCBlbGVtZW50Q29weVBhcmVudCA9IGVsZW1lbnRDb3B5LnBhcmVudE5vZGU7XG5cbiAgcmVtb3ZlU2libGluZ3NJbkRpcmVjdGlvbihcbiAgICBlbGVtZW50Q29weSxcbiAgICBzaWJsaW5nUmVtb3ZhbERpcmVjdGlvbnNbbG9jYXRpb25JblNlbGVjdGlvbl1cbiAgKTtcblxuICBtZXJnZVNpYmxpbmdUZXh0Tm9kZXNJbkRpcmVjdGlvbihcbiAgICBlbGVtZW50Q29weSxcbiAgICBzaWJsaW5nVGV4dE5vZGVNZXJnZURpcmVjdGlvbnNbbG9jYXRpb25JblNlbGVjdGlvbl1cbiAgKTtcblxuICBjb25zb2xlLmxvZyhcImVsZW1lbnRDb3B5OiBcIiwgZWxlbWVudENvcHkpO1xuICBjb25zb2xlLmxvZyhcImVsZW1lbnRDb3B5UGFyZW50OiBcIiwgZWxlbWVudENvcHlQYXJlbnQpO1xuXG4gIC8vIENsZWFuIG91dCBhbnkgbmVzdGVkIGhpZ2hsaWdodCB3cmFwcGVycy5cbiAgaWYgKFxuICAgIGVsZW1lbnRDb3B5UGFyZW50ICE9PSBlbGVtZW50QW5jZXN0b3JDb3B5ICYmXG4gICAgZWxlbWVudENvcHlQYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcylcbiAgKSB7XG4gICAgZG9tKGVsZW1lbnRDb3B5UGFyZW50KS51bndyYXAoKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGUgdGV4dCBub2RlIHRoYXQgd2UgbmVlZCBmb3IgdGhlIG5ldyBoaWdobGlnaHRcbiAgLy8gZnJvbSB0aGUgZXhpc3RpbmcgaGlnaGxpZ2h0IG9yIG90aGVyIGVsZW1lbnQuXG4gIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcblxuICByZXR1cm4geyBlbGVtZW50QW5jZXN0b3JDb3B5LCBlbGVtZW50Q29weSB9O1xufVxuXG5mdW5jdGlvbiBnYXRoZXJTaWJsaW5nc1VwVG9FbmROb2RlKHN0YXJ0Tm9kZU9yQ29udGFpbmVyLCBlbmROb2RlKSB7XG4gIGNvbnN0IGdhdGhlcmVkU2libGluZ3MgPSBbXTtcbiAgbGV0IGZvdW5kRW5kTm9kZVNpYmxpbmcgPSBmYWxzZTtcblxuICBsZXQgY3VycmVudE5vZGUgPSBzdGFydE5vZGVPckNvbnRhaW5lci5uZXh0U2libGluZztcbiAgd2hpbGUgKGN1cnJlbnROb2RlICYmICFmb3VuZEVuZE5vZGVTaWJsaW5nKSB7XG4gICAgaWYgKGN1cnJlbnROb2RlID09PSBlbmROb2RlIHx8IGN1cnJlbnROb2RlLmNvbnRhaW5zKGVuZE5vZGUpKSB7XG4gICAgICBmb3VuZEVuZE5vZGVTaWJsaW5nID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2F0aGVyZWRTaWJsaW5ncy5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHsgZ2F0aGVyZWRTaWJsaW5ncywgZm91bmRFbmROb2RlU2libGluZyB9O1xufVxuXG4vKipcbiAqIEdldHMgYWxsIHRoZSBub2RlcyBpbiBiZXR3ZWVuIHRoZSBwcm92aWRlZCBzdGFydCBhbmQgZW5kLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YXJ0Tm9kZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZW5kTm9kZVxuICogQHJldHVybnMge0hUTUxFbGVtZW50W119IE5vZGVzIHRoYXQgbGl2ZSBpbiBiZXR3ZWVuIHRoZSB0d28uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub2Rlc0luQmV0d2VlbihzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgaWYgKHN0YXJ0Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICAvLyBGaXJzdCBhdHRlbXB0IHRoZSBlYXNpZXN0IHNvbHV0aW9uLCBob3BpbmcgZW5kTm9kZSB3aWxsIGJlIGF0IHRoZSBzYW1lIGxldmVsXG4gIC8vIGFzIHRoZSBzdGFydCBub2RlIG9yIGNvbnRhaW5lZCBpbiBhbiBlbGVtZW50IGF0IHRoZSBzYW1lIGxldmVsLlxuICBjb25zdCB7XG4gICAgZm91bmRFbmROb2RlU2libGluZzogZm91bmRFbmROb2RlU2libGluZ09uU2FtZUxldmVsLFxuICAgIGdhdGhlcmVkU2libGluZ3NcbiAgfSA9IGdhdGhlclNpYmxpbmdzVXBUb0VuZE5vZGUoc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICBpZiAoZm91bmRFbmROb2RlU2libGluZ09uU2FtZUxldmVsKSB7XG4gICAgcmV0dXJuIGdhdGhlcmVkU2libGluZ3M7XG4gIH1cblxuICAvLyBOb3cgZ28gZm9yIHRoZSByb3V0ZSB0aGF0IGdvZXMgdG8gdGhlIGhpZ2hlc3QgcGFyZW50IG9mIHRoZSBzdGFydCBub2RlIGluIHRoZSB0cmVlXG4gIC8vIHRoYXQgaXMgbm90IHRoZSBwYXJlbnQgb2YgdGhlIGVuZCBub2RlLlxuICBjb25zdCBzdGFydE5vZGVQYXJlbnQgPSBmaW5kRmlyc3ROb25TaGFyZWRQYXJlbnQoe1xuICAgIGNoaWxkRWxlbWVudDogc3RhcnROb2RlLFxuICAgIG90aGVyRWxlbWVudDogZW5kTm9kZVxuICB9KTtcblxuICBpZiAoc3RhcnROb2RlUGFyZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgZm91bmRFbmROb2RlU2libGluZzogZm91bmRFbmROb2RlU2libGluZ0Zyb21QYXJlbnRMZXZlbCxcbiAgICAgIGdhdGhlcmVkU2libGluZ3M6IGdhdGhlcmVkU2libGluZ3NGcm9tUGFyZW50XG4gICAgfSA9IGdhdGhlclNpYmxpbmdzVXBUb0VuZE5vZGUoc3RhcnROb2RlUGFyZW50LCBlbmROb2RlKTtcblxuICAgIGlmIChmb3VuZEVuZE5vZGVTaWJsaW5nRnJvbVBhcmVudExldmVsKSB7XG4gICAgICByZXR1cm4gZ2F0aGVyZWRTaWJsaW5nc0Zyb21QYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIEdyb3VwcyBnaXZlbiBoaWdobGlnaHRzIGJ5IHRpbWVzdGFtcC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHNcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBBdHRyXG4gKiBAcmV0dXJucyB7QXJyYXl9IEdyb3VwZWQgaGlnaGxpZ2h0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCB0aW1lc3RhbXBBdHRyKSB7XG4gIGxldCBvcmRlciA9IFtdLFxuICAgIGNodW5rcyA9IHt9LFxuICAgIGdyb3VwZWQgPSBbXTtcblxuICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICBsZXQgdGltZXN0YW1wID0gaGwuZ2V0QXR0cmlidXRlKHRpbWVzdGFtcEF0dHIpO1xuXG4gICAgaWYgKHR5cGVvZiBjaHVua3NbdGltZXN0YW1wXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgY2h1bmtzW3RpbWVzdGFtcF0gPSBbXTtcbiAgICAgIG9yZGVyLnB1c2godGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBjaHVua3NbdGltZXN0YW1wXS5wdXNoKGhsKTtcbiAgfSk7XG5cbiAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICBsZXQgZ3JvdXAgPSBjaHVua3NbdGltZXN0YW1wXTtcblxuICAgIGdyb3VwZWQucHVzaCh7XG4gICAgICBjaHVua3M6IGdyb3VwLFxuICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBncm91cFxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oaCkge1xuICAgICAgICAgICAgcmV0dXJuIGgudGV4dENvbnRlbnQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbihcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGdyb3VwZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXRyaWV2ZUhpZ2hsaWdodHMocGFyYW1zKSB7XG4gIHBhcmFtcyA9IHtcbiAgICBhbmRTZWxmOiB0cnVlLFxuICAgIGdyb3VwZWQ6IGZhbHNlLFxuICAgIC4uLnBhcmFtc1xuICB9O1xuXG4gIGxldCBub2RlTGlzdCA9IHBhcmFtcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIltcIiArIHBhcmFtcy5kYXRhQXR0ciArIFwiXVwiKSxcbiAgICBoaWdobGlnaHRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuXG4gIGlmIChcbiAgICBwYXJhbXMuYW5kU2VsZiA9PT0gdHJ1ZSAmJlxuICAgIHBhcmFtcy5jb250YWluZXIuaGFzQXR0cmlidXRlKHBhcmFtcy5kYXRhQXR0cilcbiAgKSB7XG4gICAgaGlnaGxpZ2h0cy5wdXNoKHBhcmFtcy5jb250YWluZXIpO1xuICB9XG5cbiAgaWYgKHBhcmFtcy5ncm91cGVkKSB7XG4gICAgaGlnaGxpZ2h0cyA9IGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCBwYXJhbXMudGltZXN0YW1wQXR0cik7XG4gIH1cblxuICByZXR1cm4gaGlnaGxpZ2h0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudEhpZ2hsaWdodChlbCwgZGF0YUF0dHIpIHtcbiAgcmV0dXJuIChcbiAgICBlbCAmJiBlbC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlRfTk9ERSAmJiBlbC5oYXNBdHRyaWJ1dGUoZGF0YUF0dHIpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGROb2Rlc1RvSGlnaGxpZ2h0QWZ0ZXJFbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgZWxlbWVudEFuY2VzdG9yLFxuICBoaWdobGlnaHRXcmFwcGVyLFxuICBoaWdobGlnaHRlZENsYXNzXG59KSB7XG4gIGlmIChlbGVtZW50QW5jZXN0b3IpIHtcbiAgICBpZiAoZWxlbWVudEFuY2VzdG9yLmNsYXNzTGlzdC5jb250YWlucyhoaWdobGlnaHRlZENsYXNzKSkge1xuICAgICAgLy8gRW5zdXJlIHdlIG9ubHkgdGFrZSB0aGUgY2hpbGRyZW4gZnJvbSBhIHBhcmVudCB0aGF0IGlzIGEgaGlnaGxpZ2h0LlxuICAgICAgZWxlbWVudEFuY2VzdG9yLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICBpZiAoZG9tKGNoaWxkTm9kZSkuaXNBZnRlcihlbGVtZW50KSkge1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRBbmNlc3Rvci5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZ2hsaWdodFdyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudEFuY2VzdG9yKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGlnaGxpZ2h0V3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbGxlY3RzIHRoZSBodW1hbi1yZWFkYWJsZSBoaWdobGlnaHRlZCB0ZXh0IGZvciBhbGwgbm9kZXMgaW4gdGhlIHNlbGVjdGVkIHJhbmdlLlxuICpcbiAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaHVtYW4tcmVhZGFibGUgaGlnaGxpZ2h0ZWQgdGV4dCBmb3IgdGhlIGdpdmVuIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0ZWRUZXh0KHJhbmdlKSB7XG4gIGNvbnN0IHN0YXJ0Q29udGFpbmVyQ29weSA9IHJhbmdlLnN0YXJ0Q29udGFpbmVyLmNsb25lKHRydWUpO1xuICByZXR1cm4gXCJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlc2NyaXB0b3JzKHsgcm9vdEVsZW1lbnQsIHJhbmdlLCB3cmFwcGVyIH0pIHtcbiAgbGV0IHdyYXBwZXJDbG9uZSA9IHdyYXBwZXIuY2xvbmVOb2RlKHRydWUpO1xuXG4gIGNvbnN0IHN0YXJ0T2Zmc2V0ID1cbiAgICBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLnN0YXJ0Q29udGFpbmVyLCByb290RWxlbWVudCkgKyByYW5nZS5zdGFydE9mZnNldDtcbiAgY29uc3QgZW5kT2Zmc2V0ID1cbiAgICByYW5nZS5zdGFydENvbnRhaW5lciA9PT0gcmFuZ2UuZW5kQ29udGFpbmVyXG4gICAgICA/IHN0YXJ0T2Zmc2V0ICsgKHJhbmdlLmVuZE9mZnNldCAtIHJhbmdlLnN0YXJ0T2Zmc2V0KVxuICAgICAgOiBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLmVuZENvbnRhaW5lciwgcm9vdEVsZW1lbnQpICsgcmFuZ2UuZW5kT2Zmc2V0O1xuICBjb25zdCBsZW5ndGggPSBlbmRPZmZzZXQgLSBzdGFydE9mZnNldDtcbiAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuXG4gIHdyYXBwZXJDbG9uZS5pbm5lckhUTUwgPSBcIlwiO1xuICBjb25zdCB3cmFwcGVySFRNTCA9IHdyYXBwZXJDbG9uZS5vdXRlckhUTUw7XG5cbiAgY29uc3QgZGVzY3JpcHRvciA9IFtcbiAgICB3cmFwcGVySFRNTCxcbiAgICAvLyByZXRyaWV2ZSBhbGwgdGhlIHRleHQgY29udGVudCBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIG9mZnNldHMuXG4gICAgZ2V0SGlnaGxpZ2h0ZWRUZXh0KHJhbmdlKSxcbiAgICBzdGFydE9mZnNldCxcbiAgICBsZW5ndGhcbiAgXTtcbiAgLy8gVE9ETzogY2h1bmsgdXAgaGlnaGxpZ2h0cyBmb3IgUERGcyAob3IgYW55IGVsZW1lbnQgd2l0aCBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudHMpLlxuICByZXR1cm4gW2Rlc2NyaXB0b3JdO1xufVxuIl19
