import toDiffableHtml from "diffable-html";

import fixtures from "../fixtures/serialisation";
import TextHighlighter from "../../../src/text-highlighter";
import { setContents } from "../../utils/dom-helpers";

describe("serialisation and deserialisation of highlights", () => {
  let root, highlighter;
  beforeAll(() => {
    root = document.getElementById("root");
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
   * [5] Deserialise previously obtained JSON form of serialised highlights.
   * [6] Compare HTML of deserialised highlights with fixture from step [1].
   * @param params
   * @param {string} params.title - test title
   * @param {string[]} params.ids - The unique identifier for collections of highlight elements representing the same highlight.
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix
   * @param {string} params.expectedText - expected text content of serialized highlights
   * @param {string} params.excludeWhiteSpaceAndReturns - Don't count carriage returns and
   *                                                      following white spaces in the offset
   *                                                      and length of a highlight.
   */
  const testSerialisation = (params) => {
    it(params.title, () => {
      highlighter = new TextHighlighter(root, { 
        version: "independencia", 
        excludeWhiteSpaceAndReturns: params.excludeWhiteSpaceAndReturns 
      });

      const fixture = fixtures[`${params.fixturePrefix}.${params.fixturePostfix}`];
      const fixtureBase = fixtures[`${params.fixturePrefix}.base`];
      setContents(root, fixture());
      const htmlBefore = root.innerHTML;

      const serialisedArray = params.ids.reduce((alreadySerialised, currentId) => {
        const currentSerialised = highlighter.serializeHighlights(currentId);
        return [...alreadySerialised, currentSerialised];
      }, []);

      const { text, descriptors } = serialisedArray.reduce(
        (accumulated, serialisedString) => {
          const descriptors = JSON.parse(serialisedString);
          const descriptorsText = descriptors.map((descriptor) => descriptor[1]);

          return {
            text: [...accumulated.text, ...descriptorsText],
            descriptors: [...accumulated.descriptors, ...descriptors],
          };
        },
        { text: [], descriptors: [] },
      );

      setContents(root, fixtureBase());
      highlighter.deserializeHighlights(JSON.stringify(descriptors));
      const htmlAfter = root.innerHTML;

      expect(toDiffableHtml(htmlAfter)).toEqual(toDiffableHtml(htmlBefore));
      expect(text).toEqual(params.expectedText);
    });
  };

  testSerialisation({
    title: "should serialise and deserialise correctly for a single highlight",
    fixturePrefix: "01.serialisation",
    ids: ["test-single-highlight"],
    fixturePostfix: "singleHighlight",
    expectedText: ["Lorem ipsum dolor sit amet"],
  });

  testSerialisation({
    title: "should serialise and deserialise correctly for multiple highlights",
    fixturePrefix: "01.serialisation",
    ids: ["test-multiple-highlights-1", "test-multiple-highlights-2"],
    fixturePostfix: "multipleHighlights",
    expectedText: ["Lorem ipsum dolor sit amet", "D"],
  });

  testSerialisation({
    title:
      "should serialise and deserialise correctly for a highlight that overlaps nodes in the DOM tree",
    fixturePrefix: "02.serialisation",
    ids: ["test-overlapping-highlights"],
    fixturePostfix: "overlapping",
    expectedText: ["Lorem ipsum dolor sit amet"],
  });

  testSerialisation({
    title:
      "should serialise and deserialise correctly for a highlight that overlaps nodes in the DOM tree" +
      " and a highlight is nested in another",
    fixturePrefix: "02.serialisation",
    ids: ["test-overlapping-highlights", "test-overlapping-highlights-nested-1"],
    fixturePostfix: "nested",
    expectedText: ["Lorem ipsum dolor sit amet", "ipsum dolor "],
  });

  testSerialisation({
    title: "should serialise and deserialise correctly for two highlights that overlap eachother",
    fixturePrefix: "03.serialisation",
    ids: ["test-overlapping-highlights-1", "test-overlapping-highlights-2"],
    fixturePostfix: "overlapping",
    expectedText: ["ipsum dolor sit ", " dolor sit amet"],
  });

  testSerialisation({
    title: "should serialise and deserialise correctly for three highlights that overlap eachother",
    fixturePrefix: "03.serialisation",
    ids: [
      "test-overlapping-highlights-1",
      "test-overlapping-highlights-2",
      "test-overlapping-highlights-3",
    ],
    fixturePostfix: "overlappingMultiple",
    expectedText: ["ipsum dolor sit ", "sum d", " dolor sit amet"],
  });

  testSerialisation({
    title:
      "should serialise and deserialise correctly for multiple highlights " +
      "disregarding content in style and script tags",
    fixturePrefix: "04.serialisation",
    ids: ["test-multiple-1", "test-multiple-2"],
    fixturePostfix: "multiple",
    expectedText: ["AZZZZZCCCLorem ipsum", "DD"],
  });

  testSerialisation({
    title:
      "should serialise and deserialise correctly for excludeWhiteSpaceAndReturns mode " +
      "disregarding content in style and script tags",
    fixturePrefix: "05.serialisation",
    ids: ["test-node-1", "test-node-2"],
    fixturePostfix: "excludeWhiteSpaceAndReturns",
    expectedText: ["AZZZZZCCCLorem ipsum", "DD"],
    excludeWhiteSpaceAndReturns: true,
  });
});
