import { span, text, spanWithAttrs, highlight, imgWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "05.highlighting.singleHighlight": () => {
    return span(
      "\n   AAA \n",
      imgWithAttrs({ id: "image1" })(),
      span(
        "\n  CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          highlight(
            { color: "red", id: "", length: 62, startOffset: 7, time: "test" },
            "\n    Lorem ipsum \n      \n  dolor \n   sit amet", // 26
          ),
        ),
        highlight(
          { color: "red", id: "", length: 62, startOffset: 7, time: "test" },
          text("Some text here"), //40
        ),
        highlight(
          { color: "red", id: "", length: 62, startOffset: 7, time: "test" },
          text("\n     \n\n     "),
        ),
        span(
          highlight(
            { color: "red", id: "", length: 62, startOffset: 7, time: "test" },
            "Some more \n   text here", //59
          ),
        ),
        highlight(
          { color: "red", id: "", length: 62, startOffset: 7, time: "test" },
          text("\n\n\n    \n   "),
        ),
        spanWithAttrs({ id: "highlight-1-end-node" })(
          highlight({ color: "red", id: "", length: 62, startOffset: 7, time: "test" }, "con"), //62
          "sectetur adipiscit",
        ),
        span("elit."),
      ),
      span("\n  DDD"),
      "BBB  \n",
    );
  },

  "05.highlighting.baseExcludeWhiteSpaceAndReturns": () => {
    return span(
      "\n   AAA \n",
      imgWithAttrs({ id: "image1" })(),
      span(
        "\n  CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })(
          "\n    Lorem ipsum \n      \n  dolor \n   sit amet",
        ),
        text("Some text here"),
        text("\n     \n\n     "),
        span("Some more \n   text here"),
        text("\n\n\n    \n   "),
        spanWithAttrs({ id: "highlight-1-end-node" })("consectetur adipiscit"),
        span("elit."),
      ),
      span("\n  DDD"),
      "BBB  \n",
    );
  },
};

export default fixtures;
