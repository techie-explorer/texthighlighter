import { START_OFFSET_ATTR, LENGTH_ATTR } from "../../src/config";

const element = tag => (...children) => {
  const docElem = document.createElement(tag);
  children.forEach(child => {
    if (typeof child === "string") {
      docElem.appendChild(document.createTextNode(child));
    } else {
      docElem.appendChild(child);
    }
  });
  return docElem;
};

const span = (...children) => element("span")(...children);
const div = (...children) => element("div")(...children);
const b = (...children) => element("b")(...children);
const i = (...children) => element("i")(...children);
const img = (...children) => element("img")(...children);

const highlight = ({ color, id, startOffset, length }, ...children) => {
  const docElem = span(...children);
  docElem.classList.add("highlighted");
  if (id) {
    docElem.classList.add(id);
  }
  docElem.setAttribute("data-highlighted", true);
  docElem.setAttribute(START_OFFSET_ATTR, startOffset);
  docElem.setAttribute(LENGTH_ATTR, length);
  docElem.style.backgroundColor = color;
  return docElem;
};

export { element, span, div, b, i, img, highlight };
