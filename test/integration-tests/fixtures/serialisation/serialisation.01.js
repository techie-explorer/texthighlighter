import { span, highlight } from "../../../utils/dom-elements";

const fixtures = {
  "01.serialisation.base": () => {
    return span(
      "AAA",
      span("CCC", span("Lorem ipsum dolor sit amet"), span("consectetur adipiscit"), span("elit.")),
      span("DDD"),
      "BBB",
    );
  },
  "01.serialisation.singleHighlight": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "test-single-highlight",
              startOffset: 6,
              length: 26,
            },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
  "01.serialisation.multipleHighlights": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "test-multiple-highlights-1",
              startOffset: 6,
              length: 26,
            },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      span(
        "DD",
        highlight(
          {
            color: "blue",
            id: "test-multiple-highlights-2",
            startOffset: 60,
            length: 1,
          },
          "D",
        ),
      ),
      "BBB",
    );
  },
};

export default fixtures;
