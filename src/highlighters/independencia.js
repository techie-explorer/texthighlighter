import {
  retrieveHighlights,
  isElementHighlight,
  getElementOffset,
  findTextNodeAtLocation,
  findFirstNonSharedParent,
  extractElementContentForHighlight,
  nodesInBetween,
  sortByDepth,
  findNodeAndOffset,
  addNodesToHighlightAfterElement,
  createWrapper,
  createDescriptors
} from "../utils/highlights";
import {
  START_OFFSET_ATTR,
  END_OFFSET_ATTR,
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
  highlightRange(range, wrapper) {
    if (!range || range.collapsed) {
      return [];
    }

    console.log("ALSDebug29: RANGE: ", range);

    let highlights = [];
    let wrapperClone = wrapper.cloneNode(true);

    let startOffset =
      getElementOffset(range.startContainer, this.el) + range.startOffset;
    let endOffset =
      range.startContainer === range.endContainer
        ? startOffset + (range.endOffset - range.startOffset)
        : getElementOffset(range.endContainer, this.el) + range.endOffset;

    console.log(
      "ALSDebug29: startOffset: ",
      startOffset,
      "endOffset: ",
      endOffset
    );

    wrapperClone.setAttribute(START_OFFSET_ATTR, startOffset);
    wrapperClone.setAttribute(END_OFFSET_ATTR, endOffset);
    wrapperClone.setAttribute(DATA_ATTR, true);

    console.log("\n\n\n FINDING START CONTAINER FIRST TEXT NODE ");
    console.log("range.startContainer: ", range.startContainer);
    let startContainer = findTextNodeAtLocation(range.startContainer, "start");

    console.log("\n\n\n FINDING END CONTAINER FIRST TEXT NODE ");
    console.log("range.endContainer: ", range.endContainer);
    let endContainer = findTextNodeAtLocation(range.endContainer, "start");

    if (!startContainer || !endContainer) {
      throw new Error(
        "Failed to find the text node for the start or the end of the selected range"
      );
    }

    let afterNewHighlight =
      range.endOffset < endContainer.textContent.length - 1
        ? endContainer.splitText(range.endOffset)
        : endContainer;

    if (startContainer === endContainer) {
      let startOfNewHighlight =
        range.startOffset > 0
          ? startContainer.splitText(range.startOffset)
          : startContainer;
      // Simply wrap the selected range in the same container as a highlight.
      let highlight = dom(startOfNewHighlight).wrap(wrapperClone);
      highlights.push(highlight);
    } else if (endContainer.textContent.length >= range.endOffset) {
      let startOfNewHighlight = startContainer.splitText(range.startOffset);
      let endOfNewHighlight = afterNewHighlight.previousSibling;
      console.log(
        "Node at the start of the new highlight: ",
        startOfNewHighlight
      );
      console.log("Node at the end of new highlight: ", endOfNewHighlight);

      const startElementParent = findFirstNonSharedParent({
        childElement: startOfNewHighlight,
        otherElement: endOfNewHighlight
      });

      let startElementParentCopy;
      let startOfNewHighlightCopy;
      if (startElementParent) {
        ({
          elementAncestorCopy: startElementParentCopy,
          elementCopy: startOfNewHighlightCopy
        } = extractElementContentForHighlight({
          element: startOfNewHighlight,
          elementAncestor: startElementParent,
          options: this.options,
          locationInSelection: "start"
        }));

        console.log("startElementParent:", startElementParent);
        console.log("startElementParentCopy: ", startElementParentCopy);
      }

      const endElementParent = findFirstNonSharedParent({
        childElement: endOfNewHighlight,
        otherElement: startOfNewHighlight
      });

      let endElementParentCopy;
      let endOfNewHighlightCopy;
      if (endElementParent) {
        ({
          elementAncestorCopy: endElementParentCopy,
          elementcopy: endOfNewHighlightCopy
        } = extractElementContentForHighlight({
          element: endOfNewHighlight,
          elementAncestor: endElementParent,
          options: this.options,
          locationInSelection: "end"
        }));
        console.log(
          "Node that is the wrapper of the end of the new highlight: ",
          endElementParent
        );

        console.log(
          "Cloned of node that is the wrapper of the end of the new highlight after removing siblings and unwrapping highlight spans: ",
          endElementParentCopy
        );
      }

      addNodesToHighlightAfterElement({
        element: startOfNewHighlightCopy || startOfNewHighlight,
        elementAncestor: startElementParentCopy,
        highlightWrapper: wrapperClone,
        highlightedClass: this.options.highlightedClass
      });

      // TODO: add containers in between.
      const containersInBetween = nodesInBetween(startContainer, endContainer);
      console.log("CONTAINERS IN BETWEEN: ", containersInBetween);
      containersInBetween.forEach(container => {
        wrapperClone.appendChild(container);
      });

      if (endElementParentCopy) {
        // Only copy the children of a highlighted span into our new highlight.
        if (
          endElementParentCopy.classList.contains(this.options.highlightedClass)
        ) {
          endElementParentCopy.childNodes.forEach(childNode => {
            wrapperClone.appendChild(childNode);
          });
        } else {
          wrapperClone.appendChild(endElementParentCopy);
        }
      } else {
        wrapperClone.appendChild(endOfNewHighlight);
      }

      dom(wrapperClone).insertBefore(
        endElementParent ? endElementParent : afterNewHighlight
      );
    }

    return highlights;
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
        wrapper
      });

      // createdHighlights = this.highlightRange(range, wrapper);
      // normalizedHighlights = this.normalizeHighlights(createdHighlights);

      const processedDescriptors = this.options.onAfterHighlight(
        range,
        descriptors,
        timestamp
      );
      this.deserializeHighlights(processedDescriptors);
    }

    if (!keepRange) {
      dom(this.el).removeAllRanges();
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
  normalizeHighlights(highlights) {
    let normalizedHighlights;

    //Since we're not merging or flattening, we need to normalise the text nodes.
    highlights.forEach(function(highlight) {
      dom(highlight).normalizeTextNodes();
    });

    // omit removed nodes
    normalizedHighlights = highlights.filter(function(hl) {
      return hl.parentElement ? hl : null;
    });

    normalizedHighlights = unique(normalizedHighlights);
    normalizedHighlights.sort(function(a, b) {
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
  removeHighlights(element) {
    let container = element || this.el,
      highlights = this.getHighlights(),
      self = this;

    function removeHighlight(highlight) {
      if (highlight.className === container.className) {
        dom(highlight).unwrap();
      }
    }

    highlights.forEach(function(hl) {
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
    let highlights = this.getHighlights(),
      refEl = this.el,
      hlDescriptors = [];

    sortByDepth(highlights, false);

    highlights.forEach(function(highlight) {
      let length = highlight.textContent.length,
        offset = getElementOffset(highlight, refEl), // Hl offset from the root element.
        wrapper = highlight.cloneNode(true);

      const containsIdAsClass = wrapper.classList.contains(id);
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

    function deserializationFnCustom(hlDescriptor) {
      let hl = {
          wrapper: hlDescriptor[0],
          text: hlDescriptor[1],
          offset: Number.parseInt(hlDescriptor[2]),
          length: Number.parseInt(hlDescriptor[3])
        },
        hlNode,
        highlight;

      const parentNode = self.el;
      const { node, offset: offsetWithinNode } = findNodeAndOffset(
        hl,
        parentNode
      );

      hlNode = node.splitText(offsetWithinNode);
      hlNode.splitText(hl.length);

      if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
        dom(hlNode.nextSibling).remove();
      }

      if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
        dom(hlNode.previousSibling).remove();
      }

      highlight = dom(hlNode).wrap(dom().fromHTML(hl.wrapper)[0]);
      highlights.push(highlight);
    }

    hlDescriptors.forEach(function(hlDescriptor) {
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
}

export default IndependenciaHighlighter;
