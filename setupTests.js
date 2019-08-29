require("jest-extended");

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
