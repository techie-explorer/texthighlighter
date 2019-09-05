import { span, highlight, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "03.serialisation.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem ipsum dolor "),
        b("sit amet elit"),
        img(),
        b("am ", i("leonulla")),
        "et",
        span("consectetur ", b("adipiscit")),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "03.serialisation.overlapping": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          "Lorem ",
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 16
            },
            "ipsum",
            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-2",
                startOffset: 17,
                length: 15
              },
              " dolor "
            )
          )
        ),
        b(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 16
            },

            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-2",
                startOffset: 17,
                length: 15
              },
              "sit "
            )
          ),
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-2",
              startOffset: 17,
              length: 15
            },
            "amet"
          ),
          " elit"
        ),
        img(),
        b("am ", i("leonulla")),
        "et",
        span("consectetur ", b("adipiscit")),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "03.serialisation.overlappingMultiple": () => {
    // Add the case where three highlights overlap here!
    return span(
      "AAA",
      span(
        "CCC",
        span(
          "Lorem ",
          // red highlighted text: "ipsum dolor sit "
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 16
            },
            "ip",
            // green highlighted text: "sum d"
            highlight(
              {
                color: "green",
                id: "test-overlapping-highlights-2",
                startOffset: 14,
                length: 5
              },
              "sum",
              // blue highlighted text: " dolor sit amet"
              highlight(
                {
                  color: "blue",
                  id: "test-overlapping-highlights-3",
                  startOffset: 17,
                  length: 15
                },
                " d"
              )
            ),
            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-3",
                startOffset: 17,
                length: 15
              },
              "olor "
            )
          )
        ),

        b(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-1",
              startOffset: 12,
              length: 16
            },
            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-3",
                startOffset: 17,
                length: 15
              },
              "sit "
            )
          ),
          highlight(
            {
              color: "blue",
              id: "test-overlapping-highlights-3",
              startOffset: 17,
              length: 15
            },
            "amet"
          ),
          " elit"
        ),
        img(),
        b("am ", i("leonulla")),
        "et",
        span("consectetur ", b("adipiscit")),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  }
};

export default fixtures;
