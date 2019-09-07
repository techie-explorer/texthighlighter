import fixtures from "../fixtures/deselect";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

/**
 * @module
 * deselection tests.
 *
 * @typedef Highlight
 * @type {object}
 * @property {string} id
 * @property {number} offset
 * @property {number} length
 */

describe("deselecting parent highlights", () => {
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
   * Converts test highlight objects to serialised descriptors.
   *
   * @param {Highlight[]} highlights
   */
  function toDescriptors(highlights) {
    return highlights.map(highlight => {
      return {
        id: highlight.id,
        // Highlight text field is not relevant for deselection tests so we can
        // leave it empty.
        serialisedDescriptor: JSON.stringify([
          [
            `<span class="highlighted ${highlight.id}" data-highlighted="true" data-timestamp="undefined" ` +
              `data-start-offset="${highlight.offset}" data-length="${highlight.length}"></span>`,
            "",
            highlight.offset,
            highlight.length
          ]
        ])
      };
    });
  }

  /**
   * Tests deselecting a larger highlight and focuses nested highlights
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfixBeforeDeselect
   * [2] Deselect the highlight specified by params.deselectId.
   * [4] Ensure nested highlights specified by params.nestedHighlights
   *     have the focus (Innermost nested highlights for multiple levels of nesting).
   *
   * @param params
   * @param {string} params.title - test title
   * @param {Highlight[]} params.nestedHighlights - descriptor for collections of highlight elements representing
   *                                                the nested highlights that should have been focused.
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfixBeforeFocus - fixture name postfix used as the before focus comparison
   */
  const testDeselect = params => {
    it(`${params.fixturePrefix}:before(${params.fixturePostfixBeforeFocus}): ${params.title}`, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfixBeforeFocus}`];
      setContents(root, fixture());

      const descriptors = toDescriptors(params.nestedHighlights);
      highlighter.deselectUsingId(params.deselectId, descriptors);

      params.nestedHighlights.forEach(({ id, offset, length }) => {
        expect({ id, offset, length }).toHaveFocus(root);
      });
    });
  };

  testDeselect({
    title:
      "should focus on a single nested highlight on deselection of the parent highlight",
    fixturePrefix: "01.deselect",
    deselectId: "test-parent-highlight",
    nestedHighlights: [{ id: "test-nested-highlight", offset: 6, length: 26 }],
    fixturePostfixBeforeFocus: "singleNestedHighlight"
  });

  testDeselect({
    title:
      "should focus on three nested highlights on deselection of the parent highlight",
    fixturePrefix: "02.deselect",
    deselectId: "test-parent-highlight",
    nestedHighlights: [
      { id: "test-nested-highlight-1", offset: 3, length: 3 },
      { id: "test-nested-highlight-2", offset: 6, length: 26 },
      { id: "test-nested-highlight-3", offset: 32, length: 6 }
    ],
    fixturePostfixBeforeFocus: "multipleNestedHighlights"
  });

  testDeselect({
    title:
      "should focus on three nested highlights nested inside inner parent highlights on deselection of the outer parent highlight",
    fixturePrefix: "03.deselect",
    deselectId: "test-outer-parent-highlight",
    nestedHighlights: [
      { id: "test-nested-highlight-1", offset: 3, length: 3 },
      { id: "test-nested-highlight-2", offset: 6, length: 26 },
      { id: "test-nested-highlight-3", offset: 32, length: 6 },
      { id: "test-nested-highlight-4", offset: 38, length: 11 }
    ],
    fixturePostfixBeforeFocus: "multiLevelNestedHighlights"
  });
});
