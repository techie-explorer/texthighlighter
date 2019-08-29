import dom, { NODE_TYPE } from "./utils/dom";
import { bindEvents, unbindEvents } from "./utils/events";
import {
  refineRangeBoundaries,
  sortByDepth,
  haveSameColor,
  groupHighlights,
  createWrapper,
  getElementOffset,
  findTextNodeAtLocation,
  findFirstNonSharedParent,
  extractElementContentForHighlight,
  findNodeAndOffset
} from "./utils/highlights";
import { unique } from "./utils/arrays";

/**
 * Attribute added by default to every highlight.
 * @type {string}
 */
export const DATA_ATTR = "data-highlighted";

/**
 * Attribute used to group highlight wrappers.
 * @type {string}
 */
export const TIMESTAMP_ATTR = "data-timestamp";

export const START_OFFSET_ATTR = "data-start-offset";
export const END_OFFSET_ATTR = "data-end-offset";

/**
 * Don't highlight content of these tags.
 * @type {string[]}
 */
export const IGNORE_TAGS = [
  "SCRIPT",
  "STYLE",
  "SELECT",
  "OPTION",
  "BUTTON",
  "OBJECT",
  "APPLET",
  "VIDEO",
  "AUDIO",
  "CANVAS",
  "EMBED",
  "PARAM",
  "METER",
  "PROGRESS"
];

/**
 * TextHighlighter that provides text highlighting functionality to dom elements.
 */
class TextHighlighter {
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
  constructor(element, options) {
    if (!element) {
      throw new Error("Missing anchor element");
    }

    this.el = element;
    this.options = {
      color: "#ffff7b",
      highlightedClass: "highlighted",
      contextClass: "highlighter-context",
      onRemoveHighlight: function() {
        return true;
      },
      onBeforeHighlight: function() {
        return true;
      },
      onAfterHighlight: function() {},
      ...options
    };

    dom(this.el).addClass(this.options.contextClass);
    bindEvents(this.el, this);
  }

  /**
   * Permanently disables highlighting.
   * Unbinds events and remove context element class.
   * @memberof TextHighlighter
   */
  destroy() {
    unbindEvents(this.el, this);
    dom(this.el).removeClass(this.options.contextClass);
  }

  highlightHandler() {
    this.doHighlight();
  }

  /**
   * Highlights current range.
   * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
   * @memberof TextHighlighter
   */
  doHighlight(keepRange) {
    let range = dom(this.el).getRange(),
      wrapper,
      createdHighlights,
      normalizedHighlights,
      timestamp;

    if (!range || range.collapsed) {
      return;
    }

    if (this.options.onBeforeHighlight(range) === true) {
      timestamp = +new Date();
      wrapper = createWrapper(this.options);
      wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);

      createdHighlights = this.highlightRangeCustom(range, wrapper);
      normalizedHighlights = this.normalizeHighlights(createdHighlights);

      this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
    }

    if (!keepRange) {
      dom(this.el).removeAllRanges();
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
  highlightRangeCustom(range, wrapper) {
    if (!range || range.collapsed) {
      return [];
    }

    console.log("ALSDebug29: RANGE: ", range);

    let highlights = [];
    let wrapperClone = wrapper.cloneNode(true);
    let overlapsWithExistingHighlight = false;

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
      console.log("startContainer === endContainer!!!!!");
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

      let endElementParent = findFirstNonSharedParent({
        childElement: endOfNewHighlight,
        otherElement: startOfNewHighlight
      });

      if (endElementParent) {
        let endElementParentCopy = extractElementContentForHighlight({
          element: endOfNewHighlight,
          elementAncestor: endElementParent,
          options: this.options,
          locationInSelection: "end"
        });

        wrapperClone.appendChild(startOfNewHighlight);
        // TODO: add containers in between.

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

        dom(wrapperClone).insertBefore(endElementParent);

        console.log(
          "Node that is the wrapper of the end of the new highlight: ",
          endElementParent
        );

        console.log(
          "Cloned of node that is the wrapper of the end of the new highlight after removing siblings and unwrapping highlight spans: ",
          endElementParentCopy
        );
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
  highlightRange(range, wrapper) {
    if (!range || range.collapsed) {
      return [];
    }

    console.log("ALSDebug28: range before refined! ", range);

    var result = refineRangeBoundaries(range),
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
      if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {
        if (
          IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 &&
          node.nodeValue.trim() !== ""
        ) {
          wrapperClone = wrapper.cloneNode(true);
          wrapperClone.setAttribute(DATA_ATTR, true);
          nodeParent = node.parentNode;

          // highlight if a node is inside the el
          if (dom(this.el).contains(nodeParent) || nodeParent === this.el) {
            highlight = dom(node).wrap(wrapperClone);
            highlights.push(highlight);
          }
        }

        goDeeper = false;
      }
      if (
        node === endContainer &&
        !(endContainer.hasChildNodes() && goDeeper)
      ) {
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
  normalizeHighlights(highlights) {
    var normalizedHighlights;

    //this.flattenNestedHighlights(highlights);
    //this.mergeSiblingHighlights(highlights);

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
   * Flattens highlights structure.
   * Note: this method changes input highlights - their order and number after calling this method may change.
   * @param {Array} highlights - highlights to flatten.
   * @memberof TextHighlighter
   */
  flattenNestedHighlights(highlights) {
    var again,
      self = this;

    sortByDepth(highlights, true);

    function flattenOnce() {
      var again = false;

      highlights.forEach(function(hl, i) {
        var parent = hl.parentElement,
          parentPrev = parent.previousSibling,
          parentNext = parent.nextSibling;

        if (self.isHighlight(parent)) {
          if (!haveSameColor(parent, hl)) {
            if (!hl.nextSibling) {
              if (!parentNext) {
                dom(hl).insertAfter(parent);
              } else {
                dom(hl).insertBefore(parentNext);
              }
              //dom(hl).insertBefore(parentNext || parent);
              again = true;
            }

            if (!hl.previousSibling) {
              if (!parentPrev) {
                dom(hl).insertBefore(parent);
              } else {
                dom(hl).insertAfter(parentPrev);
              }
              //dom(hl).insertAfter(parentPrev || parent);
              again = true;
            }

            if (
              hl.previousSibling &&
              hl.previousSibling.nodeType == 3 &&
              hl.nextSibling &&
              hl.nextSibling.nodeType == 3
            ) {
              var spanleft = document.createElement("span");
              spanleft.style.backgroundColor = parent.style.backgroundColor;
              spanleft.className = parent.className;
              var timestamp = parent.attributes[TIMESTAMP_ATTR].nodeValue;
              spanleft.setAttribute(TIMESTAMP_ATTR, timestamp);
              spanleft.setAttribute(DATA_ATTR, true);

              var spanright = spanleft.cloneNode(true);

              dom(hl.previousSibling).wrap(spanleft);
              dom(hl.nextSibling).wrap(spanright);

              var nodes = Array.prototype.slice.call(parent.childNodes);
              nodes.forEach(function(node) {
                dom(node).insertBefore(node.parentNode);
              });
              again = true;
            }

            if (!parent.hasChildNodes()) {
              dom(parent).remove();
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
  mergeSiblingHighlights(highlights) {
    let self = this;

    function shouldMerge(current, node) {
      return false;
      /*       return (
        node &&
        node.nodeType === NODE_TYPE.ELEMENT_NODE &&
        haveSameColor(current, node) &&
        self.isHighlight(node)
      ); */
    }

    highlights.forEach(function(highlight) {
      var prev = highlight.previousSibling,
        next = highlight.nextSibling;

      if (shouldMerge(highlight, prev)) {
        dom(highlight).prepend(prev.childNodes);
        dom(prev).remove();
      }
      if (shouldMerge(highlight, next)) {
        dom(highlight).append(next.childNodes);
        dom(next).remove();
      }

      dom(highlight).normalizeTextNodes();
    });
  }

  /**
   * Sets highlighting color.
   * @param {string} color - valid CSS color.
   * @memberof TextHighlighter
   */
  setColor(color) {
    this.options.color = color;
  }

  /**
   * Returns highlighting color.
   * @returns {string}
   * @memberof TextHighlighter
   */
  getColor() {
    return this.options.color;
  }

  /**
   * Removes highlights from element. If element is a highlight itself, it is removed as well.
   * If no element is given, all highlights all removed.
   * @param {HTMLElement} [element] - element to remove highlights from
   * @memberof TextHighlighter
   */
  removeHighlights(element) {
    var container = element || this.el,
      highlights = this.getHighlights({ container: container }),
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
        dom(highlight).unwrap();

        /**  nodes.forEach(function(node) {
          mergeSiblings(node);
        });
        */
      }
    }

    //sortByDepth(highlights, true);

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
   * @memberof TextHighlighter
   */
  getHighlights(params) {
    params = {
      container: this.el,
      andSelf: true,
      grouped: false,
      ...params
    };

    var nodeList = params.container.querySelectorAll("[" + DATA_ATTR + "]"),
      highlights = Array.prototype.slice.call(nodeList);

    if (params.andSelf === true && params.container.hasAttribute(DATA_ATTR)) {
      highlights.push(params.container);
    }

    if (params.grouped) {
      highlights = groupHighlights(highlights, TIMESTAMP_ATTR);
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
  isHighlight(el) {
    return (
      el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR)
    );
  }

  /**
   * Serializes all highlights in the element the highlighter is applied to.
   * @returns {string} - stringified JSON with highlights definition
   * @memberof TextHighlighter
   */
  serializeHighlights() {
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

    sortByDepth(highlights, false);

    highlights.forEach(function(highlight) {
      var offset = 0, // Hl offset from previous sibling within parent node.
        length = highlight.textContent.length,
        hlPath = getElementPath(highlight, refEl),
        wrapper = highlight.cloneNode(true);

      wrapper.innerHTML = "";
      wrapper = wrapper.outerHTML;

      if (
        highlight.previousSibling &&
        highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE
      ) {
        offset = highlight.previousSibling.length;
      }

      hlDescriptors.push([
        wrapper,
        highlight.textContent,
        hlPath.join(":"),
        offset,
        length
      ]);
    });

    return JSON.stringify(hlDescriptors);
  }

  /**
   * Serializes all highlights in the element the highlighter is applied to.
   * @returns {string} - stringified JSON with highlights definition
   * @memberof TextHighlighter
   */
  serializeHighlightsCustom(id) {
    var highlights = this.getHighlights(),
      refEl = this.el,
      hlDescriptors = [];

    sortByDepth(highlights, false);

    highlights.forEach(function(highlight) {
      var length = highlight.textContent.length,
        // hlPath = getElementPath(highlight, refEl),
        offset = getElementOffset(highlight, refEl), // Hl offset from the root element.
        wrapper = highlight.cloneNode(true);

      wrapper.innerHTML = "";
      wrapper = wrapper.outerHTML;

      console.log("Highlight text offset from root node: ", offset);
      console.log(
        `wrapper.toString().indexOf(${id}):`,
        wrapper.toString().indexOf(id)
      );
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
  deserializeHighlightsCustom(json) {
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

  /**
   * Deserializes highlights.
   * @throws exception when can't parse JSON or JSON has invalid structure.
   * @param {object} json - JSON object with highlights definition.
   * @returns {Array} - array of deserialized highlights.
   * @memberof TextHighlighter
   */
  deserializeHighlights(json) {
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

      while ((idx = hl.path.shift())) {
        node = node.childNodes[idx];
      }

      if (
        node.childNodes[elIndex - 1] &&
        node.childNodes[elIndex - 1].nodeType === NODE_TYPE.TEXT_NODE
      ) {
        elIndex -= 1;
      }

      node = node.childNodes[elIndex];
      hlNode = node.splitText(hl.offset);
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
  find(text, caseSensitive) {
    var wnd = dom(this.el).getWindow(),
      scrollX = wnd.scrollX,
      scrollY = wnd.scrollY,
      caseSens = typeof caseSensitive === "undefined" ? true : caseSensitive;

    dom(this.el).removeAllRanges();

    if (wnd.find) {
      while (wnd.find(text, caseSens)) {
        this.doHighlight(true);
      }
    } else if (wnd.document.body.createTextRange) {
      var textRange = wnd.document.body.createTextRange();
      textRange.moveToElementText(this.el);
      while (textRange.findText(text, 1, caseSens ? 4 : 0)) {
        if (
          !dom(this.el).contains(textRange.parentElement()) &&
          textRange.parentElement() !== this.el
        ) {
          break;
        }

        textRange.select();
        this.doHighlight(true);
        textRange.collapse(false);
      }
    }

    dom(this.el).removeAllRanges();
    wnd.scrollTo(scrollX, scrollY);
  }
}

export default TextHighlighter;
