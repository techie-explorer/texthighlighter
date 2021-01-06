import dom, { NODE_TYPE } from "./dom";
import { DATA_ATTR, START_OFFSET_ATTR, LENGTH_ATTR, IGNORE_TAGS } from "../config";
import { arrayToLower } from "./arrays";

/**
 * Takes range object as parameter and refines it boundaries
 * @param range
 * @returns {object} refined boundaries and initial state of highlighting algorithm.
 */
export function refineRangeBoundaries(range) {
  let startContainer = range.startContainer,
    endContainer = range.endContainer,
    ancestor = range.commonAncestorContainer,
    goDeeper = true;

  if (range.endOffset === 0) {
    while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
      endContainer = endContainer.parentNode;
    }
    endContainer = endContainer.previousSibling;
  } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
    if (range.endOffset < endContainer.nodeValue.length) {
      endContainer.splitText(range.endOffset);
    }
  } else if (range.endOffset > 0) {
    endContainer = endContainer.childNodes.item(range.endOffset - 1);
  }

  if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
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
    goDeeper: goDeeper,
  };
}

/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
export function sortByDepth(arr, descending) {
  arr.sort(function(a, b) {
    return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
  });
}

/**
 * Returns true if elements a i b have the same color.
 * @param {Node} a
 * @param {Node} b
 * @returns {boolean}
 */
export function haveSameColor(a, b) {
  return dom(a).color() === dom(b).color();
}

/**
 * Creates wrapper for highlights.
 * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
 * in constructor.
 * @param {object} options - the same object as in TextHighlighter constructor.
 * @returns {HTMLElement}
 */
export function createWrapper(options) {
  let span = document.createElement("span");
  span.style.backgroundColor = options.color;
  span.className = options.highlightedClass;
  return span;
}

export function findTextNodeAtLocation(element, locationInChildNodes) {
  let textNodeElement = element;
  let i = 0;
  while (textNodeElement && textNodeElement.nodeType !== NODE_TYPE.TEXT_NODE) {
    if (locationInChildNodes === "start") {
      if (textNodeElement.childNodes.length > 0) {
        textNodeElement = textNodeElement.childNodes[0];
      } else {
        textNodeElement = textNodeElement.nextSibling;
      }
    } else if (locationInChildNodes === "end") {
      if (textNodeElement.childNodes.length > 0) {
        let lastIndex = textNodeElement.childNodes.length - 1;
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
  return dom(node).textContentExcludingTags(arrayToLower(excludeNodeNames));
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
 * Determine where to inject a highlight based on it's offset.
 * A highlight can span multiple nodes, so in here we accumulate
 * all those nodes with offset and length of the content in the node
 * included in the highlight.
 *
 * @param {*} highlight
 * @param {*} parentNode
 * @param {*} excludeNodeNames
 * @param {boolean} excludeWhiteSpaceAndReturns
 */
export function findNodesAndOffsets(
  highlight,
  parentNode,
  excludeNodeNames = IGNORE_TAGS,
  excludeWhiteSpaceAndReturns = false,
) {
  const nodesAndOffsets = [];
  let currentNode = parentNode;
  let currentOffset = 0;
  const highlightEndOffset = highlight.offset + highlight.length;
  let allText = "";

  while (currentNode && currentOffset < highlightEndOffset) {
    // Ensure we ignore node types that the caller has specified should be excluded.
    if (!excludeNodeNames.includes(currentNode.nodeName)) {
      const textContent = textContentExcludingTags(currentNode, excludeNodeNames);
      const reducedTextContent = excludeWhiteSpaceAndReturns
        ? normaliseText(textContent)
        : textContent;
      if (currentNode == parentNode) {
        allText = reducedTextContent;
      }
      const textLength = reducedTextContent.length;

      const endOfCurrentNodeOffset = currentOffset + textLength;

      if (endOfCurrentNodeOffset > highlight.offset) {
        const isTerminalNode = currentNode.childNodes.length === 0;
        if (isTerminalNode) {
          if (currentNode.nodeType === NODE_TYPE.TEXT_NODE) {
            const offsetWithinNode =
              highlight.offset > currentOffset ? highlight.offset - currentOffset : 0;

            const lengthInHighlight =
              highlightEndOffset > endOfCurrentNodeOffset
                ? textLength - offsetWithinNode
                : highlightEndOffset - currentOffset - offsetWithinNode;

            if (lengthInHighlight > 0) {
              nodesAndOffsets.push({
                node: currentNode,
                offset: offsetWithinNode,
                length: lengthInHighlight,
                normalisedText: excludeWhiteSpaceAndReturns 
                  ? normaliseText(currentNode.textContent) 
                  : currentNode.textContent,
              });
            }

            currentOffset = endOfCurrentNodeOffset;
          }

          // It doesn't matter if it is a text node or not at this point,
          // we still need to get the next sibling of the node or it's ancestors.
          currentNode = dom(currentNode).nextClosestSibling(parentNode);
        } else {
          currentNode = currentNode.childNodes[0];
        }
      } else {
        currentOffset = endOfCurrentNodeOffset;
        if (currentNode !== parentNode) {
          currentNode = currentNode.nextSibling;
        } else {
          currentNode = null;
        }
      }
    } else {
      currentNode = dom(currentNode).nextClosestSibling(parentNode);
    }
  }

  return { nodesAndOffsets, allText };
}

export function getElementOffset(childElement, rootElement, excludeNodeNames = IGNORE_TAGS) {
  let offset = 0;
  let childNodes;

  let currentElement = childElement;
  do {
    // Ensure specified node types are not counted in the offset.
    if (!excludeNodeNames.includes(currentElement.nodeName)) {
      childNodes = currentElement.parentNode.childNodes;
      const childElementIndex = dom(currentElement.parentNode).getChildIndex(currentElement);
      const offsetInCurrentParent = getTextOffsetBefore(
        childNodes,
        childElementIndex,
        excludeNodeNames,
      );
      offset += offsetInCurrentParent;
    }

    currentElement = currentElement.parentNode;
  } while (currentElement !== rootElement || !currentElement);

  return offset;
}

function getTextOffsetBefore(childNodes, cutIndex, excludeNodeNames) {
  let textOffset = 0;
  for (let i = 0; i < cutIndex; i++) {
    const currentNode = childNodes[i];

    // Strip out all nodes from the child node that we should be excluding.
    //
    // Use textContent and not innerText to account for invisible characters such as carriage returns as well,
    // plus innerText forces a reflow of the layout and as we access text content of nodes
    // a lot in the highlighting process, we don't want to take the performance hit.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    const text = dom(currentNode).textContentExcludingTags(arrayToLower(excludeNodeNames));

    if (!excludeNodeNames.includes(currentNode.nodeName) && text && text.length > 0) {
      textOffset += text.length;
    }
  }
  return textOffset;
}

export function findFirstNonSharedParent(elements) {
  let childElement = elements.childElement;
  let otherElement = elements.otherElement;
  let parents = dom(childElement).parentsWithoutDocument();
  let i = 0;
  let firstNonSharedParent = null;
  let allParentsAreShared = false;
  while (!firstNonSharedParent && !allParentsAreShared && i < parents.length) {
    const currentParent = parents[i];

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
  const gatheredSiblings = [];
  let foundEndNodeSibling = false;

  let currentNode = startNodeOrContainer.nextSibling;
  while (currentNode && !foundEndNodeSibling) {
    if (currentNode === endNode || currentNode.contains(endNode)) {
      foundEndNodeSibling = true;
    } else {
      gatheredSiblings.push(currentNode);
      currentNode = currentNode.nextSibling;
    }
  }

  return { gatheredSiblings, foundEndNodeSibling };
}

/**
 * Gets all the nodes in between the provided start and end.
 *
 * @param {HTMLElement} startNode
 * @param {HTMLElement} endNode
 * @returns {HTMLElement[]} Nodes that live in between the two.
 */
export function nodesInBetween(startNode, endNode) {
  if (startNode === endNode) {
    return [];
  }
  // First attempt the easiest solution, hoping endNode will be at the same level
  // as the start node or contained in an element at the same level.
  const {
    foundEndNodeSibling: foundEndNodeSiblingOnSameLevel,
    gatheredSiblings,
  } = gatherSiblingsUpToEndNode(startNode, endNode);

  if (foundEndNodeSiblingOnSameLevel) {
    return gatheredSiblings;
  }

  // Now go for the route that goes to the highest parent of the start node in the tree
  // that is not the parent of the end node.
  const startNodeParent = findFirstNonSharedParent({
    childElement: startNode,
    otherElement: endNode,
  });

  if (startNodeParent) {
    const {
      foundEndNodeSibling: foundEndNodeSiblingFromParentLevel,
      gatheredSiblings: gatheredSiblingsFromParent,
    } = gatherSiblingsUpToEndNode(startNodeParent, endNode);

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
export function groupHighlights(highlights, timestampAttr) {
  let order = [],
    chunks = {},
    grouped = [];

  highlights.forEach(function(hl) {
    let timestamp = hl.getAttribute(timestampAttr);

    if (typeof chunks[timestamp] === "undefined") {
      chunks[timestamp] = [];
      order.push(timestamp);
    }

    chunks[timestamp].push(hl);
  });

  order.forEach(function(timestamp) {
    let group = chunks[timestamp];

    grouped.push({
      chunks: group,
      timestamp: timestamp,
      toString: function() {
        return group
          .map(function(h) {
            return h.textContent;
          })
          .join("");
      },
    });
  });

  return grouped;
}

export function retrieveHighlights(params) {
  params = {
    andSelf: true,
    grouped: false,
    ...params,
  };

  let nodeList = params.container.querySelectorAll("[" + params.dataAttr + "]"),
    highlights = Array.prototype.slice.call(nodeList);

  if (params.andSelf === true && params.container.hasAttribute(params.dataAttr)) {
    highlights.push(params.container);
  }

  if (params.grouped) {
    highlights = groupHighlights(highlights, params.timestampAttr);
  }

  return highlights;
}

export function isElementHighlight(el, dataAttr) {
  return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(dataAttr);
}

export function addNodesToHighlightAfterElement({
  element,
  elementAncestor,
  highlightWrapper,
  highlightedClass,
}) {
  if (elementAncestor) {
    if (elementAncestor.classList.contains(highlightedClass)) {
      // Ensure we only take the children from a parent that is a highlight.
      elementAncestor.childNodes.forEach((childNode) => {
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
export function getHighlightedTextForRange(range, excludeTags = IGNORE_TAGS) {
  // Strip out all carriage returns and excess html layout space.

  return dom(range.cloneContents())
    .textContentExcludingTags(arrayToLower(excludeTags))
    .replace(/\s{2,}/g, " ")
    .replace("\r\n", "")
    .replace("\r", "")
    .replace("\n", "");
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
export function getHighlightedTextRelativeToRoot({
  rootElement,
  startOffset,
  length,
  excludeTags = IGNORE_TAGS,
}) {
  const textContent = dom(rootElement).textContentExcludingTags(arrayToLower(excludeTags));
  const highlightedRawText = textContent.substring(
    startOffset,
    Number.parseInt(startOffset) + Number.parseInt(length),
  );

  const textNode = document.createTextNode(highlightedRawText);
  const tempContainer = document.createElement("div");
  tempContainer.appendChild(textNode);
  // Extract the human-readable text only.
  return tempContainer.innerText;
}

export function createDescriptors({ rootElement, range, wrapper, excludeNodeNames = IGNORE_TAGS, dataAttr = DATA_ATTR }) {
  const wrapperClone = wrapper.cloneNode(true);

  const startOffset =
    getElementOffset(range.startContainer, rootElement, excludeNodeNames) + range.startOffset;

  const endOffset =
    range.startContainer === range.endContainer
      ? startOffset + (range.endOffset - range.startOffset)
      : getElementOffset(range.endContainer, rootElement, excludeNodeNames) + range.endOffset;

  const length = endOffset - startOffset;

  wrapperClone.setAttribute(dataAttr, true);
  wrapperClone.setAttribute(START_OFFSET_ATTR, startOffset);
  wrapperClone.setAttribute(LENGTH_ATTR, length);

  wrapperClone.innerHTML = "";
  const wrapperHTML = wrapperClone.outerHTML;

  const descriptor = [
    wrapperHTML,
    // retrieve all the text content between the start and end offsets.
    getHighlightedTextForRange(range, excludeNodeNames),
    startOffset,
    length,
  ];
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
function isClosestHighlightParent(node, id, rootElement, dataAttr = DATA_ATTR) {
  let isClosestHighlightParent = true;
  let currentNode = node.parentNode;

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
export function focusHighlightNodes(
  id,
  nodeInfoList,
  highlightWrapper,
  rootElement,
  highlightedClass,
  normalizeElements,
  dataAttr = DATA_ATTR
) {
  nodeInfoList.forEach((nodeInfo) => {
    const node = nodeInfo.node;
    // Only wrap the node if the closest highlight parent isn't one with the given id.
    if (!isClosestHighlightParent(node, id, rootElement, dataAttr)) {
      // Ensure any ancestors that aren't direct parents that represent the same highlight wrapper are removed.
      const ancestors = dom(node).parentsUpTo(rootElement);
      ancestors.forEach((ancestor) => {
        if (isElementHighlight(ancestor, dataAttr) && ancestor.classList.contains(id)) {
          // Ensure a copy of the ancestor is wrapped back around any
          // other children that do not contain the current node.
          ancestor.childNodes.forEach((ancestorChild) => {
            if (!ancestorChild.contains(node)) {
              const wrapper = highlightWrapper.cloneNode(true);
              dom(ancestorChild).wrap(wrapper);
            }
          });

          dom(ancestor).unwrap();
        }
      });

      // Now wrap the node or the part of the node the highlight covers directly with the wrapper.
      let nodeToBeWrapped = node;
      if (nodeInfo.offset > 0) {
        nodeToBeWrapped = node.splitText(nodeInfo.offset);
      }

      if (nodeInfo.length < nodeToBeWrapped.textContent.length) {
        nodeToBeWrapped.splitText(nodeInfo.length);
      }

      dom(nodeToBeWrapped).wrap(highlightWrapper.cloneNode(true));
    }
  });

  if (normalizeElements) {
    // Ensure we normalise all nodes in the root container to merge sibling elements
    // of the same highlight together that get copied for the purpose of focusing.
    dom(rootElement).normalizeElements(highlightedClass, dataAttr);
  }
}

/**
 * Validation for descriptors to ensure they are of the correct format to be used by the Independencia highlighter.
 *
 * @param {array} descriptors  The descriptors to be validated.
 * @return {boolean} - if the descriptors are valid or not.
 */
export function validateIndependenciaDescriptors(descriptors) {
  if (descriptors && descriptors.length === 4) {
    return true;
  }
  return false;
}
