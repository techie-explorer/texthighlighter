/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox */

describe("Custom serialization", function() {
  "use strict";

  var hl;

  fixtures.loadFiles([
    "serializationCustom.01",
    "serializationCustom.02",
    "serializationCustom.03",
    "serializationCustom.04",
    "serializationCustom.05",
    "serializationCustom.06"
  ]);

  beforeEach(function() {
    hl = sandbox.init();
  });

  afterEach(function() {
    sandbox.empty();
  });

  /**
   * Tests custom serialization and deserialization.
   * Procedure:
   * [1] Load fixture named: params.fixturePrefix + '.' + params.fixturePostfix (fixture with highlights).
   * [2] Serialize highlights.
   * [3] Compare JSON form of serialized highlights with params.expectedText
   * [4] Load fixture named: params.fixturePrefix + '.base' (fixture with highlights removed).
   * [5] Deserialize previously obtained JSON form of serialized highlights.
   * [6] Compare HTML of deserialized highlights with fixture from step [1].
   * @param params
   * @param {string} params.title - test title
   * @param {string} params.fixturePrefix - fixture name prefix
   * @param {string} params.fixturePostfix - fixture name postfix
   * @param {string} params.expectedText - expected text content of serialized highlights
   */
  function testSerializationCustom(params) {
    it(params.title, function() {
      var htmlBefore, htmlAfter, serialized, text;

      sandbox.setFixture(params.fixturePrefix + "." + params.fixturePostfix);
      htmlBefore = sandbox.html();
      serialized = hl.serializeHighlightsCustom(params.id);

      text = JSON.parse(serialized).map(function(hlDesc) {
        return hlDesc[1];
      });
      expect(text).toEqual(params.expectedText);

      sandbox.setFixture(params.fixturePrefix + ".base");
      hl.deserializeHighlights(serialized);
      htmlAfter = sandbox.html();

      expect(htmlBefore).toEqual(htmlAfter);
    });
  }

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #01",
    fixturePrefix: "01.s11n",
    fixturePostfix: "h1",
    expectedText: ["Lorem ipsum dolor sit amet", "elit."]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #02",
    fixturePrefix: "01.s11n",
    fixturePostfix: "h2",
    expectedText: [
      "A",
      "CC",
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscit",
      "elit."
    ]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #03",
    fixturePrefix: "02.s11n",
    fixturePostfix: "h1",
    expectedText: [
      "Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet."
    ]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #04",
    fixturePrefix: "03.s11n",
    fixturePostfix: "h1",
    expectedText: [
      "Lorem ipsum ",
      "dolor sit amet ",
      "consectetur adipiscing elit."
    ]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #05",
    fixturePrefix: "04.s11n",
    fixturePostfix: "h1",
    expectedText: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      "elit."
    ]
  });
  testSerializationCustom({
    id: "highlight-test",
    title: "use case #06",
    fixturePrefix: "04.s11n",
    fixturePostfix: "h2",
    expectedText: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      "Lorem"
    ]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #07",
    fixturePrefix: "05.s11n",
    fixturePostfix: "h1",
    expectedText: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      "sit amet"
    ]
  });

  testSerializationCustom({
    id: "highlight-test",
    title: "use case #08",
    fixturePrefix: "06.s11n",
    fixturePostfix: "h1",
    expectedText: [
      "elit.",
      "consectetur ",
      "adipiscit ",
      "sit amet ",
      "ipsum dolor "
    ]
  });
  testSerializationCustom({
    id: "highlight-test",
    title: "use case #09",
    fixturePrefix: "06.s11n",
    fixturePostfix: "h2",
    expectedText: [
      "consectetur ",
      "adipiscit ",
      "sec",
      "ipsum dolor ",
      "ipsum dolor ",
      "dolor "
    ]
  });
});
