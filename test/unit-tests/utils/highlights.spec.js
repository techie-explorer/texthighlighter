import {
  getHighlightedTextRelativeToRoot,
  getHighlightedTextForRange,
  findNodesAndOffsets,
  getElementOffset,
  validateIndependenciaDescriptors,
} from "../../../src/utils/highlights";
import { span, b, i, div, img, style, script, docFrag } from "../../utils/dom-elements";

/**
 * Extracts text from nodes so we can do equality comparisons
 * when DOM nodes are involved.
 *
 * @param {*} nodes
 */
const prepareNodes = (nodes) =>
  nodes.map((node) => ({
    length: node.length,
    nodeText: node.node.textContent,
    offset: node.offset,
  }));

describe("highlighting utility functionality", () => {
  let root;
  beforeEach(() => {
    root = document.getElementById("root");
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  describe("#getElementOffset()", () => {
    it("should get the correct element offset excluding specified node types", () => {
      const child = span("This is the child element");
      const contents = div(
        style(".header { background-color: #fff; }"),
        span("a span"),
        div(div(script("function init() { alert('We have done something!') }"))),
        child,
        b("Some bold text after"),
      );
      root.appendChild(contents);
      expect(getElementOffset(child, root, ["SCRIPT", "STYLE"])).toEqual(6);
    });
  });

  describe("#getHighlightedTextRelativeToRoot()", () => {
    it("should extract the highlighted text across a range of nodes at multiple levels", () => {
      const contents = span(
        b("This ", i("is"), " the ", span("begin", i("ning")), " ", i("something wonderful,")),
        span(span(" improving the foundations"), " for what is to come"),
      );
      root.appendChild(contents);
      expect(
        getHighlightedTextRelativeToRoot({
          rootElement: root,
          startOffset: 21,
          length: 35,
        }),
      ).toEqual(" something wonderful, improving the");
    });
  });

  describe("#getHighlightTextForRange()", () => {
    it("should extract the highlighted text from the provided range ignoring excluded tags", () => {
      const range = {
        cloneContents: () => {
          return docFrag(
            div("This really is the beginning"),
            script("function init() { alert('Something!') }"),
            div(" ", span(b("of something wonderful"))),
            div(div(div(style(".header { background: black; }")))),
            div(", improving the ", b(i("foundations")), " for what is to come"),
          );
        },
      };

      expect(getHighlightedTextForRange(range, ["script", "style"])).toEqual(
        "This really is the beginning of something wonderful, improving the foundations for what is to come",
      );
    });
  });

  describe("#findNodesAndOffsets()", () => {
    it("should collect a portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things"),
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 21,
          length: 5,
        },
        root,
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 4,
          nodeText: " of something wonderful.",
          length: 5,
        },
      ]);
    });

    it("should collect the end portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things"),
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 29,
          length: 12,
        },
        root,
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 12,
          nodeText: " of something wonderful.",
          length: 12,
        },
      ]);
    });

    it("should collect the start portion of a single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things"),
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 17,
          length: 5,
        },
        root,
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 0,
          nodeText: " of something wonderful.",
          length: 5,
        },
      ]);
    });

    it("should collect a full single node that is highlighted", () => {
      const contents = div(
        b("This is the start"),
        i(" of something wonderful."),
        div("Trust me when I say we are improving things"),
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 17,
          length: 24,
        },
        root,
      );
      expect(prepareNodes(nodes)).toEqual([
        {
          offset: 0,
          nodeText: " of something wonderful.",
          length: 24,
        },
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
          "We will be the revolutionaries highlighters around the world have been crying out for.",
        ),
      );
      root.appendChild(contents);
      const nodes = findNodesAndOffsets(
        {
          offset: 24,
          length: 50,
        },
        root,
      );

      expect(prepareNodes(nodes)).toEqual([
        {
          length: 11,
          nodeText: "of something ",
          offset: 2,
        },
        {
          length: 21,
          nodeText: "That is very unusual.",
          offset: 0,
        },
        {
          length: 12,
          nodeText: " We are not ",
          offset: 0,
        },
        {
          length: 6,
          nodeText: "very happy with ",
          offset: 0,
        },
      ]);
    });

    it(
      "should collect multiple nodes that form a part of a single highlight and ignore nodes " +
        "that should be excluded as specified by the caller",
      () => {
        const contents = div(
          b("This is the beginning "),
          script("function init() { alert('Something happened!') }"),
          "of something ",
          div("That is very unusual."),
          div(div(div(style(".header { position: absolute; top: 0; }")))),
          img(),
          span(" We are not ", i("very happy with ")),
          div(div(span(b("what went before.")))),
          div(
            "We will be the revolutionaries highlighters around the world have been crying out for.",
          ),
        );

        root.appendChild(contents);
        const nodes = findNodesAndOffsets(
          {
            offset: 24,
            length: 50,
          },
          root,
          ["SCRIPT", "STYLE"],
        );

        expect(prepareNodes(nodes)).toEqual([
          {
            length: 11,
            nodeText: "of something ",
            offset: 2,
          },
          {
            length: 21,
            nodeText: "That is very unusual.",
            offset: 0,
          },
          {
            length: 12,
            nodeText: " We are not ",
            offset: 0,
          },
          {
            length: 6,
            nodeText: "very happy with ",
            offset: 0,
          },
        ]);
      },
    );
  });
  describe("#validateIndependenciaDescriptors()", () => {
    it("Should fail for descriptors of incorrect length", () => {
      let descriptors = ['<span className="highlighted"></span>', "test1", 10];
      expect(validateIndependenciaDescriptors(descriptors)).toEqual(false);
      descriptors = ['<span className="highlighted"></span>', "test1", 10, 5, 5];
      expect(validateIndependenciaDescriptors(descriptors)).toEqual(false);
    });

    it("Should work for descriptors of the correct length", () => {
      let descriptors = ['<span className="highlighted"></span>', "test1", 10, 5];
      expect(validateIndependenciaDescriptors(descriptors)).toEqual(true);
    });
  });
});
