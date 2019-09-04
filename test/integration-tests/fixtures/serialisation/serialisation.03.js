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
            color: "blue",
            id: "test-overlapping-highlights-1",
            startOffset: 16,
            length: 15
          },
          highlight(
            {
              color: "red",
              id: "test-overlapping-highlights-2",
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
  }
};

export default fixtures;
