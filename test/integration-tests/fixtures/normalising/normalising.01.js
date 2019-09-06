import { span } from "../../../utils/dom-elements";

const fixtures = {
  "01.normalising.base": () => {
    return span(
      "AAA","aaa",
      span(
        "CCC","ccc",
        span("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDD","ddd"),
      "BBB"
    );
  },
  "01.normalising.textNodes": () => {
    return span(
      "AAAaaa",
      span(
        "CCCccc",
        span("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit.")
      ),
      span("DDDddd"),
      "BBB"
    );
  }
};

export default fixtures;