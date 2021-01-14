import { span, style, script, highlight, b, i, div, img } from "../../../utils/dom-elements";

import { b64EncodedFontStyles, regularStyles, script as scriptText } from "../text";

// Test fixtures with content including style and script elements.
const fixtures = {
  "06.serialisation.base": () => {
    return div(
      "AAA",
      style(regularStyles()),
      style(b64EncodedFontStyles()),
      b("ZZZZZ"),
      script(scriptText()),
      span(
        // Existing highlight that belongs to the higher priority
        // "data-highlighter-2" highlighter.
        highlight(
          {
            color: "red",
            id: "high-priority-highlight",
            startOffset: 8,
            length: 8,
            dataAttr: "data-highlighter-2",
          },
          "\n    CCC",
        ),
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
  "06.serialisation.priorityHighlighter": () => {
    return div(
      "AA",
      highlight(
        {
          color: "red",
          id: "test-node-1",
          startOffset: 2,
          length: 33,
          dataAttr: "data-highlighter-1",
        },
        "A",
      ),
      style(regularStyles()),
      style(b64EncodedFontStyles()),
      b(
        highlight(
          {
            color: "red",
            id: "test-node-1",
            startOffset: 2,
            length: 33,
            dataAttr: "data-highlighter-1",
          },
          "ZZZZZ",
        ),
      ),
      script(scriptText()),
      span(
        // The outer wrapper needs to remain for the case there is text outside
        // of the low priority highlight that needs to remain highlighted.
        highlight(
          {
            color: "red",
            id: "high-priority-highlight",
            startOffset: 8,
            length: 8,
            dataAttr: "data-highlighter-2",
          },
          highlight(
            {
              color: "red",
              id: "test-node-1",
              startOffset: 2,
              length: 33,
              dataAttr: "data-highlighter-1",
            },
            // Ensuring existing higher priority highlight remains inside.
            highlight(
              {
                color: "red",
                id: "high-priority-highlight",
                startOffset: 8,
                length: 8,
                dataAttr: "data-highlighter-2",
              },
              "\n    CCC",
            ),
          ),
        ),
        span(
          highlight(
            {
              color: "red",
              id: "test-node-1",
              startOffset: 2,
              length: 33,
              dataAttr: "data-highlighter-1",
            },
            "\n    Lorem \n  ipsum",
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
      span(
        highlight(
          {
            color: "blue",
            id: "test-node-2",
            startOffset: 94,
            length: 2,
            dataAttr: "data-highlighter-1",
          },
          "DD",
        ),
        "D",
      ),
      "BBB",
    );
  },
};

export default fixtures;
