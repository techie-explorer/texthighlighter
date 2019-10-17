import { span, highlight, spanWithAttrs, imgWithAttrs, comment } from "../../../utils/dom-elements";

const fixtures = {
  "04.highlighting.baseWithEventsAndComments": () => {
    return span(
      "AAA",
      comment("section1"),
      imgWithAttrs({ id: "image1" })(),
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })("Lorem ipsum dolor sit amet"),
        comment("section2"),
        spanWithAttrs({ id: "highlight-1-end-node" })("consectetur adipiscit"),
        span("elit."),
      ),
      comment("section3"),
      span("DDD"),
      "BBB",
    );
  },
  "04.highlighting.singleHighlightWithEventsAndComments": () => {
    return span(
      "AAA",
      comment("section1"),
      imgWithAttrs({ id: "image1" })(),
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          highlight(
            { color: "red", id: "", length: 29, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        comment("section1"),
        spanWithAttrs({ id: "highlight-1-end-node" })(
          highlight({ color: "red", id: "", length: 29, startOffset: 6, time: "test" }, "con"),
          "sectetur adipiscit",
        ),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
};

export default fixtures;
