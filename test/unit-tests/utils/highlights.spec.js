import {
  getHighlightedTextRelativeToRoot,
  getHighlightedTextForRange
} from "../../../src/utils/highlights";
import { span, b, i } from "../../utils/dom-elements";

describe("highlighting utility functionality", () => {
  let root;
  beforeEach(() => {
    root = document.getElementById("root");
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  describe("#getHighlightedTextRelativeToRoot()", () => {
    it("should extract the highlighted text across a range of nodes at multiple levels", () => {
      const contents = span(
        b(
          "This ",
          i("is"),
          " the ",
          span("begin", i("ning")),
          " ",
          i("something wonderful,")
        ),
        span(span(" improving the foundations"), " for what is to come")
      );
      root.appendChild(contents);
      expect(
        getHighlightedTextRelativeToRoot({
          rootElement: root,
          startOffset: 21,
          length: 35
        })
      ).toEqual(" something wonderful, improving the");
    });
  });

  describe("#getHighlightTextForRange()", () => {
    it("should extract the highlighted text from the provided range", () => {
      const range = {
        extractContents: () => {
          const fragment = document.createElement("div");
          const highlightContents = span(
            b(
              "This really ",
              i("is"),
              " the ",
              span("begin", i("ning")),
              " of ",
              i("something wonderful,")
            ),
            span(span(" improving the foundations"), " for what is to come")
          );
          fragment.appendChild(highlightContents);
          return fragment;
        }
      };

      expect(getHighlightedTextForRange(range)).toEqual(
        "This really is the beginning of something wonderful, improving the foundations for what is to come"
      );
    });
  });

  describe("#findNodesAndOffsets()", () => {
    it("should collect a single node that is highlighted", () => {});
    it("should collect multiple nodes that are highlighted", () => {});
  });
});
