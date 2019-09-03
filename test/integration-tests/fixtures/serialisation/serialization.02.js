import { span, highlight, b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "02.serialization.base": () => {
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
  "02.serialization.overlapping1": () => {
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
  }
};

export default fixtures;
