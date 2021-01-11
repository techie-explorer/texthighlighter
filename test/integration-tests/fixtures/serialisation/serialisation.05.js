import { span, style, script, highlight, b, i, div, img } from "../../../utils/dom-elements";

import { b64EncodedFontStyles, regularStyles, script as scriptText } from "../text";

// Test fixtures with content including style and script elements.
const fixtures = {
  "05.serialisation.base": () => {
    return div(
      "AAA",
      style(regularStyles()),
      style(b64EncodedFontStyles()),
      b("ZZZZZ"),
      script(scriptText()),
      span(
        "\n    CCC",
        span("\n    Lorem \n  ipsum dolor "), //26
        b("sit amet elit"),
        img(),
        b("am ", i("leonulla")),
        "et",
        span("consectetur ", b("adipiscit")),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
  "05.serialisation.excludeWhiteSpaceAndReturns": () => {
    return div(
      "AA",
      highlight(
        {
          color: "red",
          id: "test-node-1",
          startOffset: 2,
          length: 20,
        },
        "A",
      ),
      style(regularStyles()),
      style(b64EncodedFontStyles()),
      b(highlight({ color: "red", id: "test-node-1", startOffset: 2, length: 20 }, "ZZZZZ")),
      script(scriptText()),
      span(
        highlight({ color: "red", id: "test-node-1", startOffset: 2, length: 20 }, "\n    CCC"),
        span(
          highlight(
            { color: "red", id: "test-node-1", startOffset: 2, length: 20 },
            "\n    Lorem \n  ipsum", //19
          ),
          " dolor ",
        ),
        b("sit amet elit"),
        img(),
        b("am ", i("leonulla")),
        "et",
        span("consectetur ", b("adipiscit")),
        span("elit."),
      ),
      span(highlight({ color: "blue", id: "test-node-2", startOffset: 81, length: 2 }, "DD"), "D"),
      "BBB",
    );
  },
};

export default fixtures;
