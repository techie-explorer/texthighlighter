import { span, highlight, spanWithAttrs } from "../../../utils/dom-elements";

const fixtures = {
  "02.callbacks.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({ id: "highlight-1-start-node" })("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })("DDD"),
      "BBB",
    );
  },

  "02.callbacks.Single_highlight_with_id_and_metadata": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({
          id: "highlight-1-start-node",
          "data-test-id": "testId103293",
          "data-custom-tag": "spontaneous",
        })(
          highlight(
            { color: "red", id: "testId", length: 26, startOffset: 6, time: "test" },
            "Lorem ipsum dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })("DDD"),
      "BBB",
    );
  },

  "02.callbacks.Single_highlight_with_id_and_metadata_after_removal": () => {
    return span(
      "AAA",
      span(
        "CCC",
        spanWithAttrs({
          id: "highlight-1-start-node",
          "data-test-id": "testId103293",
          "data-custom-tag": "spontaneous",
        })("Lorem ipsum dolor sit amet"),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      spanWithAttrs({ id: "highlight-2-start-node" })("DDD"),
      "BBB",
    );
  },
};

export default fixtures;
