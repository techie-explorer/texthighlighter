import fixtures from "../fixtures/highlighting";
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
  highlight
} from "../../utils/dom-elements";

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
   * @param {string} params.highlightId - id of the new highlight
   * @param {string} params.highlightIdToRemove - id of the highlight to remove, if this isn't set then remove them all
   * @param {function} params.cloneContents - the return of the range clone contents function
   */
  const testHighlighting = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfixAfterHighlight}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeHighlight}`];
      const fixtureAfterRemoval = fixtures[`${params.fixturePrefix}.${params.fixturePostfixRemovedHighlight}`];
      setContents(root, fixtureBase());

      console.log('root.innerHTML1',root.innerHTML)

      let startNode = document.getElementById(params.range.startNodeId);
      let endNode = document.getElementById(params.range.endNodeId);

      startNode.clone = () => {
              return startNode;
            }

      let range = {
        startContainer:startNode,
        startOffset:params.range.startOffset,
        endContainer:endNode,
        endOffset:params.range.endOffset,
        cloneContents: params.cloneContents
      };
      
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

      console.log('root.innerHTML2',root.innerHTML)

      let highlights = Array.prototype.slice.call(document.querySelectorAll('.highlighted'));
      highlights.forEach(highlight => {
        highlight.setAttribute(TIMESTAMP_ATTR, "test");
        if(params.highlightId && highlight.className === 'highlighted') {
          highlight.classList.add(params.highlightId)
        }
      })

      const htmlDuring = root.innerHTML;
      console.log('root.innerHTML3',root.innerHTML)

      expect(htmlDuring).toEqual(fixture().outerHTML);
      if(params.highlightIdToRemove) {
        highlighter.removeHighlights(params.highlightIdToRemove);
      } else {
        highlighter.removeHighlights();
      }
      
      const htmlAfter = root.innerHTML;
      console.log('root.innerHTML4',root.innerHTML)

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
    colour: 'red',
    cloneContents: () => {
      return docFrag(
        span("Lorem ipsum dolor sit amet"),
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove correctly for multiple highlights",
    fixturePrefix: "01.highlighting",
    fixturePostfixAfterHighlight: "multipleHighlights",
    fixturePostfixBeforeHighlight: "singleHighlight",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-2-start-node', startOffset: 2, endNodeId: 'highlight-2-start-node', endOffset: 3},
    colour: 'blue',
    cloneContents: () => {
      return docFrag(
        span("DDD"),
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove correctly for an overlapping highlight",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight1",
    fixturePostfixBeforeHighlight: "base",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 0, endNodeId: 'highlight-1-end-node', endOffset: 29},
    colour: 'red',
    highlightId: '1',
    cloneContents: () => {
      return docFrag(
        spanWithAttrs({id: 'highlight-1-end-node'})(
          "CCC",
          spanWithAttrs({id: 'highlight-1-start-node'})("Lorem ipsum dolor "),
          b("sit "),
          img(),
          i("am"),
          "et",
          span("consectetur adipiscit"),
          span("elit.")
        ),
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove all correctly for nested highlights",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight1ThenHighlight2",
    fixturePostfixBeforeHighlight: "highlight1",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 6, endNodeId: 'highlight-1-start-node', endOffset: 18},
    colour: 'blue',
    highlightId: '2',
    cloneContents: () => {
      return docFrag(
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "Lorem ipsum dolor "
        )
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove correctly for nested highlights when the second highlight is bigger than the first",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight2ThenHighlight1",
    fixturePostfixBeforeHighlight: "highlight2",
    fixturePostfixRemovedHighlight: "base",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 0, endNodeId: 'highlight-1-end-node', endOffset: 29},
    colour: 'red',
    highlightId: '1',
    cloneContents: () => {
      return docFrag(
        spanWithAttrs({id: 'highlight-1-end-node'})(
          "CCC",
          spanWithAttrs({id: 'highlight-1-start-node'})(
              "Lorem ",
              highlight(
                  { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
                  "ipsum dolor "
              )),
          b("sit "),
          img(),
          i("am"),
          "et",
          span("consectetur adipiscit"),
          span("elit.")
        ),
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove one correctly for nested highlights",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight1ThenHighlight2",
    fixturePostfixBeforeHighlight: "highlight1",
    fixturePostfixRemovedHighlight: "highlight1",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 6, endNodeId: 'highlight-1-start-node', endOffset: 18},
    colour: 'blue',
    highlightId: '2',
    highlightIdToRemove: '2',
    cloneContents: () => {
      return docFrag(
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "Lorem ipsum dolor "
        )
      );
    }
  });

  testHighlighting({
    title: "should highlight and remove one correctly for nested highlights where the second highlight is larger than the first",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight2ThenHighlight1",
    fixturePostfixBeforeHighlight: "highlight2",
    fixturePostfixRemovedHighlight: "highlight2",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 0, endNodeId: 'highlight-1-end-node', endOffset: 29},
    colour: 'red',
    highlightId: '1',
    highlightIdToRemove: '1',
    cloneContents: () => {
      return docFrag(
        spanWithAttrs({id: 'highlight-1-end-node'})(
          "CCC",
          spanWithAttrs({id: 'highlight-1-start-node'})(
              "Lorem ",
              highlight(
                  { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
                  "ipsum dolor "
              )),
          b("sit "),
          img(),
          i("am"),
          "et",
          span("consectetur adipiscit"),
          span("elit.")
        ),
      );
    }
  });

  testHighlighting({
    title: "should create second highlight nested within the first, then correctly remove the first.",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight1ThenHighlight2",
    fixturePostfixBeforeHighlight: "highlight1",
    fixturePostfixRemovedHighlight: "highlight2",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 6, endNodeId: 'highlight-1-start-node', endOffset: 18},
    colour: 'blue',
    highlightId: '2',
    highlightIdToRemove: '1',
    cloneContents: () => {
      return docFrag(
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "Lorem ipsum dolor "
        )
      );
    }
  });

  testHighlighting({
    title: "should create second highlight nested around the first, then correctly remove the first.",
    fixturePrefix: "02.highlighting",
    fixturePostfixAfterHighlight: "highlight2ThenHighlight1",
    fixturePostfixBeforeHighlight: "highlight2",
    fixturePostfixRemovedHighlight: "highlight1",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 0, endNodeId: 'highlight-1-end-node', endOffset: 29},
    colour: 'red',
    highlightId: '1',
    highlightIdToRemove: '2',
    cloneContents: () => {
      return docFrag(
        spanWithAttrs({id: 'highlight-1-end-node'})(
          "CCC",
          spanWithAttrs({id: 'highlight-1-start-node'})(
              "Lorem ",
              highlight(
                  { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
                  "ipsum dolor "
              )),
          b("sit "),
          img(),
          i("am"),
          "et",
          span("consectetur adipiscit"),
          span("elit.")
        ),
      );
    }
  });


  testHighlighting({
    title: "Should create a third highlight nested amongst 2 others, then correctly remove that highlight",
    fixturePrefix: "03.highlighting",
    fixturePostfixAfterHighlight: "highlight1ThenHighlight2ThenHighlight3",
    fixturePostfixBeforeHighlight: "highlight1ThenHighlight2",
    fixturePostfixRemovedHighlight: "highlight1ThenHighlight2",
    range:{startNodeId: 'highlight-1-start-node', startOffset: 8, endNodeId: 'highlight-1-start-node', endOffset: 13},
    colour: 'green',
    highlightId: '3',
    highlightIdToRemove: '3',
    cloneContents: () => {
      return docFrag(
        highlight(
          {
            color: "red",
            id: "test-overlapping-highlights-1",
            startOffset: 12,
            length: 16
          },
          "ipsum",
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-2",
              startOffset: 17,
              length: 15
            },
            " dolor "
          )
        )
      );
    }
  });


});