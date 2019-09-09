import { span, highlight, spanWithAttrs, bWithAttrs, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "03.highlighting.base": () => {
    return span(
      "AAA",
      spanWithAttrs({ id: "highlight-2-end-node" })(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })("Lorem ipsum dolor "),
        bWithAttrs({ id: "highlight-1-end-node" })("sit amet elit"),
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
  "03.highlighting.highlight1ThenHighlight2": () => {
    return span(
      "AAA",
      spanWithAttrs({ id: "highlight-2-end-node" })(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          "Lorem ",
          highlight(
            { color: "red", id: "1", length: 16, startOffset: 12, time: "test" },
            "ipsum",
            highlight(
              { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
              " dolor ",
            ),
          ),
        ),
        bWithAttrs({ id: "highlight-1-end-node" })(
          highlight(
            { color: "red", id: "1", length: 16, startOffset: 12, time: "test" },
            highlight(
              { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
              "sit ",
            ),
          ),
          highlight({ color: "blue", id: "2", length: 15, startOffset: 17, time: "test" }, "amet"),
          " elit",
        ),
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
  "03.highlighting.highlight1ThenHighlight2ThenHighlight3": () => {
    // Add the case where three highlights overlap here!
    return span(
      "AAA",
      spanWithAttrs({ id: "highlight-2-end-node" })(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          "Lorem ",
          // red highlighted text: "ipsum dolor sit "
          highlight(
            { color: "red", id: "1", length: 16, startOffset: 12, time: "test" },
            "ip",
            // green highlighted text: "sum d"
            highlight({ color: "green", id: "3", length: 5, startOffset: 14, time: "test" }, "sum"),
            highlight(
              { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
              // blue highlighted text: " dolor sit amet"
              highlight(
                { color: "green", id: "3", length: 5, startOffset: 14, time: "test" },
                " d",
              ),
              "olor ",
            ),
          ),
        ),

        bWithAttrs({ id: "highlight-1-end-node" })(
          highlight(
            { color: "red", id: "1", length: 16, startOffset: 12, time: "test" },
            highlight(
              { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
              "sit ",
            ),
          ),
          highlight({ color: "blue", id: "2", length: 15, startOffset: 17, time: "test" }, "amet"),
          " elit",
        ),
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
  "03.highlighting.highlight2ThenHighlight3": () => {
    // Add the case where three highlights overlap here!
    return span(
      "AAA",
      spanWithAttrs({ id: "highlight-2-end-node" })(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          "Lorem ip",
          // green highlighted text: "sum d"
          highlight({ color: "green", id: "3", length: 5, startOffset: 14, time: "test" }, "sum"),
          highlight(
            { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
            // blue highlighted text: " dolor sit amet"
            highlight({ color: "green", id: "3", length: 5, startOffset: 14, time: "test" }, " d"),
            "olor ",
          ),
        ),
        bWithAttrs({ id: "highlight-1-end-node" })(
          highlight(
            { color: "blue", id: "2", length: 15, startOffset: 17, time: "test" },
            "sit amet",
          ),
          " elit",
        ),
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
};

export default fixtures;
