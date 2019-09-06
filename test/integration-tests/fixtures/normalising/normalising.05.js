import { span, highlight, bWithAttrs,b, i, img } from "../../../utils/dom-elements";

const fixtures = {
  "05.normalising.base": () => {
    return span(
      "AAA","aaa",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "1",
              startOffset: 6,
              length: 26
            },
            "Lorem ipsum dolor ","aaa"
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "1",
                startOffset: 6,
                length: 26
              },
              "sit ","aaa "
            )
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "1",
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
                id: "1",
                startOffset: 6,
                length: 26
              },
              "am "
            ),
            highlight(
              {
                color: "red",
                id: "1",
                startOffset: 6,
                length: 26
              },
              highlight(
                {
                  color: "blue",
                  id: "2",
                  startOffset: 6,
                  length: 26
                },
                "am again"
              ),
            ),
          ),
          highlight(
            {
              color: "red",
              id: "1",
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
  "05.normalising.highlightsWithDifferentIds": () => {
    return span(
      "AAAaaa",
      span(
        "CCC",
        span(
          highlight(
            {
              color: "red",
              id: "1",
              startOffset: 6,
              length: 26
            },
            "Lorem ipsum dolor aaa",
          ),
          bWithAttrs({id: "bold"})(
            highlight(
              {
                color: "red",
                id: "1",
                startOffset: 6,
                length: 26
              },
              "sit aaa sit again "
            )
          ),
          img(),
          i(
            highlight(
              {
                color: "red",
                id: "1",
                startOffset: 6,
                length: 26
              },
              "am ",
              highlight(
                {
                  color: "blue",
                  id: "2",
                  startOffset: 6,
                  length: 26
                },
                "am again"
              ),
            ),
          ),
          highlight(
            {
              color: "red",
              id: "1",
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
