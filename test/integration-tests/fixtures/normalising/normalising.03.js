import { span, spanWithAttrs, img } from "../../../utils/dom-elements";

const fixtures = {
  "03.normalising.base": () => {
    return span(
      "AAA",
      spanWithAttrs({id: "test-normalising-1"})(
        "CCC",
        spanWithAttrs({id: "test-normalising-2"})("Lorem ipsum dolor sit amet"),
        img(),
        spanWithAttrs({id: "test-normalising-2"})("consectetur adipiscit"),
        span("elit.")
      ),
      spanWithAttrs({id: "test-normalising-1"})("DDD"),
      "BBB"
    );
  },
  "03.normalising.elementsWithSameId": () => {
    return span(
      "AAA",
      spanWithAttrs({id: "test-normalising-1"})(
        "CCC",
        spanWithAttrs({id: "test-normalising-2"})("Lorem ipsum dolor sit amet"),
        img(),
        spanWithAttrs({id: "test-normalising-2"})("consectetur adipiscit"),
        span("elit."),
        "DDD"
      ),
      "BBB"
    );
  }
};

export default fixtures;