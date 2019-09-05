import fixtures from "../fixtures/highlighting";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents, addRange } from "../../utils/dom-helpers";

describe("highlighting a given range", () => {
  let root, highlighter;
  beforeAll(() => {
    root = document.getElementById("root");
  });

  beforeEach(() => {
    highlighter = new TextHighlighter(root, { version: "independencia" });
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
   * @param {string[]} params.ids - The unique identifier for collections of highlight elements representing the same highlight.
   * @param {JSON} params.range - the range object for the highlight
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix
   * @param {string} params.expectedText - expected text content of serialized highlights
   */
  const testHighlighting = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfix}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.base`];
      setContents(root, fixture());
      const htmlBefore = root.innerHTML;

    let range = addRange(params.range.startNode, params.range.startOffset,params.range.endNode,params.range.endOffset)

     highlighter.doHighlight(true);

      //expect(text).toEqual(params.expectedText);

      highlighter.removeHighlights(root);
      const htmlAfter = root.innerHTML;

      expect(htmlBefore).toEqual(htmlAfter);
    });
  };

  testHighlighting({
    title: "should highlight and remove correctly for a single highlight",
    fixturePrefix: "01.highlighting",
    ids: ["test-single-highlight"],
    fixturePostfix: "singleHighlight",
    expectedText: ["Lorem ipsum dolor sit amet"]
  });
});