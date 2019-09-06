import { span, highlight, spanWithAttrs, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "02.highlighting.base": () => {
    return span(
      "AAA",
      spanWithAttrs({id: 'highlight-1-end-node'})(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})("Lorem ipsum dolor "),
        b("sit "),
        img(),
        i("am"),
        "et",
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "02.highlighting.highlight1": () => {
    return span(
      "AAA",
      spanWithAttrs({id: 'highlight-1-end-node'})(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor "
          )
        ),
        b(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "sit "
          )
        ),
        img(),
        i(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "am"
          )
        ),
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "et"
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "02.highlighting.highlight2": () => {
    return span(
      "AAA",
      spanWithAttrs({id: 'highlight-1-end-node'})(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
            "Lorem ",
            highlight(
                { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
                "ipsum dolor "
            )),
        b("sit "),
        img(),
        i("am"),
        "et",
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    )
  },
  "02.highlighting.highlight1ThenHighlight2": () => {
    return span(
      "AAA",
      spanWithAttrs({id: 'highlight-1-end-node'})(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "Lorem ",
            highlight(
              { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
              "ipsum dolor "
            )
          )
        ),
        b(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "sit "
          )
        ),
        img(),
        i(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "am"
          )
        ),
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "et"
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    )
  },
  "02.highlighting.highlight2ThenHighlight1": () => {
    return span(
      "AAA",
      spanWithAttrs({id: 'highlight-1-end-node'})(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "Lorem "
          ),
          highlight(
            { color: "blue", id: "2", length: 12, startOffset: 12, time: "test" },
            highlight(
              { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
              "ipsum dolor "
            )
          )
        ),
        b(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "sit "
          )
        ),
        img(),
        i(
          highlight(
            { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
            "am"
          )
        ),
        highlight(
          { color: "red", id: "1", length: 26, startOffset: 6, time: "test" },
          "et"
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    )
  }
};

export default fixtures;
