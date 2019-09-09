import { span, highlight, b } from "../../../utils/dom-elements";

const fixtures = {
  "01.deselect.singleNestedHighlight": () => {
    return span(
      "AAA",
      span(
        highlight(
          {
            color: "blue",
            id: "test-parent-highlight",
            startOffset: 3,
            length: 35,
          },
          "CCC",
        ),
        span(
          highlight(
            {
              color: "red",
              id: "test-nested-highlight",
              startOffset: 6,
              length: 26,
            },
            highlight(
              {
                color: "blue",
                id: "test-parent-highlight",
                startOffset: 3,
                length: 35,
              },
              "Lorem ipsum dolor sit amet",
            ),
          ),
        ),
        b(
          highlight(
            {
              color: "blue",
              id: "test-parent-highlight",
              startOffset: 3,
              length: 35,
            },
            " elit.",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
  "02.deselect.multipleNestedHighlights": () => {
    return span(
      "AAA",
      span(
        highlight(
          {
            color: "black",
            id: "test-nested-highlight-1",
            startOffset: 3,
            length: 3,
          },
          highlight(
            {
              color: "blue",
              id: "test-parent-highlight",
              startOffset: 3,
              length: 35,
            },
            "CCC",
          ),
        ),
        span(
          highlight(
            {
              color: "red",
              id: "test-nested-highlight-2",
              startOffset: 6,
              length: 26,
            },
            highlight(
              {
                color: "blue",
                id: "test-parent-highlight",
                startOffset: 3,
                length: 35,
              },
              "Lorem ipsum dolor sit amet",
            ),
          ),
        ),
        b(
          highlight(
            {
              color: "green",
              id: "test-nested-highlight-3",
              startOffset: 32,
              length: 6,
            },
            highlight(
              {
                color: "blue",
                id: "test-parent-highlight",
                startOffset: 3,
                length: 35,
              },
              " elit.",
            ),
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
  "03.deselect.multiLevelNestedHighlights": () => {
    return span(
      highlight(
        {
          color: "turqouise",
          id: "test-outer-parent-highlight",
          startOffset: 0,
          length: 59,
        },
        "AAA",
      ),
      span(
        highlight(
          {
            color: "black",
            id: "test-nested-highlight-1",
            startOffset: 3,
            length: 3,
          },
          highlight(
            {
              color: "blue",
              id: "test-inner-parent-highlight",
              startOffset: 3,
              length: 35,
            },
            highlight(
              {
                color: "turqouise",
                id: "test-outer-parent-highlight",
                startOffset: 0,
                length: 59,
              },
              "CCC",
            ),
          ),
        ),
        span(
          highlight(
            {
              color: "red",
              id: "test-nested-highlight-2",
              startOffset: 6,
              length: 26,
            },
            highlight(
              {
                color: "blue",
                id: "test-inner-parent-highlight",
                startOffset: 3,
                length: 35,
              },
              highlight(
                {
                  color: "turqouise",
                  id: "test-outer-parent-highlight",
                  startOffset: 0,
                  length: 59,
                },
                "Lorem ipsum dolor sit amet",
              ),
            ),
          ),
        ),
        b(
          highlight(
            {
              color: "green",
              id: "test-nested-highlight-3",
              startOffset: 32,
              length: 6,
            },
            highlight(
              {
                color: "blue",
                id: "test-inner-parent-highlight",
                startOffset: 3,
                length: 35,
              },
              highlight(
                {
                  color: "turqouise",
                  id: "test-outer-parent-highlight",
                  startOffset: 0,
                  length: 59,
                },
                " elit.",
              ),
            ),
          ),
        ),
        span(
          highlight(
            {
              color: "black",
              id: "test-nested-highlight-4",
              startOffset: 38,
              length: 11,
            },
            highlight(
              {
                color: "white",
                id: "test-inner-parent-highlight-2",
                startOffset: 38,
                length: 21,
              },
              highlight(
                {
                  color: "turqouise",
                  id: "test-outer-parent-highlight",
                  startOffset: 0,
                  length: 59,
                },
                "consectetur",
              ),
            ),
          ),
          highlight(
            {
              color: "white",
              id: "test-inner-parent-highlight-2",
              startOffset: 38,
              length: 21,
            },
            highlight(
              {
                color: "turqouise",
                id: "test-outer-parent-highlight",
                startOffset: 0,
                length: 59,
              },
              " adipiscit",
            ),
          ),
        ),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
};

export default fixtures;
