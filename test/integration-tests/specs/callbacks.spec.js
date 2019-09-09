import fixtures from "../fixtures/callbacks";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";
import { TIMESTAMP_ATTR } from "../../../src/config";
import {
  span,
  b,
  i,
  div,
  img,
  style,
  script,
  docFrag,
  spanWithAttrs,
  highlight,
} from "../../utils/dom-elements";

describe("highlighting a given range", () => {
  let root, highlighter;

  beforeAll(() => {
    root = document.getElementById("root");
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  /*
   * Tests the different callback parameters
   * Procedure:
   & [1] Initialise the text highlighter with the callback functions passed in the parameters.
   * [2] Load fixture named: params.fixturePrefix + '.base' (fixture before highlights).
   * [3] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture after highlights).
   * [4] Load fixture named: params.fixturePrefix + '.' + params.fixtureAfterRemoval (fixture after highlights are removed).
   * [5] Set the base fixture as the root and set the range from the parameters.
   * [6] Do the highlight
   * [7] Compare HTML of result with fixture from step [3].
   * [8] Remove the highlights
   * [9] Compare HTML of result with fixture from step [4].
   * @param params
   * @param {string} params.title - test title
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix used after the normalising for comparison
   * @param {string} params.fixtureAfterRemoval - fixture name postfix used after the normalising for comparison
   * @param {Object} params.range - The range with the start/end nodes and start/end offsets for which to make the highlight.
   * @param {string} params.colour - The colour of the highlight to be made.
   * @params {Function} params.cloneContents - Function to clone the contents of the nodes within the range.
   * @params {Function} params.onBeforeHighlight - callback to be excecuted before the highlight is made
   * @params {Function} params.onAfterHighlight - callback to be excecuted after the highlight is made
   * @params {Function} params.onRemoveHighlight - callback to be excecuted before the highlight is removed
   */

  const testCallbacks = (params) => {
    it(params.title, () => {
      highlighter = new TextHighlighter(root, {
        version: "independencia",
        onBeforeHighlight: params.onBeforeHighlight,
        onAfterHighlight: params.onAfterHighlight,
        onRemoveHighlight: params.onRemoveHighlight,
      });

      const fixture = fixtures[`${params.fixturePrefix}.${params.fixturePostfix}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.base`];
      const fixtureAfterRemoval = fixtures[`${params.fixturePrefix}.${params.fixtureAfterRemoval}`];
      setContents(root, fixtureBase());

      let startNode = document.getElementById(params.range.startNodeId);
      let endNode = document.getElementById(params.range.endNodeId);

      startNode.clone = () => {
        return startNode;
      };

      let range = {
        startContainer: startNode,
        startOffset: params.range.startOffset,
        endContainer: endNode,
        endOffset: params.range.endOffset,
        cloneContents: params.cloneContents,
      };

      window.getSelection = () => {
        return {
          rangeCount: 1,
          removeAllRanges: () => {},
          getRangeAt: (index) => {
            return range;
          },
        };
      };

      highlighter.setColor(params.colour);
      highlighter.doHighlight(true);

      let highlights = Array.prototype.slice.call(document.querySelectorAll(".highlighted"));
      highlights.forEach((highlight) => {
        highlight.setAttribute(TIMESTAMP_ATTR, "test");
      });

      const htmlDuring = root.innerHTML;

      expect(htmlDuring).toEqual(fixture().outerHTML);

      highlighter.removeHighlights();

      const htmlAfter = root.innerHTML;

      expect(htmlAfter).toEqual(fixtureAfterRemoval().outerHTML);
    });
  };

  testCallbacks({
    title: "should not change from the base since no callbacks are passed as parameters",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "base",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {},
    onAfterHighlight: () => {},
    onRemoveHighlight: () => {},
  });

  testCallbacks({
    title: "should not change from the base since only onBeforeHighlight is passed as a parameter",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "base",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return true;
    },
    onAfterHighlight: () => {},
    onRemoveHighlight: () => {},
  });

  testCallbacks({
    title: "should not change from the base since only onAfterHighlight is passed as a parameter",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "base",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {},
    onAfterHighlight: (range, descriptors, timestamp) => {
      return descriptors;
    },
    onRemoveHighlight: () => {},
  });

  testCallbacks({
    title:
      "should create a highlight but fail to remove it since onRemoveHighlight is an empty function",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "singleHighlight",
    fixtureAfterRemoval: "singleHighlight",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return true;
    },
    onAfterHighlight: (range, descriptors, timestamp) => {
      return descriptors;
    },
    onRemoveHighlight: () => {},
  });

  testCallbacks({
    title: "should not change from the base since only onBeforeHighlight is set to false",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "base",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return false;
    },
    onAfterHighlight: (range, descriptors, timestamp) => {
      return descriptors;
    },
    onRemoveHighlight: () => {},
  });

  testCallbacks({
    title: "should create a highlight and remove it correctly",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "singleHighlight",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return true;
    },
    onAfterHighlight: (range, descriptors, timestamp) => {
      return descriptors;
    },
    onRemoveHighlight: () => {
      return true;
    },
  });

  testCallbacks({
    title:
      "should create a highlight but fail to remove it since onRemoveHighlight is set to false",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "singleHighlight",
    fixtureAfterRemoval: "singleHighlight",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return true;
    },
    onAfterHighlight: (range, descriptors, timestamp) => {
      return descriptors;
    },
    onRemoveHighlight: () => {
      return false;
    },
  });

  testCallbacks({
    title:
      "should create a highlight and remove it correctly with a more complex onAfterHighlight function.",
    fixturePrefix: "01.callbacks",
    fixturePostfix: "singleHighlightWithId",
    fixtureAfterRemoval: "base",
    range: {
      startNodeId: "highlight-1-start-node",
      startOffset: 0,
      endNodeId: "highlight-1-start-node",
      endOffset: 26,
    },
    colour: "red",
    cloneContents: () => {
      return docFrag(span("Lorem ipsum dolor sit amet"));
    },
    onBeforeHighlight: () => {
      return true;
    },
    onAfterHighlight: function(range, descriptors) {
      var descriptorsWithIds = descriptors.map((descriptor) => {
        var [wrapper, ...rest] = descriptor;
        return [wrapper.replace('class="highlighted"', `class="highlighted testId"`), ...rest];
      });
      return descriptorsWithIds;
    },
    onRemoveHighlight: () => {
      return true;
    },
  });
});
