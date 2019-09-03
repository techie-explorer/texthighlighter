import fixtures from "../fixtures/serialisation";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../utils/dom-helpers";

describe("serialisation and deserialisation of highlights", () => {
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
   * Tests serialisation and deserialisation.
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture with highlights).
   * [2] Serialise highlights.
   * [3] Compare JSON form of serialized highlights with params.expectedText
   * [4] Load fixture named: params.fixturePrefix + '.base' (fixture with highlights removed).
   * [5] Deserialise previously obtained JSON form of serialized highlights.
   * [6] Compare HTML of deserialised highlights with fixture from step [1].
   * @param params
   * @param {string} params.title - test title
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix
   * @param {string} params.expectedText - expected text content of serialized highlights
   */
  const testSerialisation = params => {
    it(params.title, () => {
      const fixture =
        fixtures[`${params.fixturePrefix}.${params.fixturePostfix}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.base`];
      setContents(root, fixture());
      const htmlBefore = root.innerHTML;
      console.log(htmlBefore);

      const serialised = highlighter.serializeHighlights(params.id);

      const text = JSON.parse(serialised).map(descriptor => descriptor[1]);
      expect(text).toEqual(params.expectedText);

      setContents(root, fixtureBase());
      highlighter.deserializeHighlights(serialised);
      const htmlAfter = root.innerHTML;

      expect(htmlBefore).toEqual(htmlAfter);
    });
  };

  testSerialisation({
    title: "should serialise and deserialise correctly for a single highlight",
    fixturePrefix: "01.serialization",
    id: "single-highlight",
    fixturePostfix: "singleHighlight",
    expectedText: ["Lorem ipsum dolor sit amet"]
  });
});
