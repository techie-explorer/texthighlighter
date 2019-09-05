import fixtures from "../fixtures/focus";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

describe("highlighting a given range", () => {
  let root, highlighter;

  beforeAll(() => {
    root = document.getElementById("root");
    
  });

  beforeEach(() => {
    highlighter = new TextHighlighter(root, { version: "independencia"});
    
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  /**
   * Tests focusing on overlapping highlights
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.base' (fixture without focus).
   * [2] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture with highlight in focus).
   * [3] Focus on a highlight given an ID.
   * [4] Compare HTML of result with fixture from step [2].
   * @param params
   * @param {string} params.title - test title
   * @param {string[]} params.ids - The unique identifier for collections of highlight elements representing the same highlight that we are to focus on.
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfixBeforeFocus - fixture name postfix used as the before focus comparison
   * @param {string} params.fixturePostfixAfterFocus - fixture name postfix used as the after focus comparison
   */
  const testFocus = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfixAfterFocus}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeFocus}`];
      setContents(root, fixtureBase());
      
      const htmlBefore = root.innerHTML;
      console.log('htmlBefore',htmlBefore)

      highlighter.focusUsingId(params.ids[0]);
      
      const htmlAfter = root.innerHTML;
      console.log('htmlAfter',htmlAfter)
      expect(htmlAfter).toEqual(fixture());

        if(params.ids.length > 1) {
            highlighter.focusUsingId(params.ids[1]);
      
            htmlBefore = root.innerHTML;
            console.log('htmlBefore',htmlBefore)
            expect(htmlBefore).toEqual(fixtureBase());
        }
    });
  };

  testFocus({
    title: "should focus on a single highlight that does not overlap and therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    ids: ["test-single-highlight"],
    fixturePostfixBeforeFocus: "singleHighlight",
    fixturePostfixAfterFocus: "singleHighlight",
  });

  testFocus({
    title: "should focus on multiple highlights that do not overlap so therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    ids: ["test-multiple-highlights-1", "test-multiple-highlights-2"],
    fixturePostfixBeforeFocus: "multipleHighlights",
    fixturePostfixAfterFocus: "multipleHighlights",
  });

  testFocus({
    title: "should focus on multiple highlights that do not overlap so therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    ids: ["test-multiple-highlights-1", "test-multiple-highlights-2"],
    fixturePostfixBeforeFocus: "multipleHighlights",
    fixturePostfixAfterFocus: "multipleHighlights",
  });

    testFocus({
        title: "should focus on a highlights that overlaps an image, therefore there should be no difference from the original fixture",
        fixturePrefix: "02.focus",
        ids: ["test-overlapping-highlights"],
        fixturePostfixBeforeFocus: "overlapping",
        fixturePostfixAfterFocus: "overlapping",
    });

    testFocus({
        title: "should focus on a nested highlights and focus on it's surrounding parent highlight",
        fixturePrefix: "02.focus",
        ids: ["test-overlapping-highlights", "test-overlapping-highlights-nested-1"],
        fixturePostfixBeforeFocus: "nestedFocus",
        fixturePostfixAfterFocus: "nestedParentFocused",
    });

    testFocus({
        title: "should focus on 2 different overlapping highlights",
        fixturePrefix: "03.focus",
        ids: ["test-overlapping-highlights-2", "test-overlapping-highlights-1"],
        fixturePostfixBeforeFocus: "overlappingFocusFirst",
        fixturePostfixAfterFocus: "overlappingFocusSecond",
    });


    testFocus({
        title: "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 2",
        fixturePrefix: "03.focus",
        ids: ["test-overlapping-highlights-2", "test-overlapping-highlights-1"],
        fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst",
        fixturePostfixAfterFocus: "overlappingMultipleFocusSecond",
    });

    testFocus({
        title: "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 3",
        fixturePrefix: "03.focus",
        ids: ["test-overlapping-highlights-3", "test-overlapping-highlights-1"],
        fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst",
        fixturePostfixAfterFocus: "overlappingMultipleFocusThird",
    });

    testFocus({
        title: "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 3 and 2",
        fixturePrefix: "03.focus",
        ids: ["test-overlapping-highlights-2", "test-overlapping-highlights-3"],
        fixturePostfixBeforeFocus: "overlappingMultipleFocusThird",
        fixturePostfixAfterFocus: "overlappingMultipleFocusSecond",
    });

});