import { span, highlight, spanWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "01.callbacks.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      spanWithAttrs({id: 'highlight-2-start-node'})("DDD"),
      "BBB"
    );
  },
  "01.callbacks.singleHighlight": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      spanWithAttrs({id: 'highlight-2-start-node'})("DDD"),
      "BBB"
    );
  },
  "01.callbacks.multipleHighlights": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      spanWithAttrs({id: 'highlight-2-start-node'})(
        "DD",
        highlight({ color: "blue", id: "", length: 1, startOffset: 60, time: "test" }, "D")
      ),
      "BBB"
    );
  }
};

export default fixtures;
