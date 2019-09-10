import TextHighlighter from "../../../src/text-highlighter";

describe("Text highlighter entrypoint class", () => {
  let highlighter, root;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(TextHighlighter.prototype, "highlightHandler").mockImplementation(() => {});
    if (highlighter) {
      highlighter.destroy();
    }
    highlighter = null;
    document.getElementById("root").innerHTML = "";
    root = document.getElementById("root");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should bind to default mouseup event when no useDefaultEvents option is provided", () => {
    highlighter = new TextHighlighter(root, {});
    const event = new Event("mouseup");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalled();
  });

  it("should bind to default touchend event when no useDefaultEvents option is provided", () => {
    highlighter = new TextHighlighter(root, {});
    const event = new Event("touchend");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalled();
  });

  it("should bind events to default mouseup event when useDefaultEvents option is provided as true", () => {
    highlighter = new TextHighlighter(root, { useDefaultEvents: true });
    const event = new Event("mouseup");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalled();
  });

  it("should bind events to default touchend event when useDefaultEvents option is provided as true", () => {
    highlighter = new TextHighlighter(root, { useDefaultEvents: true });
    const event = new Event("touchend");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalled();
  });

  it("should not bind events by default to mouseup event when useDefaultEvents option is provided as false", () => {
    highlighter = new TextHighlighter(root, { useDefaultEvents: false });
    const event = new Event("mouseup");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalledTimes(0);
  });

  it("should not bind events by default to touchend when useDefaultEvents option is provided as false", () => {
    highlighter = new TextHighlighter(root, { useDefaultEvents: false });
    const event = new Event("touchend");
    root.dispatchEvent(event);
    expect(highlighter.highlightHandler).toHaveBeenCalledTimes(0);
  });
});
