import toDiffableHtml from "diffable-html";

import fixtures from "../fixtures/normalising";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

describe("normalising different elements", () => {
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

  /*
   * Tests normalising of different elements
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.base' (fixture without normalised nodes).
   * [2] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture with normalised nodes).
   * [3] Compare HTML of result with fixture from step [2].
   * @param params
   * @param {string} params.title - test title
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix used after the normalising for comparison
   */
  const testNormalising = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfix}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.base`];
      setContents(root, fixtureBase());

      highlighter.normalizeHighlights();

      const htmlAfter = root.innerHTML;
      expect(toDiffableHtml(htmlAfter)).toEqual(
        toDiffableHtml(fixture().outerHTML)
      );
    });
  };

  testNormalising({
    title:
      "should merge text nodes that are next to each other in the child list",
    fixturePrefix: "01.normalising",
    fixturePostfix: "textNodes"
  });

  testNormalising({
    title:
      "should merge elements that are next to each other in the child list with the same ID",
    fixturePrefix: "02.normalising",
    fixturePostfix: "elementsWithSameId"
  });

  testNormalising({
    title:
      "should not merge elements that are next to each other in the child list with the same ID if there is an image in the way",
    fixturePrefix: "03.normalising",
    fixturePostfix: "elementsWithSameId"
  });

  testNormalising({
    title:
      "should merge highlights that are next to each other in the child list with the same ID",
    fixturePrefix: "04.normalising",
    fixturePostfix: "highlightsWithSameId"
  });

  testNormalising({
    title:
      "should merge highlights that are next to each other in the child list with the same ID, but not highlights that have different IDs",
    fixturePrefix: "05.normalising",
    fixturePostfix: "highlightsWithDifferentIds"
  });
});
