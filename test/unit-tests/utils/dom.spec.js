import dom from "../../../src/utils/dom";
import { div, style, script, b, i, span } from "../../utils/dom-elements";

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
        div(" and instead seek to build on what we have in common.")
      );
      root.appendChild(contents);
      expect(dom(root).textContentExcludingTags(["style", "script"])).toEqual(
        "It is time to put away our weapons and look to create a society of peace. " +
          "Let us not dwell on our differences and instead seek to build on what we have in common."
      );
    });
  });
});
