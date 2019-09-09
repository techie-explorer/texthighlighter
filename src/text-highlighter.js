import dom from "./utils/dom";
import { bindEvents, unbindEvents } from "./utils/events";
import Primitivo from "./highlighters/primitivo";
import Independencia from "./highlighters/independencia";
import { DATA_ATTR } from "./config";
import { createWrapper } from "./utils/highlights";

const highlighters = {
  primitivo: Primitivo,
  "v1-2014": Primitivo,
  independencia: Independencia,
  "v2-2019": Independencia,
};

const versionNames = {
  "v1-2014": "Primitivo (v1-2014)",
  primitivo: "Primitivo (v1-2014)",
  "v2-2019": "Independencia (v2-2019)",
  independencia: "Independencia (v2-2019)",
};

/**
 * TextHighlighter that provides text highlighting functionality to dom elements.
 */
class TextHighlighter {
  /**
   * Creates wrapper for highlights.
   * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
   * in constructor.
   *
   * @param {object} options - the same object as in TextHighlighter constructor.
   * @returns {HTMLElement}
   */
  static createWrapper(options) {
    return createWrapper(options);
  }

  /**
   * Creates TextHighlighter instance and binds to given DOM elements.
   *
   * @param {HTMLElement} element - DOM element to which highlighted will be applied.
   * @param {object} [options] - additional options.
   * @param {string} options.version - The version of the text highlighting functionality to use.
   * There are two options:
   *   primitivo (v1-2014) is for the initial implementation using interdependent highlight locators.
   *   (Lots of issues for requirements beyond simple all or nothing highlights)
   *
   *   independencia (v2-2019) is for an improved implementation focusing on making highlights independent
   *   from eachother and other element nodes within the context DOM object. v2 uses data attributes
   *   as the source of truth about the text range selected to create the original highlight.
   *   This allows us freedom to manipulate the DOM at will and handle overlapping highlights a lot better.
   *
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
   * wrappers is passed as param. (The callback interface differs between versions, see specific highlighter classes for more info)
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
      version: "independencia",
      excludeNodes: ["SCRIPT", "STYLE"],
      onRemoveHighlight: function() {
        return true;
      },
      onBeforeHighlight: function() {
        return true;
      },
      onAfterHighlight: function(_, hlts) {
        // For the newer version of the highlighter, we need to return the
        // highlight descriptors parameter by default in order to create highlights in the DOM.
        return hlts;
      },
      ...options,
    };

    if (!highlighters[this.options.version]) {
      throw new Error("Please provide a valid version of the text highlighting functionality");
    }

    this.highlighter = new highlighters[this.options.version](this.el, this.options);

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

  doHighlight(keepRange) {
    this.highlighter.doHighlight(keepRange);
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
    return this.highlighter.highlightRange(range, wrapper);
  }

  /**
   * Normalizes highlights. Ensure at least text nodes are normalized, carries out some flattening and nesting
   * where necessary.
   *
   * @param {Array} highlights - highlights to normalize.
   * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
   * input highlights.
   * @memberof TextHighlighter
   */
  normalizeHighlights(highlights) {
    return this.highlighter.normalizeHighlights(highlights);
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
   * @param {HTMLElement} element - element to remove highlights from.
   *                                 if empty, the root element of the highlighter will  be used.
   * @param {string} id - The unique id of a highlight represented by a collection of elements.
   * @memberof TextHighlighter
   */
  removeHighlights(element, id) {
    this.highlighter.removeHighlights(element, id);
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
    return this.highlighter.getHighlights(params);
  }

  /**
   * Returns true if element is a highlight.
   * All highlights have 'data-highlighted' attribute.
   * @param el - element to check.
   * @returns {boolean}
   * @memberof TextHighlighter
   */
  isHighlight(el) {
    return this.highlighter.isHighlight(el, DATA_ATTR);
  }

  /**
   * Serializes all highlights in the element the highlighter is applied to.
   * the id is not used in the initial version of the highlighter.
   *
   * @param {string} id - The unique identifier grouping a set of highlight elements together.
   * @returns {string} - stringified JSON with highlights definition
   * @memberof TextHighlighter
   */
  serializeHighlights(id) {
    return this.highlighter.serializeHighlights(id);
  }

  /**
   * Deserializes highlights.
   * @throws exception when can't parse JSON or JSON has invalid structure.
   * @param {object} json - JSON object with highlights definition.
   * @returns {Array} - array of deserialized highlights.
   * @memberof TextHighlighter
   */
  deserializeHighlights(json) {
    return this.highlighter.deserializeHighlights(json);
  }

  /**
   * Finds and highlights given text.
   * @param {string} text - text to search for
   * @param {boolean} [caseSensitive] - if set to true, performs case sensitive search (default: true)
   * @memberof TextHighlighter
   */
  find(text, caseSensitive) {
    let wnd = dom(this.el).getWindow(),
      scrollX = wnd.scrollX,
      scrollY = wnd.scrollY,
      caseSens = typeof caseSensitive === "undefined" ? true : caseSensitive;

    dom(this.el).removeAllRanges();

    if (wnd.find) {
      while (wnd.find(text, caseSens)) {
        this.doHighlight(true);
      }
    } else if (wnd.document.body.createTextRange) {
      let textRange = wnd.document.body.createTextRange();
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

  /**
   * Focuses a highlight, bringing it forward in the case it is sitting behind another
   * overlapping highlight, or a highlight it is nested inside.
   *
   * This is only supported by independencia (v2-2019) and onwards.
   * For older versions, this will simply do nothing.
   *
   * @param {string} id - The id of the highlight present in the class names of all elements
   *                      in the DOM that represent the highlight.
   *
   * @param {string} descriptors - Optional serialised descriptors, useful in the case a highlight has no representation in the DOM
   *                        where empty highlight wrapper nodes are removed to use less dom elements.
   *
   * @memberof TextHighlighter
   */
  focusUsingId(id, descriptors) {
    if (this.highlighter.focusUsingId) {
      this.highlighter.focusUsingId(id, descriptors);
    } else {
      console.warn(
        `The ${
          versionNames[this.options.version]
        } version of the text highlighter does not support focusing highlights.`,
      );
    }
  }

  /**
   * Deselects a highlight, bringing any nested highlights in the list of descriptors
   * forward.
   *
   * This is only supported by independencia (v2-2019) and onwards.
   * For older versions, this will simply do nothing.
   *
   * @typedef HighlightDescriptor
   * @type {object}
   * @property {string} id
   * @property {string} serialisedDescriptor
   *
   * @param {string} id  The id of the deselected highlight.
   * @param {HighlightDescriptor[]} descriptors the serialised highlight descriptors for a set of highlights that could be nested
   *                               in the deselected highlight.
   * @memberof TextHighlighter
   */
  deselectUsingId(id, descriptors) {
    if (this.highlighter.deselectUsingId) {
      this.highlighter.deselectUsingId(id, descriptors);
    } else {
      console.warn(
        `The ${
          versionNames[this.options.version]
        } version of the text highlighter does not support deselecting highlights.`,
      );
    }
  }
}

export default TextHighlighter;