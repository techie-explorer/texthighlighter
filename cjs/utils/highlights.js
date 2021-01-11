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
exports.nodesInBetween = nodesInBetween;
exports.groupHighlights = groupHighlights;
exports.retrieveHighlights = retrieveHighlights;
exports.isElementHighlight = isElementHighlight;
exports.addNodesToHighlightAfterElement = addNodesToHighlightAfterElement;
exports.getHighlightedTextForRange = getHighlightedTextForRange;
exports.getHighlightedTextRelativeToRoot = getHighlightedTextRelativeToRoot;
exports.createDescriptors = createDescriptors;
exports.focusHighlightNodes = focusHighlightNodes;
exports.validateIndependenciaDescriptors = validateIndependenciaDescriptors;

var _dom = _interopRequireWildcard(require("./dom"));

var _config = require("../config");

var _arrays = require("./arrays");

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
  var textNodeElement = element;
  var i = 0;

  while (textNodeElement && textNodeElement.nodeType !== _dom.NODE_TYPE.TEXT_NODE) {
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

  return textNodeElement;
}

function textContentExcludingTags(node, excludeNodeNames) {
  return (0, _dom["default"])(node).textContentExcludingTags((0, _arrays.arrayToLower)(excludeNodeNames));
}
/**
 * Deals with normalising text for when carriage returns and white space
 * that directly follows should be ignored.
 *
 * @param {string} text
 */


function normaliseText(text) {
  return text.replace(/((\r\n|\n\r|\n|\r)\s*)/g, "");
}
/**
 *
 * @param {number} offsetWithinNode
 * @param {string} text
 *
 * @return {number}
 */


function normaliseOffset(offsetWithinNode, text) {
  var matchResults = text.match(/^((\r\n|\n\r|\n|\r)\s*)/g);

  if (!matchResults) {
    return offsetWithinNode;
  }

  return offsetWithinNode + matchResults[0].length;
}
/**
 * Determine where to inject a highlight based on it's offset.
 * A highlight can span multiple nodes, so in here we accumulate
 * all those nodes with offset and length of the content in the node
 * included in the highlight.
 *
 * The normalisedOffset returned for each node when excludeWithSpaceAndReturns
 * is set to true represents the normalised offset in the original text and NOT
 * the normalised text.
 *
 * @param {*} highlight
 * @param {*} parentNode
 * @param {*} excludeNodeNames
 * @param {boolean} excludeWhiteSpaceAndReturns
 *
 * @return {NodesAndOffsetsResult}
 */


function findNodesAndOffsets(highlight, parentNode) {
  var excludeNodeNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _config.IGNORE_TAGS;
  var excludeWhiteSpaceAndReturns = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var nodesAndOffsets = [];
  var currentNode = parentNode;
  var currentOffset = 0;
  var highlightEndOffset = highlight.offset + highlight.length;
  var allText = "";

  while (currentNode && currentOffset < highlightEndOffset) {
    // Ensure we ignore node types that the caller has specified should be excluded.
    if (!excludeNodeNames.includes(currentNode.nodeName)) {
      var textContent = textContentExcludingTags(currentNode, excludeNodeNames);
      var reducedTextContent = excludeWhiteSpaceAndReturns ? normaliseText(textContent) : "";

      if (currentNode == parentNode) {
        allText = excludeWhiteSpaceAndReturns ? reducedTextContent : textContent;
      }

      var textLength = textContent.length;
      var normalisedTextLength = normaliseText(textContent).length;
      var endOfCurrentNodeOffset = currentOffset + textLength;
      var normalisedEOCNodeOffset = excludeWhiteSpaceAndReturns ? currentOffset + normalisedTextLength : endOfCurrentNodeOffset;

      if (normalisedEOCNodeOffset > highlight.offset) {
        var isTerminalNode = currentNode.childNodes.length === 0;

        if (isTerminalNode) {
          if (currentNode.nodeType === _dom.NODE_TYPE.TEXT_NODE) {
            var offsetWithinNode = highlight.offset > currentOffset ? highlight.offset - currentOffset : 0; // Only exclude text normalised away at the start of the entire highlight.

            var normalisedOffset = excludeWhiteSpaceAndReturns && nodesAndOffsets.length === 0 ? normaliseOffset(offsetWithinNode, textContent) : offsetWithinNode;
            var normalisedOffsetDiff = Math.abs(normalisedOffset - offsetWithinNode); // Remove further carriage returns and white spaces that directly follow
            // from the length in the node
            // that may be in the middle or at the end of the node.

            var textFromNormalisedOffset = textContent.substr(normalisedOffset);
            var charactersToIgnoreInside = excludeWhiteSpaceAndReturns ? textFromNormalisedOffset.length - normaliseText(textFromNormalisedOffset).length : 0;
            var nextNodeOffset = endOfCurrentNodeOffset - normalisedOffsetDiff - charactersToIgnoreInside;
            var lengthInHighlight = highlightEndOffset >= nextNodeOffset ? textLength - offsetWithinNode : // While counting the actual amount of text in the DOM node, we need to retain
            // any characters that are ignored when determining nodes from a highlight offset and length
            // to know exactly where to inject the highlight's spans without modifying the original text.
            highlightEndOffset - currentOffset - offsetWithinNode + charactersToIgnoreInside; // Only exclude text normalised away from the node at the start of the
            // entire highlight.

            var normalisedLengthInHighlight = excludeWhiteSpaceAndReturns && nodesAndOffsets.length === 0 ? lengthInHighlight - normalisedOffsetDiff : lengthInHighlight;

            if (normalisedLengthInHighlight > 0) {
              nodesAndOffsets.push({
                node: currentNode,
                offset: normalisedOffset,
                length: normalisedLengthInHighlight,
                normalisedText: excludeWhiteSpaceAndReturns ? normaliseText(currentNode.textContent) : currentNode.textContent
              });
            }

            currentOffset = nextNodeOffset;
          } // It doesn't matter if it is a text node or not at this point,
          // we still need to get the next sibling of the node or it's ancestors.


          currentNode = (0, _dom["default"])(currentNode).nextClosestSibling(parentNode);
        } else {
          currentNode = currentNode.childNodes[0];
        }
      } else {
        currentOffset = normalisedEOCNodeOffset;

        if (currentNode !== parentNode) {
          currentNode = currentNode.nextSibling;
        } else {
          currentNode = null;
        }
      }
    } else {
      currentNode = (0, _dom["default"])(currentNode).nextClosestSibling(parentNode);
    }
  }

  return {
    nodesAndOffsets: nodesAndOffsets,
    allText: allText
  };
}

function getElementOffset(childElement, rootElement) {
  var excludeNodeNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _config.IGNORE_TAGS;
  var excludeWhiteSpaceAndReturns = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var startOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var isStartOfRange = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var offset = 0;
  var childNodes;
  var currentElement = childElement;

  do {
    // Ensure specified node types are not counted in the offset.
    if (!excludeNodeNames.includes(currentElement.nodeName)) {
      childNodes = currentElement.parentNode.childNodes;
      var childElementIndex = (0, _dom["default"])(currentElement.parentNode).getChildIndex(currentElement);
      var offsetInCurrentParent = getTextOffsetBefore(childNodes, childElementIndex, excludeNodeNames, excludeWhiteSpaceAndReturns);
      offset += offsetInCurrentParent;
    }

    currentElement = currentElement.parentNode;
  } while (currentElement !== rootElement || !currentElement);

  return excludeWhiteSpaceAndReturns && isStartOfRange ? offset : offset + startOffset;
}

function getTextOffsetBefore(childNodes, cutIndex, excludeNodeNames) {
  var excludeWhiteSpaceAndReturns = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var textOffset = 0;

  for (var i = 0; i < cutIndex; i++) {
    var currentNode = childNodes[i]; // Strip out all nodes from the child node that we should be excluding.
    //
    // Use textContent and not innerText to account for invisible characters such as carriage returns as well,
    // plus innerText forces a reflow of the layout and as we access text content of nodes
    // a lot in the highlighting process, we don't want to take the performance hit.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

    var text = (0, _dom["default"])(currentNode).textContentExcludingTags((0, _arrays.arrayToLower)(excludeNodeNames));

    if (!excludeNodeNames.includes(currentNode.nodeName) && text && text.length > 0) {
      textOffset += excludeWhiteSpaceAndReturns ? normaliseText(text).length : text.length;
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
  var excludeTags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _config.IGNORE_TAGS;
  // Strip out all carriage returns and excess html layout space.
  return (0, _dom["default"])(range.cloneContents()).textContentExcludingTags((0, _arrays.arrayToLower)(excludeTags)).replace(/\s{2,}/g, " ").replace("\r\n", "").replace("\r", "").replace("\n", "");
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
      length = _ref2.length,
      _ref2$excludeTags = _ref2.excludeTags,
      excludeTags = _ref2$excludeTags === void 0 ? _config.IGNORE_TAGS : _ref2$excludeTags,
      _ref2$excludeWhiteSpa = _ref2.excludeWhiteSpaceAndReturns,
      excludeWhiteSpaceAndReturns = _ref2$excludeWhiteSpa === void 0 ? false : _ref2$excludeWhiteSpa;
  var textContent = (0, _dom["default"])(rootElement).textContentExcludingTags((0, _arrays.arrayToLower)(excludeTags));
  var finalTextContent = excludeWhiteSpaceAndReturns ? normaliseText(textContent) : textContent;
  var highlightedRawText = finalTextContent.substring(startOffset, Number.parseInt(startOffset) + Number.parseInt(length));
  var textNode = document.createTextNode(highlightedRawText);
  var tempContainer = document.createElement("div");
  tempContainer.appendChild(textNode); // Extract the human-readable text only.

  return tempContainer.innerText;
}

function createDescriptors(_ref3) {
  var rootElement = _ref3.rootElement,
      range = _ref3.range,
      wrapper = _ref3.wrapper,
      _ref3$excludeNodeName = _ref3.excludeNodeNames,
      excludeNodeNames = _ref3$excludeNodeName === void 0 ? _config.IGNORE_TAGS : _ref3$excludeNodeName,
      _ref3$dataAttr = _ref3.dataAttr,
      dataAttr = _ref3$dataAttr === void 0 ? _config.DATA_ATTR : _ref3$dataAttr,
      _ref3$excludeWhiteSpa = _ref3.excludeWhiteSpaceAndReturns,
      excludeWhiteSpaceAndReturns = _ref3$excludeWhiteSpa === void 0 ? false : _ref3$excludeWhiteSpa;
  var wrapperClone = wrapper.cloneNode(true);
  var normalisedStartOffset = excludeWhiteSpaceAndReturns ? normaliseOffset(range.startOffset, range.startContainer.textContent) : range.startOffset;
  var startOffset = getElementOffset(range.startContainer, rootElement, excludeNodeNames, excludeWhiteSpaceAndReturns, normalisedStartOffset, true);
  var normalisedEndOffset = excludeWhiteSpaceAndReturns ? normaliseOffset(range.endOffset, range.endContainer.textContent) : range.endOffset;
  var endOffset = range.startContainer === range.endContainer ? startOffset + (normalisedEndOffset - normalisedStartOffset) : getElementOffset(range.endContainer, rootElement, excludeNodeNames, excludeWhiteSpaceAndReturns, normalisedEndOffset, false);
  var length = endOffset - startOffset;
  wrapperClone.setAttribute(dataAttr, true);
  wrapperClone.setAttribute(_config.START_OFFSET_ATTR, startOffset);
  wrapperClone.setAttribute(_config.LENGTH_ATTR, length);
  wrapperClone.innerHTML = "";
  var wrapperHTML = wrapperClone.outerHTML;
  var descriptor = [wrapperHTML, // retrieve all the text content between the start and end offsets.
  getHighlightedTextForRange(range, excludeNodeNames), startOffset, length];
  return [descriptor];
}
/**
 *
 *
 * @param {HTMLElement} node  The element we need to get parent information for.
 * @param {string} id The unique id of the collection of elements representing a highlight.
 * @param {HTMLElement} rootElement The root element of the context to stop at.
 * @param {string} dataAttr The namespace data attribute for highlights for a provided text highlighter instance.
 *
 * @return {boolean}
 */


function isClosestHighlightParent(node, id, rootElement) {
  var dataAttr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _config.DATA_ATTR;
  var isClosestHighlightParent = true;
  var currentNode = node.parentNode;

  while (currentNode && currentNode !== rootElement && isClosestHighlightParent) {
    if (isElementHighlight(currentNode, dataAttr) && !currentNode.classList.contains(id)) {
      // The case there is a closer parent than the highlight for the provided id.
      isClosestHighlightParent = false;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return isClosestHighlightParent;
}
/**
 * Focuses a set of highlight elements for a given id by ensuring if it has descendants that are highlights
 * it is moved inside of the innermost highlight.
 *
 * The innermost highlight's styles will be applied and will be visible to the user
 * and given the "focus".
 *
 * To focus the red highlight the following:
 *
 * -- <red-highlight>
 * ---- <blue-highlight>
 * ------ <green-highlight>
 * ---------- Highlighted text
 *
 * becomes:
 *
 * -- <blue-highlight>
 * ---- <green-highlight>
 * ------ <red-highlight>
 * -------- Highlighted text
 *
 * and
 *
 * -- <red-highlight>
 * ---- Some text only highlighted in red
 * ---- <blue-highlight>
 * ------ Text in blue and red
 * ------ <green-highlight>
 * ---------- Rest of the highlight in red, green and blue
 *
 * becomes
 *
 * -- <red-highlight>
 * ---- Some text only highlighted in red
 * -- <blue-highlight>
 * ---- <red-highlight-copy-1>
 * ------ Text in blue and red
 * ---- <green-highlight>
 * ------ <red-highlight-copy-2>
 * -------- Rest of the highlight in red, green and blue
 *
 * @typedef NodeInfo
 * @type {object}
 * @property {HTMLElement} nodeInfo.node The html element (This will in most cases be a text node)
 * @property {number} nodeInfo.offset  The offset within the node to be highlighted
 * @property {number} nodeInfo.length  The length within the node that should be highlighted.
 *
 * @param {string} id The unique identifier of a highlight represented by one or more nodes in the DOM.
 * @param {NodeInfo[]}  nodeInfoList The highlight portion node information that should be focused.
 * @param {HTMLElement} highlightWrapper  The highlight wrapper representing the highlight to be focused.
 *
 * @param {HTMLElement} rootElement The root context element to normalise elements within.
 * @param {string} highlightedClass The class used to identify highlights.
 * @param {boolean} normalizeElements Whether or not elements should be normalised.
 * @param {string} dataAttr The namespace data attribute for highlights for a provided text highlighter instance.
 */


function focusHighlightNodes(id, nodeInfoList, highlightWrapper, rootElement, highlightedClass, normalizeElements) {
  var dataAttr = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _config.DATA_ATTR;
  nodeInfoList.forEach(function (nodeInfo) {
    var node = nodeInfo.node; // Only wrap the node if the closest highlight parent isn't one with the given id.

    if (!isClosestHighlightParent(node, id, rootElement, dataAttr)) {
      // Ensure any ancestors that aren't direct parents that represent the same highlight wrapper are removed.
      var ancestors = (0, _dom["default"])(node).parentsUpTo(rootElement);
      ancestors.forEach(function (ancestor) {
        if (isElementHighlight(ancestor, dataAttr) && ancestor.classList.contains(id)) {
          // Ensure a copy of the ancestor is wrapped back around any
          // other children that do not contain the current node.
          ancestor.childNodes.forEach(function (ancestorChild) {
            if (!ancestorChild.contains(node)) {
              var wrapper = highlightWrapper.cloneNode(true);
              (0, _dom["default"])(ancestorChild).wrap(wrapper);
            }
          });
          (0, _dom["default"])(ancestor).unwrap();
        }
      }); // Now wrap the node or the part of the node the highlight covers directly with the wrapper.

      var nodeToBeWrapped = node;

      if (nodeInfo.offset > 0) {
        nodeToBeWrapped = node.splitText(nodeInfo.offset);
      }

      if (nodeInfo.length < nodeToBeWrapped.textContent.length) {
        nodeToBeWrapped.splitText(nodeInfo.length);
      }

      (0, _dom["default"])(nodeToBeWrapped).wrap(highlightWrapper.cloneNode(true));
    }
  });

  if (normalizeElements) {
    // Ensure we normalise all nodes in the root container to merge sibling elements
    // of the same highlight together that get copied for the purpose of focusing.
    (0, _dom["default"])(rootElement).normalizeElements(highlightedClass, dataAttr);
  }
}
/**
 * Validation for descriptors to ensure they are of the correct format to be used by the Independencia highlighter.
 *
 * @param {array} descriptors  The descriptors to be validated.
 * @return {boolean} - if the descriptors are valid or not.
 */


function validateIndependenciaDescriptors(descriptors) {
  if (descriptors && descriptors.length === 4) {
    return true;
  }

  return false;
}
