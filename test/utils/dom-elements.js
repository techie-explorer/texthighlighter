import { START_OFFSET_ATTR, LENGTH_ATTR, TIMESTAMP_ATTR } from "../../src/config";

const element = tag => (...children) => ({ id } = {}) => {
  const docElem = document.createElement(tag);
  children.forEach(child => {
    if (typeof child === "string") {
      docElem.appendChild(document.createTextNode(child));
    } else {
      docElem.appendChild(child);
    }
  });
  if (id) {
    docElem.setAttribute("id", id);
  }

  return docElem;
};

const span = (...children) => element("span")(...children)();
const div = (...children) => element("div")(...children)();
const b = (...children) => element("b")(...children)();
const i = (...children) => element("i")(...children)();
const img = (...children) => element("img")(...children)();

const spanWithAttrs = attrs => (...children) =>
  element("span")(...children)(attrs);
const divWithAttrs = attrs => (...children) =>
  element("div")(...children)(attrs);
const bWithAttrs = attrs => (...children) => element("b")(...children)(attrs);
const iWithAttrs = attrs => (...children) => element("i")(...children)(attrs);
const imgWithAttrs = attrs => (...children) =>
  element("img")(...children)(attrs);

const highlight = ({ color, id, startOffset, length, time}, ...children) => {
  const docElem = span(...children);
  docElem.style.backgroundColor = color;
  docElem.classList.add("highlighted");
  if (id) {
    docElem.classList.add(id);
  }
  docElem.setAttribute(TIMESTAMP_ATTR, time);
  docElem.setAttribute("data-highlighted", true);
  docElem.setAttribute(START_OFFSET_ATTR, startOffset);
  docElem.setAttribute(LENGTH_ATTR, length);
  
  return docElem;
};

export {
  element,
  span,
  div,
  b,
  i,
  img,
  highlight,
  spanWithAttrs,
  divWithAttrs,
  bWithAttrs,
  iWithAttrs,
  imgWithAttrs
};
