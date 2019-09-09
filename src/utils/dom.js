import { isElementHighlight } from "./highlights";
import { DATA_ATTR } from "../config";
export const NODE_TYPE = { ELEMENT_NODE: 1, TEXT_NODE: 3 };

/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 *
 */
const dom = function(el) {
  return /** @lends dom **/ {
    /**
     * Adds class to element.
     * @param {string} className
     */
    addClass: function(className) {
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
    removeClass: function(className) {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(
          new RegExp("(^|\\b)" + className + "(\\b|$)", "gi"),
          " ",
        );
      }
    },

    /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
    prepend: function(nodesToPrepend) {
      let nodes = Array.prototype.slice.call(nodesToPrepend),
        i = nodes.length;

      while (i--) {
        el.insertBefore(nodes[i], el.firstChild);
      }
    },

    /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
    append: function(nodesToAppend) {
      let nodes = Array.prototype.slice.call(nodesToAppend);

      for (let i = 0, len = nodes.length; i < len; ++i) {
        el.appendChild(nodes[i]);
      }
    },

    /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertAfter: function(refEl) {
      return refEl.parentNode.insertBefore(el, refEl.nextSibling);
    },

    /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
    insertBefore: function(refEl) {
      return refEl.parentNode.insertBefore(el, refEl);
    },

    /**
     * Removes base element from DOM.
     */
    remove: function() {
      el.parentNode.removeChild(el);
      el = null;
    },

    /**
     * Returns true if base element contains given child.
     * @param {Node|HTMLElement} child
     * @returns {boolean}
     */
    contains: function(child) {
      return el !== child && el.contains(child);
    },

    /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
    wrap: function(wrapper) {
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
    unwrap: function() {
      let nodes = Array.prototype.slice.call(el.childNodes),
        wrapper;

      nodes.forEach(function(node) {
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
    parents: function() {
      let parent,
        path = [];

      while ((parent = el.parentNode)) {
        path.push(parent);
        el = parent;
      }

      return path;
    },

    /**
     * Returns array of base element parents up to the
     * provided root element.
     *
     * @param {HTMLElement} rootElement
     * @returns {HTMLElement[]}
     */
    parentsUpTo: function(rootElement) {
      let parent,
        path = [];

      while ((parent = el.parentNode) && parent !== rootElement) {
        path.push(parent);
        el = parent;
      }

      return path;
    },

    /**
     * Returns array of base element parents, excluding the document.
     * @returns {HTMLElement[]}
     */
    parentsWithoutDocument: function() {
      return this.parents().filter((elem) => elem !== document);
    },

    /**
     * Traverses up the tree to to get the next closest sibling of a node
     * or any of it's parents.
     *
     * This is used in scenarios where you have already consumed the parents while
     * traversing the tree but not the siblings of parents.
     *
     * @returns {HTMLElement | null}
     */
    nextClosestSibling: function() {
      let current = el;
      let nextClosestSibling;

      do {
        nextClosestSibling = current.nextSibling;
        current = current.parentNode;
      } while (!nextClosestSibling && current.parentNode);

      return nextClosestSibling;
    },

    /**
     * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
     * element node has only one text node.
     * It should does the same as standard element.normalize, but IE implements it incorrectly.
     */
    normalizeTextNodes: function() {
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
     * Normalizes elements that have the a same id and are next to eachother in the child list
     */
    normalizeElements: function(highlightedClass) {
      if (!el) {
        return;
      }

      if (el.nodeType !== NODE_TYPE.TEXT_NODE) {
        if (isElementHighlight(el, DATA_ATTR)) {
          let className = el.className;
          while (
            className &&
            el.nextSibling &&
            el.nextSibling.nodeType !== NODE_TYPE.TEXT_NODE &&
            el.nextSibling.className === className &&
            className !== highlightedClass
          ) {
            el.innerHTML += el.nextSibling.innerHTML;
            el.parentNode.removeChild(el.nextSibling);
          }
          dom(el.firstChild).normalizeElements(highlightedClass);
        } else {
          let id = el.id;
          while (
            id &&
            el.nextSibling &&
            el.nextSibling.nodeType !== NODE_TYPE.TEXT_NODE &&
            el.nextSibling.id === id
          ) {
            el.innerHTML += el.nextSibling.innerHTML;
            el.parentNode.removeChild(el.nextSibling);
          }
          dom(el.firstChild).normalizeElements(highlightedClass);
        }
      } else {
        dom(el).normalizeTextNodes();
      }
      dom(el.nextSibling).normalizeElements(highlightedClass);
    },

    /**
     * Returns element background color.
     * @returns {CSSStyleDeclaration.backgroundColor}
     */
    color: function() {
      return el.style.backgroundColor;
    },

    /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
    fromHTML: function(html) {
      let div = document.createElement("div");
      div.innerHTML = html;
      return div.childNodes;
    },

    /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
    getRange: function() {
      let selection = dom(el).getSelection(),
        range;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      }

      return range;
    },

    /**
     * Removes all ranges of the window of base element.
     */
    removeAllRanges: function() {
      let selection = dom(el).getSelection();
      selection.removeAllRanges();
    },

    /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
    getSelection: function() {
      return dom(el)
        .getWindow()
        .getSelection();
    },

    /**
     * Returns window of the base element.
     * @returns {Window}
     */
    getWindow: function() {
      return dom(el).getDocument().defaultView;
    },

    /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
    getDocument: function() {
      // if ownerDocument is null then el is the document itself.
      return el.ownerDocument || el;
    },
    /**
     * Returns whether the provided element comes after the base element.
     *
     * @param {HTMLElement} otherElement
     *
     * @returns {boolean}
     */
    isAfter: function(otherElement, rootElement) {
      let sibling = el.nextSibling;
      let isAfter = false;
      while (sibling && !isAfter) {
        if (sibling === otherElement) {
          isAfter = true;
        } else {
          if (!sibling.nextSibling) {
            sibling = el.parentNode.nextSibling;
          } else {
            sibling = sibling.nextSibling;
          }
        }
      }
      return isAfter;
    },

    /**
     * Extracts all the text content for the root element excluding
     * all the text content inside any of the provided excluded tags.
     *
     * @param {string[]} excludeTags lement tags to exclude
     *
     * @returns {string}
     */
    textContentExcludingTags: function(excludeTags) {
      // Ensure we simply return the text content in the case the element is a text node.
      if (el.nodeType !== NODE_TYPE.TEXT_NODE) {
        const elCopy = el.cloneNode(true);
        const elementsToBeExcluded = excludeTags.reduce((accum, tag) => {
          return [...accum, ...elCopy.querySelectorAll(tag)];
        }, []);
        elementsToBeExcluded.forEach((toExcludeFromCopy) => {
          toExcludeFromCopy.remove();
        });
        return elCopy.textContent;
      }
      return el.textContent;
    },
  };
};

export default dom;
