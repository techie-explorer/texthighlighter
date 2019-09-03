import dom, { NODE_TYPE } from "./dom";
import { START_OFFSET_ATTR, END_OFFSET_ATTR, DATA_ATTR } from "../config";

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
    while (
      !endContainer.previousSibling &&
      endContainer.parentNode !== ancestor
    ) {
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
    goDeeper: goDeeper
  };
}

/**
 * Sorts array of DOM elements by its depth in DOM tree.
 * @param {HTMLElement[]} arr - array to sort.
 * @param {boolean} descending - order of sort.
 */
export function sortByDepth(arr, descending) {
  arr.sort(function(a, b) {
    return (
      dom(descending ? b : a).parents().length -
      dom(descending ? a : b).parents().length
    );
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
  console.log("Element as parameter: ", element);
  let textNodeElement = element;
  let i = 0;
  while (textNodeElement && textNodeElement.nodeType !== NODE_TYPE.TEXT_NODE) {
    console.log(`textNodeElement step ${i}`, textNodeElement);
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

  console.log("text node element returned: ", textNodeElement);
  return textNodeElement;
}

/**
 * Determine where to inject a highlight based on it's offset.
 *
 * @param {*} highlight
 * @param {*} parentNode
 */
export function findNodeAndOffset(highlight, parentNode) {
  let currentNode = parentNode;
  let currentOffset = 0;
  let offsetWithinNode = 0;
  let locationFound = false;

  while (
    currentNode &&
    !locationFound &&
    (currentOffset < highlight.offset ||
      (currentOffset === highlight.offset && currentNode.childNodes.length > 0))
  ) {
    const endOfNodeOffset = currentOffset + currentNode.textContent.length;

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

  return { node: currentNode, offset: offsetWithinNode };
}

export function getElementOffset(childElement, rootElement) {
  let offset = 0;
  let childNodes;

  let currentElement = childElement;
  do {
    childNodes = Array.prototype.slice.call(
      currentElement.parentNode.childNodes
    );
    const childElementIndex = childNodes.indexOf(currentElement);
    const offsetInCurrentParent = getTextOffsetBefore(
      childNodes,
      childElementIndex
    );
    offset += offsetInCurrentParent;
    currentElement = currentElement.parentNode;
  } while (currentElement !== rootElement || !currentElement);

  return offset;
}

function getTextOffsetBefore(childNodes, cutIndex) {
  let textOffset = 0;
  for (let i = 0; i < cutIndex; i++) {
    const currentNode = childNodes[i];
    // Use textContent and not innerHTML to account for invisible characters as well.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    const text = currentNode.textContent;
    if (text && text.length > 0) {
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

const siblingRemovalDirections = {
  start: "previousSibling",
  end: "nextSibling"
};

const siblingTextNodeMergeDirections = {
  start: "nextSibling",
  end: "previousSibling"
};

function removeSiblingsInDirection(startNode, direction) {
  let sibling = startNode[direction];
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
  let sibling = startNode[direction];
  while (sibling) {
    if (sibling.nodeType === NODE_TYPE.TEXT_NODE) {
      startNode.textContent += sibling.textContent;
      startNode.parentNode.removeChild(sibling);
      sibling = sibling[direction];
    }
  }
}

export function extractElementContentForHighlight(params) {
  let element = params.element;
  let elementAncestor = params.elementAncestor;
  let options = params.options;
  let locationInSelection = params.locationInSelection;

  let elementAncestorCopy = elementAncestor.cloneNode(true);

  // Beginning of childNodes list for end container in selection
  // and end of childNodes list for start container in selection.
  let locationInChildNodes = locationInSelection === "start" ? "end" : "start";
  let elementCopy = findTextNodeAtLocation(
    elementAncestorCopy,
    locationInChildNodes
  );
  let elementCopyParent = elementCopy.parentNode;

  removeSiblingsInDirection(
    elementCopy,
    siblingRemovalDirections[locationInSelection]
  );

  mergeSiblingTextNodesInDirection(
    elementCopy,
    siblingTextNodeMergeDirections[locationInSelection]
  );

  console.log("elementCopy: ", elementCopy);
  console.log("elementCopyParent: ", elementCopyParent);

  // Clean out any nested highlight wrappers.
  if (
    elementCopyParent !== elementAncestorCopy &&
    elementCopyParent.classList.contains(options.highlightedClass)
  ) {
    dom(elementCopyParent).unwrap();
  }

  // Remove the text node that we need for the new highlight
  // from the existing highlight or other element.
  element.parentNode.removeChild(element);

  return { elementAncestorCopy, elementCopy };
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
    gatheredSiblings
  } = gatherSiblingsUpToEndNode(startNode, endNode);

  if (foundEndNodeSiblingOnSameLevel) {
    return gatheredSiblings;
  }

  // Now go for the route that goes to the highest parent of the start node in the tree
  // that is not the parent of the end node.
  const startNodeParent = findFirstNonSharedParent({
    childElement: startNode,
    otherElement: endNode
  });

  if (startNodeParent) {
    const {
      foundEndNodeSibling: foundEndNodeSiblingFromParentLevel,
      gatheredSiblings: gatheredSiblingsFromParent
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
      }
    });
  });

  return grouped;
}

export function retrieveHighlights(params) {
  params = {
    andSelf: true,
    grouped: false,
    ...params
  };

  let nodeList = params.container.querySelectorAll("[" + params.dataAttr + "]"),
    highlights = Array.prototype.slice.call(nodeList);

  if (
    params.andSelf === true &&
    params.container.hasAttribute(params.dataAttr)
  ) {
    highlights.push(params.container);
  }

  if (params.grouped) {
    highlights = groupHighlights(highlights, params.timestampAttr);
  }

  return highlights;
}

export function isElementHighlight(el, dataAttr) {
  return (
    el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(dataAttr)
  );
}

export function addNodesToHighlightAfterElement({
  element,
  elementAncestor,
  highlightWrapper,
  highlightedClass
}) {
  if (elementAncestor) {
    if (elementAncestor.classList.contains(highlightedClass)) {
      // Ensure we only take the children from a parent that is a highlight.
      elementAncestor.childNodes.forEach(childNode => {
        if (dom(childNode).isAfter(element)) {
        }
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
export function getHighlightedText(range) {
  const startContainerCopy = range.startContainer.clone(true);
  return "";
}

export function createDescriptors({ rootElement, range, wrapper }) {
  let wrapperClone = wrapper.cloneNode(true);

  const startOffset =
    getElementOffset(range.startContainer, rootElement) + range.startOffset;
  const endOffset =
    range.startContainer === range.endContainer
      ? startOffset + (range.endOffset - range.startOffset)
      : getElementOffset(range.endContainer, rootElement) + range.endOffset;
  const length = endOffset - startOffset;
  wrapperClone.setAttribute(DATA_ATTR, true);

  wrapperClone.innerHTML = "";
  const wrapperHTML = wrapperClone.outerHTML;

  const descriptor = [
    wrapperHTML,
    // retrieve all the text content between the start and end offsets.
    getHighlightedText(range),
    startOffset,
    length
  ];
  // TODO: chunk up highlights for PDFs (or any element with absolutely positioned elements).
  return [descriptor];
}
