import { span, highlight, spanWithAttrs, imgWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "01.highlighting.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit."),
        imgWithAttrs({ id: "image1" })(),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })("DDD"),
      "BBB",
    );
  },
  "01.highlighting.singleHighlight": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          highlight(
            { color: "red", id: "", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
        imgWithAttrs({ id: "image1" })(),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })("DDD"),
      "BBB",
    );
  },
  "01.highlighting.multipleHighlights": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          highlight(
            { color: "red", id: "", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
        imgWithAttrs({ id: "image1" })(),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })(
        "DD",
        highlight({ color: "blue", id: "", length: 1, startOffset: 60, time: "test" }, "D"),
      ),
      "BBB",
    );
  },
};

export default fixtures;
