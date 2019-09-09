import fixtures from "../fixtures/focus";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

describe("focusing on different highlights", () => {
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
   * Tests focusing on overlapping highlights
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfixBeforeFocus (fixture with highlight id 2 in focus) and set that to the root element.
   * [3] Focus on highlight using params.ids[0].
   * [4] Ensure the innermost highlight wrapper for the text nodes in the highlight range are for params.id[0] [2].
   * [5] Focus on a second ID using params.ids[1] if it exists (this is the highlight that was originally focused in the params.fixturePostfixBeforeFocus)
   * [6] Ensure the innermost highlight wrapper for the text nodes in the highlight range are for params.id[1] [1].
   *
   * @typedef Highlight
   * @type {object}
   * @property {string} id
   * @property {number} offset
   * @property {number} length
   *
   * @param params
   * @param {string} params.title - test title
   * @param {Highlight[]} params.highlights - The unique identifier for collections of highlight elements representing the same highlight that we are to focus on.
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfixBeforeFocus - fixture name postfix used as the before focus comparison
   */
  const testFocus = params => {
    it(`${params.fixturePrefix}:before(${params.fixturePostfixBeforeFocus}): ${params.title}`, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeFocus}`];
      setContents(root, fixture());

      const { id, offset, length, descriptors } = params.highlights[0];
      highlighter.focusUsingId(id, descriptors);

      expect({ id, offset, length }).toHaveFocus(root);

      // The second id is of the highlight that was originally focused.
      if (params.highlights.length > 1) {
        const {
          id: id2,
          offset: offset2,
          length: length2
        } = params.highlights[1];
        highlighter.focusUsingId(id2);

        expect({ id: id2, offset: offset2, length: length2 }).toHaveFocus(root);
      }
    });
  };

  testFocus({
    title:
      "should focus on a single highlight that does not overlap and therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    highlights: [{ id: "test-single-highlight", offset: 6, length: 26 }],
    fixturePostfixBeforeFocus: "singleHighlight"
  });

  testFocus({
    title:
      "should focus on multiple highlights that do not overlap so therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    highlights: [
      { id: "test-multiple-highlights-1", offset: 6, length: 26 },
      { id: "test-multiple-highlights-2", offset: 60, length: 1 }
    ],
    fixturePostfixBeforeFocus: "multipleHighlights"
  });

  testFocus({
    title:
      "should focus on a highlight that overlaps an image, therefore there should be no difference from the original fixture",
    fixturePrefix: "02.focus",
    highlights: [{ id: "test-overlapping-highlights", offset: 6, length: 26 }],
    fixturePostfixBeforeFocus: "overlapping"
  });

  testFocus({
    title:
      "should focus on a nested highlight and focus on it's surrounding parent highlight",
    fixturePrefix: "02.focus",
    highlights: [
      { id: "test-overlapping-highlights", offset: 6, length: 26 },
      { id: "test-overlapping-highlights-nested-1", offset: 12, length: 12 }
    ],
    fixturePostfixBeforeFocus: "nestedFocus"
  });

  testFocus({
    title: "should focus on 2 different overlapping highlights",
    fixturePrefix: "03.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 17, length: 15 },
      { id: "test-overlapping-highlights-1", offset: 12, length: 16 }
    ],
    fixturePostfixBeforeFocus: "overlappingFocusFirst"
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 2",
    fixturePrefix: "04.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 14, length: 5 },
      { id: "test-overlapping-highlights-1", offset: 12, length: 15 }
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst"
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 3",
    fixturePrefix: "05.focus",
    highlights: [
      { id: "test-overlapping-highlights-3", offset: 17, length: 15 },
      { id: "test-overlapping-highlights-1", offset: 12, length: 15 }
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst"
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 3 and 2",
    fixturePrefix: "06.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 13, length: 5 },
      { id: "test-overlapping-highlights-3", offset: 16, length: 15 }
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusThird"
  });

  testFocus({
    title:
      "should focus an overlapping highlight that has no representation in the DOM and then focus on the previously focused highlight",
    fixturePrefix: "07.focus",
    highlights: [
      {
        id: "test-overlapping-highlights-2",
        offset: 13,
        length: 5,
        descriptors:
          '[["<span class=\\"highlighted test-overlapping-highlights-2\\" style=\\"background-color:red;\\" ' +
          'data-highlighted=\\"true\\" data-start-offset=\\"13\\" data-length=\\"5\\"></span>","sum d",13,5]]'
      },
      { id: "test-overlapping-highlights-3", offset: 16, length: 15 }
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusThird"
  });
});
