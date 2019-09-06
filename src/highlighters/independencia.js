import {
  retrieveHighlights,
  isElementHighlight,
  sortByDepth,
  findNodesAndOffsets,
  createWrapper,
  createDescriptors,
  getHighlightedTextRelativeToRoot
} from "../utils/highlights";
import {
  START_OFFSET_ATTR,
  LENGTH_ATTR,
  DATA_ATTR,
  TIMESTAMP_ATTR
} from "../config";
import dom from "../utils/dom";
import { unique } from "../utils/arrays";

/**
 * IndependenciaHighlighter that provides text highlighting functionality to dom elements
 * with a focus on removing interdependence between highlights and other element nodes in the context element.
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
   * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
   * wrappers is passed as param.
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
   * @param {Array} highlights - highlights to normalize.
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
   * @param {HTMLElement} [element] - element to remove highlights from
   * @memberof IndependenciaHighlighter
   */
  removeHighlights(id) {

    let highlights = this.getHighlights(),
      self = this;

    function removeHighlight(highlight) {
      dom(highlight).unwrap();
    }

    highlights.forEach(function(hl) {
      if (self.options.onRemoveHighlight(hl) === true) {
        if(!id || (id && hl.classList.contains(id))) {
          removeHighlight(hl);
        }
      }
    });

     this.normalizeHighlights(highlights)
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
   * @memberof TextHighlighter
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
    //dom(this.el).normalizeElements();

    return highlights;
  }
}

export default IndependenciaHighlighter;
