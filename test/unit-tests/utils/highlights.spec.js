import {
  getHighlightedTextRelativeToRoot,
  getHighlightedTextForRange,
  findNodesAndOffsets
} from "../../../src/utils/highlights";
import { span, b, i, div, img } from "../../utils/dom-elements";

/**
 * Extracts text from nodes so we can do equality comparisons
 * when DOM nodes are involved.
 *
 * @param {*} nodes
 */
const prepareNodes = nodes =>
  nodes.map(node => ({
    length: node.length,
    nodeText: node.node.textContent,
    offset: node.offset
  }));

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
        toString: () =>
          "This really is the beginning of something wonderful, improving the foundations for what is to come"
      };

      expect(getHighlightedTextForRange(range)).toEqual(
        "This really is the beginning of something wonderful, improving the foundations for what is to come"
      );
    });
  });

  describe("#findNodesAndOffsets()", () => {
    it("should collect a portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things")
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 21,
          length: 5
        },
        root
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 4,
          nodeText: " of something wonderful.",
          length: 5
        }
      ]);
    });

    it("should collect the end portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things")
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 29,
          length: 12
        },
        root
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 12,
          nodeText: " of something wonderful.",
          length: 12
        }
      ]);
    });

    it("should collect the start portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things")
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 17,
          length: 5
        },
        root
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 0,
          nodeText: " of something wonderful.",
          length: 5
        }
      ]);
    });

    it("should collect a full single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things")
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 17,
          length: 24
        },
        root
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 0,
          nodeText: " of something wonderful.",
          length: 24
        }
      ]);
    });

    it("should collect multiple nodes that form a part of a single highlight and ignore terminal element nodes", () => {
      const contents = div(
        b("This is the beginning "),
        "of something ",
        div("That is very unusual."),
        img(),
        span(" We are not ", i("very happy with ")),
        div(div(span(b("what went before.")))),
        div(
          "We will be the revolutionaries highlighters around the world have been crying out for."
        )
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 24,
          length: 50
        },
        root
      );

      expect(prepareNodes(nodes)).toEqual([
        {
          length: 11,
          nodeText: "of something ",
          offset: 2
        },
        {
          length: 21,
          nodeText: "That is very unusual.",
          offset: 0
        },
        {
          length: 12,
          nodeText: " We are not ",
          offset: 0
        },
        {
          length: 6,
          nodeText: "very happy with ",
          offset: 0
        }
      ]);
    });
  });
});
