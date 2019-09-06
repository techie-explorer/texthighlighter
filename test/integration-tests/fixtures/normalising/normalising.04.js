import { span, highlight, bWithAttrs,b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "04.normalising.base": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "",
              startOffset: 6,
              length: 26
            },
            "Lorem ipsum dolor ",
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "sit "
            )
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "sit again "
            )
          ),
          img(),
          i(
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "am "
            ),
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "am again"
            ),
          ),
          highlight(
            {
              color: "red",
              id: "",
              startOffset: 6,
              length: 26
            },
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
  "04.normalising.highlightsWithSameId": () => {
    return span(
      "AAA",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "",
              startOffset: 6,
              length: 26
            },
            "Lorem ipsum dolor ",
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "sit sit again "
            )
          ),
          img(),
          i(
            highlight(
              {
                color: "red",
                id: "",
                startOffset: 6,
                length: 26
              },
              "am am again"
            ),
          ),
          highlight(
            {
              color: "red",
              id: "",
              startOffset: 6,
              length: 26
            },
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
};

export default fixtures;
