import { span, highlight } from "../../../utils/dom-elements";

const fixtures = {
  "01.highlighting.base": () => {
    return span({id:null},
      "AAA",
      span({id:null},
        "CCC",
        span({id: 'highlight-1-start-node'},"Lorem ipsum dolor sit amet"),
        span({id:null},"consectetur adipiscit"),
        span({id:null},"elit.")
      ),
      span({id: 'highlight-2-start-node'},"DDD"),
      "BBB"
    );
  },
  "01.highlighting.singleHighlight": () => {
    return span({id:null},
      "AAA",
      span({id:null},
        "CCC",
        span({id: 'highlight-1-start-node'},
          highlight(
            { color: "red", id: "test-single-highlight" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span({id:null},"consectetur adipiscit"),
        span({id:null},"elit.")
      ),
      span({id: 'highlight-2-start-node'},"DDD"),
      "BBB"
    );
  },
  "01.highlighting.multipleHighlights": () => {
    return span({id:null},
      "AAA",
      span({id:null},
        "CCC",
        span({id: 'highlight-1-start-node'},
          highlight(
            { color: "red", id: "test-multiple-highlights" },
            "Lorem ipsum dolor sit amet"
          )
        ),
        span({id:null},"consectetur adipiscit"),
        span({id:null},"elit.")
      ),
      span({id: 'highlight-2-start-node'},
        "DD",
        highlight({ color: "blue", id: "test-multiple-highlights" }, "D")
      ),
      "BBB"
    );
  }
};

export default fixtures;
