import "jest-extended";

import sanitizeHtml from "sanitize-html";
import {
  findNodesAndOffsets,
  isElementHighlight
} from "./src/utils/highlights";
import { DATA_ATTR, IGNORE_TAGS } from "./src/config";

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

// Custom jest matchers.
expect.extend({
  toHaveFocus({ id, offset, length }, rootElement) {
    const { nodesAndOffsets } = findNodesAndOffsets(
      { offset: Number.parseInt(offset), length: Number.parseInt(length) },
      rootElement,
      IGNORE_TAGS
    );

    const { failures, pass } = nodesAndOffsets.reduce(
      (accumResults, { node }) => {
        if (
          node.parentNode.classList.contains(id) &&
          isElementHighlight(node.parentNode, DATA_ATTR)
        ) {
          return accumResults;
        }
        const parent = node.parentNode;
        return {
          failures: [
            ...accumResults.failures,
            {
              text: node.textContent,
              wrapper: `${parent.nodeName}${parent.id &&
                "#" + parent.id}:className="${parent.className}"`
            }
          ],
          pass: false
        };
      },
      { failures: [], pass: true }
    );

    return {
      pass,
      message: () => `
Expected all nodes in highlights to be wrapped with the
${this.utils.EXPECTED_COLOR(id)} highlight wrapper:

        ${failures.map(
          result =>
            `\n\n    "${
              result.text
            }" was wrapped inside element ${this.utils.RECEIVED_COLOR(
              result.wrapper
            )}`
        )}
      `
    };
  }
});
