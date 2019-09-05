import { span, highlight, b, i, img } from "../../../utils/dom-elements";

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
            startOffset: 11,
            length: 16
          },
          "ipsum"),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-2",
            startOffset: 16,
            length: 15
          },
          highlight(
            {
                color: "red",
                id: "test-overlapping-highlights-1",
                startOffset: 11,
                length: 16
            },
            " dolor "
          )
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-2",
            startOffset: 16,
            length: 15
          },
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 11,
              length: 16
            },
            b("sit ")
          ),
          b("amet")
        ),
        b("elit")
      )
    );
  },
  "03.focus.overlappingFocusSecond": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem "),
        highlight(
          {
            color: "red",
            id: "test-overlapping-highlights-1",
            startOffset: 11,
            length: 16
          },
          "ipsum",
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-2",
              startOffset: 16,
              length: 15
            },
            " dolor "
          )
        ),
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
                id: "test-overlapping-highlights-2",
                startOffset: 16,
                length: 15
            },
            b("sit ")
          )
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-2",
            startOffset: 16,
            length: 15
          },
          b("amet")
        ),
        b("elit")
      )
    );
  },
  "03.focus.overlappingMultipleFocusFirst": () => {
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
        ),
        highlight(
          {
            color: "green",
            id: "test-overlapping-highlights-2",
            startOffset: 13,
            length: 5
          },
          // highlighted text: "sum d"
          highlight(
            {
                color: "red",
                id: "test-overlapping-highlights-1",
                startOffset: 11,
                length: 16
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
             highlight(
                {
                    color: "red",
                    id: "test-overlapping-highlights-1",
                    startOffset: 11,
                    length: 16
                },
                "olor "
            ),
          )
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-3",
            startOffset: 16,
            length: 15
          },
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 11,
              length: 16
            },
            b("sit")
          ),
          b("amet")
        ),
        b("elit")
      )
    );
  },
  "03.focus.overlappingMultipleFocusSecond": () => {
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
            highlight(
                {
                color: "green",
                id: "test-overlapping-highlights-2",
                startOffset: 13,
                length: 5
                },
               "olor "
            ),
          )
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-3",
            startOffset: 16,
            length: 15
          },
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 11,
              length: 16
            },
            b("sit")
          ),
          b("amet")
        ),
        b("elit")
      )
    );
  },
  "03.focus.overlappingMultipleFocusThird": () => {
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
            b("sit")
          )
        ),
        highlight(
          {
            color: "blue",
            id: "test-overlapping-highlights-3",
            startOffset: 16,
            length: 15
          },
          b("amet")
        ),
        b("elit")
      )
    );
  }
};

export default fixtures;
