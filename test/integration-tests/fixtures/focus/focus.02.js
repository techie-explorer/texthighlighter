import { span, highlight, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "02.focus.overlapping": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            "Lorem ipsum dolor ",
            b("sit ")
          ),
          img(),
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            i("am"),
            "et"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "02.focus.nestedFocus": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            "Lorem ",
            highlight(
              {
                color: "blue",
                id: "test-overlapping-highlights-nested-1",
                startOffset: 12,
                length: 12
              },
              "ipsum dolor "
            ),
            b("sit ")
          ),
          img(),
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            i("am"),
            "et"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  }, 
  "02.focus.nestedParentFocused": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            "Lorem "
          ),
          highlight(
            {
                color: "blue",
                id: "test-overlapping-highlights-nested-1",
                startOffset: 12,
                length: 12
            },
            highlight(
              {
                color: "red",
                id: "test-overlapping-highlights",
                startOffset: 6,
                length: 26
              },
              "ipsum dolor "
            ),
          ),
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            b("sit ")
          ),
          img(),
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights",
              startOffset: 6,
              length: 26
            },
            i("am"),
            "et"
          )
        ),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  }
};

export default fixtures;
