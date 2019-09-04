import { span, highlight, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "02.serialisation.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span("Lorem ipsum dolor "),
        b("sit "),
        img(),
        i("am"),
        "et",
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD"),
      "BBB"
    );
  },
  "02.serialisation.overlapping": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            { color: "red", id: "test-overlapping-highlights" },
            "Lorem ipsum dolor ",
            b("sit ")
          ),
          img(),
          highlight(
            { color: "red", id: "test-overlapping-highlights" },
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
  "02.serialisation.nested": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            { color: "red", id: "test-overlapping-highlights" },
            "Lorem ",
            highlight(
              { color: "blue", id: "test-overlapping-highlights-nested-1" },
              "ipsum dolor "
            ),
            b("sit ")
          ),
          img(),
          highlight(
            { color: "red", id: "test-overlapping-highlights" },
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
