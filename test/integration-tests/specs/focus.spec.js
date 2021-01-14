import fixtures from "../fixtures/focus";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

describe("focusing on different highlights", () => {
  let root /* , highlighter */;

  beforeAll(() => {
    root = document.getElementById("root");
  });

  /* beforeEach(() => {
    highlighter = new TextHighlighter(root, { version: "independencia" });
  });
 */
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
   * @property {boolean} shouldFocus
   * @property {Highlight | undefined} focusRetainer
   *
   * @param params
   * @param {string} params.title - test title
   * @param {Highlight[]} params.highlights - The unique identifier for collections of highlight elements representing the same highlight that we are to focus on.
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.namespaceDataAttribute - The namespace for the highlighter instance under test.
   * @param {string} params.fixturePostfixBeforeFocus - fixture name postfix used as the before focus comparison
   * @param {Record<string, number>} params.priorities - The priorities of multiple highlighters.
   */
  const testFocus = (params) => {
    it(`${params.fixturePrefix}:before(${params.fixturePostfixBeforeFocus}): ${params.title}`, () => {
      const options = {
        version: "independencia",
        priorities: params.priorities || {},
      };
      if (params.namespaceDataAttribute) {
        options.namespaceDataAttribute = params.namespaceDataAttribute;
      }
      const highlighter = new TextHighlighter(root, options);
      const fixture = fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeFocus}`];
      setContents(root, fixture());

      focusAndAssert(highlighter, params.highlights[0], params.namespaceDataAttribute);

      // The second id is of the highlight that was originally focused.
      if (params.highlights.length > 1) {
        focusAndAssert(highlighter, params.highlights[1], params.namespaceDataAttribute);
      }
    });
  };

  function focusAndAssert(highlighter, highlight, namespaceDataAttribute) {
    const { id, offset, length, shouldFocus, focusRetainer, descriptors } = highlight;
    highlighter.focusUsingId(id, descriptors);

    const descriptor = { id, offset, length, dataAttr: namespaceDataAttribute };

    if (shouldFocus) {
      expect(descriptor).toHaveFocus(root);
    } else {
      expect(descriptor).not.toHaveFocus(root);
      if (focusRetainer) {
        expect(focusRetainer).toHaveFocus();
      }
    }
  }

  testFocus({
    title:
      "should focus on a single highlight that does not overlap and therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    highlights: [{ id: "test-single-highlight", offset: 6, length: 26, shouldFocus: true }],
    fixturePostfixBeforeFocus: "singleHighlight",
  });

  testFocus({
    title:
      "should focus on multiple highlights that do not overlap so therefore have no difference from the original fixture",
    fixturePrefix: "01.focus",
    highlights: [
      { id: "test-multiple-highlights-1", offset: 6, length: 26, shouldFocus: true },
      { id: "test-multiple-highlights-2", offset: 60, length: 1, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "multipleHighlights",
  });

  testFocus({
    title:
      "should focus on a highlight that overlaps an image, therefore there should be no difference from the original fixture",
    fixturePrefix: "02.focus",
    highlights: [{ id: "test-overlapping-highlights", offset: 6, length: 26, shouldFocus: true }],
    fixturePostfixBeforeFocus: "overlapping",
  });

  testFocus({
    title: "should focus on a nested highlight and focus on it's surrounding parent highlight",
    fixturePrefix: "02.focus",
    highlights: [
      { id: "test-overlapping-highlights", offset: 6, length: 26, shouldFocus: true },
      { id: "test-overlapping-highlights-nested-1", offset: 12, length: 12, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "nestedFocus",
  });

  testFocus({
    title: "should focus on 2 different overlapping highlights",
    fixturePrefix: "03.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 17, length: 15, shouldFocus: true },
      { id: "test-overlapping-highlights-1", offset: 12, length: 16, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "overlappingFocusFirst",
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 2",
    fixturePrefix: "04.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 14, length: 5, shouldFocus: true },
      { id: "test-overlapping-highlights-1", offset: 12, length: 15, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst",
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 1 and 3",
    fixturePrefix: "05.focus",
    highlights: [
      { id: "test-overlapping-highlights-3", offset: 17, length: 15, shouldFocus: true },
      { id: "test-overlapping-highlights-1", offset: 12, length: 15, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusFirst",
  });

  testFocus({
    title:
      "should focus on 2 different overlapping highlights which are overlapping with another, focus on highlight 3 and 2",
    fixturePrefix: "06.focus",
    highlights: [
      { id: "test-overlapping-highlights-2", offset: 13, length: 5, shouldFocus: true },
      { id: "test-overlapping-highlights-3", offset: 16, length: 15, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusThird",
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
          'data-highlighted=\\"true\\" data-start-offset=\\"13\\" data-length=\\"5\\"></span>","sum d",13,5]]',
        shouldFocus: true,
      },
      { id: "test-overlapping-highlights-3", offset: 16, length: 15, shouldFocus: true },
    ],
    fixturePostfixBeforeFocus: "overlappingMultipleFocusThird",
  });

  testFocus({
    title:
      "should not focus a highlight when the provided namespace doesn't have the highest priority",
    fixturePrefix: "08.focus",
    highlights: [
      {
        id: "basic-highlights",
        offset: 11,
        length: 5,
        shouldFocus: false,
        focusRetainer: {
          id: "user-highlights",
          offset: 6,
          length: 5,
          dataAttr: "data-user-highlights",
        },
      },
    ],
    fixturePostfixBeforeFocus: "priorityHighlighters",
    namespaceDataAttribute: "data-basic-highlights",
    priorities: {
      "data-basic-highlights": 1,
      "data-user-highlights": 2,
    },
  });
});
