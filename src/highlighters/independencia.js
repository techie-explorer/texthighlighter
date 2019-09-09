import {
  retrieveHighlights,
  isElementHighlight,
  sortByDepth,
  findNodesAndOffsets,
  createWrapper,
  createDescriptors,
  getHighlightedTextRelativeToRoot,
  focusHighlightNodes
} from "../utils/highlights";
import {
  START_OFFSET_ATTR,
  LENGTH_ATTR,
  DATA_ATTR,
  TIMESTAMP_ATTR
} from "../config";
import dom from "../utils/dom";

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
 * @callback onAfterHighlightCallbackV2
 * @param {Range} range
 * @param {HlDescriptor[]} highlightDescriptors
 * @param {number} timestamp
 * @return {HlDescriptor[]}
 */
class IndependenciaHighlighter {
  /**
   * Creates an IndependenciaHighlighter instance for functionality that focuses for highlight independence.
   *
   * @param {HTMLElement} element - DOM element to which highlighted will be applied.
   * @param {object} [options] - additional options.
   * @param {string} options.color - highlight color.
   * @param {string} options.excludeNodes - Node types to exclude when calculating offsets and determining where to inject highlights.
   * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
   * @param {string} options.contextClass - class added to element to which highlighter is applied,
   *  'highlighter-context' by default.
   * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
   *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
   * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
   *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
   * @param {onAfterHighlightCallbackV2} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param. This should always return a set of descriptors.
   * @class IndependenciaHighlighter
   */
  constructor(element, options) {
    this.el = element;
    this.options = options;
  }

  /**
   * Highlights current range.
   * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
   * @memberof IndependenciaHighlighter
   */
  doHighlight(keepRange) {
    let range = dom(this.el).getRange(),
      wrapper,
      timestamp;

    if (!range || range.collapsed) {
      return;
    }

    if (this.options.onBeforeHighlight(range) === true) {
      timestamp = +new Date();
      wrapper = createWrapper(this.options);
      wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);

      const descriptors = createDescriptors({
        rootElement: this.el,
        range,
        wrapper,
        excludeNodeNames: this.options.excludeNodes
      });

      // createdHighlights = this.highlightRange(range, wrapper);
      // normalizedHighlights = this.normalizeHighlights(createdHighlights);

      const processedDescriptors = this.options.onAfterHighlight(
        range,
        descriptors,
        timestamp
      );
      this.deserializeHighlights(JSON.stringify(processedDescriptors));
    }

    if (!keepRange) {
      dom(this.el).removeAllRanges();
    }
  }

  /**
   * Normalizes highlights. Ensures text nodes within any given element node are merged together, elements with the
   * same ID next to each other are merged together and highlights with the same ID next to each other are merged together.
   *
   * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
   * input highlights.
   * @memberof IndependenciaHighlighter
   */
  normalizeHighlights() {
    dom(this.el).normalizeElements();
  }

  /**
   *
   * Removes highlights from element. If element is a highlight itself, it is removed as well.
   * If no element is given, all highlights are removed.
   * @param {HTMLElement} element - element to remove highlights from
   * @param {string} id - The unique id of a highlight represented by a collection of elements.
   * @memberof IndependenciaHighlighter
   */
  removeHighlights(element, id) {
    const container = element || this.el;
    let highlights = this.getHighlights({ container }),
      self = this;

    function removeHighlight(highlight) {
      dom(highlight).unwrap();
    }

    highlights.forEach(function(hl) {
      if (!id || (id && hl.classList.contains(id))) {
        if (self.options.onRemoveHighlight(hl) === true) {
          removeHighlight(hl);
        }
      }
    });

    this.normalizeHighlights(highlights);
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
  getHighlights(params) {
    const mergedParams = {
      container: this.el,
      dataAttr: DATA_ATTR,
      timestampAttr: TIMESTAMP_ATTR,
      ...params
    };
    return retrieveHighlights(mergedParams);
  }

  /**
   * Returns true if element is a highlight.
   *
   * @param el - element to check.
   * @returns {boolean}
   * @memberof IndependenciaHighlighter
   */
  isHighlight(el, dataAttr) {
    return isElementHighlight(el, dataAttr);
  }

  /**
   * Serializes all highlights in the element the highlighter is applied to.
   * @returns {string} - stringified JSON with highlights definition
   * @memberof IndependenciaHighlighter
   */
  serializeHighlights(id) {
    const highlights = this.getHighlights(),
      self = this;

    sortByDepth(highlights, false);

    if (highlights.length === 0) {
      return [];
    }

    // Even if there are multiple elements for a given highlight, the first
    // highlight in the DOM with the given ID in it's class name
    // will have all the information we need.
    const highlight = highlights.find(hl => hl.classList.contains(id));

    if (!highlight) {
      return [];
    }

    const length = highlight.getAttribute(LENGTH_ATTR);
    const offset = highlight.getAttribute(START_OFFSET_ATTR);
    const wrapper = highlight.cloneNode(true);

    wrapper.innerHTML = "";
    const wrapperHTML = wrapper.outerHTML;

    const descriptor = [
      wrapperHTML,
      getHighlightedTextRelativeToRoot({
        rootElement: self.el,
        startOffset: offset,
        length,
        excludeTags: this.options.excludeNodes
      }),
      offset,
      length
    ];

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
  deserializeHighlights(json) {
    let hlDescriptors,
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
      let hl = {
          wrapper: hlDescriptor[0],
          text: hlDescriptor[1],
          offset: Number.parseInt(hlDescriptor[2]),
          length: Number.parseInt(hlDescriptor[3])
        },
        hlNode,
        highlight;

      const parentNode = self.el;
      const highlightNodes = findNodesAndOffsets(
        hl,
        parentNode,
        self.options.excludeNodes
      );

      highlightNodes.forEach(
        ({ node, offset: offsetWithinNode, length: lengthInNode }) => {
          // Don't call innerText to prevent DOM layout reflow.
          // Visible text content may be a bit of naive name but represents
          // everything excluding new lines and white space.
          const visibleTextContent = node.textContent
            .trim()
            .replace(/(\r\n|\n|\r)/gm, "");

          if (visibleTextContent.length > 0) {
            hlNode = node.splitText(offsetWithinNode);
            hlNode.splitText(lengthInNode);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
              dom(hlNode.nextSibling).remove();
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
              dom(hlNode.previousSibling).remove();
            }

            highlight = dom(hlNode).wrap(dom().fromHTML(hl.wrapper)[0]);
            highlights.push(highlight);
          }
        }
      );
    }

    hlDescriptors.forEach(function(hlDescriptor) {
      try {
        deserialise(hlDescriptor);
      } catch (e) {
        if (console && console.warn) {
          console.warn("Can't deserialize highlight descriptor. Cause: " + e);
        }
      }
    });

    // TODO: normalise at the end of deserialisation.
    // this.normalizeHighlights(highlights);
    // dom(this.el).normalizeElements();

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
  focusUsingId(id, descriptors) {
    const highlightElements = this.el.querySelectorAll(`.${id}`);

    // For the future, we may save by accepting the offset and length as parameters as the caller should have this data
    // from the serialised descriptors.
    if (highlightElements.length > 0) {
      const firstHighlightElement = highlightElements[0];
      const nodesAndOffsets = findNodesAndOffsets(
        {
          offset: Number.parseInt(
            firstHighlightElement.getAttribute(START_OFFSET_ATTR)
          ),
          length: Number.parseInt(
            firstHighlightElement.getAttribute(LENGTH_ATTR)
          )
        },
        this.el,
        this.options.excludeNodes
      );

      const highlightWrapper = firstHighlightElement.cloneNode(true);
      highlightWrapper.innerHTML = "";
      focusHighlightNodes(id, nodesAndOffsets, highlightWrapper, this.el);
    } else if (descriptors) {
      // No elements in the DOM for the highlight?
      // let's deserialize the descriptor to bring the highlight into focus.
      this.deserializeHighlights(descriptors);
    }
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
  deselectUsingId(id, descriptors) {
    const deselectedHighlight = this.el.querySelector(`.${id}`);

    if (deselectedHighlight) {
      const deselectedStartOffset = Number.parseInt(
        deselectedHighlight.getAttribute(START_OFFSET_ATTR)
      );
      const deselectedLength = Number.parseInt(
        deselectedHighlight.getAttribute(LENGTH_ATTR)
      );

      const nestedDescriptors = descriptors
        .map(hlDescriptor => ({
          id: hlDescriptor.id,
          descriptor: JSON.parse(hlDescriptor.serialisedDescriptor)
        }))
        .filter(hlDescriptor => {
          const innerDescriptor = hlDescriptor.descriptor[0];
          const offset = Number.parseInt(innerDescriptor[2]);
          const length = Number.parseInt(innerDescriptor[3]);
          return (
            offset >= deselectedStartOffset &&
            offset + length <= deselectedStartOffset + deselectedLength
          );
        });

      nestedDescriptors.sort((a, b) => {
        const aLength = Number.parseInt(a.descriptor[0][3]);
        const bLength = Number.parseInt(b.descriptor[0][3]);
        return aLength > bLength ? -1 : 1;
      });

      nestedDescriptors.forEach(hlDescriptor => {
        this.focusUsingId(
          hlDescriptor.id,
          JSON.stringify(hlDescriptor.descriptor)
        );
      });
    }
  }
}

export default IndependenciaHighlighter;
