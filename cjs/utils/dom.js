"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.NODE_TYPE = void 0;

var _highlights = require("./highlights");

var _config = require("../config");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var NODE_TYPE = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8
};
/**
 * Utility functions to make DOM manipulation easier.
 * @param {Node|HTMLElement} [el] - base DOM element to manipulate
 * @returns {object}
 *
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
       * Returns array of base element parents up to the
       * provided root element.
       *
       * @param {HTMLElement} rootElement
       * @returns {HTMLElement[]}
       */
      parentsUpTo: function parentsUpTo(rootElement) {
        var parent,
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
      parentsWithoutDocument: function parentsWithoutDocument() {
        return this.parents().filter(function (elem) {
          return elem !== document;
        });
      },

      /**
       * Traverses up the tree to to get the next closest sibling of a node
       * or any of it's parents.
       *
       * This is used in scenarios where you have already consumed the parents while
       * traversing the tree but not the siblings of parents.
       *
       * @param {HTMLElement | undefined} rootNode  The root node which acts as a threshold
       * for how deep we can go in the tree when getting siblings or their parents.
       *
       * @returns {HTMLElement | null}
       */
      nextClosestSibling: function nextClosestSibling(rootNode) {
        var current = el;
        var nextClosestSibling;

        do {
          nextClosestSibling = current.nextSibling;
          current = current.parentNode;
        } while (!nextClosestSibling && current.parentNode && rootNode.contains(current));

        if (!rootNode.contains(current)) {
          nextClosestSibling = null;
        }

        return nextClosestSibling;
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
       * Normalizes elements that have the a same id and are next to eachother in the child list
       */
      normalizeElements: function normalizeElements(highlightedClass) {
        var dataAttr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _config.DATA_ATTR;

        if (!el) {
          return;
        }

        if (el.nodeType !== NODE_TYPE.TEXT_NODE) {
          if ((0, _highlights.isElementHighlight)(el, dataAttr)) {
            var className = el.className;

            while (className && el.nextSibling && el.nextSibling.nodeType !== NODE_TYPE.TEXT_NODE && el.nextSibling.className === className && className !== highlightedClass) {
              el.innerHTML += el.nextSibling.innerHTML;
              el.parentNode.removeChild(el.nextSibling);
            }

            dom(el.firstChild).normalizeElements(highlightedClass, dataAttr);
          } else {
            var id = el.id;

            while (id && el.nextSibling && el.nextSibling.nodeType !== NODE_TYPE.TEXT_NODE && el.nextSibling.id === id) {
              el.innerHTML += el.nextSibling.innerHTML;
              el.parentNode.removeChild(el.nextSibling);
            }

            dom(el.firstChild).normalizeElements(highlightedClass, dataAttr);
          }
        } else {
          dom(el).normalizeTextNodes();
        }

        dom(el.nextSibling).normalizeElements(highlightedClass, dataAttr);
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
      },

      /**
       * Returns whether the provided element comes after the base element.
       *
       * @param {HTMLElement} otherElement
       *
       * @returns {boolean}
       */
      isAfter: function isAfter(otherElement, rootElement) {
        var sibling = el.nextSibling;
        var isAfter = false;

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
      textContentExcludingTags: function textContentExcludingTags(excludeTags) {
        if (el && el.nodeType === NODE_TYPE.COMMENT_NODE) {
          return "";
        }

        if (el && el.nodeType !== NODE_TYPE.TEXT_NODE) {
          // Ensure we simply return the text content in the case the element is a text node.
          var elCopy = el.cloneNode(true);
          var commentsInCopy = [elCopy.querySelectorAll("*")].filter(function (element) {
            return element.nodeType === NODE_TYPE.COMMENT_NODE;
          });
          commentsInCopy.forEach(function (toExcludeFromCopy) {
            toExcludeFromCopy.remove();
          });
          var elementsToBeExcluded = excludeTags.reduce(function (accum, tag) {
            return [].concat(_toConsumableArray(accum), _toConsumableArray(elCopy.querySelectorAll(tag)));
          }, []);
          elementsToBeExcluded.forEach(function (toExcludeFromCopy) {
            toExcludeFromCopy.remove();
          });
          return elCopy.textContent;
        }

        return el.textContent;
      },

      /**
       * Gets the index of a child element in the base element.
       * It is important we use childNodes as we want to include both
       * html element nodes and text nodes.
       *
       * @param {HTMLElement} childElement
       * @return {number}
       */
      getChildIndex: function getChildIndex(childElement) {
        var currentChild = el.firstChild;
        var i = 0;

        while (currentChild && childElement !== currentChild) {
          if (currentChild !== childElement) {
            currentChild = currentChild.nextSibling;
            i++;
          }
        }

        return currentChild ? i : -1;
      },

      /**
       * Loop through the elements in the dom and remove any events attached to elements that are not text nodes and have no children.
       *
       * @param {listOfElementAttributes} - list of events and their values which have been turned off, along with a temporary id for each element which has been altered.
       */
      turnOffEventHandlers: function turnOffEventHandlers(listOfElementAttributes) {
        if (!el) {
          return;
        }

        if (el.childNodes && el.childNodes.length > 0) {
          dom(el.firstChild).turnOffEventHandlers(listOfElementAttributes);
        } else if (el.nodeType !== NODE_TYPE.TEXT_NODE && el.attributes) {
          var eventsForObject = dom(el).turnOffEventHandlersForElement();

          if (eventsForObject) {
            listOfElementAttributes.push(eventsForObject);
          }
        }

        dom(el.nextSibling).turnOffEventHandlers(listOfElementAttributes);
      },

      /**
       * Loop through the elements in the dom and add back in any events that were previously removed from elements.
       *
       * @param {listOfElementAttributes} - list of events and their values which have recently been turned off, along with a temporary id for each element which has been altered.
       */
      turnOnEventHandlers: function turnOnEventHandlers(listOfElementAttributes) {
        if (!el || !listOfElementAttributes || listOfElementAttributes.length === 0) {
          return;
        }

        var elements = Array.prototype.slice.call(el.querySelectorAll("[temp-id]"));
        listOfElementAttributes.forEach(function (elementAttribute) {
          var tempId = elementAttribute.tempId;
          var attributeList = elementAttribute.listOfAttributes;
          var element = elements.filter(function (element) {
            return element.getAttribute("temp-id") === tempId;
          })[0];

          if (element) {
            dom(element).addAttributes(attributeList);
            element.removeAttribute("temp-id");
          }
        });
      },

      /**
       * Loop through the attributes of an element and turn off all attributes that have names starting with 'on'.
       * This will turn of all events for elements that have no children and are not text nodes (images etc.)
       *
       * @return {object} - list of events and their values which have been turned off
       */
      turnOffEventHandlersForElement: function turnOffEventHandlersForElement() {
        if (!el) {
          return null;
        }

        if (el.nodeType !== NODE_TYPE.TEXT_NODE && el.nodeType !== NODE_TYPE.COMMENT_NODE && el.childNodes && el.childNodes.length === 0) {
          var attributes = [].slice.call(el.attributes);
          var listOfAttributes = [];
          var i;

          for (i = 0; i < attributes.length; i++) {
            var att = attributes[i].name;

            if (att.indexOf("on") === 0) {
              var eventHandlers = {};
              eventHandlers.attribute = attributes[i].name;
              eventHandlers.value = attributes[i].value;
              listOfAttributes.push(eventHandlers);
              el.attributes.removeNamedItem(att);
            }
          }

          if (listOfAttributes.length > 0) {
            var uniqueId = "hlt-".concat(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            el.setAttribute("temp-id", uniqueId);
            return {
              tempId: uniqueId,
              listOfAttributes: listOfAttributes
            };
          }
        }
      },

      /**
       * Loop through the a list of attributes and add each and their value to the element.
       *
       * @param {array} - list of attributes and their values
       */
      addAttributes: function addAttributes(attributes) {
        if (!el) {
          return;
        }

        var i;

        for (i = 0; i < attributes.length; i++) {
          var attribute = attributes[i];
          el.setAttribute(attribute.attribute, attribute.value);
        }
      }
    }
  );
};

var _default = dom;
exports["default"] = _default;
