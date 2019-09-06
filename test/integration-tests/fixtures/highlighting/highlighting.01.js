import { span, highlight, spanWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "01.highlighting.base": () => {
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
  "01.highlighting.singleHighlight": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "test-single-highlight" },
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
  "01.highlighting.multipleHighlights": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({id: 'highlight-1-start-node'})(
          highlight(
            { color: "red", id: "test-multiple-highlights" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      spanWithAttrs({id: 'highlight-2-start-node'})(
        "DD",
        highlight({ color: "blue", id: "test-multiple-highlights" }, "D")
      ),
      "BBB"
    );
  }
};

export default fixtures;
