import dom from "../../../src/utils/dom";
import { div, style, script, b, i, span, text } from "../../utils/dom-elements";

describe("dom utility functionality", () => {
  let root;
  beforeEach(() => {
    root = document.getElementById("root");
  });

  afterEach(() => {
    root.innerHTML = "";
  });

  describe("#textContentExcludingTags()", () => {
    it("should exclude text content from the specified excluded tags that live in the parent element", () => {
      const contents = div(
        "It is time to put away our weapons",
        style(".header { background-color: black; }"),
        span(" and look to create a society of ", b("peace"), "."),
        div(" Let us not dwell on our ", i("differences")),
        script("function init() { alert('Something happened'); }"),
        div(" and instead seek to build on what we have in common."),
      );
      root.appendChild(contents);
      expect(dom(root).textContentExcludingTags(["style", "script"])).toEqual(
        "It is time to put away our weapons and look to create a society of peace. " +
          "Let us not dwell on our differences and instead seek to build on what we have in common.",
      );
    });
  });

  describe("#getChildIndex()", () => {
    it("should get the correct index for in the element children list for a set of child nodes", () => {
      const children = [
        div("This is div 1"),
        span("This is element 2"),
        span("This is a ", b("bold"), " element"),
        i("Italics element here"),
        text("This is a text node element!"),
      ];

      children.forEach((child) => root.appendChild(child));

      const rootWrapped = dom(root);
      children.forEach((child, i) => {
        expect(rootWrapped.getChildIndex(child)).toBe(i);
      });
    });
  });
});
