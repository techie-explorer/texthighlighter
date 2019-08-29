(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./jquery-plugin":2,"./text-highlighter":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
        let prev = node.previousSibling,
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

},{"./utils/arrays":4,"./utils/dom":5,"./utils/events":6,"./utils/highlights":7}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./dom":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2xvYmFsLXNjcmlwdC5qcyIsInNyYy9qcXVlcnktcGx1Z2luLmpzIiwic3JjL3RleHQtaGlnaGxpZ2h0ZXIuanMiLCJzcmMvdXRpbHMvYXJyYXlzLmpzIiwic3JjL3V0aWxzL2RvbS5qcyIsInNyYy91dGlscy9ldmVudHMuanMiLCJzcmMvdXRpbHMvaGlnaGxpZ2h0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBOztBQVlBOzs7O0FBVkE7Ozs7QUFJQSxNQUFNLENBQUMsZUFBUCxHQUF5QiwyQkFBekI7QUFFQTs7Ozs7Ozs7OztBQ1JBO0FBRUEsSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsR0FBQyxVQUFTLENBQVQsRUFBWTtBQUNYOztBQUVBLFFBQU0sV0FBVyxHQUFHLGlCQUFwQjs7QUFFQSxhQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLE9BQWxCLEVBQTJCO0FBQ3pCLGFBQU8sWUFBVztBQUNoQixRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYixFQUFtQixFQUFuQjtBQUNELE9BRkQ7QUFHRDtBQUVEOzs7Ozs7QUFNQTs7Ozs7Ozs7O0FBT0EsSUFBQSxDQUFDLENBQUMsRUFBRixDQUFLLGVBQUwsR0FBdUIsVUFBUyxPQUFULEVBQWtCO0FBQ3ZDLGFBQU8sS0FBSyxJQUFMLENBQVUsWUFBVztBQUMxQixZQUFJLEVBQUUsR0FBRyxJQUFUO0FBQUEsWUFDRSxFQURGOztBQUdBLFlBQUksQ0FBQyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsRUFBVyxXQUFYLENBQUwsRUFBOEI7QUFDNUIsVUFBQSxFQUFFLEdBQUcsSUFBSSxlQUFKLENBQW9CLEVBQXBCLEVBQXdCLE9BQXhCLENBQUw7QUFFQSxVQUFBLEVBQUUsQ0FBQyxPQUFILEdBQWEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFKLEVBQWEsVUFBUyxPQUFULEVBQWtC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QSxNQUFNLEVBQUUsS0FERztBQUVYLE1BQUEsU0FBUyxFQUFFLFNBRkE7QUFHWCxNQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixlQUFPLEtBQUssQ0FDVCxHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFDLENBQUMsV0FBVDtBQUNELFNBSEksRUFJSixJQUpJLENBSUMsRUFKRCxDQUFQO0FBS0Q7QUFUVSxLQUFiO0FBV0QsR0FkRDtBQWdCQSxTQUFPLE9BQVA7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBUZXh0SGlnaGxpZ2h0ZXIgZnJvbSBcIi4vdGV4dC1oaWdobGlnaHRlclwiO1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgVGV4dEhpZ2hsaWdodGVyIGNsYXNzIGdsb2JhbGx5IHRvIGJlXG4gKiB1c2VkIGluIGRlbW9zIGFuZCB0byBiZSBpbmplY3RlZCBkaXJlY3RseSBpbnRvIGh0bWwgZmlsZXMuXG4gKi9cbmdsb2JhbC5UZXh0SGlnaGxpZ2h0ZXIgPSBUZXh0SGlnaGxpZ2h0ZXI7XG5cbi8qKlxuICogTG9hZCB0aGUganF1ZXJ5IHBsdWdpbiBnbG9iYWxseSBleHBlY3RpbmcgalF1ZXJ5IGFuZCBUZXh0SGlnaGxpZ2h0ZXIgdG8gYmUgZ2xvYmFsbHlcbiAqIGF2YWlhYmxlLCB0aGlzIG1lYW5zIHRoaXMgbGlicmFyeSBkb2Vzbid0IG5lZWQgYSBoYXJkIHJlcXVpcmVtZW50IG9mIGpRdWVyeS5cbiAqL1xuaW1wb3J0IFwiLi9qcXVlcnktcGx1Z2luXCI7XG4iLCIvKiBnbG9iYWwgalF1ZXJ5IFRleHRIaWdobGlnaHRlciAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAoZnVuY3Rpb24oJCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3QgUExVR0lOX05BTUUgPSBcInRleHRIaWdobGlnaHRlclwiO1xuXG4gICAgZnVuY3Rpb24gd3JhcChmbiwgd3JhcHBlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB3cmFwcGVyLmNhbGwodGhpcywgZm4pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgalF1ZXJ5IHBsdWdpbiBuYW1lc3BhY2UuXG4gICAgICogQGV4dGVybmFsIFwialF1ZXJ5LmZuXCJcbiAgICAgKiBAc2VlIHtAbGluayBodHRwOi8vZG9jcy5qcXVlcnkuY29tL1BsdWdpbnMvQXV0aG9yaW5nIFRoZSBqUXVlcnkgUGx1Z2luIEd1aWRlfVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGFwcGxpZXMgaXQgdG8gdGhlIGdpdmVuIGpRdWVyeSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgU2FtZSBhcyB7QGxpbmsgVGV4dEhpZ2hsaWdodGVyfSBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtqUXVlcnl9XG4gICAgICogQGV4YW1wbGUgJCgnI3NhbmRib3gnKS50ZXh0SGlnaGxpZ2h0ZXIoeyBjb2xvcjogJ3JlZCcgfSk7XG4gICAgICogQGZ1bmN0aW9uIGV4dGVybmFsOlwialF1ZXJ5LmZuXCIudGV4dEhpZ2hsaWdodGVyXG4gICAgICovXG4gICAgJC5mbi50ZXh0SGlnaGxpZ2h0ZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZWwgPSB0aGlzLFxuICAgICAgICAgIGhsO1xuXG4gICAgICAgIGlmICghJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSkpIHtcbiAgICAgICAgICBobCA9IG5ldyBUZXh0SGlnaGxpZ2h0ZXIoZWwsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgaGwuZGVzdHJveSA9IHdyYXAoaGwuZGVzdHJveSwgZnVuY3Rpb24oZGVzdHJveSkge1xuICAgICAgICAgICAgZGVzdHJveS5jYWxsKGhsKTtcbiAgICAgICAgICAgICQoZWwpLnJlbW92ZURhdGEoUExVR0lOX05BTUUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJC5kYXRhKGVsLCBQTFVHSU5fTkFNRSwgaGwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5mbi5nZXRIaWdobGlnaHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YShQTFVHSU5fTkFNRSk7XG4gICAgfTtcbiAgfSkoalF1ZXJ5KTtcbn1cbiIsImltcG9ydCBkb20sIHsgTk9ERV9UWVBFIH0gZnJvbSBcIi4vdXRpbHMvZG9tXCI7XG5pbXBvcnQgeyBiaW5kRXZlbnRzLCB1bmJpbmRFdmVudHMgfSBmcm9tIFwiLi91dGlscy9ldmVudHNcIjtcbmltcG9ydCB7XG4gIHJlZmluZVJhbmdlQm91bmRhcmllcyxcbiAgc29ydEJ5RGVwdGgsXG4gIGhhdmVTYW1lQ29sb3IsXG4gIGdyb3VwSGlnaGxpZ2h0cyxcbiAgY3JlYXRlV3JhcHBlcixcbiAgZ2V0RWxlbWVudE9mZnNldCxcbiAgZmluZFRleHROb2RlQXRMb2NhdGlvbixcbiAgZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50LFxuICBleHRyYWN0RWxlbWVudENvbnRlbnRGb3JIaWdobGlnaHQsXG4gIGZpbmROb2RlQW5kT2Zmc2V0XG59IGZyb20gXCIuL3V0aWxzL2hpZ2hsaWdodHNcIjtcbmltcG9ydCB7IHVuaXF1ZSB9IGZyb20gXCIuL3V0aWxzL2FycmF5c1wiO1xuXG4vKipcbiAqIEF0dHJpYnV0ZSBhZGRlZCBieSBkZWZhdWx0IHRvIGV2ZXJ5IGhpZ2hsaWdodC5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBEQVRBX0FUVFIgPSBcImRhdGEtaGlnaGxpZ2h0ZWRcIjtcblxuLyoqXG4gKiBBdHRyaWJ1dGUgdXNlZCB0byBncm91cCBoaWdobGlnaHQgd3JhcHBlcnMuXG4gKiBAdHlwZSB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgVElNRVNUQU1QX0FUVFIgPSBcImRhdGEtdGltZXN0YW1wXCI7XG5cbmV4cG9ydCBjb25zdCBTVEFSVF9PRkZTRVRfQVRUUiA9IFwiZGF0YS1zdGFydC1vZmZzZXRcIjtcbmV4cG9ydCBjb25zdCBFTkRfT0ZGU0VUX0FUVFIgPSBcImRhdGEtZW5kLW9mZnNldFwiO1xuXG4vKipcbiAqIERvbid0IGhpZ2hsaWdodCBjb250ZW50IG9mIHRoZXNlIHRhZ3MuXG4gKiBAdHlwZSB7c3RyaW5nW119XG4gKi9cbmV4cG9ydCBjb25zdCBJR05PUkVfVEFHUyA9IFtcbiAgXCJTQ1JJUFRcIixcbiAgXCJTVFlMRVwiLFxuICBcIlNFTEVDVFwiLFxuICBcIk9QVElPTlwiLFxuICBcIkJVVFRPTlwiLFxuICBcIk9CSkVDVFwiLFxuICBcIkFQUExFVFwiLFxuICBcIlZJREVPXCIsXG4gIFwiQVVESU9cIixcbiAgXCJDQU5WQVNcIixcbiAgXCJFTUJFRFwiLFxuICBcIlBBUkFNXCIsXG4gIFwiTUVURVJcIixcbiAgXCJQUk9HUkVTU1wiXG5dO1xuXG4vKipcbiAqIFRleHRIaWdobGlnaHRlciB0aGF0IHByb3ZpZGVzIHRleHQgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uYWxpdHkgdG8gZG9tIGVsZW1lbnRzLlxuICovXG5jbGFzcyBUZXh0SGlnaGxpZ2h0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBUZXh0SGlnaGxpZ2h0ZXIgaW5zdGFuY2UgYW5kIGJpbmRzIHRvIGdpdmVuIERPTSBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIHdoaWNoIGhpZ2hsaWdodGVkIHdpbGwgYmUgYXBwbGllZC5cbiAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAtIGFkZGl0aW9uYWwgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29sb3IgLSBoaWdobGlnaHQgY29sb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MgLSBjbGFzcyBhZGRlZCB0byBoaWdobGlnaHQsICdoaWdobGlnaHRlZCcgYnkgZGVmYXVsdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY29udGV4dENsYXNzIC0gY2xhc3MgYWRkZWQgdG8gZWxlbWVudCB0byB3aGljaCBoaWdobGlnaHRlciBpcyBhcHBsaWVkLFxuICAgKiAgJ2hpZ2hsaWdodGVyLWNvbnRleHQnIGJ5IGRlZmF1bHQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25SZW1vdmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyByZW1vdmVkLiBIaWdobGlnaHQgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIGlmIGhpZ2hsaWdodCBzaG91bGQgYmUgcmVtb3ZlZCwgb3IgZmFsc2UgLSB0byBwcmV2ZW50IHJlbW92YWwuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQgLSBmdW5jdGlvbiBjYWxsZWQgYmVmb3JlIGhpZ2hsaWdodCBpcyBjcmVhdGVkLiBSYW5nZSBvYmplY3QgaXNcbiAgICogIHBhc3NlZCBhcyBwYXJhbS4gRnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGNvbnRpbnVlIHByb2Nlc3NpbmcsIG9yIGZhbHNlIC0gdG8gcHJldmVudCBoaWdobGlnaHRpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMub25BZnRlckhpZ2hsaWdodCAtIGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBoaWdobGlnaHQgaXMgY3JlYXRlZC4gQXJyYXkgb2YgY3JlYXRlZFxuICAgKiB3cmFwcGVycyBpcyBwYXNzZWQgYXMgcGFyYW0uXG4gICAqIEBjbGFzcyBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgYW5jaG9yIGVsZW1lbnRcIik7XG4gICAgfVxuXG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgY29sb3I6IFwiI2ZmZmY3YlwiLFxuICAgICAgaGlnaGxpZ2h0ZWRDbGFzczogXCJoaWdobGlnaHRlZFwiLFxuICAgICAgY29udGV4dENsYXNzOiBcImhpZ2hsaWdodGVyLWNvbnRleHRcIixcbiAgICAgIG9uUmVtb3ZlSGlnaGxpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgb25CZWZvcmVIaWdobGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBvbkFmdGVySGlnaGxpZ2h0OiBmdW5jdGlvbigpIHt9LFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG5cbiAgICBkb20odGhpcy5lbCkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNvbnRleHRDbGFzcyk7XG4gICAgYmluZEV2ZW50cyh0aGlzLmVsLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJtYW5lbnRseSBkaXNhYmxlcyBoaWdobGlnaHRpbmcuXG4gICAqIFVuYmluZHMgZXZlbnRzIGFuZCByZW1vdmUgY29udGV4dCBlbGVtZW50IGNsYXNzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHVuYmluZEV2ZW50cyh0aGlzLmVsLCB0aGlzKTtcbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNvbnRleHRDbGFzcyk7XG4gIH1cblxuICBoaWdobGlnaHRIYW5kbGVyKCkge1xuICAgIHRoaXMuZG9IaWdobGlnaHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIGN1cnJlbnQgcmFuZ2UuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0ga2VlcFJhbmdlIC0gRG9uJ3QgcmVtb3ZlIHJhbmdlIGFmdGVyIGhpZ2hsaWdodGluZy4gRGVmYXVsdDogZmFsc2UuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRvSGlnaGxpZ2h0KGtlZXBSYW5nZSkge1xuICAgIGxldCByYW5nZSA9IGRvbSh0aGlzLmVsKS5nZXRSYW5nZSgpLFxuICAgICAgd3JhcHBlcixcbiAgICAgIGNyZWF0ZWRIaWdobGlnaHRzLFxuICAgICAgbm9ybWFsaXplZEhpZ2hsaWdodHMsXG4gICAgICB0aW1lc3RhbXA7XG5cbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMub25CZWZvcmVIaWdobGlnaHQocmFuZ2UpID09PSB0cnVlKSB7XG4gICAgICB0aW1lc3RhbXAgPSArbmV3IERhdGUoKTtcbiAgICAgIHdyYXBwZXIgPSBjcmVhdGVXcmFwcGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShUSU1FU1RBTVBfQVRUUiwgdGltZXN0YW1wKTtcblxuICAgICAgY3JlYXRlZEhpZ2hsaWdodHMgPSB0aGlzLmhpZ2hsaWdodFJhbmdlQ3VzdG9tKHJhbmdlLCB3cmFwcGVyKTtcbiAgICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gdGhpcy5ub3JtYWxpemVIaWdobGlnaHRzKGNyZWF0ZWRIaWdobGlnaHRzKTtcblxuICAgICAgdGhpcy5vcHRpb25zLm9uQWZ0ZXJIaWdobGlnaHQocmFuZ2UsIG5vcm1hbGl6ZWRIaWdobGlnaHRzLCB0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGlmICgha2VlcFJhbmdlKSB7XG4gICAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBmdW5jdGlvbmFsaXR5IHRvIGhpZ2hsaWdodCB0aGUgcmFuZ2UgYWxsb3dpbmcgbW9yZSBpc29sYXRpb24gZm9yIG92ZXJsYXBwaW5nIGhpZ2hsaWdodHMuXG4gICAqIFRoaXMgc29sdXRpb24gc3RlYWxzIHRoZSB0ZXh0IG9yIG90aGVyIG5vZGVzIGluIHRoZSBET00gZnJvbSBvdmVybGFwcGluZyAoTk9UIE5FU1RFRCkgaGlnaGxpZ2h0c1xuICAgKiBmb3IgcmVwcmVzZW50YXRpb24gaW4gdGhlIERPTS5cbiAgICpcbiAgICogRm9yIHRoZSBwdXJwb3NlIG9mIHNlcmlhbGlzYXRpb24gdGhpcyB3aWxsIG1haW50YWluIGEgZGF0YSBhdHRyaWJ1dGUgb24gdGhlIGhpZ2hsaWdodCB3cmFwcGVyXG4gICAqIHdpdGggdGhlIHN0YXJ0IHRleHQgYW5kIGVuZCB0ZXh0IG9mZnNldHMgcmVsYXRpdmUgdG8gdGhlIGNvbnRleHQgcm9vdCBlbGVtZW50LlxuICAgKlxuICAgKiBXcmFwcyB0ZXh0IG9mIGdpdmVuIHJhbmdlIG9iamVjdCBpbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmFuZ2V9IHJhbmdlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHdyYXBwZXJcbiAgICogQHJldHVybnMge0FycmF5fSAtIGFycmF5IG9mIGNyZWF0ZWQgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgaGlnaGxpZ2h0UmFuZ2VDdXN0b20ocmFuZ2UsIHdyYXBwZXIpIHtcbiAgICBpZiAoIXJhbmdlIHx8IHJhbmdlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiQUxTRGVidWcyOTogUkFOR0U6IFwiLCByYW5nZSk7XG5cbiAgICBsZXQgaGlnaGxpZ2h0cyA9IFtdO1xuICAgIGxldCB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICBsZXQgb3ZlcmxhcHNXaXRoRXhpc3RpbmdIaWdobGlnaHQgPSBmYWxzZTtcblxuICAgIGxldCBzdGFydE9mZnNldCA9XG4gICAgICBnZXRFbGVtZW50T2Zmc2V0KHJhbmdlLnN0YXJ0Q29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICAgIGxldCBlbmRPZmZzZXQgPVxuICAgICAgcmFuZ2Uuc3RhcnRDb250YWluZXIgPT09IHJhbmdlLmVuZENvbnRhaW5lclxuICAgICAgICA/IHN0YXJ0T2Zmc2V0ICsgKHJhbmdlLmVuZE9mZnNldCAtIHJhbmdlLnN0YXJ0T2Zmc2V0KVxuICAgICAgICA6IGdldEVsZW1lbnRPZmZzZXQocmFuZ2UuZW5kQ29udGFpbmVyLCB0aGlzLmVsKSArIHJhbmdlLmVuZE9mZnNldDtcblxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJBTFNEZWJ1ZzI5OiBzdGFydE9mZnNldDogXCIsXG4gICAgICBzdGFydE9mZnNldCxcbiAgICAgIFwiZW5kT2Zmc2V0OiBcIixcbiAgICAgIGVuZE9mZnNldFxuICAgICk7XG5cbiAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKFNUQVJUX09GRlNFVF9BVFRSLCBzdGFydE9mZnNldCk7XG4gICAgd3JhcHBlckNsb25lLnNldEF0dHJpYnV0ZShFTkRfT0ZGU0VUX0FUVFIsIGVuZE9mZnNldCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlxcblxcblxcbiBGSU5ESU5HIFNUQVJUIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2Uuc3RhcnRDb250YWluZXI6IFwiLCByYW5nZS5zdGFydENvbnRhaW5lcik7XG4gICAgbGV0IHN0YXJ0Q29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5zdGFydENvbnRhaW5lciwgXCJzdGFydFwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuXFxuIEZJTkRJTkcgRU5EIENPTlRBSU5FUiBGSVJTVCBURVhUIE5PREUgXCIpO1xuICAgIGNvbnNvbGUubG9nKFwicmFuZ2UuZW5kQ29udGFpbmVyOiBcIiwgcmFuZ2UuZW5kQ29udGFpbmVyKTtcbiAgICBsZXQgZW5kQ29udGFpbmVyID0gZmluZFRleHROb2RlQXRMb2NhdGlvbihyYW5nZS5lbmRDb250YWluZXIsIFwic3RhcnRcIik7XG5cbiAgICBpZiAoIXN0YXJ0Q29udGFpbmVyIHx8ICFlbmRDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJGYWlsZWQgdG8gZmluZCB0aGUgdGV4dCBub2RlIGZvciB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgc2VsZWN0ZWQgcmFuZ2VcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgYWZ0ZXJOZXdIaWdobGlnaHQgPVxuICAgICAgcmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLnRleHRDb250ZW50Lmxlbmd0aCAtIDFcbiAgICAgICAgPyBlbmRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLmVuZE9mZnNldClcbiAgICAgICAgOiBlbmRDb250YWluZXI7XG5cbiAgICBpZiAoc3RhcnRDb250YWluZXIgPT09IGVuZENvbnRhaW5lcikge1xuICAgICAgbGV0IHN0YXJ0T2ZOZXdIaWdobGlnaHQgPVxuICAgICAgICByYW5nZS5zdGFydE9mZnNldCA+IDBcbiAgICAgICAgICA/IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldClcbiAgICAgICAgICA6IHN0YXJ0Q29udGFpbmVyO1xuICAgICAgLy8gU2ltcGx5IHdyYXAgdGhlIHNlbGVjdGVkIHJhbmdlIGluIHRoZSBzYW1lIGNvbnRhaW5lciBhcyBhIGhpZ2hsaWdodC5cbiAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRDb250YWluZXIgPT09IGVuZENvbnRhaW5lciEhISEhXCIpO1xuICAgICAgbGV0IGhpZ2hsaWdodCA9IGRvbShzdGFydE9mTmV3SGlnaGxpZ2h0KS53cmFwKHdyYXBwZXJDbG9uZSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9IGVsc2UgaWYgKGVuZENvbnRhaW5lci50ZXh0Q29udGVudC5sZW5ndGggPj0gcmFuZ2UuZW5kT2Zmc2V0KSB7XG4gICAgICBsZXQgc3RhcnRPZk5ld0hpZ2hsaWdodCA9IHN0YXJ0Q29udGFpbmVyLnNwbGl0VGV4dChyYW5nZS5zdGFydE9mZnNldCk7XG4gICAgICBsZXQgZW5kT2ZOZXdIaWdobGlnaHQgPSBhZnRlck5ld0hpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgXCJOb2RlIGF0IHRoZSBzdGFydCBvZiB0aGUgbmV3IGhpZ2hsaWdodDogXCIsXG4gICAgICAgIHN0YXJ0T2ZOZXdIaWdobGlnaHRcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vZGUgYXQgdGhlIGVuZCBvZiBuZXcgaGlnaGxpZ2h0OiBcIiwgZW5kT2ZOZXdIaWdobGlnaHQpO1xuICAgICAgLyogXG4gICAgICBsZXQgc3RhcnRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICBvdGhlckVsZW1lbnQ6IGVuZE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgaWYgKHN0YXJ0RWxlbWVudFBhcmVudCkge1xuICAgICAgICBsZXQgc3RhcnRFbGVtZW50UGFyZW50Q29weSA9IGV4dHJhY3RFbGVtZW50Q29udGVudEZvckhpZ2hsaWdodChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0LFxuICAgICAgICAgICAgZWxlbWVudEFuY2VzdG9yOiBzdGFydEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICBsb2NhdGlvbkluU2VsZWN0aW9uOiBcInN0YXJ0XCJcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9ICovXG5cbiAgICAgIGxldCBlbmRFbGVtZW50UGFyZW50ID0gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KHtcbiAgICAgICAgY2hpbGRFbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgb3RoZXJFbGVtZW50OiBzdGFydE9mTmV3SGlnaGxpZ2h0XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVuZEVsZW1lbnRQYXJlbnQpIHtcbiAgICAgICAgbGV0IGVuZEVsZW1lbnRQYXJlbnRDb3B5ID0gZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0KHtcbiAgICAgICAgICBlbGVtZW50OiBlbmRPZk5ld0hpZ2hsaWdodCxcbiAgICAgICAgICBlbGVtZW50QW5jZXN0b3I6IGVuZEVsZW1lbnRQYXJlbnQsXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIGxvY2F0aW9uSW5TZWxlY3Rpb246IFwiZW5kXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKHN0YXJ0T2ZOZXdIaWdobGlnaHQpO1xuICAgICAgICAvLyBUT0RPOiBhZGQgY29udGFpbmVycyBpbiBiZXR3ZWVuLlxuXG4gICAgICAgIC8vIE9ubHkgY29weSB0aGUgY2hpbGRyZW4gb2YgYSBoaWdobGlnaHRlZCBzcGFuIGludG8gb3VyIG5ldyBoaWdobGlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5vcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGVuZEVsZW1lbnRQYXJlbnRDb3B5LmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JhcHBlckNsb25lLmFwcGVuZENoaWxkKGVuZEVsZW1lbnRQYXJlbnRDb3B5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvbSh3cmFwcGVyQ2xvbmUpLmluc2VydEJlZm9yZShlbmRFbGVtZW50UGFyZW50KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBcIk5vZGUgdGhhdCBpcyB0aGUgd3JhcHBlciBvZiB0aGUgZW5kIG9mIHRoZSBuZXcgaGlnaGxpZ2h0OiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgXCJDbG9uZWQgb2Ygbm9kZSB0aGF0IGlzIHRoZSB3cmFwcGVyIG9mIHRoZSBlbmQgb2YgdGhlIG5ldyBoaWdobGlnaHQgYWZ0ZXIgcmVtb3Zpbmcgc2libGluZ3MgYW5kIHVud3JhcHBpbmcgaGlnaGxpZ2h0IHNwYW5zOiBcIixcbiAgICAgICAgICBlbmRFbGVtZW50UGFyZW50Q29weVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgcmFuZ2UuXG4gICAqIFdyYXBzIHRleHQgb2YgZ2l2ZW4gcmFuZ2Ugb2JqZWN0IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICogQHBhcmFtIHtSYW5nZX0gcmFuZ2VcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlclxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgY3JlYXRlZCBoaWdobGlnaHRzLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBoaWdobGlnaHRSYW5nZShyYW5nZSwgd3JhcHBlcikge1xuICAgIGlmICghcmFuZ2UgfHwgcmFuZ2UuY29sbGFwc2VkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBTFNEZWJ1ZzI4OiByYW5nZSBiZWZvcmUgcmVmaW5lZCEgXCIsIHJhbmdlKTtcblxuICAgIGxldCByZXN1bHQgPSByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpLFxuICAgICAgc3RhcnRDb250YWluZXIgPSByZXN1bHQuc3RhcnRDb250YWluZXIsXG4gICAgICBlbmRDb250YWluZXIgPSByZXN1bHQuZW5kQ29udGFpbmVyLFxuICAgICAgZ29EZWVwZXIgPSByZXN1bHQuZ29EZWVwZXIsXG4gICAgICBkb25lID0gZmFsc2UsXG4gICAgICBub2RlID0gc3RhcnRDb250YWluZXIsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBoaWdobGlnaHQsXG4gICAgICB3cmFwcGVyQ2xvbmUsXG4gICAgICBub2RlUGFyZW50O1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGdvRGVlcGVyICYmIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIElHTk9SRV9UQUdTLmluZGV4T2Yobm9kZS5wYXJlbnROb2RlLnRhZ05hbWUpID09PSAtMSAmJlxuICAgICAgICAgIG5vZGUubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIlxuICAgICAgICApIHtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUgPSB3cmFwcGVyLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICB3cmFwcGVyQ2xvbmUuc2V0QXR0cmlidXRlKERBVEFfQVRUUiwgdHJ1ZSk7XG4gICAgICAgICAgbm9kZVBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICAgIC8vIGhpZ2hsaWdodCBpZiBhIG5vZGUgaXMgaW5zaWRlIHRoZSBlbFxuICAgICAgICAgIGlmIChkb20odGhpcy5lbCkuY29udGFpbnMobm9kZVBhcmVudCkgfHwgbm9kZVBhcmVudCA9PT0gdGhpcy5lbCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ID0gZG9tKG5vZGUpLndyYXAod3JhcHBlckNsb25lKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUgPT09IGVuZENvbnRhaW5lciAmJlxuICAgICAgICAhKGVuZENvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkgJiYgZ29EZWVwZXIpXG4gICAgICApIHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnRhZ05hbWUgJiYgSUdOT1JFX1RBR1MuaW5kZXhPZihub2RlLnRhZ05hbWUpID4gLTEpIHtcbiAgICAgICAgaWYgKGVuZENvbnRhaW5lci5wYXJlbnROb2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZ29EZWVwZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChnb0RlZXBlciAmJiBub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICBnb0RlZXBlciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBnb0RlZXBlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCFkb25lKTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZXMgaGlnaGxpZ2h0cy4gRW5zdXJlcyB0aGF0IGhpZ2hsaWdodGluZyBpcyBkb25lIHdpdGggdXNlIG9mIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBudW1iZXIgb2ZcbiAgICogd3JhcHBpbmcgSFRNTCBlbGVtZW50cy5cbiAgICogRmxhdHRlbnMgaGlnaGxpZ2h0cyBzdHJ1Y3R1cmUgYW5kIG1lcmdlcyBzaWJsaW5nIGhpZ2hsaWdodHMuIE5vcm1hbGl6ZXMgdGV4dCBub2RlcyB3aXRoaW4gaGlnaGxpZ2h0cy5cbiAgICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0cyAtIGhpZ2hsaWdodHMgdG8gbm9ybWFsaXplLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2Ygbm9ybWFsaXplZCBoaWdobGlnaHRzLiBPcmRlciBhbmQgbnVtYmVyIG9mIHJldHVybmVkIGhpZ2hsaWdodHMgbWF5IGJlIGRpZmZlcmVudCB0aGFuXG4gICAqIGlucHV0IGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIG5vcm1hbGl6ZUhpZ2hsaWdodHMoaGlnaGxpZ2h0cykge1xuICAgIGxldCBub3JtYWxpemVkSGlnaGxpZ2h0cztcblxuICAgIC8vdGhpcy5mbGF0dGVuTmVzdGVkSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcbiAgICAvL3RoaXMubWVyZ2VTaWJsaW5nSGlnaGxpZ2h0cyhoaWdobGlnaHRzKTtcblxuICAgIC8vU2luY2Ugd2UncmUgbm90IG1lcmdpbmcgb3IgZmxhdHRlbmluZywgd2UgbmVlZCB0byBub3JtYWxpc2UgdGhlIHRleHQgbm9kZXMuXG4gICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhpZ2hsaWdodCkge1xuICAgICAgZG9tKGhpZ2hsaWdodCkubm9ybWFsaXplVGV4dE5vZGVzKCk7XG4gICAgfSk7XG5cbiAgICAvLyBvbWl0IHJlbW92ZWQgbm9kZXNcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cyA9IGhpZ2hsaWdodHMuZmlsdGVyKGZ1bmN0aW9uKGhsKSB7XG4gICAgICByZXR1cm4gaGwucGFyZW50RWxlbWVudCA/IGhsIDogbnVsbDtcbiAgICB9KTtcblxuICAgIG5vcm1hbGl6ZWRIaWdobGlnaHRzID0gdW5pcXVlKG5vcm1hbGl6ZWRIaWdobGlnaHRzKTtcbiAgICBub3JtYWxpemVkSGlnaGxpZ2h0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLm9mZnNldFRvcCAtIGIub2Zmc2V0VG9wIHx8IGEub2Zmc2V0TGVmdCAtIGIub2Zmc2V0TGVmdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBub3JtYWxpemVkSGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGF0dGVucyBoaWdobGlnaHRzIHN0cnVjdHVyZS5cbiAgICogTm90ZTogdGhpcyBtZXRob2QgY2hhbmdlcyBpbnB1dCBoaWdobGlnaHRzIC0gdGhlaXIgb3JkZXIgYW5kIG51bWJlciBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSBjaGFuZ2UuXG4gICAqIEBwYXJhbSB7QXJyYXl9IGhpZ2hsaWdodHMgLSBoaWdobGlnaHRzIHRvIGZsYXR0ZW4uXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGZsYXR0ZW5OZXN0ZWRIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgYWdhaW4sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gZmxhdHRlbk9uY2UoKSB7XG4gICAgICBsZXQgYWdhaW4gPSBmYWxzZTtcblxuICAgICAgaGlnaGxpZ2h0cy5mb3JFYWNoKGZ1bmN0aW9uKGhsLCBpKSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBobC5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgIHBhcmVudFByZXYgPSBwYXJlbnQucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgIHBhcmVudE5leHQgPSBwYXJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKHNlbGYuaXNIaWdobGlnaHQocGFyZW50KSkge1xuICAgICAgICAgIGlmICghaGF2ZVNhbWVDb2xvcihwYXJlbnQsIGhsKSkge1xuICAgICAgICAgICAgaWYgKCFobC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgICBpZiAoIXBhcmVudE5leHQpIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50TmV4dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy9kb20oaGwpLmluc2VydEJlZm9yZShwYXJlbnROZXh0IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFobC5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKCFwYXJlbnRQcmV2KSB7XG4gICAgICAgICAgICAgICAgZG9tKGhsKS5pbnNlcnRCZWZvcmUocGFyZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb20oaGwpLmluc2VydEFmdGVyKHBhcmVudFByZXYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vZG9tKGhsKS5pbnNlcnRBZnRlcihwYXJlbnRQcmV2IHx8IHBhcmVudCk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBobC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwucHJldmlvdXNTaWJsaW5nLm5vZGVUeXBlID09IDMgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcgJiZcbiAgICAgICAgICAgICAgaGwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT0gM1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGxldCBzcGFubGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJlbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICBzcGFubGVmdC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICBsZXQgdGltZXN0YW1wID0gcGFyZW50LmF0dHJpYnV0ZXNbVElNRVNUQU1QX0FUVFJdLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgc3BhbmxlZnQuc2V0QXR0cmlidXRlKFRJTUVTVEFNUF9BVFRSLCB0aW1lc3RhbXApO1xuICAgICAgICAgICAgICBzcGFubGVmdC5zZXRBdHRyaWJ1dGUoREFUQV9BVFRSLCB0cnVlKTtcblxuICAgICAgICAgICAgICBsZXQgc3BhbnJpZ2h0ID0gc3BhbmxlZnQuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICAgIGRvbShobC5wcmV2aW91c1NpYmxpbmcpLndyYXAoc3BhbmxlZnQpO1xuICAgICAgICAgICAgICBkb20oaGwubmV4dFNpYmxpbmcpLndyYXAoc3BhbnJpZ2h0KTtcblxuICAgICAgICAgICAgICBsZXQgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChwYXJlbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGRvbShub2RlKS5pbnNlcnRCZWZvcmUobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFnYWluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFwYXJlbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgIGRvbShwYXJlbnQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGhsLmZpcnN0Q2hpbGQsIGhsKTtcbiAgICAgICAgICAgIGhpZ2hsaWdodHNbaV0gPSBwYXJlbnQ7XG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFnYWluO1xuICAgIH1cblxuICAgIGRvIHtcbiAgICAgIGFnYWluID0gZmxhdHRlbk9uY2UoKTtcbiAgICB9IHdoaWxlIChhZ2Fpbik7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2VzIHNpYmxpbmcgaGlnaGxpZ2h0cyBhbmQgbm9ybWFsaXplcyBkZXNjZW5kYW50IHRleHQgbm9kZXMuXG4gICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNoYW5nZXMgaW5wdXQgaGlnaGxpZ2h0cyAtIHRoZWlyIG9yZGVyIGFuZCBudW1iZXIgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgY2hhbmdlLlxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0c1xuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBtZXJnZVNpYmxpbmdIaWdobGlnaHRzKGhpZ2hsaWdodHMpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBzaG91bGRNZXJnZShjdXJyZW50LCBub2RlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAvKiAgICAgICByZXR1cm4gKFxuICAgICAgICBub2RlICYmXG4gICAgICAgIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgaGF2ZVNhbWVDb2xvcihjdXJyZW50LCBub2RlKSAmJlxuICAgICAgICBzZWxmLmlzSGlnaGxpZ2h0KG5vZGUpXG4gICAgICApOyAqL1xuICAgIH1cblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGxldCBwcmV2ID0gaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZyxcbiAgICAgICAgbmV4dCA9IGhpZ2hsaWdodC5uZXh0U2libGluZztcblxuICAgICAgaWYgKHNob3VsZE1lcmdlKGhpZ2hsaWdodCwgcHJldikpIHtcbiAgICAgICAgZG9tKGhpZ2hsaWdodCkucHJlcGVuZChwcmV2LmNoaWxkTm9kZXMpO1xuICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkTWVyZ2UoaGlnaGxpZ2h0LCBuZXh0KSkge1xuICAgICAgICBkb20oaGlnaGxpZ2h0KS5hcHBlbmQobmV4dC5jaGlsZE5vZGVzKTtcbiAgICAgICAgZG9tKG5leHQpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBkb20oaGlnaGxpZ2h0KS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGhpZ2hsaWdodGluZyBjb2xvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIC0gdmFsaWQgQ1NTIGNvbG9yLlxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXRDb2xvcihjb2xvcikge1xuICAgIHRoaXMub3B0aW9ucy5jb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaGlnaGxpZ2h0aW5nIGNvbG9yLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBnZXRDb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaGlnaGxpZ2h0cyBmcm9tIGVsZW1lbnQuIElmIGVsZW1lbnQgaXMgYSBoaWdobGlnaHQgaXRzZWxmLCBpdCBpcyByZW1vdmVkIGFzIHdlbGwuXG4gICAqIElmIG5vIGVsZW1lbnQgaXMgZ2l2ZW4sIGFsbCBoaWdobGlnaHRzIGFsbCByZW1vdmVkLlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbZWxlbWVudF0gLSBlbGVtZW50IHRvIHJlbW92ZSBoaWdobGlnaHRzIGZyb21cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgcmVtb3ZlSGlnaGxpZ2h0cyhlbGVtZW50KSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IGVsZW1lbnQgfHwgdGhpcy5lbCxcbiAgICAgIGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoeyBjb250YWluZXI6IGNvbnRhaW5lciB9KSxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgLyogICAgIGZ1bmN0aW9uIG1lcmdlU2libGluZ3Mobm9kZSkge1xuICAgICAgbGV0IHByZXYgPSBub2RlLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmc7XG5cbiAgICAgIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKHByZXYgJiYgcHJldi5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcHJldi5ub2RlVmFsdWUgKyBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERSkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWUgKyBuZXh0Lm5vZGVWYWx1ZTtcbiAgICAgICAgICBkb20obmV4dCkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcmV2ICYmIHByZXYuY2xhc3NOYW1lID09PSBub2RlLmNsYXNzTmFtZSkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gcHJldi5ub2RlVmFsdWUgKyBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICBkb20ocHJldikucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5jbGFzc05hbWUgPT09IG5vZGUuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSArIG5leHQubm9kZVZhbHVlO1xuICAgICAgICAgIGRvbShuZXh0KS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKi9cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodChoaWdobGlnaHQpIHtcbiAgICAgIGlmIChoaWdobGlnaHQuY2xhc3NOYW1lID09PSBjb250YWluZXIuY2xhc3NOYW1lKSB7XG4gICAgICAgIGRvbShoaWdobGlnaHQpLnVud3JhcCgpO1xuXG4gICAgICAgIC8qKiAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgbWVyZ2VTaWJsaW5ncyhub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9zb3J0QnlEZXB0aChoaWdobGlnaHRzLCB0cnVlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgICAgaWYgKHNlbGYub3B0aW9ucy5vblJlbW92ZUhpZ2hsaWdodChobCkgPT09IHRydWUpIHtcbiAgICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGhsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhpZ2hsaWdodHMgZnJvbSBnaXZlbiBjb250YWluZXIuXG4gICAqIEBwYXJhbSBwYXJhbXNcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3BhcmFtcy5jb250YWluZXJdIC0gcmV0dXJuIGhpZ2hsaWdodHMgZnJvbSB0aGlzIGVsZW1lbnQuIERlZmF1bHQ6IHRoZSBlbGVtZW50IHRoZVxuICAgKiBoaWdobGlnaHRlciBpcyBhcHBsaWVkIHRvLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuYW5kU2VsZl0gLSBpZiBzZXQgdG8gdHJ1ZSBhbmQgY29udGFpbmVyIGlzIGEgaGlnaGxpZ2h0IGl0c2VsZiwgYWRkIGNvbnRhaW5lciB0b1xuICAgKiByZXR1cm5lZCByZXN1bHRzLiBEZWZhdWx0OiB0cnVlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbXMuZ3JvdXBlZF0gLSBpZiBzZXQgdG8gdHJ1ZSwgaGlnaGxpZ2h0cyBhcmUgZ3JvdXBlZCBpbiBsb2dpY2FsIGdyb3VwcyBvZiBoaWdobGlnaHRzIGFkZGVkXG4gICAqIGluIHRoZSBzYW1lIG1vbWVudC4gRWFjaCBncm91cCBpcyBhbiBvYmplY3Qgd2hpY2ggaGFzIGdvdCBhcnJheSBvZiBoaWdobGlnaHRzLCAndG9TdHJpbmcnIG1ldGhvZCBhbmQgJ3RpbWVzdGFtcCdcbiAgICogcHJvcGVydHkuIERlZmF1bHQ6IGZhbHNlLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgaGlnaGxpZ2h0cy5cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZ2V0SGlnaGxpZ2h0cyhwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSB7XG4gICAgICBjb250YWluZXI6IHRoaXMuZWwsXG4gICAgICBhbmRTZWxmOiB0cnVlLFxuICAgICAgZ3JvdXBlZDogZmFsc2UsXG4gICAgICAuLi5wYXJhbXNcbiAgICB9O1xuXG4gICAgbGV0IG5vZGVMaXN0ID0gcGFyYW1zLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFwiW1wiICsgREFUQV9BVFRSICsgXCJdXCIpLFxuICAgICAgaGlnaGxpZ2h0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVMaXN0KTtcblxuICAgIGlmIChwYXJhbXMuYW5kU2VsZiA9PT0gdHJ1ZSAmJiBwYXJhbXMuY29udGFpbmVyLmhhc0F0dHJpYnV0ZShEQVRBX0FUVFIpKSB7XG4gICAgICBoaWdobGlnaHRzLnB1c2gocGFyYW1zLmNvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcy5ncm91cGVkKSB7XG4gICAgICBoaWdobGlnaHRzID0gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIFRJTUVTVEFNUF9BVFRSKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudCBpcyBhIGhpZ2hsaWdodC5cbiAgICogQWxsIGhpZ2hsaWdodHMgaGF2ZSAnZGF0YS1oaWdobGlnaHRlZCcgYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgaXNIaWdobGlnaHQoZWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZWwgJiYgZWwubm9kZVR5cGUgPT09IE5PREVfVFlQRS5FTEVNRU5UX05PREUgJiYgZWwuaGFzQXR0cmlidXRlKERBVEFfQVRUUilcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzKCkge1xuICAgIGxldCBoaWdobGlnaHRzID0gdGhpcy5nZXRIaWdobGlnaHRzKCksXG4gICAgICByZWZFbCA9IHRoaXMuZWwsXG4gICAgICBobERlc2NyaXB0b3JzID0gW107XG5cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50UGF0aChlbCwgcmVmRWxlbWVudCkge1xuICAgICAgbGV0IHBhdGggPSBbXSxcbiAgICAgICAgY2hpbGROb2RlcztcblxuICAgICAgZG8ge1xuICAgICAgICBjaGlsZE5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWwucGFyZW50Tm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgcGF0aC51bnNoaWZ0KGNoaWxkTm9kZXMuaW5kZXhPZihlbCkpO1xuICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICB9IHdoaWxlIChlbCAhPT0gcmVmRWxlbWVudCB8fCAhZWwpO1xuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG5cbiAgICBzb3J0QnlEZXB0aChoaWdobGlnaHRzLCBmYWxzZSk7XG5cbiAgICBoaWdobGlnaHRzLmZvckVhY2goZnVuY3Rpb24oaGlnaGxpZ2h0KSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gMCwgLy8gSGwgb2Zmc2V0IGZyb20gcHJldmlvdXMgc2libGluZyB3aXRoaW4gcGFyZW50IG5vZGUuXG4gICAgICAgIGxlbmd0aCA9IGhpZ2hsaWdodC50ZXh0Q29udGVudC5sZW5ndGgsXG4gICAgICAgIGhsUGF0aCA9IGdldEVsZW1lbnRQYXRoKGhpZ2hsaWdodCwgcmVmRWwpLFxuICAgICAgICB3cmFwcGVyID0gaGlnaGxpZ2h0LmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgd3JhcHBlciA9IHdyYXBwZXIub3V0ZXJIVE1MO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcgJiZcbiAgICAgICAgaGlnaGxpZ2h0LnByZXZpb3VzU2libGluZy5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFRfTk9ERVxuICAgICAgKSB7XG4gICAgICAgIG9mZnNldCA9IGhpZ2hsaWdodC5wcmV2aW91c1NpYmxpbmcubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBobERlc2NyaXB0b3JzLnB1c2goW1xuICAgICAgICB3cmFwcGVyLFxuICAgICAgICBoaWdobGlnaHQudGV4dENvbnRlbnQsXG4gICAgICAgIGhsUGF0aC5qb2luKFwiOlwiKSxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBsZW5ndGhcbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhsRGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgYWxsIGhpZ2hsaWdodHMgaW4gdGhlIGVsZW1lbnQgdGhlIGhpZ2hsaWdodGVyIGlzIGFwcGxpZWQgdG8uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gc3RyaW5naWZpZWQgSlNPTiB3aXRoIGhpZ2hsaWdodHMgZGVmaW5pdGlvblxuICAgKiBAbWVtYmVyb2YgVGV4dEhpZ2hsaWdodGVyXG4gICAqL1xuICBzZXJpYWxpemVIaWdobGlnaHRzQ3VzdG9tKGlkKSB7XG4gICAgbGV0IGhpZ2hsaWdodHMgPSB0aGlzLmdldEhpZ2hsaWdodHMoKSxcbiAgICAgIHJlZkVsID0gdGhpcy5lbCxcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBbXTtcblxuICAgIHNvcnRCeURlcHRoKGhpZ2hsaWdodHMsIGZhbHNlKTtcblxuICAgIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihoaWdobGlnaHQpIHtcbiAgICAgIGxldCBsZW5ndGggPSBoaWdobGlnaHQudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgICAvLyBobFBhdGggPSBnZXRFbGVtZW50UGF0aChoaWdobGlnaHQsIHJlZkVsKSxcbiAgICAgICAgb2Zmc2V0ID0gZ2V0RWxlbWVudE9mZnNldChoaWdobGlnaHQsIHJlZkVsKSwgLy8gSGwgb2Zmc2V0IGZyb20gdGhlIHJvb3QgZWxlbWVudC5cbiAgICAgICAgd3JhcHBlciA9IGhpZ2hsaWdodC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIHdyYXBwZXIgPSB3cmFwcGVyLm91dGVySFRNTDtcblxuICAgICAgY29uc29sZS5sb2coXCJIaWdobGlnaHQgdGV4dCBvZmZzZXQgZnJvbSByb290IG5vZGU6IFwiLCBvZmZzZXQpO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGB3cmFwcGVyLnRvU3RyaW5nKCkuaW5kZXhPZigke2lkfSk6YCxcbiAgICAgICAgd3JhcHBlci50b1N0cmluZygpLmluZGV4T2YoaWQpXG4gICAgICApO1xuICAgICAgaWYgKHdyYXBwZXIudG9TdHJpbmcoKS5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgIGhsRGVzY3JpcHRvcnMucHVzaChbd3JhcHBlciwgaGlnaGxpZ2h0LnRleHRDb250ZW50LCBvZmZzZXQsIGxlbmd0aF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGhsRGVzY3JpcHRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VyaWFsaXplcyB0aGUgY3VzdG9tIGZvcm0gb2YgaGlnaGxpZ2h0cy5cbiAgICpcbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0c0N1c3RvbShqc29uKSB7XG4gICAgbGV0IGhsRGVzY3JpcHRvcnMsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IFwiQ2FuJ3QgcGFyc2UgSlNPTjogXCIgKyBlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXphdGlvbkZuQ3VzdG9tKGhsRGVzY3JpcHRvcikge1xuICAgICAgbGV0IGhsID0ge1xuICAgICAgICAgIHdyYXBwZXI6IGhsRGVzY3JpcHRvclswXSxcbiAgICAgICAgICB0ZXh0OiBobERlc2NyaXB0b3JbMV0sXG4gICAgICAgICAgb2Zmc2V0OiBOdW1iZXIucGFyc2VJbnQoaGxEZXNjcmlwdG9yWzJdKSxcbiAgICAgICAgICBsZW5ndGg6IE51bWJlci5wYXJzZUludChobERlc2NyaXB0b3JbM10pXG4gICAgICAgIH0sXG4gICAgICAgIGhsTm9kZSxcbiAgICAgICAgaGlnaGxpZ2h0O1xuXG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gc2VsZi5lbDtcbiAgICAgIGNvbnN0IHsgbm9kZSwgb2Zmc2V0OiBvZmZzZXRXaXRoaW5Ob2RlIH0gPSBmaW5kTm9kZUFuZE9mZnNldChcbiAgICAgICAgaGwsXG4gICAgICAgIHBhcmVudE5vZGVcbiAgICAgICk7XG5cbiAgICAgIGhsTm9kZSA9IG5vZGUuc3BsaXRUZXh0KG9mZnNldFdpdGhpbk5vZGUpO1xuICAgICAgaGxOb2RlLnNwbGl0VGV4dChobC5sZW5ndGgpO1xuXG4gICAgICBpZiAoaGxOb2RlLm5leHRTaWJsaW5nICYmICFobE5vZGUubmV4dFNpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUubmV4dFNpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGxOb2RlLnByZXZpb3VzU2libGluZyAmJiAhaGxOb2RlLnByZXZpb3VzU2libGluZy5ub2RlVmFsdWUpIHtcbiAgICAgICAgZG9tKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcpLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICBoaWdobGlnaHQgPSBkb20oaGxOb2RlKS53cmFwKGRvbSgpLmZyb21IVE1MKGhsLndyYXBwZXIpWzBdKTtcbiAgICAgIGhpZ2hsaWdodHMucHVzaChoaWdobGlnaHQpO1xuICAgIH1cblxuICAgIGhsRGVzY3JpcHRvcnMuZm9yRWFjaChmdW5jdGlvbihobERlc2NyaXB0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGlnaGxpZ2h0OiBcIiwgaGxEZXNjcmlwdG9yKTtcbiAgICAgICAgZGVzZXJpYWxpemF0aW9uRm5DdXN0b20oaGxEZXNjcmlwdG9yKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZGVzZXJpYWxpemUgaGlnaGxpZ2h0IGRlc2NyaXB0b3IuIENhdXNlOiBcIiArIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaGlnaGxpZ2h0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlcmlhbGl6ZXMgaGlnaGxpZ2h0cy5cbiAgICogQHRocm93cyBleGNlcHRpb24gd2hlbiBjYW4ndCBwYXJzZSBKU09OIG9yIEpTT04gaGFzIGludmFsaWQgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvbiAtIEpTT04gb2JqZWN0IHdpdGggaGlnaGxpZ2h0cyBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gYXJyYXkgb2YgZGVzZXJpYWxpemVkIGhpZ2hsaWdodHMuXG4gICAqIEBtZW1iZXJvZiBUZXh0SGlnaGxpZ2h0ZXJcbiAgICovXG4gIGRlc2VyaWFsaXplSGlnaGxpZ2h0cyhqc29uKSB7XG4gICAgbGV0IGhsRGVzY3JpcHRvcnMsXG4gICAgICBoaWdobGlnaHRzID0gW10sXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodHM7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGhsRGVzY3JpcHRvcnMgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IFwiQ2FuJ3QgcGFyc2UgSlNPTjogXCIgKyBlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc2VyaWFsaXphdGlvbkZuKGhsRGVzY3JpcHRvcikge1xuICAgICAgbGV0IGhsID0ge1xuICAgICAgICAgIHdyYXBwZXI6IGhsRGVzY3JpcHRvclswXSxcbiAgICAgICAgICB0ZXh0OiBobERlc2NyaXB0b3JbMV0sXG4gICAgICAgICAgcGF0aDogaGxEZXNjcmlwdG9yWzJdLnNwbGl0KFwiOlwiKSxcbiAgICAgICAgICBvZmZzZXQ6IGhsRGVzY3JpcHRvclszXSxcbiAgICAgICAgICBsZW5ndGg6IGhsRGVzY3JpcHRvcls0XVxuICAgICAgICB9LFxuICAgICAgICBlbEluZGV4ID0gaGwucGF0aC5wb3AoKSxcbiAgICAgICAgbm9kZSA9IHNlbGYuZWwsXG4gICAgICAgIGhsTm9kZSxcbiAgICAgICAgaGlnaGxpZ2h0LFxuICAgICAgICBpZHg7XG5cbiAgICAgIHdoaWxlICgoaWR4ID0gaGwucGF0aC5zaGlmdCgpKSkge1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZE5vZGVzW2lkeF07XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXggLSAxXSAmJlxuICAgICAgICBub2RlLmNoaWxkTm9kZXNbZWxJbmRleCAtIDFdLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVF9OT0RFXG4gICAgICApIHtcbiAgICAgICAgZWxJbmRleCAtPSAxO1xuICAgICAgfVxuXG4gICAgICBub2RlID0gbm9kZS5jaGlsZE5vZGVzW2VsSW5kZXhdO1xuICAgICAgaGxOb2RlID0gbm9kZS5zcGxpdFRleHQoaGwub2Zmc2V0KTtcbiAgICAgIGhsTm9kZS5zcGxpdFRleHQoaGwubGVuZ3RoKTtcblxuICAgICAgaWYgKGhsTm9kZS5uZXh0U2libGluZyAmJiAhaGxOb2RlLm5leHRTaWJsaW5nLm5vZGVWYWx1ZSkge1xuICAgICAgICBkb20oaGxOb2RlLm5leHRTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhsTm9kZS5wcmV2aW91c1NpYmxpbmcgJiYgIWhsTm9kZS5wcmV2aW91c1NpYmxpbmcubm9kZVZhbHVlKSB7XG4gICAgICAgIGRvbShobE5vZGUucHJldmlvdXNTaWJsaW5nKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgaGlnaGxpZ2h0ID0gZG9tKGhsTm9kZSkud3JhcChkb20oKS5mcm9tSFRNTChobC53cmFwcGVyKVswXSk7XG4gICAgICBoaWdobGlnaHRzLnB1c2goaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBobERlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24oaGxEZXNjcmlwdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkZXNlcmlhbGl6YXRpb25GbihobERlc2NyaXB0b3IpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW4ndCBkZXNlcmlhbGl6ZSBoaWdobGlnaHQgZGVzY3JpcHRvci4gQ2F1c2U6IFwiICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBoaWdobGlnaHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBoaWdobGlnaHRzIGdpdmVuIHRleHQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gdGV4dCB0byBzZWFyY2ggZm9yXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nhc2VTZW5zaXRpdmVdIC0gaWYgc2V0IHRvIHRydWUsIHBlcmZvcm1zIGNhc2Ugc2Vuc2l0aXZlIHNlYXJjaCAoZGVmYXVsdDogdHJ1ZSlcbiAgICogQG1lbWJlcm9mIFRleHRIaWdobGlnaHRlclxuICAgKi9cbiAgZmluZCh0ZXh0LCBjYXNlU2Vuc2l0aXZlKSB7XG4gICAgbGV0IHduZCA9IGRvbSh0aGlzLmVsKS5nZXRXaW5kb3coKSxcbiAgICAgIHNjcm9sbFggPSB3bmQuc2Nyb2xsWCxcbiAgICAgIHNjcm9sbFkgPSB3bmQuc2Nyb2xsWSxcbiAgICAgIGNhc2VTZW5zID0gdHlwZW9mIGNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2FzZVNlbnNpdGl2ZTtcblxuICAgIGRvbSh0aGlzLmVsKS5yZW1vdmVBbGxSYW5nZXMoKTtcblxuICAgIGlmICh3bmQuZmluZCkge1xuICAgICAgd2hpbGUgKHduZC5maW5kKHRleHQsIGNhc2VTZW5zKSkge1xuICAgICAgICB0aGlzLmRvSGlnaGxpZ2h0KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKSB7XG4gICAgICBsZXQgdGV4dFJhbmdlID0gd25kLmRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gICAgICB0ZXh0UmFuZ2UubW92ZVRvRWxlbWVudFRleHQodGhpcy5lbCk7XG4gICAgICB3aGlsZSAodGV4dFJhbmdlLmZpbmRUZXh0KHRleHQsIDEsIGNhc2VTZW5zID8gNCA6IDApKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZG9tKHRoaXMuZWwpLmNvbnRhaW5zKHRleHRSYW5nZS5wYXJlbnRFbGVtZW50KCkpICYmXG4gICAgICAgICAgdGV4dFJhbmdlLnBhcmVudEVsZW1lbnQoKSAhPT0gdGhpcy5lbFxuICAgICAgICApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgdGhpcy5kb0hpZ2hsaWdodCh0cnVlKTtcbiAgICAgICAgdGV4dFJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb20odGhpcy5lbCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgd25kLnNjcm9sbFRvKHNjcm9sbFgsIHNjcm9sbFkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRIaWdobGlnaHRlcjtcbiIsIi8qKlxuICogUmV0dXJucyBhcnJheSB3aXRob3V0IGR1cGxpY2F0ZWQgdmFsdWVzLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWUoYXJyKSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKHZhbHVlLCBpZHgsIHNlbGYpIHtcbiAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaWR4O1xuICB9KTtcbn1cbiIsImV4cG9ydCBjb25zdCBOT0RFX1RZUEUgPSB7IEVMRU1FTlRfTk9ERTogMSwgVEVYVF9OT0RFOiAzIH07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFrZSBET00gbWFuaXB1bGF0aW9uIGVhc2llci5cbiAqIEBwYXJhbSB7Tm9kZXxIVE1MRWxlbWVudH0gW2VsXSAtIGJhc2UgRE9NIGVsZW1lbnQgdG8gbWFuaXB1bGF0ZVxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuY29uc3QgZG9tID0gZnVuY3Rpb24oZWwpIHtcbiAgcmV0dXJuIC8qKiBAbGVuZHMgZG9tICoqLyB7XG4gICAgLyoqXG4gICAgICogQWRkcyBjbGFzcyB0byBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxiKVwiICsgY2xhc3NOYW1lICsgXCIoXFxcXGJ8JClcIiwgXCJnaVwiKSxcbiAgICAgICAgICBcIiBcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQcmVwZW5kcyBjaGlsZCBub2RlcyB0byBiYXNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtOb2RlW119IG5vZGVzVG9QcmVwZW5kXG4gICAgICovXG4gICAgcHJlcGVuZDogZnVuY3Rpb24obm9kZXNUb1ByZXBlbmQpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGVzVG9QcmVwZW5kKSxcbiAgICAgICAgaSA9IG5vZGVzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbC5pbnNlcnRCZWZvcmUobm9kZXNbaV0sIGVsLmZpcnN0Q2hpbGQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIGNoaWxkIG5vZGVzIHRvIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge05vZGVbXX0gbm9kZXNUb0FwcGVuZFxuICAgICAqL1xuICAgIGFwcGVuZDogZnVuY3Rpb24obm9kZXNUb0FwcGVuZCkge1xuICAgICAgbGV0IG5vZGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZXNUb0FwcGVuZCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGFmdGVyIHJlZkVsLlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gcmVmRWwgLSBub2RlIGFmdGVyIHdoaWNoIGJhc2UgZWxlbWVudCB3aWxsIGJlIGluc2VydGVkXG4gICAgICogQHJldHVybnMge05vZGV9IC0gaW5zZXJ0ZWQgZWxlbWVudFxuICAgICAqL1xuICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbC5uZXh0U2libGluZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgYmFzZSBlbGVtZW50IGJlZm9yZSByZWZFbC5cbiAgICAgKiBAcGFyYW0ge05vZGV9IHJlZkVsIC0gbm9kZSBiZWZvcmUgd2hpY2ggYmFzZSBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWRcbiAgICAgKiBAcmV0dXJucyB7Tm9kZX0gLSBpbnNlcnRlZCBlbGVtZW50XG4gICAgICovXG4gICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihyZWZFbCkge1xuICAgICAgcmV0dXJuIHJlZkVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCByZWZFbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYmFzZSBlbGVtZW50IGZyb20gRE9NLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgIGVsID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIGJhc2UgZWxlbWVudCBjb250YWlucyBnaXZlbiBjaGlsZC5cbiAgICAgKiBAcGFyYW0ge05vZGV8SFRNTEVsZW1lbnR9IGNoaWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gZWwgIT09IGNoaWxkICYmIGVsLmNvbnRhaW5zKGNoaWxkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYmFzZSBlbGVtZW50IGluIHdyYXBwZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB3cmFwcGVyXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSB3cmFwcGVyIGVsZW1lbnRcbiAgICAgKi9cbiAgICB3cmFwOiBmdW5jdGlvbih3cmFwcGVyKSB7XG4gICAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgICB9XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVud3JhcHMgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtOb2RlW119IC0gY2hpbGQgbm9kZXMgb2YgdW53cmFwcGVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgdW53cmFwOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBub2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLmNoaWxkTm9kZXMpLFxuICAgICAgICB3cmFwcGVyO1xuXG4gICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgd3JhcHBlciA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgZG9tKG5vZGUpLmluc2VydEJlZm9yZShub2RlLnBhcmVudE5vZGUpO1xuICAgICAgfSk7XG4gICAgICBkb20od3JhcHBlcikucmVtb3ZlKCk7XG5cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBiYXNlIGVsZW1lbnQgcGFyZW50cy5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRbXX1cbiAgICAgKi9cbiAgICBwYXJlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwYXJlbnQsXG4gICAgICAgIHBhdGggPSBbXTtcblxuICAgICAgd2hpbGUgKChwYXJlbnQgPSBlbC5wYXJlbnROb2RlKSkge1xuICAgICAgICBwYXRoLnB1c2gocGFyZW50KTtcbiAgICAgICAgZWwgPSBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXRoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGJhc2UgZWxlbWVudCBwYXJlbnRzLCBleGNsdWRpbmcgdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxuICAgICAqL1xuICAgIHBhcmVudHNXaXRob3V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50cygpLmZpbHRlcihlbGVtID0+IGVsZW0gIT09IGRvY3VtZW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplcyB0ZXh0IG5vZGVzIHdpdGhpbiBiYXNlIGVsZW1lbnQsIGllLiBtZXJnZXMgc2libGluZyB0ZXh0IG5vZGVzIGFuZCBhc3N1cmVzIHRoYXQgZXZlcnlcbiAgICAgKiBlbGVtZW50IG5vZGUgaGFzIG9ubHkgb25lIHRleHQgbm9kZS5cbiAgICAgKiBJdCBzaG91bGQgZG9lcyB0aGUgc2FtZSBhcyBzdGFuZGFyZCBlbGVtZW50Lm5vcm1hbGl6ZSwgYnV0IElFIGltcGxlbWVudHMgaXQgaW5jb3JyZWN0bHkuXG4gICAgICovXG4gICAgbm9ybWFsaXplVGV4dE5vZGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgIGVsLm5leHRTaWJsaW5nICYmXG4gICAgICAgICAgZWwubmV4dFNpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREVcbiAgICAgICAgKSB7XG4gICAgICAgICAgZWwubm9kZVZhbHVlICs9IGVsLm5leHRTaWJsaW5nLm5vZGVWYWx1ZTtcbiAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9tKGVsLmZpcnN0Q2hpbGQpLm5vcm1hbGl6ZVRleHROb2RlcygpO1xuICAgICAgfVxuICAgICAgZG9tKGVsLm5leHRTaWJsaW5nKS5ub3JtYWxpemVUZXh0Tm9kZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBlbGVtZW50IGJhY2tncm91bmQgY29sb3IuXG4gICAgICogQHJldHVybnMge0NTU1N0eWxlRGVjbGFyYXRpb24uYmFja2dyb3VuZENvbG9yfVxuICAgICAqL1xuICAgIGNvbG9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgZG9tIGVsZW1lbnQgZnJvbSBnaXZlbiBodG1sIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuICAgICAqIEByZXR1cm5zIHtOb2RlTGlzdH1cbiAgICAgKi9cbiAgICBmcm9tSFRNTDogZnVuY3Rpb24oaHRtbCkge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgIHJldHVybiBkaXYuY2hpbGROb2RlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBmaXJzdCByYW5nZSBvZiB0aGUgd2luZG93IG9mIGJhc2UgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7UmFuZ2V9XG4gICAgICovXG4gICAgZ2V0UmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNlbGVjdGlvbiA9IGRvbShlbCkuZ2V0U2VsZWN0aW9uKCksXG4gICAgICAgIHJhbmdlO1xuXG4gICAgICBpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgICAgIHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByYW5nZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgcmFuZ2VzIG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqL1xuICAgIHJlbW92ZUFsbFJhbmdlczogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZG9tKGVsKS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBzZWxlY3Rpb24gb2JqZWN0IG9mIHRoZSB3aW5kb3cgb2YgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtTZWxlY3Rpb259XG4gICAgICovXG4gICAgZ2V0U2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBkb20oZWwpXG4gICAgICAgIC5nZXRXaW5kb3coKVxuICAgICAgICAuZ2V0U2VsZWN0aW9uKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2luZG93IG9mIHRoZSBiYXNlIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge1dpbmRvd31cbiAgICAgKi9cbiAgICBnZXRXaW5kb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRvbShlbCkuZ2V0RG9jdW1lbnQoKS5kZWZhdWx0VmlldztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBkb2N1bWVudCBvZiB0aGUgYmFzZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRG9jdW1lbnR9XG4gICAgICovXG4gICAgZ2V0RG9jdW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gaWYgb3duZXJEb2N1bWVudCBpcyBudWxsIHRoZW4gZWwgaXMgdGhlIGRvY3VtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiBlbC5vd25lckRvY3VtZW50IHx8IGVsO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRvbTtcbiIsImV4cG9ydCBmdW5jdGlvbiBiaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5iaW5kRXZlbnRzKGVsLCBzY29wZSkge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBzY29wZS5oaWdobGlnaHRIYW5kbGVyLmJpbmQoc2NvcGUpKTtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHNjb3BlLmhpZ2hsaWdodEhhbmRsZXIuYmluZChzY29wZSkpO1xufVxuIiwiaW1wb3J0IGRvbSwgeyBOT0RFX1RZUEUgfSBmcm9tIFwiLi9kb21cIjtcblxuLyoqXG4gKiBUYWtlcyByYW5nZSBvYmplY3QgYXMgcGFyYW1ldGVyIGFuZCByZWZpbmVzIGl0IGJvdW5kYXJpZXNcbiAqIEBwYXJhbSByYW5nZVxuICogQHJldHVybnMge29iamVjdH0gcmVmaW5lZCBib3VuZGFyaWVzIGFuZCBpbml0aWFsIHN0YXRlIG9mIGhpZ2hsaWdodGluZyBhbGdvcml0aG0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmVSYW5nZUJvdW5kYXJpZXMocmFuZ2UpIHtcbiAgbGV0IHN0YXJ0Q29udGFpbmVyID0gcmFuZ2Uuc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyID0gcmFuZ2UuZW5kQ29udGFpbmVyLFxuICAgIGFuY2VzdG9yID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXIsXG4gICAgZ29EZWVwZXIgPSB0cnVlO1xuXG4gIGlmIChyYW5nZS5lbmRPZmZzZXQgPT09IDApIHtcbiAgICB3aGlsZSAoXG4gICAgICAhZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZyAmJlxuICAgICAgZW5kQ29udGFpbmVyLnBhcmVudE5vZGUgIT09IGFuY2VzdG9yXG4gICAgKSB7XG4gICAgICBlbmRDb250YWluZXIgPSBlbmRDb250YWluZXIucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgZW5kQ29udGFpbmVyID0gZW5kQ29udGFpbmVyLnByZXZpb3VzU2libGluZztcbiAgfSBlbHNlIGlmIChlbmRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2UuZW5kT2Zmc2V0IDwgZW5kQ29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGVuZENvbnRhaW5lci5zcGxpdFRleHQocmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2UuZW5kT2Zmc2V0ID4gMCkge1xuICAgIGVuZENvbnRhaW5lciA9IGVuZENvbnRhaW5lci5jaGlsZE5vZGVzLml0ZW0ocmFuZ2UuZW5kT2Zmc2V0IC0gMSk7XG4gIH1cblxuICBpZiAoc3RhcnRDb250YWluZXIubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUX05PREUpIHtcbiAgICBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPT09IHN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGdvRGVlcGVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChyYW5nZS5zdGFydE9mZnNldCA+IDApIHtcbiAgICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuc3BsaXRUZXh0KHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgICAgIGlmIChlbmRDb250YWluZXIgPT09IHN0YXJ0Q29udGFpbmVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBlbmRDb250YWluZXIgPSBzdGFydENvbnRhaW5lcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAocmFuZ2Uuc3RhcnRPZmZzZXQgPCBzdGFydENvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgIHN0YXJ0Q29udGFpbmVyID0gc3RhcnRDb250YWluZXIuY2hpbGROb2Rlcy5pdGVtKHJhbmdlLnN0YXJ0T2Zmc2V0KTtcbiAgfSBlbHNlIHtcbiAgICBzdGFydENvbnRhaW5lciA9IHN0YXJ0Q29udGFpbmVyLm5leHRTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydENvbnRhaW5lcjogc3RhcnRDb250YWluZXIsXG4gICAgZW5kQ29udGFpbmVyOiBlbmRDb250YWluZXIsXG4gICAgZ29EZWVwZXI6IGdvRGVlcGVyXG4gIH07XG59XG5cbi8qKlxuICogU29ydHMgYXJyYXkgb2YgRE9NIGVsZW1lbnRzIGJ5IGl0cyBkZXB0aCBpbiBET00gdHJlZS5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gYXJyIC0gYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVzY2VuZGluZyAtIG9yZGVyIG9mIHNvcnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlEZXB0aChhcnIsIGRlc2NlbmRpbmcpIHtcbiAgYXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiAoXG4gICAgICBkb20oZGVzY2VuZGluZyA/IGIgOiBhKS5wYXJlbnRzKCkubGVuZ3RoIC1cbiAgICAgIGRvbShkZXNjZW5kaW5nID8gYSA6IGIpLnBhcmVudHMoKS5sZW5ndGhcbiAgICApO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZWxlbWVudHMgYSBpIGIgaGF2ZSB0aGUgc2FtZSBjb2xvci5cbiAqIEBwYXJhbSB7Tm9kZX0gYVxuICogQHBhcmFtIHtOb2RlfSBiXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhdmVTYW1lQ29sb3IoYSwgYikge1xuICByZXR1cm4gZG9tKGEpLmNvbG9yKCkgPT09IGRvbShiKS5jb2xvcigpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgd3JhcHBlciBmb3IgaGlnaGxpZ2h0cy5cbiAqIFRleHRIaWdobGlnaHRlciBpbnN0YW5jZSBjYWxscyB0aGlzIG1ldGhvZCBlYWNoIHRpbWUgaXQgbmVlZHMgdG8gY3JlYXRlIGhpZ2hsaWdodHMgYW5kIHBhc3Mgb3B0aW9ucyByZXRyaWV2ZWRcbiAqIGluIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgc2FtZSBvYmplY3QgYXMgaW4gVGV4dEhpZ2hsaWdodGVyIGNvbnN0cnVjdG9yLlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihvcHRpb25zKSB7XG4gIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIHNwYW4uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgc3Bhbi5jbGFzc05hbWUgPSBvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3M7XG4gIHJldHVybiBzcGFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRleHROb2RlQXRMb2NhdGlvbihlbGVtZW50LCBsb2NhdGlvbkluQ2hpbGROb2Rlcykge1xuICBjb25zb2xlLmxvZyhcIkVsZW1lbnQgYXMgcGFyYW1ldGVyOiBcIiwgZWxlbWVudCk7XG4gIGxldCB0ZXh0Tm9kZUVsZW1lbnQgPSBlbGVtZW50O1xuICBsZXQgaSA9IDA7XG4gIHdoaWxlICh0ZXh0Tm9kZUVsZW1lbnQgJiYgdGV4dE5vZGVFbGVtZW50Lm5vZGVUeXBlICE9PSBOT0RFX1RZUEUuVEVYVF9OT0RFKSB7XG4gICAgY29uc29sZS5sb2coYHRleHROb2RlRWxlbWVudCBzdGVwICR7aX1gLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICAgIGlmIChsb2NhdGlvbkluQ2hpbGROb2RlcyA9PT0gXCJzdGFydFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0ZXh0Tm9kZUVsZW1lbnQgPSB0ZXh0Tm9kZUVsZW1lbnQuY2hpbGROb2Rlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5uZXh0U2libGluZztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxvY2F0aW9uSW5DaGlsZE5vZGVzID09PSBcImVuZFwiKSB7XG4gICAgICBpZiAodGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgbGFzdEluZGV4ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdGV4dE5vZGVFbGVtZW50ID0gdGV4dE5vZGVFbGVtZW50LmNoaWxkTm9kZXNbbGFzdEluZGV4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHROb2RlRWxlbWVudCA9IHRleHROb2RlRWxlbWVudC5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHROb2RlRWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwidGV4dCBub2RlIGVsZW1lbnQgcmV0dXJuZWQ6IFwiLCB0ZXh0Tm9kZUVsZW1lbnQpO1xuICByZXR1cm4gdGV4dE5vZGVFbGVtZW50O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGVyZSB0byBpbmplY3QgYSBoaWdobGlnaHQgYmFzZWQgb24gaXQncyBvZmZzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBoaWdobGlnaHRcbiAqIEBwYXJhbSB7Kn0gcGFyZW50Tm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZE5vZGVBbmRPZmZzZXQoaGlnaGxpZ2h0LCBwYXJlbnROb2RlKSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG4gIGxldCBjdXJyZW50T2Zmc2V0ID0gMDtcbiAgbGV0IG9mZnNldFdpdGhpbk5vZGUgPSAwO1xuICBsZXQgbG9jYXRpb25Gb3VuZCA9IGZhbHNlO1xuXG4gIHdoaWxlIChcbiAgICBjdXJyZW50Tm9kZSAmJlxuICAgICFsb2NhdGlvbkZvdW5kICYmXG4gICAgKGN1cnJlbnRPZmZzZXQgPCBoaWdobGlnaHQub2Zmc2V0IHx8XG4gICAgICAoY3VycmVudE9mZnNldCA9PT0gaGlnaGxpZ2h0Lm9mZnNldCAmJiBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA+IDApKVxuICApIHtcbiAgICBjb25zdCBlbmRPZk5vZGVPZmZzZXQgPSBjdXJyZW50T2Zmc2V0ICsgY3VycmVudE5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuXG4gICAgaWYgKGVuZE9mTm9kZU9mZnNldCA+IGhpZ2hsaWdodC5vZmZzZXQpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvZmZzZXRXaXRoaW5Ob2RlID0gaGlnaGxpZ2h0Lm9mZnNldCAtIGN1cnJlbnRPZmZzZXQ7XG4gICAgICAgIGxvY2F0aW9uRm91bmQgPSB0cnVlO1xuICAgICAgICBjdXJyZW50T2Zmc2V0ID0gY3VycmVudE9mZnNldCArIG9mZnNldFdpdGhpbk5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRPZmZzZXQgPSBlbmRPZk5vZGVPZmZzZXQ7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG5vZGU6IGN1cnJlbnROb2RlLCBvZmZzZXQ6IG9mZnNldFdpdGhpbk5vZGUgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRPZmZzZXQoY2hpbGRFbGVtZW50LCByb290RWxlbWVudCkge1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgbGV0IGNoaWxkTm9kZXM7XG5cbiAgbGV0IGN1cnJlbnRFbGVtZW50ID0gY2hpbGRFbGVtZW50O1xuICBsZXQgbGV2ZWwgPSAxO1xuICBkbyB7XG4gICAgY2hpbGROb2RlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgICAgY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzXG4gICAgKTtcbiAgICBjb25zdCBjaGlsZEVsZW1lbnRJbmRleCA9IGNoaWxkTm9kZXMuaW5kZXhPZihjdXJyZW50RWxlbWVudCk7XG4gICAgY29uc3Qgb2Zmc2V0SW5DdXJyZW50UGFyZW50ID0gZ2V0VGV4dE9mZnNldEJlZm9yZShcbiAgICAgIGNoaWxkTm9kZXMsXG4gICAgICBjaGlsZEVsZW1lbnRJbmRleFxuICAgICk7XG4gICAgb2Zmc2V0ICs9IG9mZnNldEluQ3VycmVudFBhcmVudDtcbiAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGU7XG4gICAgbGV2ZWwgKz0gMTtcbiAgfSB3aGlsZSAoY3VycmVudEVsZW1lbnQgIT09IHJvb3RFbGVtZW50IHx8ICFjdXJyZW50RWxlbWVudCk7XG5cbiAgcmV0dXJuIG9mZnNldDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dE9mZnNldEJlZm9yZShjaGlsZE5vZGVzLCBjdXRJbmRleCkge1xuICBsZXQgdGV4dE9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY3V0SW5kZXg7IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gY2hpbGROb2Rlc1tpXTtcbiAgICAvLyBVc2UgdGV4dENvbnRlbnQgYW5kIG5vdCBpbm5lckhUTUwgdG8gYWNjb3VudCBmb3IgaW52aXNpYmxlIGNoYXJhY3RlcnMgYXMgd2VsbC5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS90ZXh0Q29udGVudFxuICAgIGNvbnN0IHRleHQgPSBjdXJyZW50Tm9kZS50ZXh0Q29udGVudDtcbiAgICBpZiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRleHRPZmZzZXQgKz0gdGV4dC5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiB0ZXh0T2Zmc2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEZpcnN0Tm9uU2hhcmVkUGFyZW50KGVsZW1lbnRzKSB7XG4gIGxldCBjaGlsZEVsZW1lbnQgPSBlbGVtZW50cy5jaGlsZEVsZW1lbnQ7XG4gIGxldCBvdGhlckVsZW1lbnQgPSBlbGVtZW50cy5vdGhlckVsZW1lbnQ7XG4gIGxldCBwYXJlbnRzID0gZG9tKGNoaWxkRWxlbWVudCkucGFyZW50c1dpdGhvdXREb2N1bWVudCgpO1xuICBsZXQgaSA9IDA7XG4gIGxldCBmaXJzdE5vblNoYXJlZFBhcmVudCA9IG51bGw7XG4gIHdoaWxlICghZmlyc3ROb25TaGFyZWRQYXJlbnQgJiYgaSA8IHBhcmVudHMubGVuZ3RoKSB7XG4gICAgbGV0IGN1cnJlbnRQYXJlbnQgPSBwYXJlbnRzW2ldO1xuXG4gICAgaWYgKGN1cnJlbnRQYXJlbnQuY29udGFpbnMob3RoZXJFbGVtZW50KSAmJiBpID4gMCkge1xuICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50UGFyZW50IGNvbnRhaW5zIG90aGVyIGVsZW1lbnQhXCIsIGN1cnJlbnRQYXJlbnQpO1xuICAgICAgZmlyc3ROb25TaGFyZWRQYXJlbnQgPSBwYXJlbnRzW2kgLSAxXTtcbiAgICB9XG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIGZpcnN0Tm9uU2hhcmVkUGFyZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEVsZW1lbnRDb250ZW50Rm9ySGlnaGxpZ2h0KHBhcmFtcykge1xuICBsZXQgZWxlbWVudCA9IHBhcmFtcy5lbGVtZW50O1xuICBsZXQgZWxlbWVudEFuY2VzdG9yID0gcGFyYW1zLmVsZW1lbnRBbmNlc3RvcjtcbiAgbGV0IG9wdGlvbnMgPSBwYXJhbXMub3B0aW9ucztcbiAgbGV0IGxvY2F0aW9uSW5TZWxlY3Rpb24gPSBwYXJhbXMubG9jYXRpb25JblNlbGVjdGlvbjtcblxuICBsZXQgZWxlbWVudEFuY2VzdG9yQ29weSA9IGVsZW1lbnRBbmNlc3Rvci5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgLy8gQmVnaW5uaW5nIG9mIGNoaWxkTm9kZXMgbGlzdCBmb3IgZW5kIGNvbnRhaW5lciBpbiBzZWxlY3Rpb25cbiAgLy8gYW5kIGVuZCBvZiBjaGlsZE5vZGVzIGxpc3QgZm9yIHN0YXJ0IGNvbnRhaW5lciBpbiBzZWxlY3Rpb24uXG4gIGxldCBsb2NhdGlvbkluQ2hpbGROb2RlcyA9IGxvY2F0aW9uSW5TZWxlY3Rpb24gPT09IFwic3RhcnRcIiA/IFwiZW5kXCIgOiBcInN0YXJ0XCI7XG4gIGxldCBlbGVtZW50Q29weSA9IGZpbmRUZXh0Tm9kZUF0TG9jYXRpb24oXG4gICAgZWxlbWVudEFuY2VzdG9yQ29weSxcbiAgICBsb2NhdGlvbkluQ2hpbGROb2Rlc1xuICApO1xuICBsZXQgZWxlbWVudENvcHlQYXJlbnQgPSBlbGVtZW50Q29weS5wYXJlbnROb2RlO1xuXG4gIGxldCBzaWJsaW5nID0gZWxlbWVudENvcHkubmV4dFNpYmxpbmc7XG4gIHdoaWxlIChzaWJsaW5nKSB7XG4gICAgZWxlbWVudENvcHlQYXJlbnQucmVtb3ZlQ2hpbGQoc2libGluZyk7XG4gICAgc2libGluZyA9IGVsZW1lbnRDb3B5Lm5leHRTaWJsaW5nO1xuICB9XG5cbiAgY29uc29sZS5sb2coXCJlbGVtZW50Q29weTogXCIsIGVsZW1lbnRDb3B5KTtcbiAgY29uc29sZS5sb2coXCJlbGVtZW50Q29weVBhcmVudDogXCIsIGVsZW1lbnRDb3B5UGFyZW50KTtcblxuICAvLyBDbGVhbiBvdXQgYW55IG5lc3RlZCBoaWdobGlnaHQgd3JhcHBlcnMuXG4gIGlmIChcbiAgICBlbGVtZW50Q29weVBhcmVudCAhPT0gZWxlbWVudEFuY2VzdG9yQ29weSAmJlxuICAgIGVsZW1lbnRDb3B5UGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhvcHRpb25zLmhpZ2hsaWdodGVkQ2xhc3MpXG4gICkge1xuICAgIGRvbShlbGVtZW50Q29weVBhcmVudCkudW53cmFwKCk7XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIHRleHQgbm9kZSB0aGF0IHdlIG5lZWQgZm9yIHRoZSBuZXcgaGlnaGxpZ2h0XG4gIC8vIGZyb20gdGhlIGV4aXN0aW5nIGhpZ2hsaWdodCBvciBvdGhlciBlbGVtZW50LlxuICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cbiAgcmV0dXJuIGVsZW1lbnRBbmNlc3RvckNvcHk7XG59XG5cbi8qKlxuICogR3JvdXBzIGdpdmVuIGhpZ2hsaWdodHMgYnkgdGltZXN0YW1wLlxuICogQHBhcmFtIHtBcnJheX0gaGlnaGxpZ2h0c1xuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcEF0dHJcbiAqIEByZXR1cm5zIHtBcnJheX0gR3JvdXBlZCBoaWdobGlnaHRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBIaWdobGlnaHRzKGhpZ2hsaWdodHMsIHRpbWVzdGFtcEF0dHIpIHtcbiAgbGV0IG9yZGVyID0gW10sXG4gICAgY2h1bmtzID0ge30sXG4gICAgZ3JvdXBlZCA9IFtdO1xuXG4gIGhpZ2hsaWdodHMuZm9yRWFjaChmdW5jdGlvbihobCkge1xuICAgIGxldCB0aW1lc3RhbXAgPSBobC5nZXRBdHRyaWJ1dGUodGltZXN0YW1wQXR0cik7XG5cbiAgICBpZiAodHlwZW9mIGNodW5rc1t0aW1lc3RhbXBdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjaHVua3NbdGltZXN0YW1wXSA9IFtdO1xuICAgICAgb3JkZXIucHVzaCh0aW1lc3RhbXApO1xuICAgIH1cblxuICAgIGNodW5rc1t0aW1lc3RhbXBdLnB1c2goaGwpO1xuICB9KTtcblxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgIGxldCBncm91cCA9IGNodW5rc1t0aW1lc3RhbXBdO1xuXG4gICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAgIGNodW5rczogZ3JvdXAsXG4gICAgICB0aW1lc3RhbXA6IHRpbWVzdGFtcCxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihoKSB7XG4gICAgICAgICAgICByZXR1cm4gaC50ZXh0Q29udGVudDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5qb2luKFwiXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gZ3JvdXBlZDtcbn1cbiJdfQ==
