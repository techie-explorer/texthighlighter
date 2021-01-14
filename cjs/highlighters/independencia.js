"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _highlights = require("../utils/highlights");

var _config = require("../config");

var _dom = _interopRequireDefault(require("../utils/dom"));

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
 *
 * @typedef {Object} HlDescriptor
 * @property {string} 0 - The span wrapper injected for the highlight.
 * @property {string} 1 - The highlighted text.
 * @property {number} 2 - The text offset relevant to the root element of a highlight.
 * @property {number} 3 - Length of highlight.
 *
 * @typedef {Object} PreprocessDescriptorsResult
 * @property {HlDescriptor[]} descriptors
 * @property {Object} meta - Any application-specific meta data created in the preprocessing stage that is
 *  used after highlights have been created.
 *
 * @callback PreprocessDescriptors
 * @param {Range} range
 * @param {HlDescriptor[]} highlightDescriptors
 * @param {number} timestamp
 * @return {PreprocessDescriptorsResult}
 *
 * @callback OnAfterHighlightCallbackV2
 * @param {Range} range
 * @param {HlDescriptor[]} highlightDescriptors
 * @param {number} timestamp
 * @param {Object} meta
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
   * @param {string} options.excludeNodes - Node types to exclude when calculating offsets and determining where to inject highlights.
   * @param {boolean} options.excludeWhiteSpaceAndReturns - Whether or not to exclude white space and carriage returns while calculating text content
   *                                                        offsets. The white space that is excluded is only the white space that comes directly
   *                                                        after carriage returns.
   * @param {boolean} options.normalizeElements - Whether or not to normalise elements on the DOM when highlights are created, deserialised
   *  into the DOM, focused and deselected. Normalising events has a huge performance implication when enabling highlighting for a root element
   *  that contains thousands of nodes.
   * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
   * @param {string} options.contextClass - class added to element to which highlighter is applied,
   *  'highlighter-context' by default.
   * @param {string} options.namespaceDataAttribute - Data attribute to identify highlights that belong to a particular highlight instance.
   * @param {Record<string, number>} options.priorities - Defines priorities for multiple highlighters, the keys
   *                                                      are the namespaces for highlighters and the values are the priorities
   *                                                      where the higher number has the higher priority.
   *                                                      For example { userHighlights: 1, staticHighlights: 2 } would mean
   *                                                      that highlights from the "static" highlighter will always appear above highlights
   *                                                      from the "user" highlighter.
   * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
   *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
   * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
   *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
   * @param {PreprocessDescriptors} options.preprocessDescriptors - function called after the user has carried out the action
   *  to trigger creation of highlights after making a text selection. This should be used to customise the highlight span wrapper
   *  with custom data attributes or styles required before the highlight is loaded into the DOM.
   *  This callback must return an array of highlight descriptors.
   * @param {OnAfterHighlightCallbackV2} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param. This is called after the highlight has been created in the DOM.
   * @class IndependenciaHighlighter
   */
  function IndependenciaHighlighter(element, options) {
    _classCallCheck(this, IndependenciaHighlighter);

    this.el = element;
    this.options = options;
    this.removedHighlights = {};
  }
  /**
   * Highlights current range.
   * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
   * @memberof IndependenciaHighlighter
   */


  _createClass(IndependenciaHighlighter, [{
    key: "doHighlight",
    value: function doHighlight(keepRange) {
      var range = (0, _dom["default"])(this.el).getRange(),
          wrapper,
          timestamp;

      if (!range || range.collapsed) {
        return;
      }

      var eventItems = [];
      (0, _dom["default"])(this.el).turnOffEventHandlers(eventItems);

      if (this.options.onBeforeHighlight(range) === true) {
        timestamp = +new Date();
        wrapper = (0, _highlights.createWrapper)(this.options);
        wrapper.setAttribute(_config.TIMESTAMP_ATTR, timestamp);
        var descriptors = (0, _highlights.createDescriptors)({
          rootElement: this.el,
          range: range,
          wrapper: wrapper,
          excludeNodeNames: this.options.excludeNodes,
          dataAttr: this.options.namespaceDataAttribute,
          excludeWhiteSpaceAndReturns: this.options.excludeWhiteSpaceAndReturns
        });

        var _this$options$preproc = this.options.preprocessDescriptors(range, descriptors, timestamp),
            processedDescriptors = _this$options$preproc.descriptors,
            meta = _this$options$preproc.meta;

        if (!meta[this.options.cancelProperty]) {
          this.deserializeHighlights(JSON.stringify(processedDescriptors));
          this.options.onAfterHighlight(range, processedDescriptors, timestamp, meta);
        }
      }

      if (!keepRange) {
        (0, _dom["default"])(this.el).removeAllRanges();
      }

      (0, _dom["default"])(this.el).turnOnEventHandlers(eventItems);
    }
    /**
     * Normalizes highlights and the dom. Ensures text nodes within any given element node are merged together, elements with the
     * same ID next to each other are merged together and highlights with the same ID next to each other are merged together.
     *
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "normalizeHighlights",
    value: function normalizeHighlights() {
      (0, _dom["default"])(this.el).normalizeElements(this.options.highlightedClass, this.options.namespaceDataAttribute);
    }
    /**
     * Removes one highlight if an ID is provided, removes all highlights in the provided
     * element otherwise.
     *
     * @param {HTMLElement} element - element to remove highlights from
     * @param {string} id - ID of highlight to remove
     * Removes highlights from element using highlight ID.
     * If no id is given, all highlights are removed.
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "removeHighlights",
    value: function removeHighlights(element, id) {
      var container = element || this.el;
      var highlights = this.getHighlights({
        container: container,
        dataAttr: this.options.namespaceDataAttribute
      }),
          self = this;
      highlights.forEach(function (hl) {
        if (!id || id && hl.classList.contains(id)) {
          var highlightId = hl.classList.length > 1 ? hl.classList[1] : null;

          if (highlightId && self.removedHighlights[highlightId]) {
            (0, _dom["default"])(hl).unwrap();
          } else if (self.options.onRemoveHighlight(hl) === true) {
            (0, _dom["default"])(hl).unwrap();

            if (highlightId) {
              self.removedHighlights[highlightId] = true;
            }
          }
        }
      });

      if (this.options.normalizeElements) {
        this.normalizeHighlights(highlights);
      }
    }
    /**
     * Returns highlights from given container.
     * @param params
     * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
     * highlighter is applied to.
     * @param {string} [params.dataAttr] - Namespaced used to identify highlights for a specific highlighter instance.
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
        dataAttr: params.dataAttr,
        timestampAttr: _config.TIMESTAMP_ATTR
      }, params);

      return (0, _highlights.retrieveHighlights)(mergedParams);
    }
    /**
     * Returns true if element is a highlight.
     *
     * @param el - element to check.
     * @param dataAttr - data attribute to determine if the element is a highlight
     * @returns {boolean}
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "isHighlight",
    value: function isHighlight(el, dataAttr) {
      return (0, _highlights.isElementHighlight)(el, dataAttr);
    }
    /**
     * Serializes the highlight belonging to the ID.
     * @param id - ID of the highlight to serialise
     * @returns {string} - stringified JSON with highlights definition
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "serializeHighlights",
    value: function serializeHighlights(id) {
      var highlights = this.getHighlights({
        dataAttr: this.options.namespaceDataAttribute
      }),
          self = this;
      (0, _highlights.sortByDepth)(highlights, false);

      if (highlights.length === 0) {
        return [];
      }

      var eventItems = [];
      (0, _dom["default"])(this.el).turnOffEventHandlers(eventItems); // Even if there are multiple elements for a given highlight, the first
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
        length: length,
        excludeTags: this.options.excludeNodes,
        excludeWhiteSpaceAndReturns: this.options.excludeWhiteSpaceAndReturns
      }), offset, length];
      (0, _dom["default"])(this.el).turnOnEventHandlers(eventItems);
      return JSON.stringify([descriptor]);
    }
    /**
     * Deserializes the independent form of highlights.
     *
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof IndependenciaHighlighter
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

      var eventItems = [];
      (0, _dom["default"])(this.el).turnOffEventHandlers(eventItems);

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

        var _findNodesAndOffsets = (0, _highlights.findNodesAndOffsets)(hl, parentNode, self.options.excludeNodes, self.options.excludeWhiteSpaceAndReturns),
            highlightNodes = _findNodesAndOffsets.nodesAndOffsets;

        highlightNodes.forEach(function (_ref) {
          var node = _ref.node,
              offsetWithinNode = _ref.offset,
              lengthInNode = _ref.length;
          var _self$options = self.options,
              priorities = _self$options.priorities,
              namespaceDataAttribute = _self$options.namespaceDataAttribute;
          var higherPriorityHighlights = (0, _highlights.findHigherPriorityHighlights)(parentNode, node, priorities, namespaceDataAttribute); // Don't call innerText to prevent DOM layout reflow for every single node,
          // in some cases there can be thousands of nodes subject to highlighting.
          // Visible text content may be a bit of a naive name but represents
          // everything excluding new lines and white space.

          var visibleTextContent = node.textContent.trim().replace(/(\r\n|\n|\r)/gm, "");

          if (visibleTextContent.length > 0) {
            hlNode = node.splitText(offsetWithinNode);
            hlNode.splitText(lengthInNode);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
              (0, _dom["default"])(hlNode.nextSibling).remove();
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
              (0, _dom["default"])(hlNode.previousSibling).remove();
            } // Ensure highlights from higher priority highlighters retain
            // focus by nesting their wrappers.


            higherPriorityHighlights.forEach(function (otherHighlightNode) {
              var otherHlNodeCopy = otherHighlightNode.cloneNode(false);
              hlNode = (0, _dom["default"])(hlNode).wrap(otherHlNodeCopy);
            });
            highlight = (0, _dom["default"])(hlNode).wrap((0, _dom["default"])().fromHTML(hl.wrapper)[0]);
            highlights.push(highlight);
          }
        });
      }

      hlDescriptors.forEach(function (hlDescriptor) {
        try {
          if ((0, _highlights.validateIndependenciaDescriptors)(hlDescriptor)) {
            deserialise(hlDescriptor);
          } else {
            console.warn("Can't deserialize highlight descriptors. Cause: descriptors are not valid.");
          }
        } catch (e) {
          if (console && console.warn) {
            console.warn("Can't deserialize highlight descriptor. Cause: " + e);
          }
        }
      });

      if (this.options.normalizeElements) {
        this.normalizeHighlights();
      }

      (0, _dom["default"])(this.el).turnOnEventHandlers(eventItems);
      return highlights;
    }
    /**
     * Focuses a highlight, bringing it forward in the case it is sitting behind another
     * overlapping highlight, or a highlight it is nested inside.
     *
     * @param {object} id - The id of the highlight present in the class names of all elements
     *                      in the DOM that represent the highlight.
     *
     * In order to utilise this functionality unique ids for highlights should be added to the class list in the highlight
     * wrapper within the descriptors.
     * You can do this in the onAfterHighlight callback when a highlight is first created.
     *
     * In the future it might be worth adding more flexiblity to allow for user-defined ways of storing ids to identify
     * elements in the DOM. (e.g. choosing between class name or data attributes)
     *
     * @param {string} descriptors - Optional serialised descriptors, useful in the case a highlight has no representation in the DOM
     *                        where empty highlight wrapper nodes are removed to use less dom elements.
     *
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "focusUsingId",
    value: function focusUsingId(id, descriptors) {
      var highlightElements = this.el.querySelectorAll(".".concat(id, "[").concat(this.options.namespaceDataAttribute, "=\"true\"]"));
      var eventItems = [];
      (0, _dom["default"])(this.el).turnOffEventHandlers(eventItems); // For the future, we may save by accepting the offset and length as parameters as the caller should have this data
      // from the serialised descriptors.

      if (highlightElements.length > 0) {
        var firstHighlightElement = highlightElements[0];

        var _findNodesAndOffsets2 = (0, _highlights.findNodesAndOffsets)({
          offset: Number.parseInt(firstHighlightElement.getAttribute(_config.START_OFFSET_ATTR)),
          length: Number.parseInt(firstHighlightElement.getAttribute(_config.LENGTH_ATTR))
        }, this.el, this.options.excludeNodes, this.options.excludeWhiteSpaceAndReturns),
            nodesAndOffsets = _findNodesAndOffsets2.nodesAndOffsets;

        var highlightWrapper = firstHighlightElement.cloneNode(true);
        highlightWrapper.innerHTML = "";
        (0, _highlights.focusHighlightNodes)(id, nodesAndOffsets, highlightWrapper, this.el, this.options.highlightedClass, this.options.normalizeElements, this.options.priorities, this.options.namespaceDataAttribute);
      } else if (descriptors) {
        // No elements in the DOM for the highlight?
        // let's deserialize the descriptor to bring the highlight into focus.
        this.deserializeHighlights(descriptors);
      }

      (0, _dom["default"])(this.el).turnOnEventHandlers(eventItems);
    }
    /**
     * Deselects a highlight, bringing any nested highlights in the list of descriptors
     * forward.
     *
     * In order to utilise this functionality unique ids for highlights should be added to the class list in the highlight
     * wrapper within the descriptors.
     * You can do this in the onAfterHighlight callback when a highlight is first created.
     *
     * In the future it might be worth adding more flexiblity to allow for user-defined ways of storing ids to identify
     * elements in the DOM. (e.g. choosing between class name or data attributes)
     *
     * @typedef HighlightDescriptor
     * @type {object}
     * @property {string} id
     * @property {string} serialisedDescriptor
     *
     * @param {string} id  The id of the deselected highlight.
     * @param {HighlightDescriptor[]} descriptors An array of serialised descriptors containing all the relevant highlights
     *                               that could be nested within the deselected highlight.
     *
     * @memberof IndependenciaHighlighter
     */

  }, {
    key: "deselectUsingId",
    value: function deselectUsingId(id, descriptors) {
      var _this = this;

      var deselectedHighlight = this.el.querySelector(".".concat(id));

      if (deselectedHighlight) {
        var deselectedStartOffset = Number.parseInt(deselectedHighlight.getAttribute(_config.START_OFFSET_ATTR));
        var deselectedLength = Number.parseInt(deselectedHighlight.getAttribute(_config.LENGTH_ATTR));
        var nestedDescriptors = descriptors.map(function (hlDescriptor) {
          return {
            id: hlDescriptor.id,
            descriptor: JSON.parse(hlDescriptor.serialisedDescriptor)
          };
        }).filter(function (hlDescriptor) {
          var innerDescriptor = hlDescriptor.descriptor[0];
          var offset = Number.parseInt(innerDescriptor[2]);
          var length = Number.parseInt(innerDescriptor[3]);
          return offset >= deselectedStartOffset && offset + length <= deselectedStartOffset + deselectedLength;
        });
        nestedDescriptors.sort(function (a, b) {
          var aLength = Number.parseInt(a.descriptor[0][3]);
          var bLength = Number.parseInt(b.descriptor[0][3]);
          return aLength > bLength ? -1 : 1;
        });
        nestedDescriptors.forEach(function (hlDescriptor) {
          _this.focusUsingId(hlDescriptor.id, JSON.stringify(hlDescriptor.descriptor));
        });
      }
    }
  }]);

  return IndependenciaHighlighter;
}();

var _default = IndependenciaHighlighter;
exports["default"] = _default;
