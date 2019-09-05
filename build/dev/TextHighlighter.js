(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IGNORE_TAGS = exports.LENGTH_ATTR = exports.START_OFFSET_ATTR = exports.TIMESTAMP_ATTR = exports.DATA_ATTR = void 0;

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
var LENGTH_ATTR = "data-length";
/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */

exports.LENGTH_ATTR = LENGTH_ATTR;
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
      wrapperClone.setAttribute(_config.START_OFFSET_ATTR, startOffset); // wrapperClone.setAttribute(END_OFFSET_ATTR, endOffset);

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
      }); // TODO: normalise the rest of the highlights after removing some.
      // const restOfHighlights = this.getHighlights();
      // this.normalizeHighlights(restOfHighlights);
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
          self = this;
      (0, _highlights.sortByDepth)(highlights, false);

      if (highlights.length === 0) {
        return [];
      } // Even if there are multiple elements for a given highlight, the first
      // highlight in the DOM with the given ID in it's class name
      // will have all the information we need.


      var highlight = highlights.find(function (hl) {
        return hl.classList.contains(id);
      });

      if (!highlight) {
        return [];
      }

      var length = highlight.getAttribute(_config.LENGTH_ATTR);
      var offset = highlight.getAttribute(_config.START_OFFSET_ATTR);
      var wrapper = highlight.cloneNode(true);
      wrapper.innerHTML = "";
      var wrapperHTML = wrapper.outerHTML;
      var descriptor = [wrapperHTML, (0, _highlights.getHighlightedTextRelativeToRoot)({
        rootElement: self.el,
        startOffset: offset,
        length: length
      }), offset, length];
      return JSON.stringify([descriptor]);
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

      function deserialise(hlDescriptor) {
        var hl = {
          wrapper: hlDescriptor[0],
          text: hlDescriptor[1],
          offset: Number.parseInt(hlDescriptor[2]),
          length: Number.parseInt(hlDescriptor[3])
        },
            hlNode,
            highlight;
        var parentNode = self.el;
        var highlightNodes = (0, _highlights.findNodesAndOffsets)(hl, parentNode);
        highlightNodes.forEach(function (_ref) {
          var node = _ref.node,
              offsetWithinNode = _ref.offset,
              lengthInNode = _ref.length;
          hlNode = node.splitText(offsetWithinNode);
          hlNode.splitText(lengthInNode);

          if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
            (0, _dom["default"])(hlNode.nextSibling).remove();
          }

          if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
            (0, _dom["default"])(hlNode.previousSibling).remove();
          }

          highlight = (0, _dom["default"])(hlNode).wrap((0, _dom["default"])().fromHTML(hl.wrapper)[0]);
          highlights.push(highlight);
        });
      }

      hlDescriptors.forEach(function (hlDescriptor) {
        try {
          console.log("Highlight: ", hlDescriptor);
          deserialise(hlDescriptor);
        } catch (e) {
          if (console && console.warn) {
            console.warn("Can't deserialize highlight descriptor. Cause: " + e);
          }
        }
      }); // TODO: normalise at the end of deserialisation.
      // this.normalizeHighlights(highlights);

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
       * Traverses up the tree to to get the next closest sibling of a node
       * or any of it's parents.
       *
       * This is used in scenarios where you have already consumed the parents while
       * traversing the tree but not the siblings of parents.
       *
       * @returns {HTMLElement | null}
       */
      nextClosestSibling: function nextClosestSibling() {
        var current = el;
        var nextClosestSibling;

        do {
          nextClosestSibling = current.nextSibling;
          current = current.parentNode;
        } while (!nextClosestSibling && current.parentNode);

        return nextClosestSibling;
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
exports.findNodesAndOffsets = findNodesAndOffsets;
exports.getElementOffset = getElementOffset;
exports.findFirstNonSharedParent = findFirstNonSharedParent;
exports.extractElementContentForHighlight = extractElementContentForHighlight;
exports.nodesInBetween = nodesInBetween;
exports.groupHighlights = groupHighlights;
exports.retrieveHighlights = retrieveHighlights;
exports.isElementHighlight = isElementHighlight;
exports.addNodesToHighlightAfterElement = addNodesToHighlightAfterElement;
exports.getHighlightedTextForRange = getHighlightedTextForRange;
exports.getHighlightedTextRelativeToRoot = getHighlightedTextRelativeToRoot;
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
 * A highlight can span multiple nodes, so in here we accumulate
 * all those nodes with offset and length of the content in the node
 * included in the highlight.
 *
 * @param {*} highlight
 * @param {*} parentNode
 */


function findNodesAndOffsets(highlight, parentNode) {
  var nodesAndOffsets = [];
  var currentNode = parentNode;
  var currentOffset = 0;
  var highlightEndOffset = highlight.offset + highlight.length;

  while (currentNode && currentOffset < highlightEndOffset) {
    var textLength = currentNode.textContent.length;
    var endOfCurrentNodeOffset = currentOffset + textLength;

    if (endOfCurrentNodeOffset > highlight.offset) {
      var isTerminalNode = currentNode.childNodes.length === 0;

      if (isTerminalNode) {
        var offsetWithinNode = highlight.offset > currentOffset ? highlight.offset - currentOffset : 0;
        var lengthInHighlight = highlightEndOffset > endOfCurrentNodeOffset ? textLength - offsetWithinNode : highlightEndOffset - currentOffset - offsetWithinNode;
        nodesAndOffsets.push({
          node: currentNode,
          offset: offsetWithinNode,
          length: lengthInHighlight
        });
        currentOffset = endOfCurrentNodeOffset;
        currentNode = (0, _dom["default"])(currentNode).nextClosestSibling();
      } else {
        currentNode = currentNode.childNodes[0];
      }
    } else {
      currentOffset = endOfCurrentNodeOffset;
      currentNode = currentNode.nextSibling;
    }
  }

  return nodesAndOffsets;
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
        // if (dom(childNode).isAfter(element)) {
        // }
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


function getHighlightedTextForRange(range) {
  var documentFragment = range.extractContents();
  return documentFragment.innerText;
}
/**
 * Collects the human-readable highlighted text for all nodes from the start text offset
 * relative to the root element.
 *
 * @param {{ rootElement: HTMLElement, startOffset: number, length: number}} params
 *  The root-relative parameters for extracting highlighted text.
 *
 * @return {string} The human-readable highlighted text for the given root element, offset and length.
 */


function getHighlightedTextRelativeToRoot(_ref2) {
  var rootElement = _ref2.rootElement,
      startOffset = _ref2.startOffset,
      length = _ref2.length;
  var textContent = rootElement.textContent;
  var highlightedRawText = textContent.substring(startOffset, Number.parseInt(startOffset) + Number.parseInt(length));
  var textNode = document.createTextNode(highlightedRawText);
  var tempContainer = document.createElement("div");
  tempContainer.appendChild(textNode); // Extract the human-readable text only.

  return tempContainer.innerText;
}

function createDescriptors(_ref3) {
  var rootElement = _ref3.rootElement,
      range = _ref3.range,
      wrapper = _ref3.wrapper;
  var wrapperClone = wrapper.cloneNode(true);
  var startOffset = getElementOffset(range.startContainer, rootElement) + range.startOffset;
  var endOffset = range.startContainer === range.endContainer ? startOffset + (range.endOffset - range.startOffset) : getElementOffset(range.endContainer, rootElement) + range.endOffset;
  var length = endOffset - startOffset;
  wrapperClone.setAttribute(_config.DATA_ATTR, true);
  wrapperClone.innerHTML = "";
  var wrapperHTML = wrapperClone.outerHTML;
  var descriptor = [wrapperHTML, // retrieve all the text content between the start and end offsets.
  getHighlightedTextForRange(range), startOffset, length];
  return [descriptor];
}

},{"../config":1,"./dom":8}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzIiwic3JjL2dsb2JhbC1zY3JpcHQuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL2luZGVwZW5kZW5jaWEuanMiLCJzcmMvaGlnaGxpZ2h0ZXJzL3ByaW1pdGl2by5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUlPLElBQU0sU0FBUyxHQUFHLGtCQUFsQjtBQUVQOzs7Ozs7QUFJTyxJQUFNLGNBQWMsR0FBRyxnQkFBdkI7O0FBRUEsSUFBTSxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBQ0EsSUFBTSxXQUFXLEdBQUcsYUFBcEI7QUFFUDs7Ozs7O0FBSU8sSUFBTSxXQUFXLEdBQUcsQ0FDekIsUUFEeUIsRUFFekIsT0FGeUIsRUFHekIsUUFIeUIsRUFJekIsUUFKeUIsRUFLekIsUUFMeUIsRUFNekIsUUFOeUIsRUFPekIsUUFQeUIsRUFRekIsT0FSeUIsRUFTekIsT0FUeUIsRUFVekIsUUFWeUIsRUFXekIsT0FYeUIsRUFZekIsT0FaeUIsRUFhekIsT0FieUIsRUFjekIsVUFkeUIsQ0FBcEI7Ozs7Ozs7QUNuQlA7O0FBWUE7Ozs7QUFWQTs7OztBQUlBLE1BQU0sQ0FBQyxlQUFQLEdBQXlCLDJCQUF6QjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUNSQTs7QUFnQkE7O0FBTUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNLHdCOzs7QUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsb0NBQVksT0FBWixFQUFxQixPQUFyQixFQUE4QjtBQUFBOztBQUM1QixTQUFLLEVBQUwsR0FBVSxP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QUF5QixLQUFLLENBQUMsWUFBL0IsR0FDSSxXQUFXLElBQUksS0FBSyxDQUFDLFNBQU4sR0FBa0IsS0FBSyxDQUFDLFdBQTVCLENBRGYsR0FFSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsWUFBUCxFQUFxQixXQUFyQixDQUFoQixHQUFvRCxLQUFLLENBQUMsU0FIaEU7QUFJQSxNQUFNLE1BQU0sR0FBRyxTQUFTLEdBQUcsV0FBM0I7QUFDQSxFQUFBLFlBQVksQ0FBQyxZQUFiLENBQTBCLGlCQUExQixFQUFxQyxJQUFyQztBQUVBLEVBQUEsWUFBWSxDQUFDLFNBQWIsR0FBeUIsRUFBekI7QUFDQSxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsU0FBakM7QUFFQSxNQUFNLFVBQVUsR0FBRyxDQUNqQixXQURpQixFQUVqQjtBQUNBLEVBQUEsMEJBQTBCLENBQUMsS0FBRCxDQUhULEVBSWpCLFdBSmlCLEVBS2pCLE1BTGlCLENBQW5CO0FBT0EsU0FBTyxDQUFDLFVBQUQsQ0FBUDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBBdHRyaWJ1dGUgYWRkZWQgYnkgZGVmYXVsdCB0byBldmVyeSBoaWdobGlnaHQuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgREFUQV9BVFRSID0gXCJkYXRhLWhpZ2hsaWdodGVkXCI7XG5cbi8qKlxuICogQXR0cmlidXRlIHVzZWQgdG8gZ3JvdXAgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRJTUVTVEFNUF9BVFRSID0gXCJkYXRhLXRpbWVzdGFtcFwiO1xuXG5leHBvcnQgY29uc3QgU1RBUlRfT0ZGU0VUX0FUVFIgPSBcImRhdGEtc3RhcnQtb2Zmc2V0XCI7XG5leHBvcnQgY29uc3QgTEVOR1RIX0FUVFIgPSBcImRhdGEtbGVuZ3RoXCI7XG5cbi8qKlxuICogRG9uJ3QgaGlnaGxpZ2h0IGNvbnRlbnQgb2YgdGhlc2UgdGFncy5cbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqL1xuZXhwb3J0IGNvbnN0IElHTk9SRV9UQUdTID0gW1xuICBcIlNDUklQVFwiLFxuICBcIlNUWUxFXCIsXG4gIFwiU0VMRUNUXCIsXG4gIFwiT1BUSU9OXCIsXG4gIFwiQlVUVE9OXCIsXG4gIFwiT0JKRUNUXCIsXG4gIFwiQVBQTEVUXCIsXG4gIFwiVklERU9cIixcbiAgXCJBVURJT1wiLFxuICBcIkNBTlZBU1wiLFxuICBcIkVNQkVEXCIsXG4gIFwiUEFSQU1cIixcbiAgXCJNRVRFUlwiLFxuICBcIlBST0dSRVNTXCJcbl07XG4iLCJpbXBvcnQgVGV4dEhpZ2hsaWdodGVyIGZyb20gXCIuL3RleHQtaGlnaGxpZ2h0ZXJcIjtcblxuLyoqXG4gKiBFeHBvc2UgdGhlIFRleHRIaWdobGlnaHRlciBjbGFzcyBnbG9iYWxseSB0byBiZVxuICogdXNlZCBpbiBkZW1vcyBhbmQgdG8gYmUgaW5qZWN0ZWQgZGlyZWN0bHkgaW50byBodG1sIGZpbGVzLlxuICovXG5nbG9iYWwuVGV4dEhpZ2hsaWdodGVyID0gVGV4dEhpZ2hsaWdodGVyO1xuXG4vKipcbiAqIExvYWQgdGhlIGpxdWVyeSBwbHVnaW4gZ2xvYmFsbHkgZXhwZWN0aW5nIGpRdWVyeSBhbmQgVGV4dEhpZ2hsaWdodGVyIHRvIGJlIGdsb2JhbGx5XG4gKiBhdmFpYWJsZSwgdGhpcyBtZWFucyB0aGlzIGxpYnJhcnkgZG9lc24ndCBuZWVkIGEgaGFyZCByZXF1aXJlbWVudCBvZiBqUXVlcnkuXG4gKi9cbmltcG9ydCBcIi4vanF1ZXJ5LXBsdWdpblwiO1xuIiwiaW1wb3J0IHtcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIGdldEVsZW1lbnRPZmZzZXQsXG4gIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24sXG4gIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCxcbiAgZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0LFxuICBub2Rlc0luQmV0d2VlbixcbiAgc29ydEJ5RGVwdGgsXG4gIGZpbmROb2Rlc0FuZE9mZnNldHMsXG4gIGFkZE5vZGVzVG9IaWdobGlnaHRBZnRlckVsZW1lbnQsXG4gIGNyZWF0ZVdyYXBwZXIsXG4gIGNyZWF0ZURlc2NyaXB0b3JzLFxuICBnZXRIaWdobGlnaHRlZFRleHQsXG4gIGdldEhpZ2hsaWdodGVkVGV4dFJlbGF0aXZlVG9Sb290XG59IGZyb20gXCIuLi91dGlscy9oaWdobGlnaHRzXCI7XG5pbXBvcnQge1xuICBTVEFSVF9PRkZTRVRfQVRUUixcbiAgTEVOR1RIX0FUVFIsXG4gIERBVEFfQVRUUixcbiAgVElNRVNUQU1QX0FUVFJcbn0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IGRvbSBmcm9tIFwiLi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyB1bmlxdWUgfSBmcm9tIFwiLi4vdXRpbHMvYXJyYXlzXCI7XG5cbi8qKlxuICogSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHNcbiAqIHdpdGggYSBmb2N1cyBvbiByZW1vdmluZyBpbnRlcmRlcGVuZGVuY2UgYmV0d2VlbiBoaWdobGlnaHRzIGFuZCBvdGhlciBlbGVtZW50IG5vZGVzIGluIHRoZSBjb250ZXh0IGVsZW1lbnQuXG4gKi9cbmNsYXNzIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlciBpbnN0YW5jZSBmb3IgZnVuY3Rpb25hbGl0eSB0aGF0IGZvY3VzZXMgZm9yIGhpZ2hsaWdodCBpbmRlcGVuZGVuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgSW5kZXBlbmRlbmNpYUhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHRoZSByYW5nZSBhbGxvd2luZyBpc29sYXRpb24gZm9yIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMuXG4gICAqIFRoaXMgc29sdXRpb24gc3RlYWxzIHRoZSB0ZXh0IG9yIG90aGVyIG5vZGVzIGluIHRoZSBET00gZnJvbSBvdmVybGFwcGluZyAoTk9UIE5FU1RFRCkgaGlnaGxpZ2h0c1xuICAgKiBmb3IgcmVwcmVzZW50YXRpb24gaW4gdGhlIERPTS5cbiAgICpcbiAgICogRm9yIHRoZSBwdXJwb3NlIG9mIHNlcmlhbGlzYXRpb24gdGhpcyB3aWxsIG1haW50YWluIGEgZGF0YSBhdHRyaWJ1dGUgb24gdGhlIGhpZ2hsaWdodCB3cmFwcGVyXG4gICAqIHdpdGggdGhlIHN0YXJ0IHRleHQgYW5kIGVuZCB0ZXh0IG9mZnNldHMgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcm9vdCBlbGVtZW50LlxuICAgKlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyOTogUkFOR0U6IFwiLCByYW5nZSk7XG5cbiAgICBsZXQgaGlnaGxpZ2h0cyA9IFtdO1xuICAgIGxldCB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcblxuICAgIGxldCBzdGFydE9mZnNldCA9XG4gICAgICBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLnN0YXJ0Q29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgIGxldCBlbmRPZmZzZXQgPVxuICAgICAgcmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHJhbmdlLmVuZENvbnRhaW5lclxuICAgICAgICA/IHN0YXJ0T2Zmc2V0ICsgKHJhbmdlLmVuZE9mZnNldCAtIHJhbmdlLnN0YXJ0T2Zmc2V0KVxuICAgICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLmVuZE9mZnNldDtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJBTFNEZWJ1ZzI5OiBzdGFydE9mZnNldDogXCIsXG4gICAgICBzdGFydE9mZnNldCxcbiAgICAgIFwiZW5kT2Zmc2V0OiBcIixcbiAgICAgIGVuZE9mZnNldFxuICAgICk7XG5cbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKFNUQVJUX09GRlNFVF9BVFRSLCBzdGFydE9mZnNldCk7XG4gICAgLy8gd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShFTkRfT0ZGU0VUX0FUVFIsIGVuZE9mZnNldCk7XG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuXG4gICAgY29uc29sZS5sb2coXCJcXG5cXG5cXG4gRklORElORyBTVEFSVCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLnN0YXJ0Q29udGFpbmVyOiBcIiwgcmFuZ2Uuc3RhcnRDb250YWluZXIpO1xuICAgIGxldCBzdGFydENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2Uuc3RhcnRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIEVORCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLmVuZENvbnRhaW5lcjogXCIsIHJhbmdlLmVuZENvbnRhaW5lcik7XG4gICAgbGV0IGVuZENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2UuZW5kQ29udGFpbmVyLCBcInN0YXJ0XCIpO1xuXG4gICAgaWYgKCFzdGFydENvbnRhaW5lciB8fCAhZW5kQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRmFpbGVkIHRvIGZpbmQgdGhlIHRleHQgbm9kZSBmb3IgdGhlIHN0YXJ0IG9yIHRoZSBlbmQgb2YgdGhlIHNlbGVjdGVkIHJhbmdlXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyTmV3SGlnaGxpZ2h0ID1cbiAgICAgIHJhbmdlLmVuZE9mZnNldCA8IGVuZENvbnRhaW5lci50ZXh0Q29udGVudC5sZW5ndGggLSAxXG4gICAgICAgID8gZW5kQ29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5lbmRPZmZzZXQpXG4gICAgICAgIDogZW5kQ29udGFpbmVyO1xuXG4gICAgaWYgKHN0YXJ0Q29udGFpbmVyID09PSBlbmRDb250YWluZXIpIHtcbiAgICAgIGxldCBzdGFydE9mTmV3SGlnaGxpZ2h0ID1cbiAgICAgICAgcmFuZ2Uuc3RhcnRPZmZzZXQgPiAwXG4gICAgICAgICAgPyBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICAgICAgOiBzdGFydENvbnRhaW5lcjtcbiAgICAgIC8vIFNpbXBseSB3cmFwIHRoZSBzZWxlY3RlZCByYW5nZSBpbiB0aGUgc2FtZSBjb250YWluZXIgYXMgYSBoaWdobGlnaHQuXG4gICAgICBsZXQgaGlnaGxpZ2h0ID0gZG9tKHN0YXJ0T2ZOZXdIaWdobGlnaHQpLndyYXAod3JhcHBlckNsb25lKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH0gZWxzZSBpZiAoZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCA+PSByYW5nZS5lbmRPZmZzZXQpIHtcbiAgICAgIGxldCBzdGFydE9mTmV3SGlnaGxpZ2h0ID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGxldCBlbmRPZk5ld0hpZ2hsaWdodCA9IGFmdGVyTmV3SGlnaGxpZ2h0LnByZXZpb3VzU2libGluZztcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIk5vZGUgYXQgdGhlIHN0YXJ0IG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgc3RhcnRPZk5ld0hpZ2hsaWdodFxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiTm9kZSBhdCB0aGUgZW5kIG9mIG5ldyBoaWdobGlnaHQ6IFwiLCBlbmRPZk5ld0hpZ2hsaWdodCk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0RWxlbWVudFBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgICAgIGNoaWxkRWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzdGFydEVsZW1lbnRQYXJlbnRDb3B5O1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHRDb3B5O1xuICAgICAgaWYgKHN0YXJ0RWxlbWVudFBhcmVudCkge1xuICAgICAgICAoe1xuICAgICAgICAgIGVsZW1lbnRBbmNlc3RvckNvcHk6IHN0YXJ0RWxlbWVudFBhcmVudENvcHksXG4gICAgICAgICAgZWxlbWVudENvcHk6IHN0YXJ0T2ZOZXdIaWdobGlnaHRDb3B5XG4gICAgICAgIH0gPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoe1xuICAgICAgICAgIGVsZW1lbnQ6IHN0YXJ0T2ZOZXdIaWdobGlnaHQsXG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwic3RhcnRcIlxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydEVsZW1lbnRQYXJlbnQ6XCIsIHN0YXJ0RWxlbWVudFBhcmVudCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRFbGVtZW50UGFyZW50Q29weTogXCIsIHN0YXJ0RWxlbWVudFBhcmVudENvcHkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbmRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgbGV0IGVuZEVsZW1lbnRQYXJlbnRDb3B5O1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0Q29weTtcbiAgICAgIGlmIChlbmRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgICh7XG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yQ29weTogZW5kRWxlbWVudFBhcmVudENvcHksXG4gICAgICAgICAgZWxlbWVudGNvcHk6IGVuZE9mTmV3SGlnaGxpZ2h0Q29weVxuICAgICAgICB9ID0gZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0KHtcbiAgICAgICAgICBlbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3I6IGVuZEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwiZW5kXCJcbiAgICAgICAgfSkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIk5vZGUgdGhhdCBpcyB0aGUgd3JhcHBlciBvZiB0aGUgZW5kIG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJDbG9uZWQgb2Ygbm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQgYWZ0ZXIgcmVtb3Zpbmcgc2libGluZ3MgYW5kIHVud3JhcHBpbmcgaGlnaGxpZ2h0IHNwYW5zOiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBhZGROb2Rlc1RvSGlnaGxpZ2h0QWZ0ZXJFbGVtZW50KHtcbiAgICAgICAgZWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodENvcHkgfHwgc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnRDb3B5LFxuICAgICAgICBoaWdobGlnaHRXcmFwcGVyOiB3cmFwcGVyQ2xvbmUsXG4gICAgICAgIGhpZ2hsaWdodGVkQ2xhc3M6IHRoaXMub3B0aW9ucy5oaWdobGlnaHRlZENsYXNzXG4gICAgICB9KTtcblxuICAgICAgLy8gVE9ETzogYWRkIGNvbnRhaW5lcnMgaW4gYmV0d2Vlbi5cbiAgICAgIGNvbnN0IGNvbnRhaW5lcnNJbkJldHdlZW4gPSBub2Rlc0luQmV0d2VlbihzdGFydENvbnRhaW5lciwgZW5kQ29udGFpbmVyKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ09OVEFJTkVSUyBJTiBCRVRXRUVOOiBcIiwgY29udGFpbmVyc0luQmV0d2Vlbik7XG4gICAgICBjb250YWluZXJzSW5CZXR3ZWVuLmZvckVhY2goY29udGFpbmVyID0+IHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnRDb3B5KSB7XG4gICAgICAgIC8vIE9ubHkgY29weSB0aGUgY2hpbGRyZW4gb2YgYSBoaWdobGlnaHRlZCBzcGFuIGludG8gb3VyIG5ldyBoaWdobGlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZEVsZW1lbnRQYXJlbnRDb3B5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZE9mTmV3SGlnaGxpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgZG9tKHdyYXBwZXJDbG9uZSkuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBlbmRFbGVtZW50UGFyZW50ID8gZW5kRWxlbWVudFBhcmVudCA6IGFmdGVyTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgY3VycmVudCByYW5nZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBrZWVwUmFuZ2UgLSBEb24ndCByZW1vdmUgcmFuZ2UgYWZ0ZXIgaGlnaGxpZ2h0aW5nLiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgZG9IaWdobGlnaHQoa2VlcFJhbmdlKSB7XG4gICAgbGV0IHJhbmdlID0gZG9tKHRoaXMuZWwpLmdldFJhbmdlKCksXG4gICAgICB3cmFwcGVyLFxuICAgICAgdGltZXN0YW1wO1xuXG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0KHJhbmdlKSA9PT0gdHJ1ZSkge1xuICAgICAgdGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG4gICAgICB3cmFwcGVyID0gY3JlYXRlV3JhcHBlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gY3JlYXRlRGVzY3JpcHRvcnMoe1xuICAgICAgICByb290RWxlbWVudDogdGhpcy5lbCxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHdyYXBwZXJcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjcmVhdGVkSGlnaGxpZ2h0cyA9IHRoaXMuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICAgICAgLy8gbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB0aGlzLm5vcm1hbGl6ZUhpZ2hsaWdodHMoY3JlYXRlZEhpZ2hsaWdodHMpO1xuXG4gICAgICBjb25zdCBwcm9jZXNzZWREZXNjcmlwdG9ycyA9IHRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KFxuICAgICAgICByYW5nZSxcbiAgICAgICAgZGVzY3JpcHRvcnMsXG4gICAgICAgIHRpbWVzdGFtcFxuICAgICAgKTtcbiAgICAgIHRoaXMuZGVzZXJpYWxpemVIaWdobGlnaHRzKHByb2Nlc3NlZERlc2NyaXB0b3JzKTtcbiAgICB9XG5cbiAgICBpZiAoIWtlZXBSYW5nZSkge1xuICAgICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZXMgdGV4dCBub2RlcyB3aXRoaW4gYW55IGdpdmVuIGVsZW1lbnQgbm9kZSBhcmUgbWVyZ2VkIHRvZ2V0aGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBub3JtYWxpemUuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBub3JtYWxpemVkIGhpZ2hsaWdodHMuIE9yZGVyIGFuZCBudW1iZXIgb2YgcmV0dXJuZWQgaGlnaGxpZ2h0cyBtYXkgYmUgZGlmZmVyZW50IHRoYW5cbiAgICogaW5wdXQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgbm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgbGV0IG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuXG4gICAgLy9TaW5jZSB3ZSdyZSBub3QgbWVyZ2luZyBvciBmbGF0dGVuaW5nLCB3ZSBuZWVkIHRvIG5vcm1hbGlzZSB0aGUgdGV4dCBub2Rlcy5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICBkb20oaGlnaGxpZ2h0KS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9KTtcblxuICAgIC8vIG9taXQgcmVtb3ZlZCBub2Rlc1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoZnVuY3Rpb24oaGwpIHtcbiAgICAgIHJldHVybiBobC5wYXJlbnRFbGVtZW50ID8gaGwgOiBudWxsO1xuICAgIH0pO1xuXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSB1bmlxdWUobm9ybWFsaXplZEhpZ2hsaWdodHMpO1xuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGEub2Zmc2V0VG9wIC0gYi5vZmZzZXRUb3AgfHwgYS5vZmZzZXRMZWZ0IC0gYi5vZmZzZXRMZWZ0O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRIaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaGlnaGxpZ2h0cyBmcm9tIGVsZW1lbnQuIElmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBpdCBpcyByZW1vdmVkIGFzIHdlbGwuXG4gICAqIElmIG5vIGVsZW1lbnQgaXMgZ2l2ZW4sIGFsbCBoaWdobGlnaHRzIGFyZSByZW1vdmVkLlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbZWxlbWVudF0gLSBlbGVtZW50IHRvIHJlbW92ZSBoaWdobGlnaHRzIGZyb21cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IGVsZW1lbnQgfHwgdGhpcy5lbCxcbiAgICAgIGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KGhpZ2hsaWdodCkge1xuICAgICAgaWYgKGhpZ2hsaWdodC5jbGFzc05hbWUgPT09IGNvbnRhaW5lci5jbGFzc05hbWUpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkudW53cmFwKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0KGhsKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZW1vdmVIaWdobGlnaHQoaGwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogbm9ybWFsaXNlIHRoZSByZXN0IG9mIHRoZSBoaWdobGlnaHRzIGFmdGVyIHJlbW92aW5nIHNvbWUuXG4gICAgLy8gY29uc3QgcmVzdE9mSGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpO1xuICAgIC8vIHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhyZXN0T2ZIaWdobGlnaHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodHMgZnJvbSBnaXZlbiBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3BhcmFtcy5jb250YWluZXJdIC0gcmV0dXJuIGhpZ2hsaWdodHMgZnJvbSB0aGlzIGVsZW1lbnQuIERlZmF1bHQ6IHRoZSBlbGVtZW50IHRoZVxuICAgKiBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuYW5kU2VsZl0gLSBpZiBzZXQgdG8gdHJ1ZSBhbmQgY29udGFpbmVyIGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgYWRkIGNvbnRhaW5lciB0b1xuICAgKiByZXR1cm5lZCByZXN1bHRzLiBEZWZhdWx0OiB0cnVlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuZ3JvdXBlZF0gLSBpZiBzZXQgdG8gdHJ1ZSwgaGlnaGxpZ2h0cyBhcmUgZ3JvdXBlZCBpbiBsb2dpY2FsIGdyb3VwcyBvZiBoaWdobGlnaHRzIGFkZGVkXG4gICAqIGluIHRoZSBzYW1lIG1vbWVudC4gRWFjaCBncm91cCBpcyBhbiBvYmplY3Qgd2hpY2ggaGFzIGdvdCBhcnJheSBvZiBoaWdobGlnaHRzLCAndG9TdHJpbmcnIG1ldGhvZCBhbmQgJ3RpbWVzdGFtcCdcbiAgICogcHJvcGVydHkuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgICBjb25zdCBtZXJnZWRQYXJhbXMgPSB7XG4gICAgICBjb250YWluZXI6IHRoaXMuZWwsXG4gICAgICBkYXRhQXR0cjogREFUQV9BVFRSLFxuICAgICAgdGltZXN0YW1wQXR0cjogVElNRVNUQU1QX0FUVFIsXG4gICAgICAuLi5wYXJhbXNcbiAgICB9O1xuICAgIHJldHVybiByZXRyaWV2ZUhpZ2hsaWdodHMobWVyZ2VkUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodC5cbiAgICpcbiAgICogQHBhcmFtIGVsIC0gZWxlbWVudCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBJbmRlcGVuZGVuY2lhSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGlzSGlnaGxpZ2h0KGVsLCBkYXRhQXR0cikge1xuICAgIHJldHVybiBpc0VsZW1lbnRIaWdobGlnaHQoZWwsIGRhdGFBdHRyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIEluZGVwZW5kZW5jaWFIaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0cyhpZCkge1xuICAgIGNvbnN0IGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaWYgKGhpZ2hsaWdodHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gRXZlbiBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgZWxlbWVudHMgZm9yIGEgZ2l2ZW4gaGlnaGxpZ2h0LCB0aGUgZmlyc3RcbiAgICAvLyBoaWdobGlnaHQgaW4gdGhlIERPTSB3aXRoIHRoZSBnaXZlbiBJRCBpbiBpdCdzIGNsYXNzIG5hbWVcbiAgICAvLyB3aWxsIGhhdmUgYWxsIHRoZSBpbmZvcm1hdGlvbiB3ZSBuZWVkLlxuICAgIGNvbnN0IGhpZ2hsaWdodCA9IGhpZ2hsaWdodHMuZmluZChobCA9PiBobC5jbGFzc0xpc3QuY29udGFpbnMoaWQpKTtcblxuICAgIGlmICghaGlnaGxpZ2h0KSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gaGlnaGxpZ2h0LmdldEF0dHJpYnV0ZShMRU5HVEhfQVRUUik7XG4gICAgY29uc3Qgb2Zmc2V0ID0gaGlnaGxpZ2h0LmdldEF0dHJpYnV0ZShTVEFSVF9PRkZTRVRfQVRUUik7XG4gICAgY29uc3Qgd3JhcHBlciA9IGhpZ2hsaWdodC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICB3cmFwcGVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgY29uc3Qgd3JhcHBlckhUTUwgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBbXG4gICAgICB3cmFwcGVySFRNTCxcbiAgICAgIGdldEhpZ2hsaWdodGVkVGV4dFJlbGF0aXZlVG9Sb290KHtcbiAgICAgICAgcm9vdEVsZW1lbnQ6IHNlbGYuZWwsXG4gICAgICAgIHN0YXJ0T2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgIGxlbmd0aFxuICAgICAgfSksXG4gICAgICBvZmZzZXQsXG4gICAgICBsZW5ndGhcbiAgICBdO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFtkZXNjcmlwdG9yXSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIHRoZSBpbmRlcGVuZGVudCBmb3JtIG9mIGhpZ2hsaWdodHMuXG4gICAqXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIGxldCBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGlzZShobERlc2NyaXB0b3IpIHtcbiAgICAgIGxldCBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIG9mZnNldDogTnVtYmVyLnBhcnNlSW50KGhsRGVzY3JpcHRvclsyXSksXG4gICAgICAgICAgbGVuZ3RoOiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzNdKVxuICAgICAgICB9LFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodDtcblxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHNlbGYuZWw7XG4gICAgICBjb25zdCBoaWdobGlnaHROb2RlcyA9IGZpbmROb2Rlc0FuZE9mZnNldHMoaGwsIHBhcmVudE5vZGUpO1xuXG4gICAgICBoaWdobGlnaHROb2Rlcy5mb3JFYWNoKFxuICAgICAgICAoeyBub2RlLCBvZmZzZXQ6IG9mZnNldFdpdGhpbk5vZGUsIGxlbmd0aDogbGVuZ3RoSW5Ob2RlIH0pID0+IHtcbiAgICAgICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChvZmZzZXRXaXRoaW5Ob2RlKTtcbiAgICAgICAgICBobE5vZGUuc3BsaXRUZXh0KGxlbmd0aEluTm9kZSk7XG5cbiAgICAgICAgICBpZiAoaGxOb2RlLm5leHRTaWJsaW5nICYmICFobE5vZGUubmV4dFNpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaGxOb2RlLnByZXZpb3VzU2libGluZyAmJiAhaGxOb2RlLnByZXZpb3VzU2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoaWdobGlnaHQgPSBkb20oaGxOb2RlKS53cmFwKGRvbSgpLmZyb21IVE1MKGhsLndyYXBwZXIpWzBdKTtcbiAgICAgICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhpZ2hsaWdodDogXCIsIGhsRGVzY3JpcHRvcik7XG4gICAgICAgIGRlc2VyaWFsaXNlKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogbm9ybWFsaXNlIGF0IHRoZSBlbmQgb2YgZGVzZXJpYWxpc2F0aW9uLlxuICAgIC8vIHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGVwZW5kZW5jaWFIaWdobGlnaHRlcjtcbiIsImltcG9ydCB7XG4gIHJlZmluZVJhbmdlQm91bmRhcmllcyxcbiAgcmV0cmlldmVIaWdobGlnaHRzLFxuICBpc0VsZW1lbnRIaWdobGlnaHQsXG4gIHNvcnRCeURlcHRoLFxuICBoYXZlU2FtZUNvbG9yLFxuICBjcmVhdGVXcmFwcGVyXG59IGZyb20gXCIuLi91dGlscy9oaWdobGlnaHRzXCI7XG5pbXBvcnQgZG9tLCB7IE5PREVfVFlQRSB9IGZyb20gXCIuLi91dGlscy9kb21cIjtcbmltcG9ydCB7IElHTk9SRV9UQUdTLCBEQVRBX0FUVFIsIFRJTUVTVEFNUF9BVFRSIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgdW5pcXVlIH0gZnJvbSBcIi4uL3V0aWxzL2FycmF5c1wiO1xuXG4vKipcbiAqIFByaW1pdGl2b0hpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHNcbiAqIGZvciBzaW1wbGUgdXNlIGNhc2VzLlxuICovXG5jbGFzcyBQcmltaXRpdm9IaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgUHJpbWl0aXZvSGlnaGxpZ2h0ZXIgaW5zdGFuY2UgZm9yIGZ1bmN0aW9uYWxpdHkgc3BlY2lmaWMgdG8gdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gRE9NIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZWQgd2lsbCBiZSBhcHBsaWVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIC0gYWRkaXRpb25hbCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb2xvciAtIGhpZ2hsaWdodCBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGhpZ2hsaWdodCwgJ2hpZ2hsaWdodGVkJyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb250ZXh0Q2xhc3MgLSBjbGFzcyBhZGRlZCB0byBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQsXG4gICAqICAnaGlnaGxpZ2h0ZXItY29udGV4dCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIHJlbW92ZWQuIEhpZ2hsaWdodCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgaWYgaGlnaGxpZ2h0IHNob3VsZCBiZSByZW1vdmVkLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgcmVtb3ZhbC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIFJhbmdlIG9iamVjdCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gY29udGludWUgcHJvY2Vzc2luZywgb3IgZmFsc2UgLSB0byBwcmV2ZW50IGhpZ2hsaWdodGluZy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGFmdGVyIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBBcnJheSBvZiBjcmVhdGVkXG4gICAqIHdyYXBwZXJzIGlzIHBhc3NlZCBhcyBwYXJhbS5cbiAgICogQGNsYXNzIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyByYW5nZS5cbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyODogcmFuZ2UgYmVmb3JlIHJlZmluZWQhIFwiLCByYW5nZSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gcmVmaW5lUmFuZ2VCb3VuZGFyaWVzKHJhbmdlKSxcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gcmVzdWx0LnN0YXJ0Q29udGFpbmVyLFxuICAgICAgZW5kQ29udGFpbmVyID0gcmVzdWx0LmVuZENvbnRhaW5lcixcbiAgICAgIGdvRGVlcGVyID0gcmVzdWx0LmdvRGVlcGVyLFxuICAgICAgZG9uZSA9IGZhbHNlLFxuICAgICAgbm9kZSA9IHN0YXJ0Q29udGFpbmVyLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgaGlnaGxpZ2h0LFxuICAgICAgd3JhcHBlckNsb25lLFxuICAgICAgbm9kZVBhcmVudDtcblxuICAgIGRvIHtcbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBJR05PUkVfVEFHUy5pbmRleE9mKG5vZGUucGFyZW50Tm9kZS50YWdOYW1lKSA9PT0gLTEgJiZcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuICAgICAgICAgIG5vZGVQYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAvLyBoaWdobGlnaHQgaWYgYSBub2RlIGlzIGluc2lkZSB0aGUgZWxcbiAgICAgICAgICBpZiAoZG9tKHRoaXMuZWwpLmNvbnRhaW5zKG5vZGVQYXJlbnQpIHx8IG5vZGVQYXJlbnQgPT09IHRoaXMuZWwpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodCA9IGRvbShub2RlKS53cmFwKHdyYXBwZXJDbG9uZSk7XG4gICAgICAgICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBub2RlID09PSBlbmRDb250YWluZXIgJiZcbiAgICAgICAgIShlbmRDb250YWluZXIuaGFzQ2hpbGROb2RlcygpICYmIGdvRGVlcGVyKVxuICAgICAgKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS50YWdOYW1lKSA+IC0xKSB7XG4gICAgICAgIGlmIChlbmRDb250YWluZXIucGFyZW50Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZ29EZWVwZXIgJiYgbm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgZ29EZWVwZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICghZG9uZSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZXMgdGhhdCBoaWdobGlnaHRpbmcgaXMgZG9uZSB3aXRoIHVzZSBvZiB0aGUgc21hbGxlc3QgcG9zc2libGUgbnVtYmVyIG9mXG4gICAqIHdyYXBwaW5nIEhUTUwgZWxlbWVudHMuXG4gICAqIEZsYXR0ZW5zIGhpZ2hsaWdodHMgc3RydWN0dXJlIGFuZCBtZXJnZXMgc2libGluZyBoaWdobGlnaHRzLiBOb3JtYWxpemVzIHRleHQgbm9kZXMgd2l0aGluIGhpZ2hsaWdodHMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIHZhciBub3JtYWxpemVkSGlnaGxpZ2h0cztcblxuICAgIHRoaXMuZmxhdHRlbk5lc3RlZEhpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG4gICAgdGhpcy5tZXJnZVNpYmxpbmdIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBmbGF0dGVuLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGZsYXR0ZW5OZXN0ZWRIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgYWdhaW4sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZmxhdHRlbk9uY2UoKSB7XG4gICAgICBsZXQgYWdhaW4gPSBmYWxzZTtcblxuICAgICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsLCBpKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBobC5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgIHBhcmVudFByZXYgPSBwYXJlbnQucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgIHBhcmVudE5leHQgPSBwYXJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKHNlbGYuaXNIaWdobGlnaHQocGFyZW50LCBEQVRBX0FUVFIpKSB7XG4gICAgICAgICAgaWYgKCFoYXZlU2FtZUNvbG9yKHBhcmVudCwgaGwpKSB7XG4gICAgICAgICAgICBpZiAoIWhsLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICAgIGlmICghcGFyZW50TmV4dCkge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnROZXh0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnROZXh0IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFobC5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnRQcmV2KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudFByZXYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50UHJldiB8fCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PSAzICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBsZXQgc3BhbmxlZnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyZW50LnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHBhcmVudC5hdHRyaWJ1dGVzW1RJTUVTVEFNUF9BVFRSXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgbGV0IHNwYW5yaWdodCA9IHNwYW5sZWZ0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgICBkb20oaGwucHJldmlvdXNTaWJsaW5nKS53cmFwKHNwYW5sZWZ0KTtcbiAgICAgICAgICAgICAgZG9tKGhsLm5leHRTaWJsaW5nKS53cmFwKHNwYW5yaWdodCk7XG5cbiAgICAgICAgICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGFyZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20obm9kZSkuaW5zZXJ0QmVmb3JlKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcGFyZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICBkb20ocGFyZW50KS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChobC5maXJzdENoaWxkLCBobCk7XG4gICAgICAgICAgICBoaWdobGlnaHRzW2ldID0gcGFyZW50O1xuICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhZ2FpbjtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICBhZ2FpbiA9IGZsYXR0ZW5PbmNlKCk7XG4gICAgfSB3aGlsZSAoYWdhaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMgYW5kIG5vcm1hbGl6ZXMgZGVzY2VuZGFudCB0ZXh0IG5vZGVzLlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjaGFuZ2VzIGlucHV0IGhpZ2hsaWdodHMgLSB0aGVpciBvcmRlciBhbmQgbnVtYmVyIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGNoYW5nZS5cbiAgICogQHBhcmFtIGhpZ2hsaWdodHNcbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBtZXJnZVNpYmxpbmdIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBzaG91bGRNZXJnZShjdXJyZW50LCBub2RlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlICYmXG4gICAgICAgIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgaGF2ZVNhbWVDb2xvcihjdXJyZW50LCBub2RlKSAmJlxuICAgICAgICBzZWxmLmlzSGlnaGxpZ2h0KG5vZGUsIERBVEFfQVRUUilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgdmFyIHByZXYgPSBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICBuZXh0ID0gaGlnaGxpZ2h0Lm5leHRTaWJsaW5nO1xuXG4gICAgICBpZiAoc2hvdWxkTWVyZ2UoaGlnaGxpZ2h0LCBwcmV2KSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS5wcmVwZW5kKHByZXYuY2hpbGROb2Rlcyk7XG4gICAgICAgIGRvbShwcmV2KS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaG91bGRNZXJnZShoaWdobGlnaHQsIG5leHQpKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLmFwcGVuZChuZXh0LmNoaWxkTm9kZXMpO1xuICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgY3VycmVudCByYW5nZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBrZWVwUmFuZ2UgLSBEb24ndCByZW1vdmUgcmFuZ2UgYWZ0ZXIgaGlnaGxpZ2h0aW5nLiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb20odGhpcy5lbCkuZ2V0UmFuZ2UoKSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICBjcmVhdGVkSGlnaGxpZ2h0cyxcbiAgICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLFxuICAgICAgdGltZXN0YW1wO1xuXG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0KHJhbmdlKSA9PT0gdHJ1ZSkge1xuICAgICAgdGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG4gICAgICB3cmFwcGVyID0gY3JlYXRlV3JhcHBlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG5cbiAgICAgIGNyZWF0ZWRIaWdobGlnaHRzID0gdGhpcy5oaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcik7XG4gICAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhjcmVhdGVkSGlnaGxpZ2h0cyk7XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJBTFNERWJ1ZzI0OiBQcmltaXRpdm86IHRoaXMub3B0aW9uczogXCIsXG4gICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgIFwiXFxuXFxuXFxuXFxuXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KHJhbmdlLCBub3JtYWxpemVkSGlnaGxpZ2h0cywgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBpZiAoIWtlZXBSYW5nZSkge1xuICAgICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGhpZ2hsaWdodHMgZnJvbSBlbGVtZW50LiBJZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgaXQgaXMgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKiBJZiBubyBlbGVtZW50IGlzIGdpdmVuLCBhbGwgaGlnaGxpZ2h0cyBhbGwgcmVtb3ZlZC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2VsZW1lbnRdIC0gZWxlbWVudCB0byByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tXG4gICAqIEBtZW1iZXJvZiBQcmltaXRpdm9IaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGVsZW1lbnQgfHwgdGhpcy5lbCxcbiAgICAgIGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoeyBjb250YWluZXI6IGNvbnRhaW5lciB9KSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gbWVyZ2VTaWJsaW5nVGV4dE5vZGVzKHRleHROb2RlKSB7XG4gICAgICB2YXIgcHJldiA9IHRleHROb2RlLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgbmV4dCA9IHRleHROb2RlLm5leHRTaWJsaW5nO1xuXG4gICAgICBpZiAocHJldiAmJiBwcmV2Lm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IHByZXYubm9kZVZhbHVlICsgdGV4dE5vZGUubm9kZVZhbHVlO1xuICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCAmJiBuZXh0Lm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHRleHROb2RlLm5vZGVWYWx1ZSA9IHRleHROb2RlLm5vZGVWYWx1ZSArIG5leHQubm9kZVZhbHVlO1xuICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlSGlnaGxpZ2h0KGhpZ2hsaWdodCkge1xuICAgICAgdmFyIHRleHROb2RlcyA9IGRvbShoaWdobGlnaHQpLnVud3JhcCgpO1xuXG4gICAgICB0ZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIG1lcmdlU2libGluZ1RleHROb2Rlcyhub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIHRydWUpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsKSB7XG4gICAgICBpZiAoc2VsZi5vcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0KGhsKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZW1vdmVIaWdobGlnaHQoaGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0cyBmcm9tIGdpdmVuIGNvbnRhaW5lci5cbiAgICogQHBhcmFtIHBhcmFtc1xuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbcGFyYW1zLmNvbnRhaW5lcl0gLSByZXR1cm4gaGlnaGxpZ2h0cyBmcm9tIHRoaXMgZWxlbWVudC4gRGVmYXVsdDogdGhlIGVsZW1lbnQgdGhlXG4gICAqIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5hbmRTZWxmXSAtIGlmIHNldCB0byB0cnVlIGFuZCBjb250YWluZXIgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBhZGQgY29udGFpbmVyIHRvXG4gICAqIHJldHVybmVkIHJlc3VsdHMuIERlZmF1bHQ6IHRydWUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5ncm91cGVkXSAtIGlmIHNldCB0byB0cnVlLCBoaWdobGlnaHRzIGFyZSBncm91cGVkIGluIGxvZ2ljYWwgZ3JvdXBzIG9mIGhpZ2hsaWdodHMgYWRkZWRcbiAgICogaW4gdGhlIHNhbWUgbW9tZW50LiBFYWNoIGdyb3VwIGlzIGFuIG9iamVjdCB3aGljaCBoYXMgZ290IGFycmF5IG9mIGhpZ2hsaWdodHMsICd0b1N0cmluZycgbWV0aG9kIGFuZCAndGltZXN0YW1wJ1xuICAgKiBwcm9wZXJ0eS4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgY29uc3QgbWVyZ2VkUGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgZGF0YUF0dHI6IERBVEFfQVRUUixcbiAgICAgIHRpbWVzdGFtcEF0dHI6IFRJTUVTVEFNUF9BVFRSLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcbiAgICByZXR1cm4gcmV0cmlldmVIaWdobGlnaHRzKG1lcmdlZFBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgUHJpbWl0aXZvSGlnaGxpZ2h0ZXJcbiAgICovXG4gIGlzSGlnaGxpZ2h0KGVsLCBkYXRhQXR0cikge1xuICAgIHJldHVybiBpc0VsZW1lbnRIaWdobGlnaHQoZWwsIGRhdGFBdHRyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKCkge1xuICAgIGxldCBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKCksXG4gICAgICByZWZFbCA9IHRoaXMuZWwsXG4gICAgICBobERlc2NyaXB0b3JzID0gW107XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50UGF0aChlbCwgcmVmRWxlbWVudCkge1xuICAgICAgbGV0IHBhdGggPSBbXSxcbiAgICAgICAgY2hpbGROb2RlcztcblxuICAgICAgZG8ge1xuICAgICAgICBjaGlsZE5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWwucGFyZW50Tm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgcGF0aC51bnNoaWZ0KGNoaWxkTm9kZXMuaW5kZXhPZihlbCkpO1xuICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICB9IHdoaWxlIChlbCAhPT0gcmVmRWxlbWVudCB8fCAhZWwpO1xuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCBmYWxzZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMCwgLy8gSGwgb2Zmc2V0IGZyb20gcHJldmlvdXMgc2libGluZyB3aXRoaW4gcGFyZW50IG5vZGUuXG4gICAgICAgIGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIGhsUGF0aCA9IGdldEVsZW1lbnRQYXRoKGhpZ2hsaWdodCwgcmVmRWwpLFxuICAgICAgICB3cmFwcGVyID0gaGlnaGxpZ2h0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgd3JhcHBlciA9IHdyYXBwZXIub3V0ZXJIVE1MO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIG9mZnNldCA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBobERlc2NyaXB0b3JzLnB1c2goW1xuICAgICAgICB3cmFwcGVyLFxuICAgICAgICBoaWdobGlnaHQudGV4dENvbnRlbnQsXG4gICAgICAgIGhsUGF0aC5qb2luKFwiOlwiKSxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBsZW5ndGhcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhsRGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyBoaWdobGlnaHRzLlxuICAgKiBAdGhyb3dzIGV4Y2VwdGlvbiB3aGVuIGNhbid0IHBhcnNlIEpTT04gb3IgSlNPTiBoYXMgaW52YWxpZCBzdHJ1Y3R1cmUuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uIC0gSlNPTiBvYmplY3Qgd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb24uXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBkZXNlcmlhbGl6ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFByaW1pdGl2b0hpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIGxldCBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbihobERlc2NyaXB0b3IpIHtcbiAgICAgIGxldCBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIHBhdGg6IGhsRGVzY3JpcHRvclsyXS5zcGxpdChcIjpcIiksXG4gICAgICAgICAgb2Zmc2V0OiBobERlc2NyaXB0b3JbM10sXG4gICAgICAgICAgbGVuZ3RoOiBobERlc2NyaXB0b3JbNF1cbiAgICAgICAgfSxcbiAgICAgICAgZWxJbmRleCA9IGhsLnBhdGgucG9wKCksXG4gICAgICAgIG5vZGUgPSBzZWxmLmVsLFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodCxcbiAgICAgICAgaWR4O1xuXG4gICAgICB3aGlsZSAoKGlkeCA9IGhsLnBhdGguc2hpZnQoKSkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tpZHhdO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4IC0gMV0gJiZcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXggLSAxXS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIGVsSW5kZXggLT0gMTtcbiAgICAgIH1cblxuICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4XTtcbiAgICAgIGhsTm9kZSA9IG5vZGUuc3BsaXRUZXh0KGhsLm9mZnNldCk7XG4gICAgICBobE5vZGUuc3BsaXRUZXh0KGhsLmxlbmd0aCk7XG5cbiAgICAgIGlmIChobE5vZGUubmV4dFNpYmxpbmcgJiYgIWhsTm9kZS5uZXh0U2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5uZXh0U2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChobE5vZGUucHJldmlvdXNTaWJsaW5nICYmICFobE5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLnByZXZpb3VzU2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGhpZ2hsaWdodCA9IGRvbShobE5vZGUpLndyYXAoZG9tKCkuZnJvbUhUTUwoaGwud3JhcHBlcilbMF0pO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfVxuXG4gICAgaGxEZXNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGhsRGVzY3JpcHRvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVzZXJpYWxpemF0aW9uRm4oaGxEZXNjcmlwdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZGVzZXJpYWxpemUgaGlnaGxpZ2h0IGRlc2NyaXB0b3IuIENhdXNlOiBcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcmltaXRpdm9IaWdobGlnaHRlcjtcbiIsIi8qIGdsb2JhbCBqUXVlcnkgVGV4dEhpZ2hsaWdodGVyICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIChmdW5jdGlvbigkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zdCBQTFVHSU5fTkFNRSA9IFwidGV4dEhpZ2hsaWdodGVyXCI7XG5cbiAgICBmdW5jdGlvbiB3cmFwKGZuLCB3cmFwcGVyKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHdyYXBwZXIuY2FsbCh0aGlzLCBmbik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBqUXVlcnkgcGx1Z2luIG5hbWVzcGFjZS5cbiAgICAgKiBAZXh0ZXJuYWwgXCJqUXVlcnkuZm5cIlxuICAgICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kb2NzLmpxdWVyeS5jb20vUGx1Z2lucy9BdXRob3JpbmcgVGhlIGpRdWVyeSBQbHVnaW4gR3VpZGV9XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBhbmQgYXBwbGllcyBpdCB0byB0aGUgZ2l2ZW4galF1ZXJ5IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBTYW1lIGFzIHtAbGluayBUZXh0SGlnaGxpZ2h0ZXJ9IG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge2pRdWVyeX1cbiAgICAgKiBAZXhhbXBsZSAkKCcjc2FuZGJveCcpLnRleHRIaWdobGlnaHRlcih7IGNvbG9yOiAncmVkJyB9KTtcbiAgICAgKiBAZnVuY3Rpb24gZXh0ZXJuYWw6XCJqUXVlcnkuZm5cIi50ZXh0SGlnaGxpZ2h0ZXJcbiAgICAgKi9cbiAgICAkLmZuLnRleHRIaWdobGlnaHRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbCA9IHRoaXMsXG4gICAgICAgICAgaGw7XG5cbiAgICAgICAgaWYgKCEkLmRhdGEoZWwsIFBMVUdJTl9OQU1FKSkge1xuICAgICAgICAgIGhsID0gbmV3IFRleHRIaWdobGlnaHRlcihlbCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICBobC5kZXN0cm95ID0gd3JhcChobC5kZXN0cm95LCBmdW5jdGlvbihkZXN0cm95KSB7XG4gICAgICAgICAgICBkZXN0cm95LmNhbGwoaGwpO1xuICAgICAgICAgICAgJChlbCkucmVtb3ZlRGF0YShQTFVHSU5fTkFNRSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkLmRhdGEoZWwsIFBMVUdJTl9OQU1FLCBobCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmZuLmdldEhpZ2hsaWdodGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhKFBMVUdJTl9OQU1FKTtcbiAgICB9O1xuICB9KShqUXVlcnkpO1xufVxuIiwiaW1wb3J0IGRvbSBmcm9tIFwiLi91dGlscy9kb21cIjtcbmltcG9ydCB7IGJpbmRFdmVudHMsIHVuYmluZEV2ZW50cyB9IGZyb20gXCIuL3V0aWxzL2V2ZW50c1wiO1xuaW1wb3J0IFByaW1pdGl2byBmcm9tIFwiLi9oaWdobGlnaHRlcnMvcHJpbWl0aXZvXCI7XG5pbXBvcnQgSW5kZXBlbmRlbmNpYSBmcm9tIFwiLi9oaWdobGlnaHRlcnMvaW5kZXBlbmRlbmNpYVwiO1xuaW1wb3J0IHsgVElNRVNUQU1QX0FUVFIsIERBVEFfQVRUUiB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgY3JlYXRlV3JhcHBlciB9IGZyb20gXCIuL3V0aWxzL2hpZ2hsaWdodHNcIjtcblxuY29uc3QgaGlnaGxpZ2h0ZXJzID0ge1xuICBwcmltaXRpdm86IFByaW1pdGl2byxcbiAgXCJ2MS0yMDE0XCI6IFByaW1pdGl2byxcbiAgaW5kZXBlbmRlbmNpYTogSW5kZXBlbmRlbmNpYSxcbiAgXCJ2Mi0yMDE5XCI6IEluZGVwZW5kZW5jaWFcbn07XG5cbi8qKlxuICogVGV4dEhpZ2hsaWdodGVyIHRoYXQgcHJvdmlkZXMgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byBkb20gZWxlbWVudHMuXG4gKi9cbmNsYXNzIFRleHRIaWdobGlnaHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIHdyYXBwZXIgZm9yIGhpZ2hsaWdodHMuXG4gICAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAgICogaW4gY29uc3RydWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gdGhlIHNhbWUgb2JqZWN0IGFzIGluIFRleHRIaWdobGlnaHRlciBjb25zdHJ1Y3Rvci5cbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZVdyYXBwZXIob3B0aW9ucykge1xuICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGFuZCBiaW5kcyB0byBnaXZlbiBET00gZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLnZlcnNpb24gLSBUaGUgdmVyc2lvbiBvZiB0aGUgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eSB0byB1c2UuXG4gICAqIFRoZXJlIGFyZSB0d28gb3B0aW9uczpcbiAgICogICBwcmltaXRpdm8gKHYxLTIwMTQpIGlzIGZvciB0aGUgaW5pdGlhbCBpbXBsZW1lbnRhdGlvbiB1c2luZyBpbnRlcmRlcGVuZGVudCBoaWdobGlnaHQgbG9jYXRvcnMuXG4gICAqICAgKExvdHMgb2YgaXNzdWVzIGZvciByZXF1aXJlbWVudHMgYmV5b25kIHNpbXBsZSBhbGwgb3Igbm90aGluZyBoaWdobGlnaHRzKVxuICAgKlxuICAgKiAgIGluZGVwZW5kZW5jaWEgKHYyLTIwMTkpIGlzIGZvciBhbiBpbXByb3ZlZCBpbXBsZW1lbnRhdGlvbiBmb2N1c2luZyBvbiBtYWtpbmcgaGlnaGxpZ2h0cyBpbmRlcGVuZGVudFxuICAgKiAgIGZyb20gZWFjaG90aGVyIGFuZCBvdGhlciBlbGVtZW50IG5vZGVzIHdpdGhpbiB0aGUgY29udGV4dCBET00gb2JqZWN0LiB2MiB1c2VzIGRhdGEgYXR0cmlidXRlc1xuICAgKiAgIGFzIHRoZSBzb3VyY2Ugb2YgdHJ1dGggYWJvdXQgdGhlIHRleHQgcmFuZ2Ugc2VsZWN0ZWQgdG8gY3JlYXRlIHRoZSBvcmlnaW5hbCBoaWdobGlnaHQuXG4gICAqICAgVGhpcyBhbGxvd3MgdXMgZnJlZWRvbSB0byBtYW5pcHVsYXRlIHRoZSBET00gYXQgd2lsbCBhbmQgaGFuZGxlIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMgYSBsb3QgYmV0dGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb2xvciAtIGhpZ2hsaWdodCBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaGlnaGxpZ2h0ZWRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGhpZ2hsaWdodCwgJ2hpZ2hsaWdodGVkJyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jb250ZXh0Q2xhc3MgLSBjbGFzcyBhZGRlZCB0byBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQsXG4gICAqICAnaGlnaGxpZ2h0ZXItY29udGV4dCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIHJlbW92ZWQuIEhpZ2hsaWdodCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgaWYgaGlnaGxpZ2h0IHNob3VsZCBiZSByZW1vdmVkLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgcmVtb3ZhbC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkJlZm9yZUhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBiZWZvcmUgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIFJhbmdlIG9iamVjdCBpc1xuICAgKiAgcGFzc2VkIGFzIHBhcmFtLiBGdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gY29udGludWUgcHJvY2Vzc2luZywgb3IgZmFsc2UgLSB0byBwcmV2ZW50IGhpZ2hsaWdodGluZy5cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGFmdGVyIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBBcnJheSBvZiBjcmVhdGVkXG4gICAqIHdyYXBwZXJzIGlzIHBhc3NlZCBhcyBwYXJhbS5cbiAgICogQGNsYXNzIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBhbmNob3IgZWxlbWVudFwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBjb2xvcjogXCIjZmZmZjdiXCIsXG4gICAgICBoaWdobGlnaHRlZENsYXNzOiBcImhpZ2hsaWdodGVkXCIsXG4gICAgICBjb250ZXh0Q2xhc3M6IFwiaGlnaGxpZ2h0ZXItY29udGV4dFwiLFxuICAgICAgdmVyc2lvbjogXCJpbmRlcGVuZGVuY2lhXCIsXG4gICAgICBvblJlbW92ZUhpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIG9uQmVmb3JlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25BZnRlckhpZ2hsaWdodDogZnVuY3Rpb24oKSB7fSxcbiAgICAgIC4uLm9wdGlvbnNcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBcIlxcblxcblxcblxcbkFMU0RFYnVnMjQ6IFRleHRIaWdobGlnaHRlcjogb3B0aW9ucyBjb25zdHJ1Y3RvciBwYXJhbTogXCIsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhcIkFMU0RFYnVnMjQ6IFRleHRIaWdobGlnaHRlcjogdGhpcy5vcHRpb25zOiBcIiwgdGhpcy5vcHRpb25zKTtcblxuICAgIGlmICghaGlnaGxpZ2h0ZXJzW3RoaXMub3B0aW9ucy52ZXJzaW9uXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgdmVyc2lvbiBvZiB0aGUgdGV4dCBoaWdobGlnaHRpbmcgZnVuY3Rpb25hbGl0eVwiXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSBuZXcgaGlnaGxpZ2h0ZXJzW3RoaXMub3B0aW9ucy52ZXJzaW9uXShcbiAgICAgIHRoaXMuZWwsXG4gICAgICB0aGlzLm9wdGlvbnNcbiAgICApO1xuXG4gICAgZG9tKHRoaXMuZWwpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICAgIGJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWFuZW50bHkgZGlzYWJsZXMgaGlnaGxpZ2h0aW5nLlxuICAgKiBVbmJpbmRzIGV2ZW50cyBhbmQgcmVtb3ZlIGNvbnRleHQgZWxlbWVudCBjbGFzcy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB1bmJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICB9XG5cbiAgaGlnaGxpZ2h0SGFuZGxlcigpIHtcbiAgICB0aGlzLmRvSGlnaGxpZ2h0KCk7XG4gIH1cblxuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICB0aGlzLmhpZ2hsaWdodGVyLmRvSGlnaGxpZ2h0KGtlZXBSYW5nZSk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyByYW5nZS5cbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGhpZ2hsaWdodFJhbmdlKHJhbmdlLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlIGF0IGxlYXN0IHRleHQgbm9kZXMgYXJlIG5vcm1hbGl6ZWQsIGNhcnJpZXMgb3V0IHNvbWUgZmxhdHRlbmluZyBhbmQgbmVzdGluZ1xuICAgKiB3aGVyZSBuZWNlc3NhcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5ub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaGlnaGxpZ2h0aW5nIGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgLSB2YWxpZCBDU1MgY29sb3IuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5vcHRpb25zLmNvbG9yID0gY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRpbmcgY29sb3IuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBoaWdobGlnaHRzIGZyb20gZWxlbWVudC4gSWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGl0IGlzIHJlbW92ZWQgYXMgd2VsbC5cbiAgICogSWYgbm8gZWxlbWVudCBpcyBnaXZlbiwgYWxsIGhpZ2hsaWdodHMgYWxsIHJlbW92ZWQuXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtlbGVtZW50XSAtIGVsZW1lbnQgdG8gcmVtb3ZlIGhpZ2hsaWdodHMgZnJvbVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICByZW1vdmVIaWdobGlnaHRzKGVsZW1lbnQpIHtcbiAgICB0aGlzLmhpZ2hsaWdodGVyLnJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0LlxuICAgKiBBbGwgaGlnaGxpZ2h0cyBoYXZlICdkYXRhLWhpZ2hsaWdodGVkJyBhdHRyaWJ1dGUuXG4gICAqIEBwYXJhbSBlbCAtIGVsZW1lbnQgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBpc0hpZ2hsaWdodChlbCkge1xuICAgIHJldHVybiB0aGlzLmhpZ2hsaWdodGVyLmlzSGlnaGxpZ2h0KGVsLCBEQVRBX0FUVFIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIHRoZSBpZCBpcyBub3QgdXNlZCBpbiB0aGUgaW5pdGlhbCB2ZXJzaW9uIG9mIHRoZSBoaWdobGlnaHRlci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gVGhlIHVuaXF1ZSBpZGVudGlmaWVyIGdyb3VwaW5nIGEgc2V0IG9mIGhpZ2hsaWdodCBlbGVtZW50cyB0b2dldGhlci5cbiAgICogQHJldHVybnMge3N0cmluZ30gLSBzdHJpbmdpZmllZCBKU09OIHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHNlcmlhbGl6ZUhpZ2hsaWdodHMoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5oaWdobGlnaHRlci5zZXJpYWxpemVIaWdobGlnaHRzKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlnaGxpZ2h0ZXIuZGVzZXJpYWxpemVIaWdobGlnaHRzKGpzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBoaWdobGlnaHRzIGdpdmVuIHRleHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGV4dCB0byBzZWFyY2ggZm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nhc2VTZW5zaXRpdmVdIC0gaWYgc2V0IHRvIHRydWUsIHBlcmZvcm1zIGNhc2Ugc2Vuc2l0aXZlIHNlYXJjaCAoZGVmYXVsdDogdHJ1ZSlcbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZmluZCh0ZXh0LCBjYXNlU2Vuc2l0aXZlKSB7XG4gICAgbGV0IHduZCA9IGRvbSh0aGlzLmVsKS5nZXRXaW5kb3coKSxcbiAgICAgIHNjcm9sbFggPSB3bmQuc2Nyb2xsWCxcbiAgICAgIHNjcm9sbFkgPSB3bmQuc2Nyb2xsWSxcbiAgICAgIGNhc2VTZW5zID0gdHlwZW9mIGNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2FzZVNlbnNpdGl2ZTtcblxuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcblxuICAgIGlmICh3bmQuZmluZCkge1xuICAgICAgd2hpbGUgKHduZC5maW5kKHRleHQsIGNhc2VTZW5zKSkge1xuICAgICAgICB0aGlzLmRvSGlnaGxpZ2h0KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBsZXQgdGV4dFJhbmdlID0gd25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQodGhpcy5lbCk7XG4gICAgICB3aGlsZSAodGV4dFJhbmdlLmZpbmRUZXh0KHRleHQsIDEsIGNhc2VTZW5zID8gNCA6IDApKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZG9tKHRoaXMuZWwpLmNvbnRhaW5zKHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkpICYmXG4gICAgICAgICAgdGV4dFJhbmdlLnBhcmVudEVsZW1lbnQoKSAhPT0gdGhpcy5lbFxuICAgICAgICApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgd25kLnNjcm9sbFRvKHNjcm9sbFgsIHNjcm9sbFkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRIaWdobGlnaHRlcjtcbiIsIi8qKlxuICogUmV0dXJucyBhcnJheSB3aXRob3V0IGR1cGxpY2F0ZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpZHgsIHNlbGYpIHtcbiAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaWR4O1xuICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBOT0RFX1RZUEUgPSB7IEVMRU1FTlRfTk9ERTogMSwgVEVYVF9OT0RFOiAzIH07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFrZSBET00gbWFuaXB1bGF0aW9uIGVhc2llci5cbiAqIEBwYXJhbSB7Tm9kZXxIVE1MRWxlbWVudH0gW2VsXSAtIGJhc2UgRE9NIGVsZW1lbnQgdG8gbWFuaXB1bGF0ZVxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuY29uc3QgZG9tID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIC8qKiBAbGVuZHMgZG9tICoqLyB7XG4gICAgLyoqXG4gICAgICogQWRkcyBjbGFzcyB0byBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxiKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXGJ8JClcIiwgXCJnaVwiKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9QcmVwZW5kXG4gICAgICovXG4gICAgcHJlcGVuZDogZnVuY3Rpb24obm9kZXNUb1ByZXBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9QcmVwZW5kKSxcbiAgICAgICAgaSA9IG5vZGVzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbC5pbnNlcnRCZWZvcmUobm9kZXNbaV0sIGVsLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIGNoaWxkIG5vZGVzIHRvIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge05vZGVbXX0gbm9kZXNUb0FwcGVuZFxuICAgICAqL1xuICAgIGFwcGVuZDogZnVuY3Rpb24obm9kZXNUb0FwcGVuZCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXNUb0FwcGVuZCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGFmdGVyIHJlZkVsLlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcmVmRWwgLSBub2RlIGFmdGVyIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbC5uZXh0U2libGluZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGJlZm9yZSByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBiZWZvcmUgd2hpY2ggYmFzZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gLSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICovXG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYmFzZSBlbGVtZW50IGZyb20gRE9NLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIGVsID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIGJhc2UgZWxlbWVudCBjb250YWlucyBnaXZlbiBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IGNoaWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gZWwgIT09IGNoaWxkICYmIGVsLmNvbnRhaW5zKGNoaWxkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYmFzZSBlbGVtZW50IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKi9cbiAgICB3cmFwOiBmdW5jdGlvbih3cmFwcGVyKSB7XG4gICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgICB9XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVud3JhcHMgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtOb2RlW119IC0gY2hpbGQgbm9kZXMgb2YgdW53cmFwcGVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW53cmFwOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLmNoaWxkTm9kZXMpLFxuICAgICAgICB3cmFwcGVyO1xuXG4gICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgd3JhcHBlciA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZG9tKG5vZGUpLmluc2VydEJlZm9yZShub2RlLnBhcmVudE5vZGUpO1xuICAgICAgfSk7XG4gICAgICBkb20od3JhcHBlcikucmVtb3ZlKCk7XG5cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cy5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwYXJlbnQsXG4gICAgICAgIHBhdGggPSBbXTtcblxuICAgICAgd2hpbGUgKChwYXJlbnQgPSBlbC5wYXJlbnROb2RlKSkge1xuICAgICAgICBwYXRoLnB1c2gocGFyZW50KTtcbiAgICAgICAgZWwgPSBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGJhc2UgZWxlbWVudCBwYXJlbnRzLCBleGNsdWRpbmcgdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHBhcmVudHNXaXRob3V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50cygpLmZpbHRlcihlbGVtID0+IGVsZW0gIT09IGRvY3VtZW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHVwIHRoZSB0cmVlIHRvIHRvIGdldCB0aGUgbmV4dCBjbG9zZXN0IHNpYmxpbmcgb2YgYSBub2RlXG4gICAgICogb3IgYW55IG9mIGl0J3MgcGFyZW50cy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdXNlZCBpbiBzY2VuYXJpb3Mgd2hlcmUgeW91IGhhdmUgYWxyZWFkeSBjb25zdW1lZCB0aGUgcGFyZW50cyB3aGlsZVxuICAgICAqIHRyYXZlcnNpbmcgdGhlIHRyZWUgYnV0IG5vdCB0aGUgc2libGluZ3Mgb2YgcGFyZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gICAgICovXG4gICAgbmV4dENsb3Nlc3RTaWJsaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjdXJyZW50ID0gZWw7XG4gICAgICBsZXQgbmV4dENsb3Nlc3RTaWJsaW5nO1xuXG4gICAgICBkbyB7XG4gICAgICAgIG5leHRDbG9zZXN0U2libGluZyA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudE5vZGU7XG4gICAgICB9IHdoaWxlICghbmV4dENsb3Nlc3RTaWJsaW5nICYmIGN1cnJlbnQucGFyZW50Tm9kZSk7XG5cbiAgICAgIHJldHVybiBuZXh0Q2xvc2VzdFNpYmxpbmc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gYmFzZSBlbGVtZW50LCBpZS4gbWVyZ2VzIHNpYmxpbmcgdGV4dCBub2RlcyBhbmQgYXNzdXJlcyB0aGF0IGV2ZXJ5XG4gICAgICogZWxlbWVudCBub2RlIGhhcyBvbmx5IG9uZSB0ZXh0IG5vZGUuXG4gICAgICogSXQgc2hvdWxkIGRvZXMgdGhlIHNhbWUgYXMgc3RhbmRhcmQgZWxlbWVudC5ub3JtYWxpemUsIGJ1dCBJRSBpbXBsZW1lbnRzIGl0IGluY29ycmVjdGx5LlxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVRleHROb2RlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICBlbC5uZXh0U2libGluZyAmJlxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICAgICkge1xuICAgICAgICAgIGVsLm5vZGVWYWx1ZSArPSBlbC5uZXh0U2libGluZy5ub2RlVmFsdWU7XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbC5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbShlbC5maXJzdENoaWxkKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICAgIH1cbiAgICAgIGRvbShlbC5uZXh0U2libGluZykubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZWxlbWVudCBiYWNrZ3JvdW5kIGNvbG9yLlxuICAgICAqIEByZXR1cm5zIHtDU1NTdHlsZURlY2xhcmF0aW9uLmJhY2tncm91bmRDb2xvcn1cbiAgICAgKi9cbiAgICBjb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGRvbSBlbGVtZW50IGZyb20gZ2l2ZW4gaHRtbCBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICAgKiBAcmV0dXJucyB7Tm9kZUxpc3R9XG4gICAgICovXG4gICAgZnJvbUhUTUw6IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICByZXR1cm4gZGl2LmNoaWxkTm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZmlyc3QgcmFuZ2Ugb2YgdGhlIHdpbmRvdyBvZiBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1JhbmdlfVxuICAgICAqL1xuICAgIGdldFJhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzZWxlY3Rpb24gPSBkb20oZWwpLmdldFNlbGVjdGlvbigpLFxuICAgICAgICByYW5nZTtcblxuICAgICAgaWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xuICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHJhbmdlcyBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKi9cbiAgICByZW1vdmVBbGxSYW5nZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgc2VsZWN0aW9uIG9iamVjdCBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7U2VsZWN0aW9ufVxuICAgICAqL1xuICAgIGdldFNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZG9tKGVsKVxuICAgICAgICAuZ2V0V2luZG93KClcbiAgICAgICAgLmdldFNlbGVjdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdpbmRvdyBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtXaW5kb3d9XG4gICAgICovXG4gICAgZ2V0V2luZG93OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpLmdldERvY3VtZW50KCkuZGVmYXVsdFZpZXc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZG9jdW1lbnQgb2YgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTERvY3VtZW50fVxuICAgICAqL1xuICAgIGdldERvY3VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGlmIG93bmVyRG9jdW1lbnQgaXMgbnVsbCB0aGVuIGVsIGlzIHRoZSBkb2N1bWVudCBpdHNlbGYuXG4gICAgICByZXR1cm4gZWwub3duZXJEb2N1bWVudCB8fCBlbDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgcHJvdmlkZWQgZWxlbWVudCBjb21lcyBhZnRlciB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb3RoZXJFbGVtZW50XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FmdGVyOiBmdW5jdGlvbihvdGhlckVsZW1lbnQsIHJvb3RFbGVtZW50KSB7XG4gICAgICBsZXQgc2libGluZyA9IGVsLm5leHRTaWJsaW5nO1xuICAgICAgbGV0IGlzQWZ0ZXIgPSBmYWxzZTtcbiAgICAgIHdoaWxlIChzaWJsaW5nICYmICFpc0FmdGVyKSB7XG4gICAgICAgIGlmIChzaWJsaW5nID09PSBvdGhlckVsZW1lbnQpIHtcbiAgICAgICAgICBpc0FmdGVyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXNpYmxpbmcubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIHNpYmxpbmcgPSBlbC5wYXJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpc0FmdGVyO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5iaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuIiwiaW1wb3J0IGRvbSwgeyBOT0RFX1RZUEUgfSBmcm9tIFwiLi9kb21cIjtcbmltcG9ydCB7IERBVEFfQVRUUiB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuLyoqXG4gKiBUYWtlcyByYW5nZSBvYmplY3QgYXMgcGFyYW1ldGVyIGFuZCByZWZpbmVzIGl0IGJvdW5kYXJpZXNcbiAqIEBwYXJhbSByYW5nZVxuICogQHJldHVybnMge29iamVjdH0gcmVmaW5lZCBib3VuZGFyaWVzIGFuZCBpbml0aWFsIHN0YXRlIG9mIGhpZ2hsaWdodGluZyBhbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpIHtcbiAgbGV0IHN0YXJ0Q29udGFpbmVyID0gcmFuZ2Uuc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyID0gcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgIGFuY2VzdG9yID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIsXG4gICAgZ29EZWVwZXIgPSB0cnVlO1xuXG4gIGlmIChyYW5nZS5lbmRPZmZzZXQgPT09IDApIHtcbiAgICB3aGlsZSAoXG4gICAgICAhZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgZW5kQ29udGFpbmVyLnBhcmVudE5vZGUgIT09IGFuY2VzdG9yXG4gICAgKSB7XG4gICAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZztcbiAgfSBlbHNlIGlmIChlbmRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGVuZENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2UuZW5kT2Zmc2V0ID4gMCkge1xuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5jaGlsZE5vZGVzLml0ZW0ocmFuZ2UuZW5kT2Zmc2V0IC0gMSk7XG4gIH1cblxuICBpZiAoc3RhcnRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPT09IHN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChyYW5nZS5zdGFydE9mZnNldCA+IDApIHtcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGlmIChlbmRDb250YWluZXIgPT09IHN0YXJ0Q29udGFpbmVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBlbmRDb250YWluZXIgPSBzdGFydENvbnRhaW5lcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPCBzdGFydENvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydENvbnRhaW5lcjogc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyOiBlbmRDb250YWluZXIsXG4gICAgZ29EZWVwZXI6IGdvRGVlcGVyXG4gIH07XG59XG5cbi8qKlxuICogU29ydHMgYXJyYXkgb2YgRE9NIGVsZW1lbnRzIGJ5IGl0cyBkZXB0aCBpbiBET00gdHJlZS5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gYXJyIC0gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVzY2VuZGluZyAtIG9yZGVyIG9mIHNvcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlEZXB0aChhcnIsIGRlc2NlbmRpbmcpIHtcbiAgYXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiAoXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGIgOiBhKS5wYXJlbnRzKCkubGVuZ3RoIC1cbiAgICAgIGRvbShkZXNjZW5kaW5nID8gYSA6IGIpLnBhcmVudHMoKS5sZW5ndGhcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudHMgYSBpIGIgaGF2ZSB0aGUgc2FtZSBjb2xvci5cbiAqIEBwYXJhbSB7Tm9kZX0gYVxuICogQHBhcmFtIHtOb2RlfSBiXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVTYW1lQ29sb3IoYSwgYikge1xuICByZXR1cm4gZG9tKGEpLmNvbG9yKCkgPT09IGRvbShiKS5jb2xvcigpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgd3JhcHBlciBmb3IgaGlnaGxpZ2h0cy5cbiAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAqIGluIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgc2FtZSBvYmplY3QgYXMgaW4gVGV4dEhpZ2hsaWdodGVyIGNvbnN0cnVjdG9yLlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihvcHRpb25zKSB7XG4gIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIHNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgc3Bhbi5jbGFzc05hbWUgPSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3M7XG4gIHJldHVybiBzcGFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRleHROb2RlQXRMb2NhdGlvbihlbGVtZW50LCBsb2NhdGlvbkluQ2hpbGROb2Rlcykge1xuICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgYXMgcGFyYW1ldGVyOiBcIiwgZWxlbWVudCk7XG4gIGxldCB0ZXh0Tm9kZUVsZW1lbnQgPSBlbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICh0ZXh0Tm9kZUVsZW1lbnQgJiYgdGV4dE5vZGVFbGVtZW50Lm5vZGVUeXBlICE9PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgY29uc29sZS5sb2coYHRleHROb2RlRWxlbWVudCBzdGVwICR7aX1gLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICAgIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJzdGFydFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uSW5DaGlsZE5vZGVzID09PSBcImVuZFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgbGFzdEluZGV4ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbbGFzdEluZGV4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHROb2RlRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwidGV4dCBub2RlIGVsZW1lbnQgcmV0dXJuZWQ6IFwiLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICByZXR1cm4gdGV4dE5vZGVFbGVtZW50O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGVyZSB0byBpbmplY3QgYSBoaWdobGlnaHQgYmFzZWQgb24gaXQncyBvZmZzZXQuXG4gKiBBIGhpZ2hsaWdodCBjYW4gc3BhbiBtdWx0aXBsZSBub2Rlcywgc28gaW4gaGVyZSB3ZSBhY2N1bXVsYXRlXG4gKiBhbGwgdGhvc2Ugbm9kZXMgd2l0aCBvZmZzZXQgYW5kIGxlbmd0aCBvZiB0aGUgY29udGVudCBpbiB0aGUgbm9kZVxuICogaW5jbHVkZWQgaW4gdGhlIGhpZ2hsaWdodC5cbiAqXG4gKiBAcGFyYW0geyp9IGhpZ2hsaWdodFxuICogQHBhcmFtIHsqfSBwYXJlbnROb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTm9kZXNBbmRPZmZzZXRzKGhpZ2hsaWdodCwgcGFyZW50Tm9kZSkge1xuICBjb25zdCBub2Rlc0FuZE9mZnNldHMgPSBbXTtcbiAgbGV0IGN1cnJlbnROb2RlID0gcGFyZW50Tm9kZTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSAwO1xuICBjb25zdCBoaWdobGlnaHRFbmRPZmZzZXQgPSBoaWdobGlnaHQub2Zmc2V0ICsgaGlnaGxpZ2h0Lmxlbmd0aDtcblxuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgY3VycmVudE9mZnNldCA8IGhpZ2hsaWdodEVuZE9mZnNldCkge1xuICAgIGNvbnN0IHRleHRMZW5ndGggPSBjdXJyZW50Tm9kZS50ZXh0Q29udGVudC5sZW5ndGg7XG4gICAgY29uc3QgZW5kT2ZDdXJyZW50Tm9kZU9mZnNldCA9IGN1cnJlbnRPZmZzZXQgKyB0ZXh0TGVuZ3RoO1xuXG4gICAgaWYgKGVuZE9mQ3VycmVudE5vZGVPZmZzZXQgPiBoaWdobGlnaHQub2Zmc2V0KSB7XG4gICAgICBjb25zdCBpc1Rlcm1pbmFsTm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwO1xuICAgICAgaWYgKGlzVGVybWluYWxOb2RlKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldFdpdGhpbk5vZGUgPVxuICAgICAgICAgIGhpZ2hsaWdodC5vZmZzZXQgPiBjdXJyZW50T2Zmc2V0XG4gICAgICAgICAgICA/IGhpZ2hsaWdodC5vZmZzZXQgLSBjdXJyZW50T2Zmc2V0XG4gICAgICAgICAgICA6IDA7XG5cbiAgICAgICAgY29uc3QgbGVuZ3RoSW5IaWdobGlnaHQgPVxuICAgICAgICAgIGhpZ2hsaWdodEVuZE9mZnNldCA+IGVuZE9mQ3VycmVudE5vZGVPZmZzZXRcbiAgICAgICAgICAgID8gdGV4dExlbmd0aCAtIG9mZnNldFdpdGhpbk5vZGVcbiAgICAgICAgICAgIDogaGlnaGxpZ2h0RW5kT2Zmc2V0IC0gY3VycmVudE9mZnNldCAtIG9mZnNldFdpdGhpbk5vZGU7XG5cbiAgICAgICAgbm9kZXNBbmRPZmZzZXRzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IGN1cnJlbnROb2RlLFxuICAgICAgICAgIG9mZnNldDogb2Zmc2V0V2l0aGluTm9kZSxcbiAgICAgICAgICBsZW5ndGg6IGxlbmd0aEluSGlnaGxpZ2h0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRPZmZzZXQgPSBlbmRPZkN1cnJlbnROb2RlT2Zmc2V0O1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGRvbShjdXJyZW50Tm9kZSkubmV4dENsb3Nlc3RTaWJsaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRPZmZzZXQgPSBlbmRPZkN1cnJlbnROb2RlT2Zmc2V0O1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZXNBbmRPZmZzZXRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudE9mZnNldChjaGlsZEVsZW1lbnQsIHJvb3RFbGVtZW50KSB7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBsZXQgY2hpbGROb2RlcztcblxuICBsZXQgY3VycmVudEVsZW1lbnQgPSBjaGlsZEVsZW1lbnQ7XG4gIGRvIHtcbiAgICBjaGlsZE5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICBjdXJyZW50RWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXNcbiAgICApO1xuICAgIGNvbnN0IGNoaWxkRWxlbWVudEluZGV4ID0gY2hpbGROb2Rlcy5pbmRleE9mKGN1cnJlbnRFbGVtZW50KTtcbiAgICBjb25zdCBvZmZzZXRJbkN1cnJlbnRQYXJlbnQgPSBnZXRUZXh0T2Zmc2V0QmVmb3JlKFxuICAgICAgY2hpbGROb2RlcyxcbiAgICAgIGNoaWxkRWxlbWVudEluZGV4XG4gICAgKTtcbiAgICBvZmZzZXQgKz0gb2Zmc2V0SW5DdXJyZW50UGFyZW50O1xuICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZTtcbiAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQgIT09IHJvb3RFbGVtZW50IHx8ICFjdXJyZW50RWxlbWVudCk7XG5cbiAgcmV0dXJuIG9mZnNldDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dE9mZnNldEJlZm9yZShjaGlsZE5vZGVzLCBjdXRJbmRleCkge1xuICBsZXQgdGV4dE9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0SW5kZXg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gY2hpbGROb2Rlc1tpXTtcbiAgICAvLyBVc2UgdGV4dENvbnRlbnQgYW5kIG5vdCBpbm5lckhUTUwgdG8gYWNjb3VudCBmb3IgaW52aXNpYmxlIGNoYXJhY3RlcnMgYXMgd2VsbC5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS90ZXh0Q29udGVudFxuICAgIGNvbnN0IHRleHQgPSBjdXJyZW50Tm9kZS50ZXh0Q29udGVudDtcbiAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRleHRPZmZzZXQgKz0gdGV4dC5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiB0ZXh0T2Zmc2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KGVsZW1lbnRzKSB7XG4gIGxldCBjaGlsZEVsZW1lbnQgPSBlbGVtZW50cy5jaGlsZEVsZW1lbnQ7XG4gIGxldCBvdGhlckVsZW1lbnQgPSBlbGVtZW50cy5vdGhlckVsZW1lbnQ7XG4gIGxldCBwYXJlbnRzID0gZG9tKGNoaWxkRWxlbWVudCkucGFyZW50c1dpdGhvdXREb2N1bWVudCgpO1xuICBsZXQgaSA9IDA7XG4gIGxldCBmaXJzdE5vblNoYXJlZFBhcmVudCA9IG51bGw7XG4gIGxldCBhbGxQYXJlbnRzQXJlU2hhcmVkID0gZmFsc2U7XG4gIHdoaWxlICghZmlyc3ROb25TaGFyZWRQYXJlbnQgJiYgIWFsbFBhcmVudHNBcmVTaGFyZWQgJiYgaSA8IHBhcmVudHMubGVuZ3RoKSB7XG4gICAgY29uc3QgY3VycmVudFBhcmVudCA9IHBhcmVudHNbaV07XG5cbiAgICBpZiAoY3VycmVudFBhcmVudC5jb250YWlucyhvdGhlckVsZW1lbnQpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRQYXJlbnQgY29udGFpbnMgb3RoZXIgZWxlbWVudCFcIiwgY3VycmVudFBhcmVudCk7XG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBwYXJlbnRzW2kgLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsbFBhcmVudHNBcmVTaGFyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpKys7XG4gIH1cblxuICByZXR1cm4gZmlyc3ROb25TaGFyZWRQYXJlbnQ7XG59XG5cbmNvbnN0IHNpYmxpbmdSZW1vdmFsRGlyZWN0aW9ucyA9IHtcbiAgc3RhcnQ6IFwicHJldmlvdXNTaWJsaW5nXCIsXG4gIGVuZDogXCJuZXh0U2libGluZ1wiXG59O1xuXG5jb25zdCBzaWJsaW5nVGV4dE5vZGVNZXJnZURpcmVjdGlvbnMgPSB7XG4gIHN0YXJ0OiBcIm5leHRTaWJsaW5nXCIsXG4gIGVuZDogXCJwcmV2aW91c1NpYmxpbmdcIlxufTtcblxuZnVuY3Rpb24gcmVtb3ZlU2libGluZ3NJbkRpcmVjdGlvbihzdGFydE5vZGUsIGRpcmVjdGlvbikge1xuICBsZXQgc2libGluZyA9IHN0YXJ0Tm9kZVtkaXJlY3Rpb25dO1xuICB3aGlsZSAoc2libGluZykge1xuICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNpYmxpbmcpO1xuICAgIHNpYmxpbmcgPSBzaWJsaW5nW2RpcmVjdGlvbl07XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZXMgdGhlIHRleHQgb2YgYWxsIHNpYmxpbmcgdGV4dCBub2RlcyB3aXRoIHRoZSBzdGFydCBub2RlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YXJ0Tm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvblxuICovXG5mdW5jdGlvbiBtZXJnZVNpYmxpbmdUZXh0Tm9kZXNJbkRpcmVjdGlvbihzdGFydE5vZGUsIGRpcmVjdGlvbikge1xuICBsZXQgc2libGluZyA9IHN0YXJ0Tm9kZVtkaXJlY3Rpb25dO1xuICB3aGlsZSAoc2libGluZykge1xuICAgIGlmIChzaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICBzdGFydE5vZGUudGV4dENvbnRlbnQgKz0gc2libGluZy50ZXh0Q29udGVudDtcbiAgICAgIHN0YXJ0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNpYmxpbmcpO1xuICAgICAgc2libGluZyA9IHNpYmxpbmdbZGlyZWN0aW9uXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodChwYXJhbXMpIHtcbiAgbGV0IGVsZW1lbnQgPSBwYXJhbXMuZWxlbWVudDtcbiAgbGV0IGVsZW1lbnRBbmNlc3RvciA9IHBhcmFtcy5lbGVtZW50QW5jZXN0b3I7XG4gIGxldCBvcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XG4gIGxldCBsb2NhdGlvbkluU2VsZWN0aW9uID0gcGFyYW1zLmxvY2F0aW9uSW5TZWxlY3Rpb247XG5cbiAgbGV0IGVsZW1lbnRBbmNlc3RvckNvcHkgPSBlbGVtZW50QW5jZXN0b3IuY2xvbmVOb2RlKHRydWUpO1xuXG4gIC8vIEJlZ2lubmluZyBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIGVuZCBjb250YWluZXIgaW4gc2VsZWN0aW9uXG4gIC8vIGFuZCBlbmQgb2YgY2hpbGROb2RlcyBsaXN0IGZvciBzdGFydCBjb250YWluZXIgaW4gc2VsZWN0aW9uLlxuICBsZXQgbG9jYXRpb25JbkNoaWxkTm9kZXMgPSBsb2NhdGlvbkluU2VsZWN0aW9uID09PSBcInN0YXJ0XCIgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuICBsZXQgZWxlbWVudENvcHkgPSBmaW5kVGV4dE5vZGVBdExvY2F0aW9uKFxuICAgIGVsZW1lbnRBbmNlc3RvckNvcHksXG4gICAgbG9jYXRpb25JbkNoaWxkTm9kZXNcbiAgKTtcbiAgbGV0IGVsZW1lbnRDb3B5UGFyZW50ID0gZWxlbWVudENvcHkucGFyZW50Tm9kZTtcblxuICByZW1vdmVTaWJsaW5nc0luRGlyZWN0aW9uKFxuICAgIGVsZW1lbnRDb3B5LFxuICAgIHNpYmxpbmdSZW1vdmFsRGlyZWN0aW9uc1tsb2NhdGlvbkluU2VsZWN0aW9uXVxuICApO1xuXG4gIG1lcmdlU2libGluZ1RleHROb2Rlc0luRGlyZWN0aW9uKFxuICAgIGVsZW1lbnRDb3B5LFxuICAgIHNpYmxpbmdUZXh0Tm9kZU1lcmdlRGlyZWN0aW9uc1tsb2NhdGlvbkluU2VsZWN0aW9uXVxuICApO1xuXG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHk6IFwiLCBlbGVtZW50Q29weSk7XG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHlQYXJlbnQ6IFwiLCBlbGVtZW50Q29weVBhcmVudCk7XG5cbiAgLy8gQ2xlYW4gb3V0IGFueSBuZXN0ZWQgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICBpZiAoXG4gICAgZWxlbWVudENvcHlQYXJlbnQgIT09IGVsZW1lbnRBbmNlc3RvckNvcHkgJiZcbiAgICBlbGVtZW50Q29weVBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5oaWdobGlnaHRlZENsYXNzKVxuICApIHtcbiAgICBkb20oZWxlbWVudENvcHlQYXJlbnQpLnVud3JhcCgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0ZXh0IG5vZGUgdGhhdCB3ZSBuZWVkIGZvciB0aGUgbmV3IGhpZ2hsaWdodFxuICAvLyBmcm9tIHRoZSBleGlzdGluZyBoaWdobGlnaHQgb3Igb3RoZXIgZWxlbWVudC5cbiAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXG4gIHJldHVybiB7IGVsZW1lbnRBbmNlc3RvckNvcHksIGVsZW1lbnRDb3B5IH07XG59XG5cbmZ1bmN0aW9uIGdhdGhlclNpYmxpbmdzVXBUb0VuZE5vZGUoc3RhcnROb2RlT3JDb250YWluZXIsIGVuZE5vZGUpIHtcbiAgY29uc3QgZ2F0aGVyZWRTaWJsaW5ncyA9IFtdO1xuICBsZXQgZm91bmRFbmROb2RlU2libGluZyA9IGZhbHNlO1xuXG4gIGxldCBjdXJyZW50Tm9kZSA9IHN0YXJ0Tm9kZU9yQ29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB3aGlsZSAoY3VycmVudE5vZGUgJiYgIWZvdW5kRW5kTm9kZVNpYmxpbmcpIHtcbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUgfHwgY3VycmVudE5vZGUuY29udGFpbnMoZW5kTm9kZSkpIHtcbiAgICAgIGZvdW5kRW5kTm9kZVNpYmxpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBnYXRoZXJlZFNpYmxpbmdzLnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBnYXRoZXJlZFNpYmxpbmdzLCBmb3VuZEVuZE5vZGVTaWJsaW5nIH07XG59XG5cbi8qKlxuICogR2V0cyBhbGwgdGhlIG5vZGVzIGluIGJldHdlZW4gdGhlIHByb3ZpZGVkIHN0YXJ0IGFuZCBlbmQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhcnROb2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbmROb2RlXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX0gTm9kZXMgdGhhdCBsaXZlIGluIGJldHdlZW4gdGhlIHR3by5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vZGVzSW5CZXR3ZWVuKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIC8vIEZpcnN0IGF0dGVtcHQgdGhlIGVhc2llc3Qgc29sdXRpb24sIGhvcGluZyBlbmROb2RlIHdpbGwgYmUgYXQgdGhlIHNhbWUgbGV2ZWxcbiAgLy8gYXMgdGhlIHN0YXJ0IG5vZGUgb3IgY29udGFpbmVkIGluIGFuIGVsZW1lbnQgYXQgdGhlIHNhbWUgbGV2ZWwuXG4gIGNvbnN0IHtcbiAgICBmb3VuZEVuZE5vZGVTaWJsaW5nOiBmb3VuZEVuZE5vZGVTaWJsaW5nT25TYW1lTGV2ZWwsXG4gICAgZ2F0aGVyZWRTaWJsaW5nc1xuICB9ID0gZ2F0aGVyU2libGluZ3NVcFRvRW5kTm9kZShzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gIGlmIChmb3VuZEVuZE5vZGVTaWJsaW5nT25TYW1lTGV2ZWwpIHtcbiAgICByZXR1cm4gZ2F0aGVyZWRTaWJsaW5ncztcbiAgfVxuXG4gIC8vIE5vdyBnbyBmb3IgdGhlIHJvdXRlIHRoYXQgZ29lcyB0byB0aGUgaGlnaGVzdCBwYXJlbnQgb2YgdGhlIHN0YXJ0IG5vZGUgaW4gdGhlIHRyZWVcbiAgLy8gdGhhdCBpcyBub3QgdGhlIHBhcmVudCBvZiB0aGUgZW5kIG5vZGUuXG4gIGNvbnN0IHN0YXJ0Tm9kZVBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgY2hpbGRFbGVtZW50OiBzdGFydE5vZGUsXG4gICAgb3RoZXJFbGVtZW50OiBlbmROb2RlXG4gIH0pO1xuXG4gIGlmIChzdGFydE5vZGVQYXJlbnQpIHtcbiAgICBjb25zdCB7XG4gICAgICBmb3VuZEVuZE5vZGVTaWJsaW5nOiBmb3VuZEVuZE5vZGVTaWJsaW5nRnJvbVBhcmVudExldmVsLFxuICAgICAgZ2F0aGVyZWRTaWJsaW5nczogZ2F0aGVyZWRTaWJsaW5nc0Zyb21QYXJlbnRcbiAgICB9ID0gZ2F0aGVyU2libGluZ3NVcFRvRW5kTm9kZShzdGFydE5vZGVQYXJlbnQsIGVuZE5vZGUpO1xuXG4gICAgaWYgKGZvdW5kRW5kTm9kZVNpYmxpbmdGcm9tUGFyZW50TGV2ZWwpIHtcbiAgICAgIHJldHVybiBnYXRoZXJlZFNpYmxpbmdzRnJvbVBhcmVudDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogR3JvdXBzIGdpdmVuIGhpZ2hsaWdodHMgYnkgdGltZXN0YW1wLlxuICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0c1xuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcEF0dHJcbiAqIEByZXR1cm5zIHtBcnJheX0gR3JvdXBlZCBoaWdobGlnaHRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIHRpbWVzdGFtcEF0dHIpIHtcbiAgbGV0IG9yZGVyID0gW10sXG4gICAgY2h1bmtzID0ge30sXG4gICAgZ3JvdXBlZCA9IFtdO1xuXG4gIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgIGxldCB0aW1lc3RhbXAgPSBobC5nZXRBdHRyaWJ1dGUodGltZXN0YW1wQXR0cik7XG5cbiAgICBpZiAodHlwZW9mIGNodW5rc1t0aW1lc3RhbXBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjaHVua3NbdGltZXN0YW1wXSA9IFtdO1xuICAgICAgb3JkZXIucHVzaCh0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGNodW5rc1t0aW1lc3RhbXBdLnB1c2goaGwpO1xuICB9KTtcblxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgIGxldCBncm91cCA9IGNodW5rc1t0aW1lc3RhbXBdO1xuXG4gICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAgIGNodW5rczogZ3JvdXAsXG4gICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihoKSB7XG4gICAgICAgICAgICByZXR1cm4gaC50ZXh0Q29udGVudDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gZ3JvdXBlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldHJpZXZlSGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgcGFyYW1zID0ge1xuICAgIGFuZFNlbGY6IHRydWUsXG4gICAgZ3JvdXBlZDogZmFsc2UsXG4gICAgLi4ucGFyYW1zXG4gIH07XG5cbiAgbGV0IG5vZGVMaXN0ID0gcGFyYW1zLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiW1wiICsgcGFyYW1zLmRhdGFBdHRyICsgXCJdXCIpLFxuICAgIGhpZ2hsaWdodHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG5cbiAgaWYgKFxuICAgIHBhcmFtcy5hbmRTZWxmID09PSB0cnVlICYmXG4gICAgcGFyYW1zLmNvbnRhaW5lci5oYXNBdHRyaWJ1dGUocGFyYW1zLmRhdGFBdHRyKVxuICApIHtcbiAgICBoaWdobGlnaHRzLnB1c2gocGFyYW1zLmNvbnRhaW5lcik7XG4gIH1cblxuICBpZiAocGFyYW1zLmdyb3VwZWQpIHtcbiAgICBoaWdobGlnaHRzID0gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIHBhcmFtcy50aW1lc3RhbXBBdHRyKTtcbiAgfVxuXG4gIHJldHVybiBoaWdobGlnaHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50SGlnaGxpZ2h0KGVsLCBkYXRhQXR0cikge1xuICByZXR1cm4gKFxuICAgIGVsICYmIGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShkYXRhQXR0cilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZE5vZGVzVG9IaWdobGlnaHRBZnRlckVsZW1lbnQoe1xuICBlbGVtZW50LFxuICBlbGVtZW50QW5jZXN0b3IsXG4gIGhpZ2hsaWdodFdyYXBwZXIsXG4gIGhpZ2hsaWdodGVkQ2xhc3Ncbn0pIHtcbiAgaWYgKGVsZW1lbnRBbmNlc3Rvcikge1xuICAgIGlmIChlbGVtZW50QW5jZXN0b3IuY2xhc3NMaXN0LmNvbnRhaW5zKGhpZ2hsaWdodGVkQ2xhc3MpKSB7XG4gICAgICAvLyBFbnN1cmUgd2Ugb25seSB0YWtlIHRoZSBjaGlsZHJlbiBmcm9tIGEgcGFyZW50IHRoYXQgaXMgYSBoaWdobGlnaHQuXG4gICAgICBlbGVtZW50QW5jZXN0b3IuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIC8vIGlmIChkb20oY2hpbGROb2RlKS5pc0FmdGVyKGVsZW1lbnQpKSB7XG4gICAgICAgIC8vIH1cbiAgICAgICAgZWxlbWVudEFuY2VzdG9yLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaGxpZ2h0V3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50QW5jZXN0b3IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoaWdobGlnaHRXcmFwcGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICB9XG59XG5cbi8qKlxuICogQ29sbGVjdHMgdGhlIGh1bWFuLXJlYWRhYmxlIGhpZ2hsaWdodGVkIHRleHQgZm9yIGFsbCBub2RlcyBpbiB0aGUgc2VsZWN0ZWQgcmFuZ2UuXG4gKlxuICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBodW1hbi1yZWFkYWJsZSBoaWdobGlnaHRlZCB0ZXh0IGZvciB0aGUgZ2l2ZW4gcmFuZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaWdobGlnaHRlZFRleHRGb3JSYW5nZShyYW5nZSkge1xuICBjb25zdCBkb2N1bWVudEZyYWdtZW50ID0gcmFuZ2UuZXh0cmFjdENvbnRlbnRzKCk7XG4gIHJldHVybiBkb2N1bWVudEZyYWdtZW50LmlubmVyVGV4dDtcbn1cblxuLyoqXG4gKiBDb2xsZWN0cyB0aGUgaHVtYW4tcmVhZGFibGUgaGlnaGxpZ2h0ZWQgdGV4dCBmb3IgYWxsIG5vZGVzIGZyb20gdGhlIHN0YXJ0IHRleHQgb2Zmc2V0XG4gKiByZWxhdGl2ZSB0byB0aGUgcm9vdCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7eyByb290RWxlbWVudDogSFRNTEVsZW1lbnQsIHN0YXJ0T2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyfX0gcGFyYW1zXG4gKiAgVGhlIHJvb3QtcmVsYXRpdmUgcGFyYW1ldGVycyBmb3IgZXh0cmFjdGluZyBoaWdobGlnaHRlZCB0ZXh0LlxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGh1bWFuLXJlYWRhYmxlIGhpZ2hsaWdodGVkIHRleHQgZm9yIHRoZSBnaXZlbiByb290IGVsZW1lbnQsIG9mZnNldCBhbmQgbGVuZ3RoLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0ZWRUZXh0UmVsYXRpdmVUb1Jvb3Qoe1xuICByb290RWxlbWVudCxcbiAgc3RhcnRPZmZzZXQsXG4gIGxlbmd0aFxufSkge1xuICBjb25zdCB0ZXh0Q29udGVudCA9IHJvb3RFbGVtZW50LnRleHRDb250ZW50O1xuICBjb25zdCBoaWdobGlnaHRlZFJhd1RleHQgPSB0ZXh0Q29udGVudC5zdWJzdHJpbmcoXG4gICAgc3RhcnRPZmZzZXQsXG4gICAgTnVtYmVyLnBhcnNlSW50KHN0YXJ0T2Zmc2V0KSArIE51bWJlci5wYXJzZUludChsZW5ndGgpXG4gICk7XG5cbiAgY29uc3QgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShoaWdobGlnaHRlZFJhd1RleHQpO1xuICBjb25zdCB0ZW1wQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGVtcENvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0Tm9kZSk7XG4gIC8vIEV4dHJhY3QgdGhlIGh1bWFuLXJlYWRhYmxlIHRleHQgb25seS5cbiAgcmV0dXJuIHRlbXBDb250YWluZXIuaW5uZXJUZXh0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVzY3JpcHRvcnMoeyByb290RWxlbWVudCwgcmFuZ2UsIHdyYXBwZXIgfSkge1xuICBsZXQgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgY29uc3Qgc3RhcnRPZmZzZXQgPVxuICAgIGdldEVsZW1lbnRPZmZzZXQocmFuZ2Uuc3RhcnRDb250YWluZXIsIHJvb3RFbGVtZW50KSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICBjb25zdCBlbmRPZmZzZXQgPVxuICAgIHJhbmdlLnN0YXJ0Q29udGFpbmVyID09PSByYW5nZS5lbmRDb250YWluZXJcbiAgICAgID8gc3RhcnRPZmZzZXQgKyAocmFuZ2UuZW5kT2Zmc2V0IC0gcmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCByb290RWxlbWVudCkgKyByYW5nZS5lbmRPZmZzZXQ7XG4gIGNvbnN0IGxlbmd0aCA9IGVuZE9mZnNldCAtIHN0YXJ0T2Zmc2V0O1xuICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgd3JhcHBlckNsb25lLmlubmVySFRNTCA9IFwiXCI7XG4gIGNvbnN0IHdyYXBwZXJIVE1MID0gd3JhcHBlckNsb25lLm91dGVySFRNTDtcblxuICBjb25zdCBkZXNjcmlwdG9yID0gW1xuICAgIHdyYXBwZXJIVE1MLFxuICAgIC8vIHJldHJpZXZlIGFsbCB0aGUgdGV4dCBjb250ZW50IGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Zmc2V0cy5cbiAgICBnZXRIaWdobGlnaHRlZFRleHRGb3JSYW5nZShyYW5nZSksXG4gICAgc3RhcnRPZmZzZXQsXG4gICAgbGVuZ3RoXG4gIF07XG4gIHJldHVybiBbZGVzY3JpcHRvcl07XG59XG4iXX0=
