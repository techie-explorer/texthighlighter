import { span, highlight } from "../../../utils/dom-elements";

const fixtures = {
  "08.focus.priorityHighlighters": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "user-highlights",
              startOffset: 6,
              length: 5,
              dataAttr: "data-user-highlights",
            },
            "Lorem",
            highlight(
              {
                color: "red",
                id: "basic-highlights",
                startOffset: 11,
                length: 5,
                dataAttr: "data-basic-highlights",
              },
              "ipsum",
            ),
            "dolor sit amet",
          ),
        ),
        span("consectetur adipiscit"),
        span("elit."),
      ),
      span("DDD"),
      "BBB",
    );
  },
};

export default fixtures;
