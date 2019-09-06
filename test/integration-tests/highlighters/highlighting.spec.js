import fixtures from "../fixtures/highlighting";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";
import { TIMESTAMP_ATTR } from "../../../src/config";

describe("highlighting a given range", () => {
  let root, highlighter;

  beforeAll(() => {
    root = document.getElementById("root");
    
  });

  beforeEach(() => {
    highlighter = new TextHighlighter(root, { version: "independencia", onAfterHighlight: (
        range,
        descriptors,
        timestamp
      ) => {
        return descriptors
      }});
    
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  /**
   * Tests highlighting of ranges and removing highlights
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture with highlights).
   * [2] Create range.
   * [3] Highlight range
   * [4] Compare JSON form of highlight with params.expectedText
   * [4] Load fixture named: params.fixturePrefix + '.base' (fixture with highlights removed).
   * [5] Remove previously created highlight.
   * [6] Compare HTML of result with fixture from step [1].
   * @param params
   * @param {string} params.title - test title
   * @param {JSON} params.range - the range object for the highlight
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfixBeforeHighlight - fixture name postfix before highlight is made
   * @param {string} params.fixturePostfixAfterHighlight - fixture name postfix after highlight is made
   * @param {string} params.fixturePostfixRemovedHighlight - fixture name postfix after highlight is removed
   * @param {string} params.colour - colour of the highlighter
   */
  const testHighlighting = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfixAfterHighlight}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeHighlight}`];
      const fixtureAfterRemoval = fixtures[`${params.fixturePrefix}.${params.fixturePostfixRemovedHighlight}`];
      setContents(root, fixtureBase());

      let startNode = document.getElementById(params.range.startNodeId);
      let endNode = document.getElementById(params.range.endNodeId);

      startNode.clone = () => {
              return startNode;
            }

      let range = {
        startContainer:startNode,
          startOffset:params.range.startOffset,
          endContainer:endNode,endOffset:params.range.endOffset};
      
      window.getSelection = () => {
        return {
          rangeCount: 1,
          removeAllRanges: () => {},
          getRangeAt: (index) => {
            return range
          }
        };
      }

      highlighter.setColor(params.colour)
      highlighter.doHighlight(true);

      let highlights = Array.prototype.slice.call(document.querySelectorAll('.highlighted'));
      highlights.forEach(highlight => {
        highlight.setAttribute(TIMESTAMP_ATTR, "test");
      })

      const htmlDuring = root.innerHTML;

      expect(htmlDuring).toEqual(fixture().outerHTML);

      highlighter.removeHighlights(root);
      const htmlAfter = root.innerHTML;

      expect(htmlAfter).toEqual(fixtureAfterRemoval().outerHTML);
    });
  };

  testHighlighting({
    title: "should highlight and remove correctly for a single highlight",
    fixturePrefix: "01.highlighting",
    fixturePostfixAfterHighlight: "singleHighlight",
    fixturePostfixBeforeHighlight: "base",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 0, endNodeId: 'highlight-1-start-node', endOffset: 26},
    colour: 'red'
  });

  testHighlighting({
    title: "should highlight and remove correctly for multiple highlights",
    fixturePrefix: "01.highlighting",
    fixturePostfixAfterHighlight: "multipleHighlights",
    fixturePostfixBeforeHighlight: "singleHighlight",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-2-start-node', startOffset: 2, endNodeId: 'highlight-2-start-node', endOffset: 3},
    colour: 'blue'
  });
});