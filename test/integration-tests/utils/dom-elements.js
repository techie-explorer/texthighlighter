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
const img = (...children) => element("i")(...children);

const highlight = ({ color, id }, ...children) => {
  const docElem = span(...children);
  docElem.classList.add("highlighted");
  if (id) {
    docElem.classList.add(id);
  }
  docElem.setAttribute("data-highlighted", true);
  docElem.style.color = color;
  return docElem;
};

export { element, span, div, b, i, img, highlight };
