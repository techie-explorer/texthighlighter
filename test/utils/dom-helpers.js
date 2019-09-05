const setContents = (element, newChildNode) => {
  if (element) {
    element.innerHTML = "";
    element.appendChild(newChildNode);
  }
};

export { setContents };
