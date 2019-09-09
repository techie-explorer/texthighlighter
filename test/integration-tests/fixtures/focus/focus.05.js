import { span, highlight, b } from "../../../utils/dom-elements";

const fixtures = {
  "05.focus.overlappingMultipleFocusFirst": () => {
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
            startOffset: 12,
            length: 15
          },
          "ip"
        ),
        highlight(
          {
            color: "green",
            id: "test-overlapping-highlights-2",
            startOffset: 14,
            length: 5
          },
          // highlighted text: "sum d"
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 15
            },
            "sum d"
          ),
          // highlighted text: " dolor sit amet"
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 17,
              length: 15
            },
            highlight(
              {
                color: "red",
                id: "test-overlapping-highlights-1",
                startOffset: 12,
                length: 15
              },
              "olor "
            )
          )
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 17,
              length: 15
            },
            highlight(
              {
                color: "red",
                id: "test-overlapping-highlights-1",
                startOffset: 12,
                length: 15
              },
              "sit "
            )
          )
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 17,
              length: 15
            },
            "amet"
          )
        ),
        b("elit")
      )
    );
  }
};

export default fixtures;
