(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

var _textHighlighter = _interopRequireDefault(require("./text-highlighter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Expose the TextHighlighter class globally to be
 * used in demos and to be injected directly into html files.
 */
global.TextHighlighter = _textHighlighter["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./text-highlighter":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.IGNORE_TAGS = exports.END_OFFSET_ATTR = exports.START_OFFSET_ATTR = exports.TIMESTAMP_ATTR = exports.DATA_ATTR = void 0;

var _dom = _interopRequireWildcard(require("./utils/dom"));

var _events = require("./utils/events");

var _highlights = require("./utils/highlights");

var _arrays = require("./utils/arrays");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
/**
 * TextHighlighter that provides text highlighting functionality to dom elements.
 */

exports.IGNORE_TAGS = IGNORE_TAGS;

var TextHighlighter =
/*#__PURE__*/
function () {
  /**
   * Creates TextHighlighter instance and binds to given DOM elements.
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
      onRemoveHighlight: function onRemoveHighlight() {
        return true;
      },
      onBeforeHighlight: function onBeforeHighlight() {
        return true;
      },
      onAfterHighlight: function onAfterHighlight() {}
    }, options);
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
        wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);
        createdHighlights = this.highlightRangeCustom(range, wrapper);
        normalizedHighlights = this.normalizeHighlights(createdHighlights);
        this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
      }

      if (!keepRange) {
        (0, _dom["default"])(this.el).removeAllRanges();
      }
    }
    /**
     * Custom functionality to highlight the range allowing more isolation for overlapping highlights.
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
     * @memberof TextHighlighter
     */

  }, {
    key: "highlightRangeCustom",
    value: function highlightRangeCustom(range, wrapper) {
      if (!range || range.collapsed) {
        return [];
      }

      console.log("ALSDebug29: RANGE: ", range);
      var highlights = [];
      var wrapperClone = wrapper.cloneNode(true);
      var overlapsWithExistingHighlight = false;
      var startOffset = (0, _highlights.getElementOffset)(range.startContainer, this.el) + range.startOffset;
      var endOffset = range.startContainer === range.endContainer ? startOffset + (range.endOffset - range.startOffset) : (0, _highlights.getElementOffset)(range.endContainer, this.el) + range.endOffset;
      console.log("ALSDebug29: startOffset: ", startOffset, "endOffset: ", endOffset);
      wrapperClone.setAttribute(START_OFFSET_ATTR, startOffset);
      wrapperClone.setAttribute(END_OFFSET_ATTR, endOffset);
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

        console.log("startContainer === endContainer!!!!!");
        var highlight = (0, _dom["default"])(startOfNewHighlight).wrap(wrapperClone);
        highlights.push(highlight);
      } else if (endContainer.textContent.length >= range.endOffset) {
        var _startOfNewHighlight = startContainer.splitText(range.startOffset);

        var endOfNewHighlight = afterNewHighlight.previousSibling;
        console.log("Node at the start of the new highlight: ", _startOfNewHighlight);
        console.log("Node at the end of new highlight: ", endOfNewHighlight);
        /* 
        let startElementParent = findFirstNonSharedParent({
          childElement: startOfNewHighlight,
          otherElement: endOfNewHighlight
        });
         if (startElementParent) {
          let startElementParentCopy = extractElementContentForHighlight(
            {
              element: startOfNewHighlight,
              elementAncestor: startElementParent,
              options: this.options,
              locationInSelection: "start"
            }
          );
        } */

        var endElementParent = (0, _highlights.findFirstNonSharedParent)({
          childElement: endOfNewHighlight,
          otherElement: _startOfNewHighlight
        });

        if (endElementParent) {
          var endElementParentCopy = (0, _highlights.extractElementContentForHighlight)({
            element: endOfNewHighlight,
            elementAncestor: endElementParent,
            options: this.options,
            locationInSelection: "end"
          });
          wrapperClone.appendChild(_startOfNewHighlight); // TODO: add containers in between.
          // Only copy the children of a highlighted span into our new highlight.

          if (endElementParentCopy.classList.contains(this.options.highlightedClass)) {
            endElementParentCopy.childNodes.forEach(function (childNode) {
              wrapperClone.appendChild(childNode);
            });
          } else {
            wrapperClone.appendChild(endElementParentCopy);
          }

          (0, _dom["default"])(wrapperClone).insertBefore(endElementParent);
          console.log("Node that is the wrapper of the end of the new highlight: ", endElementParent);
          console.log("Cloned of node that is the wrapper of the end of the new highlight after removing siblings and unwrapping highlight spans: ", endElementParentCopy);
        }
      }

      return highlights;
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
          if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== "") {
            wrapperClone = wrapper.cloneNode(true);
            wrapperClone.setAttribute(DATA_ATTR, true);
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

        if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {
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
     * @memberof TextHighlighter
     */

  }, {
    key: "normalizeHighlights",
    value: function normalizeHighlights(highlights) {
      var normalizedHighlights; //this.flattenNestedHighlights(highlights);
      //this.mergeSiblingHighlights(highlights);
      //Since we're not merging or flattening, we need to normalise the text nodes.

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
     * Flattens highlights structure.
     * Note: this method changes input highlights - their order and number after calling this method may change.
     * @param {Array} highlights - highlights to flatten.
     * @memberof TextHighlighter
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

          if (self.isHighlight(parent)) {
            if (!(0, _highlights.haveSameColor)(parent, hl)) {
              if (!hl.nextSibling) {
                if (!parentNext) {
                  (0, _dom["default"])(hl).insertAfter(parent);
                } else {
                  (0, _dom["default"])(hl).insertBefore(parentNext);
                } //dom(hl).insertBefore(parentNext || parent);


                again = true;
              }

              if (!hl.previousSibling) {
                if (!parentPrev) {
                  (0, _dom["default"])(hl).insertBefore(parent);
                } else {
                  (0, _dom["default"])(hl).insertAfter(parentPrev);
                } //dom(hl).insertAfter(parentPrev || parent);


                again = true;
              }

              if (hl.previousSibling && hl.previousSibling.nodeType == 3 && hl.nextSibling && hl.nextSibling.nodeType == 3) {
                var spanleft = document.createElement("span");
                spanleft.style.backgroundColor = parent.style.backgroundColor;
                spanleft.className = parent.className;
                var timestamp = parent.attributes[TIMESTAMP_ATTR].nodeValue;
                spanleft.setAttribute(TIMESTAMP_ATTR, timestamp);
                spanleft.setAttribute(DATA_ATTR, true);
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
     * @memberof TextHighlighter
     */

  }, {
    key: "mergeSiblingHighlights",
    value: function mergeSiblingHighlights(highlights) {
      var self = this;

      function shouldMerge(current, node) {
        return false;
        /*       return (
          node &&
          node.nodeType === NODE_TYPE.ELEMENT_NODE &&
          haveSameColor(current, node) &&
          self.isHighlight(node)
        ); */
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
      var container = element || this.el,
          highlights = this.getHighlights({
        container: container
      }),
          self = this;
      /*     function mergeSiblings(node) {
        var prev = node.previousSibling,
          next = node.nextSibling;
         if (node && node.nodeType === NODE_TYPE.TEXT_NODE) {
          if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
            node.nodeValue = prev.nodeValue + node.nodeValue;
            dom(prev).remove();
          }
          if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
            node.nodeValue = node.nodeValue + next.nodeValue;
            dom(next).remove();
          }
        } else {
          if (prev && prev.className === node.className) {
            node.nodeValue = prev.nodeValue + node.nodeValue;
            dom(prev).remove();
          }
          if (next && next.className === node.className) {
            node.nodeValue = node.nodeValue + next.nodeValue;
            dom(next).remove();
          }
        }
      } */

      function removeHighlight(highlight) {
        if (highlight.className === container.className) {
          (0, _dom["default"])(highlight).unwrap();
          /**  nodes.forEach(function(node) {
            mergeSiblings(node);
          });
          */
        }
      } //sortByDepth(highlights, true);


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
     * @memberof TextHighlighter
     */

  }, {
    key: "getHighlights",
    value: function getHighlights(params) {
      params = _objectSpread({
        container: this.el,
        andSelf: true,
        grouped: false
      }, params);
      var nodeList = params.container.querySelectorAll("[" + DATA_ATTR + "]"),
          highlights = Array.prototype.slice.call(nodeList);

      if (params.andSelf === true && params.container.hasAttribute(DATA_ATTR)) {
        highlights.push(params.container);
      }

      if (params.grouped) {
        highlights = (0, _highlights.groupHighlights)(highlights, TIMESTAMP_ATTR);
      }

      return highlights;
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
      return el && el.nodeType === _dom.NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
    }
    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
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
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
     */

  }, {
    key: "serializeHighlightsCustom",
    value: function serializeHighlightsCustom(id) {
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
     * Deserializes the custom form of highlights.
     *
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof TextHighlighter
     */

  }, {
    key: "deserializeHighlightsCustom",
    value: function deserializeHighlightsCustom(json) {
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

},{"./utils/arrays":3,"./utils/dom":4,"./utils/events":5,"./utils/highlights":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
exports.groupHighlights = groupHighlights;

var _dom = _interopRequireWildcard(require("./dom"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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
  var level = 1;

  do {
    childNodes = Array.prototype.slice.call(currentElement.parentNode.childNodes);
    var childElementIndex = childNodes.indexOf(currentElement);
    var offsetInCurrentParent = getTextOffsetBefore(childNodes, childElementIndex);
    offset += offsetInCurrentParent;
    currentElement = currentElement.parentNode;
    level += 1;
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

  while (!firstNonSharedParent && i < parents.length) {
    var currentParent = parents[i];

    if (currentParent.contains(otherElement) && i > 0) {
      console.log("currentParent contains other element!", currentParent);
      firstNonSharedParent = parents[i - 1];
    }

    i++;
  }

  return firstNonSharedParent;
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
  var sibling = elementCopy.nextSibling;

  while (sibling) {
    elementCopyParent.removeChild(sibling);
    sibling = elementCopy.nextSibling;
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

},{"./dom":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2xvYmFsLXNjcmlwdC5qcyIsInNyYy90ZXh0LWhpZ2hsaWdodGVyLmpzIiwic3JjL3V0aWxzL2FycmF5cy5qcyIsInNyYy91dGlscy9kb20uanMiLCJzcmMvdXRpbHMvZXZlbnRzLmpzIiwic3JjL3V0aWxzL2hpZ2hsaWdodHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7OztBQUVBOzs7O0FBSUEsTUFBTSxDQUFDLGVBQVAsR0FBeUIsMkJBQXpCOzs7Ozs7Ozs7Ozs7QUNOQTs7QUFDQTs7QUFDQTs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7O0FBSU8sSUFBTSxTQUFTLEdBQUcsa0JBQWxCO0FBRVA7Ozs7OztBQUlPLElBQU0sY0FBYyxHQUFHLGdCQUF2Qjs7QUFFQSxJQUFNLGlCQUFpQixHQUFHLG1CQUExQjs7QUFDQSxJQUFNLGVBQWUsR0FBRyxpQkFBeEI7QUFFUDs7Ozs7O0FBSU8sSUFBTSxXQUFXLEdBQUcsQ0FDekIsUUFEeUIsRUFFekIsT0FGeUIsRUFHekIsUUFIeUIsRUFJekIsUUFKeUIsRUFLekIsUUFMeUIsRUFNekIsUUFOeUIsRUFPekIsUUFQeUIsRUFRekIsT0FSeUIsRUFTekIsT0FUeUIsRUFVekIsUUFWeUIsRUFXekIsT0FYeUIsRUFZekIsT0FaeUIsRUFhekIsT0FieUIsRUFjekIsVUFkeUIsQ0FBcEI7QUFpQlA7Ozs7OztJQUdNLGU7OztBQUNKOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSwyQkFBWSxPQUFaLEVBQXFCLE9BQXJCLEVBQThCO0FBQUE7O0FBQzVCLFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixZQUFNLElBQUksS0FBSixDQUFVLHdCQUFWLENBQU47QUFDRDs7QUFFRCxTQUFLLEVBQUwsR0FBVSxPQUFWO0FBQ0EsU0FBSyxPQUFMO0FBQ0UsTUFBQSxLQUFLLEVBQUUsU0FEVDtBQUVFLE1BQUEsZ0JBQWdCLEVB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QUFFLFNBRkE7QUFHWCxNQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixlQUFPLEtBQUssQ0FDVCxHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFDLENBQUMsV0FBVDtBQUNELFNBSEksRUFJSixJQUpJLENBSUMsRUFKRCxDQUFQO0FBS0Q7QUFUVSxLQUFiO0FBV0QsR0FkRDtBQWdCQSxTQUFPLE9BQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBUZXh0SGlnaGxpZ2h0ZXIgZnJvbSBcIi4vdGV4dC1oaWdobGlnaHRlclwiO1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgVGV4dEhpZ2hsaWdodGVyIGNsYXNzIGdsb2JhbGx5IHRvIGJlXG4gKiB1c2VkIGluIGRlbW9zIGFuZCB0byBiZSBpbmplY3RlZCBkaXJlY3RseSBpbnRvIGh0bWwgZmlsZXMuXG4gKi9cbmdsb2JhbC5UZXh0SGlnaGxpZ2h0ZXIgPSBUZXh0SGlnaGxpZ2h0ZXI7XG4iLCJpbXBvcnQgZG9tLCB7IE5PREVfVFlQRSB9IGZyb20gXCIuL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgYmluZEV2ZW50cywgdW5iaW5kRXZlbnRzIH0gZnJvbSBcIi4vdXRpbHMvZXZlbnRzXCI7XG5pbXBvcnQge1xuICByZWZpbmVSYW5nZUJvdW5kYXJpZXMsXG4gIHNvcnRCeURlcHRoLFxuICBoYXZlU2FtZUNvbG9yLFxuICBncm91cEhpZ2hsaWdodHMsXG4gIGNyZWF0ZVdyYXBwZXIsXG4gIGdldEVsZW1lbnRPZmZzZXQsXG4gIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24sXG4gIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCxcbiAgZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0LFxuICBmaW5kTm9kZUFuZE9mZnNldFxufSBmcm9tIFwiLi91dGlscy9oaWdobGlnaHRzXCI7XG5pbXBvcnQgeyB1bmlxdWUgfSBmcm9tIFwiLi91dGlscy9hcnJheXNcIjtcblxuLyoqXG4gKiBBdHRyaWJ1dGUgYWRkZWQgYnkgZGVmYXVsdCB0byBldmVyeSBoaWdobGlnaHQuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgREFUQV9BVFRSID0gXCJkYXRhLWhpZ2hsaWdodGVkXCI7XG5cbi8qKlxuICogQXR0cmlidXRlIHVzZWQgdG8gZ3JvdXAgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRJTUVTVEFNUF9BVFRSID0gXCJkYXRhLXRpbWVzdGFtcFwiO1xuXG5leHBvcnQgY29uc3QgU1RBUlRfT0ZGU0VUX0FUVFIgPSBcImRhdGEtc3RhcnQtb2Zmc2V0XCI7XG5leHBvcnQgY29uc3QgRU5EX09GRlNFVF9BVFRSID0gXCJkYXRhLWVuZC1vZmZzZXRcIjtcblxuLyoqXG4gKiBEb24ndCBoaWdobGlnaHQgY29udGVudCBvZiB0aGVzZSB0YWdzLlxuICogQHR5cGUge3N0cmluZ1tdfVxuICovXG5leHBvcnQgY29uc3QgSUdOT1JFX1RBR1MgPSBbXG4gIFwiU0NSSVBUXCIsXG4gIFwiU1RZTEVcIixcbiAgXCJTRUxFQ1RcIixcbiAgXCJPUFRJT05cIixcbiAgXCJCVVRUT05cIixcbiAgXCJPQkpFQ1RcIixcbiAgXCJBUFBMRVRcIixcbiAgXCJWSURFT1wiLFxuICBcIkFVRElPXCIsXG4gIFwiQ0FOVkFTXCIsXG4gIFwiRU1CRURcIixcbiAgXCJQQVJBTVwiLFxuICBcIk1FVEVSXCIsXG4gIFwiUFJPR1JFU1NcIlxuXTtcblxuLyoqXG4gKiBUZXh0SGlnaGxpZ2h0ZXIgdGhhdCBwcm92aWRlcyB0ZXh0IGhpZ2hsaWdodGluZyBmdW5jdGlvbmFsaXR5IHRvIGRvbSBlbGVtZW50cy5cbiAqL1xuY2xhc3MgVGV4dEhpZ2hsaWdodGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgVGV4dEhpZ2hsaWdodGVyIGluc3RhbmNlIGFuZCBiaW5kcyB0byBnaXZlbiBET00gZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlZCB3aWxsIGJlIGFwcGxpZWQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gLSBhZGRpdGlvbmFsIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbG9yIC0gaGlnaGxpZ2h0IGNvbG9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gaGlnaGxpZ2h0LCAnaGlnaGxpZ2h0ZWQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNvbnRleHRDbGFzcyAtIGNsYXNzIGFkZGVkIHRvIGVsZW1lbnQgdG8gd2hpY2ggaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCxcbiAgICogICdoaWdobGlnaHRlci1jb250ZXh0JyBieSBkZWZhdWx0LlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uUmVtb3ZlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgcmVtb3ZlZC4gSGlnaGxpZ2h0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiBoaWdobGlnaHQgc2hvdWxkIGJlIHJlbW92ZWQsIG9yIGZhbHNlIC0gdG8gcHJldmVudCByZW1vdmFsLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0IC0gZnVuY3Rpb24gY2FsbGVkIGJlZm9yZSBoaWdobGlnaHQgaXMgY3JlYXRlZC4gUmFuZ2Ugb2JqZWN0IGlzXG4gICAqICBwYXNzZWQgYXMgcGFyYW0uIEZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSB0byBjb250aW51ZSBwcm9jZXNzaW5nLCBvciBmYWxzZSAtIHRvIHByZXZlbnQgaGlnaGxpZ2h0aW5nLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYWZ0ZXIgaGlnaGxpZ2h0IGlzIGNyZWF0ZWQuIEFycmF5IG9mIGNyZWF0ZWRcbiAgICogd3JhcHBlcnMgaXMgcGFzc2VkIGFzIHBhcmFtLlxuICAgKiBAY2xhc3MgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGFuY2hvciBlbGVtZW50XCIpO1xuICAgIH1cblxuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGNvbG9yOiBcIiNmZmZmN2JcIixcbiAgICAgIGhpZ2hsaWdodGVkQ2xhc3M6IFwiaGlnaGxpZ2h0ZWRcIixcbiAgICAgIGNvbnRleHRDbGFzczogXCJoaWdobGlnaHRlci1jb250ZXh0XCIsXG4gICAgICBvblJlbW92ZUhpZ2hsaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIG9uQmVmb3JlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25BZnRlckhpZ2hsaWdodDogZnVuY3Rpb24oKSB7fSxcbiAgICAgIC4uLm9wdGlvbnNcbiAgICB9O1xuXG4gICAgZG9tKHRoaXMuZWwpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICAgIGJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUGVybWFuZW50bHkgZGlzYWJsZXMgaGlnaGxpZ2h0aW5nLlxuICAgKiBVbmJpbmRzIGV2ZW50cyBhbmQgcmVtb3ZlIGNvbnRleHQgZWxlbWVudCBjbGFzcy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB1bmJpbmRFdmVudHModGhpcy5lbCwgdGhpcyk7XG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb250ZXh0Q2xhc3MpO1xuICB9XG5cbiAgaGlnaGxpZ2h0SGFuZGxlcigpIHtcbiAgICB0aGlzLmRvSGlnaGxpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyBjdXJyZW50IHJhbmdlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGtlZXBSYW5nZSAtIERvbid0IHJlbW92ZSByYW5nZSBhZnRlciBoaWdobGlnaHRpbmcuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkb0hpZ2hsaWdodChrZWVwUmFuZ2UpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb20odGhpcy5lbCkuZ2V0UmFuZ2UoKSxcbiAgICAgIHdyYXBwZXIsXG4gICAgICBjcmVhdGVkSGlnaGxpZ2h0cyxcbiAgICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzLFxuICAgICAgdGltZXN0YW1wO1xuXG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm9uQmVmb3JlSGlnaGxpZ2h0KHJhbmdlKSA9PT0gdHJ1ZSkge1xuICAgICAgdGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG4gICAgICB3cmFwcGVyID0gY3JlYXRlV3JhcHBlcih0aGlzLm9wdGlvbnMpO1xuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoVElNRVNUQU1QX0FUVFIsIHRpbWVzdGFtcCk7XG5cbiAgICAgIGNyZWF0ZWRIaWdobGlnaHRzID0gdGhpcy5oaWdobGlnaHRSYW5nZUN1c3RvbShyYW5nZSwgd3JhcHBlcik7XG4gICAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHRoaXMubm9ybWFsaXplSGlnaGxpZ2h0cyhjcmVhdGVkSGlnaGxpZ2h0cyk7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5vbkFmdGVySGlnaGxpZ2h0KHJhbmdlLCBub3JtYWxpemVkSGlnaGxpZ2h0cywgdGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBpZiAoIWtlZXBSYW5nZSkge1xuICAgICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDdXN0b20gZnVuY3Rpb25hbGl0eSB0byBoaWdobGlnaHQgdGhlIHJhbmdlIGFsbG93aW5nIG1vcmUgaXNvbGF0aW9uIGZvciBvdmVybGFwcGluZyBoaWdobGlnaHRzLlxuICAgKiBUaGlzIHNvbHV0aW9uIHN0ZWFscyB0aGUgdGV4dCBvciBvdGhlciBub2RlcyBpbiB0aGUgRE9NIGZyb20gb3ZlcmxhcHBpbmcgKE5PVCBORVNURUQpIGhpZ2hsaWdodHNcbiAgICogZm9yIHJlcHJlc2VudGF0aW9uIGluIHRoZSBET00uXG4gICAqXG4gICAqIEZvciB0aGUgcHVycG9zZSBvZiBzZXJpYWxpc2F0aW9uIHRoaXMgd2lsbCBtYWludGFpbiBhIGRhdGEgYXR0cmlidXRlIG9uIHRoZSBoaWdobGlnaHQgd3JhcHBlclxuICAgKiB3aXRoIHRoZSBzdGFydCB0ZXh0IGFuZCBlbmQgdGV4dCBvZmZzZXRzIHJlbGF0aXZlIHRvIHRoZSBjb250ZXh0IHJvb3QgZWxlbWVudC5cbiAgICpcbiAgICogV3JhcHMgdGV4dCBvZiBnaXZlbiByYW5nZSBvYmplY3QgaW4gd3JhcHBlciBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gLSBhcnJheSBvZiBjcmVhdGVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGhpZ2hsaWdodFJhbmdlQ3VzdG9tKHJhbmdlLCB3cmFwcGVyKSB7XG4gICAgaWYgKCFyYW5nZSB8fCByYW5nZS5jb2xsYXBzZWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIkFMU0RlYnVnMjk6IFJBTkdFOiBcIiwgcmFuZ2UpO1xuXG4gICAgbGV0IGhpZ2hsaWdodHMgPSBbXTtcbiAgICBsZXQgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgbGV0IG92ZXJsYXBzV2l0aEV4aXN0aW5nSGlnaGxpZ2h0ID0gZmFsc2U7XG5cbiAgICBsZXQgc3RhcnRPZmZzZXQgPVxuICAgICAgZ2V0RWxlbWVudE9mZnNldChyYW5nZS5zdGFydENvbnRhaW5lciwgdGhpcy5lbCkgKyByYW5nZS5zdGFydE9mZnNldDtcbiAgICBsZXQgZW5kT2Zmc2V0ID1cbiAgICAgIHJhbmdlLnN0YXJ0Q29udGFpbmVyID09PSByYW5nZS5lbmRDb250YWluZXJcbiAgICAgICAgPyBzdGFydE9mZnNldCArIChyYW5nZS5lbmRPZmZzZXQgLSByYW5nZS5zdGFydE9mZnNldClcbiAgICAgICAgOiBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLmVuZENvbnRhaW5lciwgdGhpcy5lbCkgKyByYW5nZS5lbmRPZmZzZXQ7XG5cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIFwiQUxTRGVidWcyOTogc3RhcnRPZmZzZXQ6IFwiLFxuICAgICAgc3RhcnRPZmZzZXQsXG4gICAgICBcImVuZE9mZnNldDogXCIsXG4gICAgICBlbmRPZmZzZXRcbiAgICApO1xuXG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShTVEFSVF9PRkZTRVRfQVRUUiwgc3RhcnRPZmZzZXQpO1xuICAgIHdyYXBwZXJDbG9uZS5zZXRBdHRyaWJ1dGUoRU5EX09GRlNFVF9BVFRSLCBlbmRPZmZzZXQpO1xuXG4gICAgY29uc29sZS5sb2coXCJcXG5cXG5cXG4gRklORElORyBTVEFSVCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLnN0YXJ0Q29udGFpbmVyOiBcIiwgcmFuZ2Uuc3RhcnRDb250YWluZXIpO1xuICAgIGxldCBzdGFydENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2Uuc3RhcnRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIEVORCBDT05UQUlORVIgRklSU1QgVEVYVCBOT0RFIFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInJhbmdlLmVuZENvbnRhaW5lcjogXCIsIHJhbmdlLmVuZENvbnRhaW5lcik7XG4gICAgbGV0IGVuZENvbnRhaW5lciA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24ocmFuZ2UuZW5kQ29udGFpbmVyLCBcInN0YXJ0XCIpO1xuXG4gICAgaWYgKCFzdGFydENvbnRhaW5lciB8fCAhZW5kQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRmFpbGVkIHRvIGZpbmQgdGhlIHRleHQgbm9kZSBmb3IgdGhlIHN0YXJ0IG9yIHRoZSBlbmQgb2YgdGhlIHNlbGVjdGVkIHJhbmdlXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGFmdGVyTmV3SGlnaGxpZ2h0ID1cbiAgICAgIHJhbmdlLmVuZE9mZnNldCA8IGVuZENvbnRhaW5lci50ZXh0Q29udGVudC5sZW5ndGggLSAxXG4gICAgICAgID8gZW5kQ29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5lbmRPZmZzZXQpXG4gICAgICAgIDogZW5kQ29udGFpbmVyO1xuXG4gICAgaWYgKHN0YXJ0Q29udGFpbmVyID09PSBlbmRDb250YWluZXIpIHtcbiAgICAgIGxldCBzdGFydE9mTmV3SGlnaGxpZ2h0ID1cbiAgICAgICAgcmFuZ2Uuc3RhcnRPZmZzZXQgPiAwXG4gICAgICAgICAgPyBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpXG4gICAgICAgICAgOiBzdGFydENvbnRhaW5lcjtcbiAgICAgIC8vIFNpbXBseSB3cmFwIHRoZSBzZWxlY3RlZCByYW5nZSBpbiB0aGUgc2FtZSBjb250YWluZXIgYXMgYSBoaWdobGlnaHQuXG4gICAgICBjb25zb2xlLmxvZyhcInN0YXJ0Q29udGFpbmVyID09PSBlbmRDb250YWluZXIhISEhIVwiKTtcbiAgICAgIGxldCBoaWdobGlnaHQgPSBkb20oc3RhcnRPZk5ld0hpZ2hsaWdodCkud3JhcCh3cmFwcGVyQ2xvbmUpO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfSBlbHNlIGlmIChlbmRDb250YWluZXIudGV4dENvbnRlbnQubGVuZ3RoID49IHJhbmdlLmVuZE9mZnNldCkge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPSBzdGFydENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgbGV0IGVuZE9mTmV3SGlnaGxpZ2h0ID0gYWZ0ZXJOZXdIaWdobGlnaHQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiTm9kZSBhdCB0aGUgc3RhcnQgb2YgdGhlIG5ldyBoaWdobGlnaHQ6IFwiLFxuICAgICAgICBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJOb2RlIGF0IHRoZSBlbmQgb2YgbmV3IGhpZ2hsaWdodDogXCIsIGVuZE9mTmV3SGlnaGxpZ2h0KTtcbiAgICAgIC8qIFxuICAgICAgbGV0IHN0YXJ0RWxlbWVudFBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgICAgIGNoaWxkRWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzdGFydEVsZW1lbnRQYXJlbnQpIHtcbiAgICAgICAgbGV0IHN0YXJ0RWxlbWVudFBhcmVudENvcHkgPSBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQoXG4gICAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICAgIGVsZW1lbnRBbmNlc3Rvcjogc3RhcnRFbGVtZW50UGFyZW50LFxuICAgICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgbG9jYXRpb25JblNlbGVjdGlvbjogXCJzdGFydFwiXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSAqL1xuXG4gICAgICBsZXQgZW5kRWxlbWVudFBhcmVudCA9IGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudCh7XG4gICAgICAgIGNoaWxkRWxlbWVudDogZW5kT2ZOZXdIaWdobGlnaHQsXG4gICAgICAgIG90aGVyRWxlbWVudDogc3RhcnRPZk5ld0hpZ2hsaWdodFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChlbmRFbGVtZW50UGFyZW50KSB7XG4gICAgICAgIGxldCBlbmRFbGVtZW50UGFyZW50Q29weSA9IGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodCh7XG4gICAgICAgICAgZWxlbWVudDogZW5kT2ZOZXdIaWdobGlnaHQsXG4gICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBlbmRFbGVtZW50UGFyZW50LFxuICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBsb2NhdGlvbkluU2VsZWN0aW9uOiBcImVuZFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdyYXBwZXJDbG9uZS5hcHBlbmRDaGlsZChzdGFydE9mTmV3SGlnaGxpZ2h0KTtcbiAgICAgICAgLy8gVE9ETzogYWRkIGNvbnRhaW5lcnMgaW4gYmV0d2Vlbi5cblxuICAgICAgICAvLyBPbmx5IGNvcHkgdGhlIGNoaWxkcmVuIG9mIGEgaGlnaGxpZ2h0ZWQgc3BhbiBpbnRvIG91ciBuZXcgaGlnaGxpZ2h0LlxuICAgICAgICBpZiAoXG4gICAgICAgICAgZW5kRWxlbWVudFBhcmVudENvcHkuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMub3B0aW9ucy5oaWdobGlnaHRlZENsYXNzKVxuICAgICAgICApIHtcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weS5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZXJDbG9uZS5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyYXBwZXJDbG9uZS5hcHBlbmRDaGlsZChlbmRFbGVtZW50UGFyZW50Q29weSk7XG4gICAgICAgIH1cblxuICAgICAgICBkb20od3JhcHBlckNsb25lKS5pbnNlcnRCZWZvcmUoZW5kRWxlbWVudFBhcmVudCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJOb2RlIHRoYXQgaXMgdGhlIHdyYXBwZXIgb2YgdGhlIGVuZCBvZiB0aGUgbmV3IGhpZ2hsaWdodDogXCIsXG4gICAgICAgICAgZW5kRWxlbWVudFBhcmVudFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIFwiQ2xvbmVkIG9mIG5vZGUgdGhhdCBpcyB0aGUgd3JhcHBlciBvZiB0aGUgZW5kIG9mIHRoZSBuZXcgaGlnaGxpZ2h0IGFmdGVyIHJlbW92aW5nIHNpYmxpbmdzIGFuZCB1bndyYXBwaW5nIGhpZ2hsaWdodCBzcGFuczogXCIsXG4gICAgICAgICAgZW5kRWxlbWVudFBhcmVudENvcHlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHJhbmdlLlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2UocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyODogcmFuZ2UgYmVmb3JlIHJlZmluZWQhIFwiLCByYW5nZSk7XG5cbiAgICB2YXIgcmVzdWx0ID0gcmVmaW5lUmFuZ2VCb3VuZGFyaWVzKHJhbmdlKSxcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gcmVzdWx0LnN0YXJ0Q29udGFpbmVyLFxuICAgICAgZW5kQ29udGFpbmVyID0gcmVzdWx0LmVuZENvbnRhaW5lcixcbiAgICAgIGdvRGVlcGVyID0gcmVzdWx0LmdvRGVlcGVyLFxuICAgICAgZG9uZSA9IGZhbHNlLFxuICAgICAgbm9kZSA9IHN0YXJ0Q29udGFpbmVyLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgaGlnaGxpZ2h0LFxuICAgICAgd3JhcHBlckNsb25lLFxuICAgICAgbm9kZVBhcmVudDtcblxuICAgIGRvIHtcbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBJR05PUkVfVEFHUy5pbmRleE9mKG5vZGUucGFyZW50Tm9kZS50YWdOYW1lKSA9PT0gLTEgJiZcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lID0gd3JhcHBlci5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShEQVRBX0FUVFIsIHRydWUpO1xuICAgICAgICAgIG5vZGVQYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAvLyBoaWdobGlnaHQgaWYgYSBub2RlIGlzIGluc2lkZSB0aGUgZWxcbiAgICAgICAgICBpZiAoZG9tKHRoaXMuZWwpLmNvbnRhaW5zKG5vZGVQYXJlbnQpIHx8IG5vZGVQYXJlbnQgPT09IHRoaXMuZWwpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodCA9IGRvbShub2RlKS53cmFwKHdyYXBwZXJDbG9uZSk7XG4gICAgICAgICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBub2RlID09PSBlbmRDb250YWluZXIgJiZcbiAgICAgICAgIShlbmRDb250YWluZXIuaGFzQ2hpbGROb2RlcygpICYmIGdvRGVlcGVyKVxuICAgICAgKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS50YWdOYW1lICYmIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS50YWdOYW1lKSA+IC0xKSB7XG4gICAgICAgIGlmIChlbmRDb250YWluZXIucGFyZW50Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZ29EZWVwZXIgJiYgbm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgZ29EZWVwZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IHdoaWxlICghZG9uZSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIGhpZ2hsaWdodHMuIEVuc3VyZXMgdGhhdCBoaWdobGlnaHRpbmcgaXMgZG9uZSB3aXRoIHVzZSBvZiB0aGUgc21hbGxlc3QgcG9zc2libGUgbnVtYmVyIG9mXG4gICAqIHdyYXBwaW5nIEhUTUwgZWxlbWVudHMuXG4gICAqIEZsYXR0ZW5zIGhpZ2hsaWdodHMgc3RydWN0dXJlIGFuZCBtZXJnZXMgc2libGluZyBoaWdobGlnaHRzLiBOb3JtYWxpemVzIHRleHQgbm9kZXMgd2l0aGluIGhpZ2hsaWdodHMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIG5vcm1hbGl6ZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIG5vcm1hbGl6ZWQgaGlnaGxpZ2h0cy4gT3JkZXIgYW5kIG51bWJlciBvZiByZXR1cm5lZCBoaWdobGlnaHRzIG1heSBiZSBkaWZmZXJlbnQgdGhhblxuICAgKiBpbnB1dCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBub3JtYWxpemVIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICB2YXIgbm9ybWFsaXplZEhpZ2hsaWdodHM7XG5cbiAgICAvL3RoaXMuZmxhdHRlbk5lc3RlZEhpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG4gICAgLy90aGlzLm1lcmdlU2libGluZ0hpZ2hsaWdodHMoaGlnaGxpZ2h0cyk7XG5cbiAgICAvL1NpbmNlIHdlJ3JlIG5vdCBtZXJnaW5nIG9yIGZsYXR0ZW5pbmcsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIHRoZSB0ZXh0IG5vZGVzLlxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGRvbShoaWdobGlnaHQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgIH0pO1xuXG4gICAgLy8gb21pdCByZW1vdmVkIG5vZGVzXG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMgPSBoaWdobGlnaHRzLmZpbHRlcihmdW5jdGlvbihobCkge1xuICAgICAgcmV0dXJuIGhsLnBhcmVudEVsZW1lbnQgPyBobCA6IG51bGw7XG4gICAgfSk7XG5cbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IHVuaXF1ZShub3JtYWxpemVkSGlnaGxpZ2h0cyk7XG4gICAgbm9ybWFsaXplZEhpZ2hsaWdodHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vZmZzZXRUb3AgLSBiLm9mZnNldFRvcCB8fCBhLm9mZnNldExlZnQgLSBiLm9mZnNldExlZnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZEhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaWdobGlnaHRzIC0gaGlnaGxpZ2h0cyB0byBmbGF0dGVuLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBmbGF0dGVuTmVzdGVkSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgdmFyIGFnYWluLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCB0cnVlKTtcblxuICAgIGZ1bmN0aW9uIGZsYXR0ZW5PbmNlKCkge1xuICAgICAgdmFyIGFnYWluID0gZmFsc2U7XG5cbiAgICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCwgaSkge1xuICAgICAgICB2YXIgcGFyZW50ID0gaGwucGFyZW50RWxlbWVudCxcbiAgICAgICAgICBwYXJlbnRQcmV2ID0gcGFyZW50LnByZXZpb3VzU2libGluZyxcbiAgICAgICAgICBwYXJlbnROZXh0ID0gcGFyZW50Lm5leHRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChzZWxmLmlzSGlnaGxpZ2h0KHBhcmVudCkpIHtcbiAgICAgICAgICBpZiAoIWhhdmVTYW1lQ29sb3IocGFyZW50LCBobCkpIHtcbiAgICAgICAgICAgIGlmICghaGwubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnROZXh0KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudE5leHQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50TmV4dCB8fCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaGwucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgICAgICAgIGlmICghcGFyZW50UHJldikge1xuICAgICAgICAgICAgICAgIGRvbShobCkuaW5zZXJ0QmVmb3JlKHBhcmVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnRQcmV2KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL2RvbShobCkuaW5zZXJ0QWZ0ZXIocGFyZW50UHJldiB8fCBwYXJlbnQpO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PSAzICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgICAgIGhsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09IDNcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB2YXIgc3BhbmxlZnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcGFyZW50LnN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgdmFyIHRpbWVzdGFtcCA9IHBhcmVudC5hdHRyaWJ1dGVzW1RJTUVTVEFNUF9BVFRSXS5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIHNwYW5sZWZ0LnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgdmFyIHNwYW5yaWdodCA9IHNwYW5sZWZ0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICAgICAgICBkb20oaGwucHJldmlvdXNTaWJsaW5nKS53cmFwKHNwYW5sZWZ0KTtcbiAgICAgICAgICAgICAgZG9tKGhsLm5leHRTaWJsaW5nKS53cmFwKHNwYW5yaWdodCk7XG5cbiAgICAgICAgICAgICAgdmFyIG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGFyZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb20obm9kZSkuaW5zZXJ0QmVmb3JlKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcGFyZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICBkb20ocGFyZW50KS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChobC5maXJzdENoaWxkLCBobCk7XG4gICAgICAgICAgICBoaWdobGlnaHRzW2ldID0gcGFyZW50O1xuICAgICAgICAgICAgYWdhaW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhZ2FpbjtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICBhZ2FpbiA9IGZsYXR0ZW5PbmNlKCk7XG4gICAgfSB3aGlsZSAoYWdhaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMgYW5kIG5vcm1hbGl6ZXMgZGVzY2VuZGFudCB0ZXh0IG5vZGVzLlxuICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjaGFuZ2VzIGlucHV0IGhpZ2hsaWdodHMgLSB0aGVpciBvcmRlciBhbmQgbnVtYmVyIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IGNoYW5nZS5cbiAgICogQHBhcmFtIGhpZ2hsaWdodHNcbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgbWVyZ2VTaWJsaW5nSGlnaGxpZ2h0cyhoaWdobGlnaHRzKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2hvdWxkTWVyZ2UoY3VycmVudCwgbm9kZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgLyogICAgICAgcmV0dXJuIChcbiAgICAgICAgbm9kZSAmJlxuICAgICAgICBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAgIGhhdmVTYW1lQ29sb3IoY3VycmVudCwgbm9kZSkgJiZcbiAgICAgICAgc2VsZi5pc0hpZ2hsaWdodChub2RlKVxuICAgICAgKTsgKi9cbiAgICB9XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICB2YXIgcHJldiA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSBoaWdobGlnaHQubmV4dFNpYmxpbmc7XG5cbiAgICAgIGlmIChzaG91bGRNZXJnZShoaWdobGlnaHQsIHByZXYpKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLnByZXBlbmQocHJldi5jaGlsZE5vZGVzKTtcbiAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHNob3VsZE1lcmdlKGhpZ2hsaWdodCwgbmV4dCkpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkuYXBwZW5kKG5leHQuY2hpbGROb2Rlcyk7XG4gICAgICAgIGRvbShuZXh0KS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgZG9tKGhpZ2hsaWdodCkubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBoaWdobGlnaHRpbmcgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIHZhbGlkIENTUyBjb2xvci5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgc2V0Q29sb3IoY29sb3IpIHtcbiAgICB0aGlzLm9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodGluZyBjb2xvci5cbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGhpZ2hsaWdodHMgZnJvbSBlbGVtZW50LiBJZiBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgaXQgaXMgcmVtb3ZlZCBhcyB3ZWxsLlxuICAgKiBJZiBubyBlbGVtZW50IGlzIGdpdmVuLCBhbGwgaGlnaGxpZ2h0cyBhbGwgcmVtb3ZlZC5cbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2VsZW1lbnRdIC0gZWxlbWVudCB0byByZW1vdmUgaGlnaGxpZ2h0cyBmcm9tXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIHJlbW92ZUhpZ2hsaWdodHMoZWxlbWVudCkge1xuICAgIHZhciBjb250YWluZXIgPSBlbGVtZW50IHx8IHRoaXMuZWwsXG4gICAgICBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKHsgY29udGFpbmVyOiBjb250YWluZXIgfSksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIC8qICAgICBmdW5jdGlvbiBtZXJnZVNpYmxpbmdzKG5vZGUpIHtcbiAgICAgIHZhciBwcmV2ID0gbm9kZS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgIG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuXG4gICAgICBpZiAobm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIGlmIChwcmV2ICYmIHByZXYubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHByZXYubm9kZVZhbHVlICsgbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0ICYmIG5leHQubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlICsgbmV4dC5ub2RlVmFsdWU7XG4gICAgICAgICAgZG9tKG5leHQpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldiAmJiBwcmV2LmNsYXNzTmFtZSA9PT0gbm9kZS5jbGFzc05hbWUpIHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHByZXYubm9kZVZhbHVlICsgbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgZG9tKHByZXYpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0ICYmIG5leHQuY2xhc3NOYW1lID09PSBub2RlLmNsYXNzTmFtZSkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWUgKyBuZXh0Lm5vZGVWYWx1ZTtcbiAgICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICovXG5cbiAgICBmdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoaGlnaGxpZ2h0KSB7XG4gICAgICBpZiAoaGlnaGxpZ2h0LmNsYXNzTmFtZSA9PT0gY29udGFpbmVyLmNsYXNzTmFtZSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS51bndyYXAoKTtcblxuICAgICAgICAvKiogIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIG1lcmdlU2libGluZ3Mobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgdHJ1ZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICAgIGlmIChzZWxmLm9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQoaGwpID09PSB0cnVlKSB7XG4gICAgICAgIHJlbW92ZUhpZ2hsaWdodChobCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBoaWdobGlnaHRzIGZyb20gZ2l2ZW4gY29udGFpbmVyLlxuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtwYXJhbXMuY29udGFpbmVyXSAtIHJldHVybiBoaWdobGlnaHRzIGZyb20gdGhpcyBlbGVtZW50LiBEZWZhdWx0OiB0aGUgZWxlbWVudCB0aGVcbiAgICogaGlnaGxpZ2h0ZXIgaXMgYXBwbGllZCB0by5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmFuZFNlbGZdIC0gaWYgc2V0IHRvIHRydWUgYW5kIGNvbnRhaW5lciBpcyBhIGhpZ2hsaWdodCBpdHNlbGYsIGFkZCBjb250YWluZXIgdG9cbiAgICogcmV0dXJuZWQgcmVzdWx0cy4gRGVmYXVsdDogdHJ1ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLmdyb3VwZWRdIC0gaWYgc2V0IHRvIHRydWUsIGhpZ2hsaWdodHMgYXJlIGdyb3VwZWQgaW4gbG9naWNhbCBncm91cHMgb2YgaGlnaGxpZ2h0cyBhZGRlZFxuICAgKiBpbiB0aGUgc2FtZSBtb21lbnQuIEVhY2ggZ3JvdXAgaXMgYW4gb2JqZWN0IHdoaWNoIGhhcyBnb3QgYXJyYXkgb2YgaGlnaGxpZ2h0cywgJ3RvU3RyaW5nJyBtZXRob2QgYW5kICd0aW1lc3RhbXAnXG4gICAqIHByb3BlcnR5LiBEZWZhdWx0OiBmYWxzZS5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGdldEhpZ2hsaWdodHMocGFyYW1zKSB7XG4gICAgcGFyYW1zID0ge1xuICAgICAgY29udGFpbmVyOiB0aGlzLmVsLFxuICAgICAgYW5kU2VsZjogdHJ1ZSxcbiAgICAgIGdyb3VwZWQ6IGZhbHNlLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfTtcblxuICAgIHZhciBub2RlTGlzdCA9IHBhcmFtcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIltcIiArIERBVEFfQVRUUiArIFwiXVwiKSxcbiAgICAgIGhpZ2hsaWdodHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG5cbiAgICBpZiAocGFyYW1zLmFuZFNlbGYgPT09IHRydWUgJiYgcGFyYW1zLmNvbnRhaW5lci5oYXNBdHRyaWJ1dGUoREFUQV9BVFRSKSkge1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKHBhcmFtcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMuZ3JvdXBlZCkge1xuICAgICAgaGlnaGxpZ2h0cyA9IGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCBUSU1FU1RBTVBfQVRUUik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQuXG4gICAqIEFsbCBoaWdobGlnaHRzIGhhdmUgJ2RhdGEtaGlnaGxpZ2h0ZWQnIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIGVsIC0gZWxlbWVudCB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGlzSGlnaGxpZ2h0KGVsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGVsICYmIGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVF9OT0RFICYmIGVsLmhhc0F0dHJpYnV0ZShEQVRBX0FUVFIpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0cygpIHtcbiAgICB2YXIgaGlnaGxpZ2h0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0cygpLFxuICAgICAgcmVmRWwgPSB0aGlzLmVsLFxuICAgICAgaGxEZXNjcmlwdG9ycyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFBhdGgoZWwsIHJlZkVsZW1lbnQpIHtcbiAgICAgIHZhciBwYXRoID0gW10sXG4gICAgICAgIGNoaWxkTm9kZXM7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLnBhcmVudE5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICAgIHBhdGgudW5zaGlmdChjaGlsZE5vZGVzLmluZGV4T2YoZWwpKTtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgfSB3aGlsZSAoZWwgIT09IHJlZkVsZW1lbnQgfHwgIWVsKTtcblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuXG4gICAgc29ydEJ5RGVwdGgoaGlnaGxpZ2h0cywgZmFsc2UpO1xuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgdmFyIG9mZnNldCA9IDAsIC8vIEhsIG9mZnNldCBmcm9tIHByZXZpb3VzIHNpYmxpbmcgd2l0aGluIHBhcmVudCBub2RlLlxuICAgICAgICBsZW5ndGggPSBoaWdobGlnaHQudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgICBobFBhdGggPSBnZXRFbGVtZW50UGF0aChoaWdobGlnaHQsIHJlZkVsKSxcbiAgICAgICAgd3JhcHBlciA9IGhpZ2hsaWdodC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIHdyYXBwZXIgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgICAgaWYgKFxuICAgICAgICBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nICYmXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICkge1xuICAgICAgICBvZmZzZXQgPSBoaWdobGlnaHQucHJldmlvdXNTaWJsaW5nLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaGxEZXNjcmlwdG9ycy5wdXNoKFtcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgaGlnaGxpZ2h0LnRleHRDb250ZW50LFxuICAgICAgICBobFBhdGguam9pbihcIjpcIiksXG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgbGVuZ3RoXG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShobERlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIGFsbCBoaWdobGlnaHRzIGluIHRoZSBlbGVtZW50IHRoZSBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHN0cmluZ2lmaWVkIEpTT04gd2l0aCBoaWdobGlnaHRzIGRlZmluaXRpb25cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgc2VyaWFsaXplSGlnaGxpZ2h0c0N1c3RvbShpZCkge1xuICAgIHZhciBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKCksXG4gICAgICByZWZFbCA9IHRoaXMuZWwsXG4gICAgICBobERlc2NyaXB0b3JzID0gW107XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCBmYWxzZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gaGlnaGxpZ2h0LnRleHRDb250ZW50Lmxlbmd0aCxcbiAgICAgICAgLy8gaGxQYXRoID0gZ2V0RWxlbWVudFBhdGgoaGlnaGxpZ2h0LCByZWZFbCksXG4gICAgICAgIG9mZnNldCA9IGdldEVsZW1lbnRPZmZzZXQoaGlnaGxpZ2h0LCByZWZFbCksIC8vIEhsIG9mZnNldCBmcm9tIHRoZSByb290IGVsZW1lbnQuXG4gICAgICAgIHdyYXBwZXIgPSBoaWdobGlnaHQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICB3cmFwcGVyLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICB3cmFwcGVyID0gd3JhcHBlci5vdXRlckhUTUw7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiSGlnaGxpZ2h0IHRleHQgb2Zmc2V0IGZyb20gcm9vdCBub2RlOiBcIiwgb2Zmc2V0KTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgd3JhcHBlci50b1N0cmluZygpLmluZGV4T2YoJHtpZH0pOmAsXG4gICAgICAgIHdyYXBwZXIudG9TdHJpbmcoKS5pbmRleE9mKGlkKVxuICAgICAgKTtcbiAgICAgIGlmICh3cmFwcGVyLnRvU3RyaW5nKCkuaW5kZXhPZihpZCkgPiAtMSkge1xuICAgICAgICBobERlc2NyaXB0b3JzLnB1c2goW3dyYXBwZXIsIGhpZ2hsaWdodC50ZXh0Q29udGVudCwgb2Zmc2V0LCBsZW5ndGhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShobERlc2NyaXB0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGN1c3RvbSBmb3JtIG9mIGhpZ2hsaWdodHMuXG4gICAqXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHNDdXN0b20oanNvbikge1xuICAgIHZhciBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbkN1c3RvbShobERlc2NyaXB0b3IpIHtcbiAgICAgIHZhciBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIG9mZnNldDogTnVtYmVyLnBhcnNlSW50KGhsRGVzY3JpcHRvclsyXSksXG4gICAgICAgICAgbGVuZ3RoOiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzNdKVxuICAgICAgICB9LFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodDtcblxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHNlbGYuZWw7XG4gICAgICBjb25zdCB7IG5vZGUsIG9mZnNldDogb2Zmc2V0V2l0aGluTm9kZSB9ID0gZmluZE5vZGVBbmRPZmZzZXQoXG4gICAgICAgIGhsLFxuICAgICAgICBwYXJlbnROb2RlXG4gICAgICApO1xuXG4gICAgICBobE5vZGUgPSBub2RlLnNwbGl0VGV4dChvZmZzZXRXaXRoaW5Ob2RlKTtcbiAgICAgIGhsTm9kZS5zcGxpdFRleHQoaGwubGVuZ3RoKTtcblxuICAgICAgaWYgKGhsTm9kZS5uZXh0U2libGluZyAmJiAhaGxOb2RlLm5leHRTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcgJiYgIWhsTm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaGlnaGxpZ2h0ID0gZG9tKGhsTm9kZSkud3JhcChkb20oKS5mcm9tSFRNTChobC53cmFwcGVyKVswXSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhpZ2hsaWdodDogXCIsIGhsRGVzY3JpcHRvcik7XG4gICAgICAgIGRlc2VyaWFsaXphdGlvbkZuQ3VzdG9tKGhsRGVzY3JpcHRvcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkNhbid0IGRlc2VyaWFsaXplIGhpZ2hsaWdodCBkZXNjcmlwdG9yLiBDYXVzZTogXCIgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gIH1cblxuICAvKipcbiAgICogRGVzZXJpYWxpemVzIGhpZ2hsaWdodHMuXG4gICAqIEB0aHJvd3MgZXhjZXB0aW9uIHdoZW4gY2FuJ3QgcGFyc2UgSlNPTiBvciBKU09OIGhhcyBpbnZhbGlkIHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb24gLSBKU09OIG9iamVjdCB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGRlc2VyaWFsaXplZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXNlcmlhbGl6ZUhpZ2hsaWdodHMoanNvbikge1xuICAgIHZhciBobERlc2NyaXB0b3JzLFxuICAgICAgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBoaWdobGlnaHRzO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBobERlc2NyaXB0b3JzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBcIkNhbid0IHBhcnNlIEpTT046IFwiICsgZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6YXRpb25GbihobERlc2NyaXB0b3IpIHtcbiAgICAgIHZhciBobCA9IHtcbiAgICAgICAgICB3cmFwcGVyOiBobERlc2NyaXB0b3JbMF0sXG4gICAgICAgICAgdGV4dDogaGxEZXNjcmlwdG9yWzFdLFxuICAgICAgICAgIHBhdGg6IGhsRGVzY3JpcHRvclsyXS5zcGxpdChcIjpcIiksXG4gICAgICAgICAgb2Zmc2V0OiBobERlc2NyaXB0b3JbM10sXG4gICAgICAgICAgbGVuZ3RoOiBobERlc2NyaXB0b3JbNF1cbiAgICAgICAgfSxcbiAgICAgICAgZWxJbmRleCA9IGhsLnBhdGgucG9wKCksXG4gICAgICAgIG5vZGUgPSBzZWxmLmVsLFxuICAgICAgICBobE5vZGUsXG4gICAgICAgIGhpZ2hsaWdodCxcbiAgICAgICAgaWR4O1xuXG4gICAgICB3aGlsZSAoKGlkeCA9IGhsLnBhdGguc2hpZnQoKSkpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tpZHhdO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4IC0gMV0gJiZcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXggLSAxXS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIGVsSW5kZXggLT0gMTtcbiAgICAgIH1cblxuICAgICAgbm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tlbEluZGV4XTtcbiAgICAgIGhsTm9kZSA9IG5vZGUuc3BsaXRUZXh0KGhsLm9mZnNldCk7XG4gICAgICBobE5vZGUuc3BsaXRUZXh0KGhsLmxlbmd0aCk7XG5cbiAgICAgIGlmIChobE5vZGUubmV4dFNpYmxpbmcgJiYgIWhsTm9kZS5uZXh0U2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5uZXh0U2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChobE5vZGUucHJldmlvdXNTaWJsaW5nICYmICFobE5vZGUucHJldmlvdXNTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLnByZXZpb3VzU2libGluZykucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIGhpZ2hsaWdodCA9IGRvbShobE5vZGUpLndyYXAoZG9tKCkuZnJvbUhUTUwoaGwud3JhcHBlcilbMF0pO1xuICAgICAgaGlnaGxpZ2h0cy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgfVxuXG4gICAgaGxEZXNjcmlwdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGhsRGVzY3JpcHRvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVzZXJpYWxpemF0aW9uRm4oaGxEZXNjcmlwdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZGVzZXJpYWxpemUgaGlnaGxpZ2h0IGRlc2NyaXB0b3IuIENhdXNlOiBcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgaGlnaGxpZ2h0cyBnaXZlbiB0ZXh0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRleHQgdG8gc2VhcmNoIGZvclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjYXNlU2Vuc2l0aXZlXSAtIGlmIHNldCB0byB0cnVlLCBwZXJmb3JtcyBjYXNlIHNlbnNpdGl2ZSBzZWFyY2ggKGRlZmF1bHQ6IHRydWUpXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGZpbmQodGV4dCwgY2FzZVNlbnNpdGl2ZSkge1xuICAgIHZhciB3bmQgPSBkb20odGhpcy5lbCkuZ2V0V2luZG93KCksXG4gICAgICBzY3JvbGxYID0gd25kLnNjcm9sbFgsXG4gICAgICBzY3JvbGxZID0gd25kLnNjcm9sbFksXG4gICAgICBjYXNlU2VucyA9IHR5cGVvZiBjYXNlU2Vuc2l0aXZlID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IGNhc2VTZW5zaXRpdmU7XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG5cbiAgICBpZiAod25kLmZpbmQpIHtcbiAgICAgIHdoaWxlICh3bmQuZmluZCh0ZXh0LCBjYXNlU2VucykpIHtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHduZC5kb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSkge1xuICAgICAgdmFyIHRleHRSYW5nZSA9IHduZC5kb2N1bWVudC5ib2R5LmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgdGV4dFJhbmdlLm1vdmVUb0VsZW1lbnRUZXh0KHRoaXMuZWwpO1xuICAgICAgd2hpbGUgKHRleHRSYW5nZS5maW5kVGV4dCh0ZXh0LCAxLCBjYXNlU2VucyA/IDQgOiAwKSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWRvbSh0aGlzLmVsKS5jb250YWlucyh0ZXh0UmFuZ2UucGFyZW50RWxlbWVudCgpKSAmJlxuICAgICAgICAgIHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkgIT09IHRoaXMuZWxcbiAgICAgICAgKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0UmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgIHRoaXMuZG9IaWdobGlnaHQodHJ1ZSk7XG4gICAgICAgIHRleHRSYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9tKHRoaXMuZWwpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHduZC5zY3JvbGxUbyhzY3JvbGxYLCBzY3JvbGxZKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZXh0SGlnaGxpZ2h0ZXI7XG4iLCIvKipcbiAqIFJldHVybnMgYXJyYXkgd2l0aG91dCBkdXBsaWNhdGVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlKGFycikge1xuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbih2YWx1ZSwgaWR4LCBzZWxmKSB7XG4gICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGlkeDtcbiAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgTk9ERV9UWVBFID0geyBFTEVNRU5UX05PREU6IDEsIFRFWFRfTk9ERTogMyB9O1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb25zIHRvIG1ha2UgRE9NIG1hbmlwdWxhdGlvbiBlYXNpZXIuXG4gKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IFtlbF0gLSBiYXNlIERPTSBlbGVtZW50IHRvIG1hbmlwdWxhdGVcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cbmNvbnN0IGRvbSA9IGZ1bmN0aW9uKGVsKSB7XG4gIHJldHVybiAvKiogQGxlbmRzIGRvbSAqKi8ge1xuICAgIC8qKlxuICAgICAqIEFkZHMgY2xhc3MgdG8gZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc05hbWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgY2xhc3MgZnJvbSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoXCIoXnxcXFxcYilcIiArIGNsYXNzTmFtZSArIFwiKFxcXFxifCQpXCIsIFwiZ2lcIiksXG4gICAgICAgICAgXCIgXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJlcGVuZHMgY2hpbGQgbm9kZXMgdG8gYmFzZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7Tm9kZVtdfSBub2Rlc1RvUHJlcGVuZFxuICAgICAqL1xuICAgIHByZXBlbmQ6IGZ1bmN0aW9uKG5vZGVzVG9QcmVwZW5kKSB7XG4gICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2Rlc1RvUHJlcGVuZCksXG4gICAgICAgIGkgPSBub2Rlcy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgZWwuaW5zZXJ0QmVmb3JlKG5vZGVzW2ldLCBlbC5maXJzdENoaWxkKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9BcHBlbmRcbiAgICAgKi9cbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKG5vZGVzVG9BcHBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9BcHBlbmQpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbm9kZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZXNbaV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIGJhc2UgZWxlbWVudCBhZnRlciByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBhZnRlciB3aGljaCBiYXNlIGVsZW1lbnQgd2lsbCBiZSBpbnNlcnRlZFxuICAgICAqIEByZXR1cm5zIHtOb2RlfSAtIGluc2VydGVkIGVsZW1lbnRcbiAgICAgKi9cbiAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24ocmVmRWwpIHtcbiAgICAgIHJldHVybiByZWZFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmRWwubmV4dFNpYmxpbmcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIGJhc2UgZWxlbWVudCBiZWZvcmUgcmVmRWwuXG4gICAgICogQHBhcmFtIHtOb2RlfSByZWZFbCAtIG5vZGUgYmVmb3JlIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24ocmVmRWwpIHtcbiAgICAgIHJldHVybiByZWZFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgcmVmRWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGJhc2UgZWxlbWVudCBmcm9tIERPTS5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICBlbCA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiBiYXNlIGVsZW1lbnQgY29udGFpbnMgZ2l2ZW4gY2hpbGQuXG4gICAgICogQHBhcmFtIHtOb2RlfEhUTUxFbGVtZW50fSBjaGlsZFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNvbnRhaW5zOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGVsICE9PSBjaGlsZCAmJiBlbC5jb250YWlucyhjaGlsZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGJhc2UgZWxlbWVudCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gd3JhcHBlciBlbGVtZW50XG4gICAgICovXG4gICAgd3JhcDogZnVuY3Rpb24od3JhcHBlcikge1xuICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgZWwpO1xuICAgICAgfVxuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbndyYXBzIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7Tm9kZVtdfSAtIGNoaWxkIG5vZGVzIG9mIHVud3JhcHBlZCBlbGVtZW50LlxuICAgICAqL1xuICAgIHVud3JhcDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbC5jaGlsZE5vZGVzKSxcbiAgICAgICAgd3JhcHBlcjtcblxuICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHdyYXBwZXIgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgIGRvbShub2RlKS5pbnNlcnRCZWZvcmUobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIH0pO1xuICAgICAgZG9tKHdyYXBwZXIpLnJlbW92ZSgpO1xuXG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYXJyYXkgb2YgYmFzZSBlbGVtZW50IHBhcmVudHMuXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAgICovXG4gICAgcGFyZW50czogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGFyZW50LFxuICAgICAgICBwYXRoID0gW107XG5cbiAgICAgIHdoaWxlICgocGFyZW50ID0gZWwucGFyZW50Tm9kZSkpIHtcbiAgICAgICAgcGF0aC5wdXNoKHBhcmVudCk7XG4gICAgICAgIGVsID0gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cywgZXhjbHVkaW5nIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzV2l0aG91dERvY3VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudHMoKS5maWx0ZXIoZWxlbSA9PiBlbGVtICE9PSBkb2N1bWVudCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gYmFzZSBlbGVtZW50LCBpZS4gbWVyZ2VzIHNpYmxpbmcgdGV4dCBub2RlcyBhbmQgYXNzdXJlcyB0aGF0IGV2ZXJ5XG4gICAgICogZWxlbWVudCBub2RlIGhhcyBvbmx5IG9uZSB0ZXh0IG5vZGUuXG4gICAgICogSXQgc2hvdWxkIGRvZXMgdGhlIHNhbWUgYXMgc3RhbmRhcmQgZWxlbWVudC5ub3JtYWxpemUsIGJ1dCBJRSBpbXBsZW1lbnRzIGl0IGluY29ycmVjdGx5LlxuICAgICAqL1xuICAgIG5vcm1hbGl6ZVRleHROb2RlczogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICBlbC5uZXh0U2libGluZyAmJlxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICAgICkge1xuICAgICAgICAgIGVsLm5vZGVWYWx1ZSArPSBlbC5uZXh0U2libGluZy5ub2RlVmFsdWU7XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbC5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbShlbC5maXJzdENoaWxkKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICAgIH1cbiAgICAgIGRvbShlbC5uZXh0U2libGluZykubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZWxlbWVudCBiYWNrZ3JvdW5kIGNvbG9yLlxuICAgICAqIEByZXR1cm5zIHtDU1NTdHlsZURlY2xhcmF0aW9uLmJhY2tncm91bmRDb2xvcn1cbiAgICAgKi9cbiAgICBjb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGRvbSBlbGVtZW50IGZyb20gZ2l2ZW4gaHRtbCBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcbiAgICAgKiBAcmV0dXJucyB7Tm9kZUxpc3R9XG4gICAgICovXG4gICAgZnJvbUhUTUw6IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICByZXR1cm4gZGl2LmNoaWxkTm9kZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZmlyc3QgcmFuZ2Ugb2YgdGhlIHdpbmRvdyBvZiBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1JhbmdlfVxuICAgICAqL1xuICAgIGdldFJhbmdlOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzZWxlY3Rpb24gPSBkb20oZWwpLmdldFNlbGVjdGlvbigpLFxuICAgICAgICByYW5nZTtcblxuICAgICAgaWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xuICAgICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHJhbmdlcyBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKi9cbiAgICByZW1vdmVBbGxSYW5nZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgc2VsZWN0aW9uIG9iamVjdCBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7U2VsZWN0aW9ufVxuICAgICAqL1xuICAgIGdldFNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZG9tKGVsKVxuICAgICAgICAuZ2V0V2luZG93KClcbiAgICAgICAgLmdldFNlbGVjdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdpbmRvdyBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtXaW5kb3d9XG4gICAgICovXG4gICAgZ2V0V2luZG93OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpLmdldERvY3VtZW50KCkuZGVmYXVsdFZpZXc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgZG9jdW1lbnQgb2YgdGhlIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTERvY3VtZW50fVxuICAgICAqL1xuICAgIGdldERvY3VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGlmIG93bmVyRG9jdW1lbnQgaXMgbnVsbCB0aGVuIGVsIGlzIHRoZSBkb2N1bWVudCBpdHNlbGYuXG4gICAgICByZXR1cm4gZWwub3duZXJEb2N1bWVudCB8fCBlbDtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb207XG4iLCJleHBvcnQgZnVuY3Rpb24gYmluZEV2ZW50cyhlbCwgc2NvcGUpIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYmluZEV2ZW50cyhlbCwgc2NvcGUpIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgc2NvcGUuaGlnaGxpZ2h0SGFuZGxlci5iaW5kKHNjb3BlKSk7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbn1cbiIsImltcG9ydCBkb20sIHsgTk9ERV9UWVBFIH0gZnJvbSBcIi4vZG9tXCI7XG5cbi8qKlxuICogVGFrZXMgcmFuZ2Ugb2JqZWN0IGFzIHBhcmFtZXRlciBhbmQgcmVmaW5lcyBpdCBib3VuZGFyaWVzXG4gKiBAcGFyYW0gcmFuZ2VcbiAqIEByZXR1cm5zIHtvYmplY3R9IHJlZmluZWQgYm91bmRhcmllcyBhbmQgaW5pdGlhbCBzdGF0ZSBvZiBoaWdobGlnaHRpbmcgYWxnb3JpdGhtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmaW5lUmFuZ2VCb3VuZGFyaWVzKHJhbmdlKSB7XG4gIHZhciBzdGFydENvbnRhaW5lciA9IHJhbmdlLnN0YXJ0Q29udGFpbmVyLFxuICAgIGVuZENvbnRhaW5lciA9IHJhbmdlLmVuZENvbnRhaW5lcixcbiAgICBhbmNlc3RvciA9IHJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyLFxuICAgIGdvRGVlcGVyID0gdHJ1ZTtcblxuICBpZiAocmFuZ2UuZW5kT2Zmc2V0ID09PSAwKSB7XG4gICAgd2hpbGUgKFxuICAgICAgIWVuZENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgIGVuZENvbnRhaW5lci5wYXJlbnROb2RlICE9PSBhbmNlc3RvclxuICAgICkge1xuICAgICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmc7XG4gIH0gZWxzZSBpZiAoZW5kQ29udGFpbmVyLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgaWYgKHJhbmdlLmVuZE9mZnNldCA8IGVuZENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoKSB7XG4gICAgICBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHJhbmdlLmVuZE9mZnNldCA+IDApIHtcbiAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLmVuZE9mZnNldCAtIDEpO1xuICB9XG5cbiAgaWYgKHN0YXJ0Q29udGFpbmVyLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgaWYgKHJhbmdlLnN0YXJ0T2Zmc2V0ID09PSBzdGFydENvbnRhaW5lci5ub2RlVmFsdWUubGVuZ3RoKSB7XG4gICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPiAwKSB7XG4gICAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldCk7XG4gICAgICBpZiAoZW5kQ29udGFpbmVyID09PSBzdGFydENvbnRhaW5lci5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgZW5kQ29udGFpbmVyID0gc3RhcnRDb250YWluZXI7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHJhbmdlLnN0YXJ0T2Zmc2V0IDwgc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLmNoaWxkTm9kZXMuaXRlbShyYW5nZS5zdGFydE9mZnNldCk7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnRDb250YWluZXIgPSBzdGFydENvbnRhaW5lci5uZXh0U2libGluZztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRDb250YWluZXI6IHN0YXJ0Q29udGFpbmVyLFxuICAgIGVuZENvbnRhaW5lcjogZW5kQ29udGFpbmVyLFxuICAgIGdvRGVlcGVyOiBnb0RlZXBlclxuICB9O1xufVxuXG4vKipcbiAqIFNvcnRzIGFycmF5IG9mIERPTSBlbGVtZW50cyBieSBpdHMgZGVwdGggaW4gRE9NIHRyZWUuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IGFyciAtIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRlc2NlbmRpbmcgLSBvcmRlciBvZiBzb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydEJ5RGVwdGgoYXJyLCBkZXNjZW5kaW5nKSB7XG4gIGFyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZG9tKGRlc2NlbmRpbmcgPyBiIDogYSkucGFyZW50cygpLmxlbmd0aCAtXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGEgOiBiKS5wYXJlbnRzKCkubGVuZ3RoXG4gICAgKTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGVsZW1lbnRzIGEgaSBiIGhhdmUgdGhlIHNhbWUgY29sb3IuXG4gKiBAcGFyYW0ge05vZGV9IGFcbiAqIEBwYXJhbSB7Tm9kZX0gYlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXZlU2FtZUNvbG9yKGEsIGIpIHtcbiAgcmV0dXJuIGRvbShhKS5jb2xvcigpID09PSBkb20oYikuY29sb3IoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHdyYXBwZXIgZm9yIGhpZ2hsaWdodHMuXG4gKiBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgY2FsbHMgdGhpcyBtZXRob2QgZWFjaCB0aW1lIGl0IG5lZWRzIHRvIGNyZWF0ZSBoaWdobGlnaHRzIGFuZCBwYXNzIG9wdGlvbnMgcmV0cmlldmVkXG4gKiBpbiBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gdGhlIHNhbWUgb2JqZWN0IGFzIGluIFRleHRIaWdobGlnaHRlciBjb25zdHJ1Y3Rvci5cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIob3B0aW9ucykge1xuICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBzcGFuLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gIHNwYW4uY2xhc3NOYW1lID0gb3B0aW9ucy5oaWdobGlnaHRlZENsYXNzO1xuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24oZWxlbWVudCwgbG9jYXRpb25JbkNoaWxkTm9kZXMpIHtcbiAgY29uc29sZS5sb2coXCJFbGVtZW50IGFzIHBhcmFtZXRlcjogXCIsIGVsZW1lbnQpO1xuICB2YXIgdGV4dE5vZGVFbGVtZW50ID0gZWxlbWVudDtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAodGV4dE5vZGVFbGVtZW50ICYmIHRleHROb2RlRWxlbWVudC5ub2RlVHlwZSAhPT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgIGNvbnNvbGUubG9nKGB0ZXh0Tm9kZUVsZW1lbnQgc3RlcCAke2l9YCwgdGV4dE5vZGVFbGVtZW50KTtcbiAgICBpZiAobG9jYXRpb25JbkNoaWxkTm9kZXMgPT09IFwic3RhcnRcIikge1xuICAgICAgaWYgKHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQubmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJlbmRcIikge1xuICAgICAgaWYgKHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGxhc3RJbmRleCA9IHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5jaGlsZE5vZGVzW2xhc3RJbmRleF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQucHJldmlvdXNTaWJsaW5nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICBpKys7XG4gIH1cblxuICBjb25zb2xlLmxvZyhcInRleHQgbm9kZSBlbGVtZW50IHJldHVybmVkOiBcIiwgdGV4dE5vZGVFbGVtZW50KTtcbiAgcmV0dXJuIHRleHROb2RlRWxlbWVudDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hlcmUgdG8gaW5qZWN0IGEgaGlnaGxpZ2h0IGJhc2VkIG9uIGl0J3Mgb2Zmc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gaGlnaGxpZ2h0XG4gKiBAcGFyYW0geyp9IHBhcmVudE5vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmROb2RlQW5kT2Zmc2V0KGhpZ2hsaWdodCwgcGFyZW50Tm9kZSkge1xuICBsZXQgY3VycmVudE5vZGUgPSBwYXJlbnROb2RlO1xuICBsZXQgY3VycmVudE9mZnNldCA9IDA7XG4gIGxldCBvZmZzZXRXaXRoaW5Ob2RlID0gMDtcbiAgbGV0IGxvY2F0aW9uRm91bmQgPSBmYWxzZTtcblxuICB3aGlsZSAoXG4gICAgY3VycmVudE5vZGUgJiZcbiAgICAhbG9jYXRpb25Gb3VuZCAmJlxuICAgIChjdXJyZW50T2Zmc2V0IDwgaGlnaGxpZ2h0Lm9mZnNldCB8fFxuICAgICAgKGN1cnJlbnRPZmZzZXQgPT09IGhpZ2hsaWdodC5vZmZzZXQgJiYgY3VycmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSlcbiAgKSB7XG4gICAgY29uc3QgZW5kT2ZOb2RlT2Zmc2V0ID0gY3VycmVudE9mZnNldCArIGN1cnJlbnROb2RlLnRleHRDb250ZW50Lmxlbmd0aDtcblxuICAgIGlmIChlbmRPZk5vZGVPZmZzZXQgPiBoaWdobGlnaHQub2Zmc2V0KSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgb2Zmc2V0V2l0aGluTm9kZSA9IGhpZ2hsaWdodC5vZmZzZXQgLSBjdXJyZW50T2Zmc2V0O1xuICAgICAgICBsb2NhdGlvbkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudE9mZnNldCA9IGN1cnJlbnRPZmZzZXQgKyBvZmZzZXRXaXRoaW5Ob2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50T2Zmc2V0ID0gZW5kT2ZOb2RlT2Zmc2V0O1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBub2RlOiBjdXJyZW50Tm9kZSwgb2Zmc2V0OiBvZmZzZXRXaXRoaW5Ob2RlIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50T2Zmc2V0KGNoaWxkRWxlbWVudCwgcm9vdEVsZW1lbnQpIHtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGxldCBjaGlsZE5vZGVzO1xuXG4gIGxldCBjdXJyZW50RWxlbWVudCA9IGNoaWxkRWxlbWVudDtcbiAgbGV0IGxldmVsID0gMTtcbiAgZG8ge1xuICAgIGNoaWxkTm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgIGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2Rlc1xuICAgICk7XG4gICAgY29uc3QgY2hpbGRFbGVtZW50SW5kZXggPSBjaGlsZE5vZGVzLmluZGV4T2YoY3VycmVudEVsZW1lbnQpO1xuICAgIGNvbnN0IG9mZnNldEluQ3VycmVudFBhcmVudCA9IGdldFRleHRPZmZzZXRCZWZvcmUoXG4gICAgICBjaGlsZE5vZGVzLFxuICAgICAgY2hpbGRFbGVtZW50SW5kZXhcbiAgICApO1xuICAgIG9mZnNldCArPSBvZmZzZXRJbkN1cnJlbnRQYXJlbnQ7XG4gICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnROb2RlO1xuICAgIGxldmVsICs9IDE7XG4gIH0gd2hpbGUgKGN1cnJlbnRFbGVtZW50ICE9PSByb290RWxlbWVudCB8fCAhY3VycmVudEVsZW1lbnQpO1xuXG4gIHJldHVybiBvZmZzZXQ7XG59XG5cbmZ1bmN0aW9uIGdldFRleHRPZmZzZXRCZWZvcmUoY2hpbGROb2RlcywgY3V0SW5kZXgpIHtcbiAgbGV0IHRleHRPZmZzZXQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1dEluZGV4OyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZXNbaV07XG4gICAgLy8gVXNlIHRleHRDb250ZW50IGFuZCBub3QgaW5uZXJIVE1MIHRvIGFjY291bnQgZm9yIGludmlzaWJsZSBjaGFyYWN0ZXJzIGFzIHdlbGwuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvdGV4dENvbnRlbnRcbiAgICBjb25zdCB0ZXh0ID0gY3VycmVudE5vZGUudGV4dENvbnRlbnQ7XG4gICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICB0ZXh0T2Zmc2V0ICs9IHRleHQubGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGV4dE9mZnNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRGaXJzdE5vblNoYXJlZFBhcmVudChlbGVtZW50cykge1xuICB2YXIgY2hpbGRFbGVtZW50ID0gZWxlbWVudHMuY2hpbGRFbGVtZW50O1xuICB2YXIgb3RoZXJFbGVtZW50ID0gZWxlbWVudHMub3RoZXJFbGVtZW50O1xuICB2YXIgcGFyZW50cyA9IGRvbShjaGlsZEVsZW1lbnQpLnBhcmVudHNXaXRob3V0RG9jdW1lbnQoKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBudWxsO1xuICB3aGlsZSAoIWZpcnN0Tm9uU2hhcmVkUGFyZW50ICYmIGkgPCBwYXJlbnRzLmxlbmd0aCkge1xuICAgIHZhciBjdXJyZW50UGFyZW50ID0gcGFyZW50c1tpXTtcblxuICAgIGlmIChjdXJyZW50UGFyZW50LmNvbnRhaW5zKG90aGVyRWxlbWVudCkgJiYgaSA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudFBhcmVudCBjb250YWlucyBvdGhlciBlbGVtZW50IVwiLCBjdXJyZW50UGFyZW50KTtcbiAgICAgIGZpcnN0Tm9uU2hhcmVkUGFyZW50ID0gcGFyZW50c1tpIC0gMV07XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIHJldHVybiBmaXJzdE5vblNoYXJlZFBhcmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodChwYXJhbXMpIHtcbiAgdmFyIGVsZW1lbnQgPSBwYXJhbXMuZWxlbWVudDtcbiAgdmFyIGVsZW1lbnRBbmNlc3RvciA9IHBhcmFtcy5lbGVtZW50QW5jZXN0b3I7XG4gIHZhciBvcHRpb25zID0gcGFyYW1zLm9wdGlvbnM7XG4gIHZhciBsb2NhdGlvbkluU2VsZWN0aW9uID0gcGFyYW1zLmxvY2F0aW9uSW5TZWxlY3Rpb247XG5cbiAgdmFyIGVsZW1lbnRBbmNlc3RvckNvcHkgPSBlbGVtZW50QW5jZXN0b3IuY2xvbmVOb2RlKHRydWUpO1xuXG4gIC8vIEJlZ2lubmluZyBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIGVuZCBjb250YWluZXIgaW4gc2VsZWN0aW9uXG4gIC8vIGFuZCBlbmQgb2YgY2hpbGROb2RlcyBsaXN0IGZvciBzdGFydCBjb250YWluZXIgaW4gc2VsZWN0aW9uLlxuICB2YXIgbG9jYXRpb25JbkNoaWxkTm9kZXMgPSBsb2NhdGlvbkluU2VsZWN0aW9uID09PSBcInN0YXJ0XCIgPyBcImVuZFwiIDogXCJzdGFydFwiO1xuICB2YXIgZWxlbWVudENvcHkgPSBmaW5kVGV4dE5vZGVBdExvY2F0aW9uKFxuICAgIGVsZW1lbnRBbmNlc3RvckNvcHksXG4gICAgbG9jYXRpb25JbkNoaWxkTm9kZXNcbiAgKTtcbiAgdmFyIGVsZW1lbnRDb3B5UGFyZW50ID0gZWxlbWVudENvcHkucGFyZW50Tm9kZTtcblxuICB2YXIgc2libGluZyA9IGVsZW1lbnRDb3B5Lm5leHRTaWJsaW5nO1xuICB3aGlsZSAoc2libGluZykge1xuICAgIGVsZW1lbnRDb3B5UGFyZW50LnJlbW92ZUNoaWxkKHNpYmxpbmcpO1xuICAgIHNpYmxpbmcgPSBlbGVtZW50Q29weS5uZXh0U2libGluZztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHk6IFwiLCBlbGVtZW50Q29weSk7XG4gIGNvbnNvbGUubG9nKFwiZWxlbWVudENvcHlQYXJlbnQ6IFwiLCBlbGVtZW50Q29weVBhcmVudCk7XG5cbiAgLy8gQ2xlYW4gb3V0IGFueSBuZXN0ZWQgaGlnaGxpZ2h0IHdyYXBwZXJzLlxuICBpZiAoXG4gICAgZWxlbWVudENvcHlQYXJlbnQgIT09IGVsZW1lbnRBbmNlc3RvckNvcHkgJiZcbiAgICBlbGVtZW50Q29weVBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMob3B0aW9ucy5oaWdobGlnaHRlZENsYXNzKVxuICApIHtcbiAgICBkb20oZWxlbWVudENvcHlQYXJlbnQpLnVud3JhcCgpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHRoZSB0ZXh0IG5vZGUgdGhhdCB3ZSBuZWVkIGZvciB0aGUgbmV3IGhpZ2hsaWdodFxuICAvLyBmcm9tIHRoZSBleGlzdGluZyBoaWdobGlnaHQgb3Igb3RoZXIgZWxlbWVudC5cbiAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuXG4gIHJldHVybiBlbGVtZW50QW5jZXN0b3JDb3B5O1xufVxuXG4vKipcbiAqIEdyb3VwcyBnaXZlbiBoaWdobGlnaHRzIGJ5IHRpbWVzdGFtcC5cbiAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHNcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBBdHRyXG4gKiBAcmV0dXJucyB7QXJyYXl9IEdyb3VwZWQgaGlnaGxpZ2h0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwSGlnaGxpZ2h0cyhoaWdobGlnaHRzLCB0aW1lc3RhbXBBdHRyKSB7XG4gIHZhciBvcmRlciA9IFtdLFxuICAgIGNodW5rcyA9IHt9LFxuICAgIGdyb3VwZWQgPSBbXTtcblxuICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGwpIHtcbiAgICB2YXIgdGltZXN0YW1wID0gaGwuZ2V0QXR0cmlidXRlKHRpbWVzdGFtcEF0dHIpO1xuXG4gICAgaWYgKHR5cGVvZiBjaHVua3NbdGltZXN0YW1wXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgY2h1bmtzW3RpbWVzdGFtcF0gPSBbXTtcbiAgICAgIG9yZGVyLnB1c2godGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBjaHVua3NbdGltZXN0YW1wXS5wdXNoKGhsKTtcbiAgfSk7XG5cbiAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICB2YXIgZ3JvdXAgPSBjaHVua3NbdGltZXN0YW1wXTtcblxuICAgIGdyb3VwZWQucHVzaCh7XG4gICAgICBjaHVua3M6IGdyb3VwLFxuICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXAsXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBncm91cFxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oaCkge1xuICAgICAgICAgICAgcmV0dXJuIGgudGV4dENvbnRlbnQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbihcIlwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGdyb3VwZWQ7XG59XG4iXX0=
