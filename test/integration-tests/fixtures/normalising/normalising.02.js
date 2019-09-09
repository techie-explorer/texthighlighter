import { span, spanWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "02.normalising.base": () => {
    return span(
      "AAA",
      spanWithAttrs({ id: "test-normalising-1" })(
        "CCC",
        spanWithAttrs({ id: "test-normalising-2" })("Lorem ipsum dolor sit amet"),
        spanWithAttrs({ id: "test-normalising-2" })("consectetur adipiscit"),
        span("elit."),
      ),
      spanWithAttrs({ id: "test-normalising-1" })("DDD"),
      "BBB",
    );
  },
  "02.normalising.elementsWithSameId": () => {
    return span(
      "AAA",
      spanWithAttrs({ id: "test-normalising-1" })(
        "CCC",
        spanWithAttrs({ id: "test-normalising-2" })(
          "Lorem ipsum dolor sit ametconsectetur adipiscit",
        ),
        span("elit."),
        "DDD",
      ),
      "BBB",
    );
  },
};

export default fixtures;
