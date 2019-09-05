const setContents = (element, newChildNode) => {
  if (element) {
    element.innerHTML = "";
    element.appendChild(newChildNode);
  }
};

const addRange = (startNode, startOffset, endNode, endOffset) => {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  
 let selection = window.getSelection();

  if (selection.rangeCount > 0) {
    selection.removeAllRanges();
  }

  selection.addRange(range);

  return range;
}

export { setContents, addRange };
