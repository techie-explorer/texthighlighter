require("jest-extended");

const sanitizeHtml = require("sanitize-html");

// Add our root div node.
const root = global.document.createElement("div");
root.id = "root";
global.document.documentElement.appendChild(root);

// Ensure the document hidden element can be set in test code.
Object.defineProperty(document, "hidden", {
  value: true,
  configurable: true
});

global.window.matchMedia = () => ({ matches: false });

// Implementation of innerText for JSDOM. (It does not come with innerText)
Object.defineProperty(global.Element.prototype, "innerText", {
  get() {
    return sanitizeHtml(this.textContent, {
      allowedTags: [], // remove all tags and return text content only
      allowedAttributes: {} // remove all tags and return text content only
    });
  },
  configurable: true // make it so that it doesn't blow chunks on re-running tests with things like --watch
});
