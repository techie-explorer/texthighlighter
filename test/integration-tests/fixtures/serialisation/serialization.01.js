import { span, highlight } from "../../utils/dom-elements";

const fixtures = {
  "01.serialization.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "01.serialization.singleHighlight": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            { color: "red", id: "test-single-highlight" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "01.serialization.multipleHighlights": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            { color: "red", id: "test-multiple-highlights" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span("consectetur adipiscit")
      ),
      span("DD", highlight({ color: "blue" }, "D")),
      "BBB"
    );
  }
};

export default fixtures;
