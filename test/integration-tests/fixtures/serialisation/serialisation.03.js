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
        i("am"),
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
