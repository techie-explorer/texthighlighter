import { START_OFFSET_ATTR, LENGTH_ATTR } from "../../src/config";

const element = tag => ({id},...children) => {
  const docElem = document.createElement(tag);
  children.forEach(child => {
    if (typeof child === "string") {
      console.log('child',child)
      docElem.appendChild(document.createTextNode(child));
    } else {
      docElem.appendChild(child);
    }
  });
  if(id) {
    docElem.setAttribute('id',id)
  }
  
  return docElem;
};

const span = ({id},...children) => element("span")({id},...children);
const div = (...children) => element("div")({id:null},...children);
const b = (...children) => element("b")({id:null},...children);
const i = (...children) => element("i")({id:null},...children);
const img = (...children) => element("img")({id:null},...children);

const highlight = ({ color, id, startOffset, length }, ...children) => {
  const docElem = span(...children);
  docElem.classList.add("highlighted");
  if (id) {
    docElem.classList.add(id);
  }
  docElem.setAttribute("data-highlighted", true);
  docElem.setAttribute(START_OFFSET_ATTR, startOffset);
  docElem.setAttribute(LENGTH_ATTR, length);
  docElem.style.color = color;
  return docElem;
};

export { element, span, div, b, i, img, highlight };
