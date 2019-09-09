import { span, highlight, b } from "../../../utils/dom-elements";

const fixtures = {
  "03.focus.overlappingFocusFirst": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem "),
        highlight(
          {
            color: "red",
            id: "test-overlapping-highlights-1",
            startOffset: 12,
            length: 16,
          },
          "ipsum",
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-2",
            startOffset: 17,
            length: 15,
          },
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 16,
            },
            " dolor ",
          ),
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-2",
              startOffset: 17,
              length: 15,
            },
            highlight(
              {
                color: "red",
                id: "test-overlapping-highlights-1",
                startOffset: 12,
                length: 16,
              },
              "sit ",
            ),
          ),
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-2",
              startOffset: 17,
              length: 15,
            },
            "amet",
          ),
        ),
        b("elit"),
      ),
    );
  },
};

export default fixtures;
