import { span, highlight, b } from "../../../utils/dom-elements";

const fixtures = {
  "06.focus.overlappingMultipleFocusThird": () => {
    // Add the case where three highlights overlap here!
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem "),
        // highlighted text: "ipsum dolor sit"
        highlight(
          {
            color: "red",
            id: "test-overlapping-highlights-1",
            startOffset: 11,
            length: 16
          },
          "ip",
          // highlighted text: "sum d"
          highlight(
            {
              color: "green",
              id: "test-overlapping-highlights-2",
              startOffset: 13,
              length: 5
            },
            "sum d"
          ),
          // highlighted text: " dolor sit amet"
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 16,
              length: 15
            },
            "olor "
          )
        ),
        b(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 11,
              length: 16
            },
            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-3",
                startOffset: 16,
                length: 15
              },
              "sit"
            )
          )
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 16,
              length: 15
            },
            " amet"
          )
        ),
        b("elit")
      )
    );
  }
};

export default fixtures;
