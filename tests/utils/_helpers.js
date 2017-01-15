const createElements = (arr) => {
  return arr.map((elem) => {
    const el = document.createElement(elem.node || 'div');

    if (elem.text) {
      el.textContent = elem.text;
    }

    if (elem.attrs) {
      const attrs = elem.attrs;
      Object.keys(attrs).forEach((attr) => {
        el.setAttribute(attr, attrs[attr]);
      });
    }

    if (elem.styles) {
      const styles = elem.styles;
      Object.keys(styles).forEach((style) => {
        el.style[style] = styles[style];
      });
    }

    if (elem.children) {
      const children = createElements(elem.children);
      children.forEach((child) => {
        el.appendChild(child)
      });
    }

    return el;
  });
};

const attachElements = (arr, parent) => {
  const parentNode = parent || document.body;
  arr.forEach((el) => {
    parentNode.appendChild(el);
  });
};

const detachElements = (arr, parent) => {
  const parentNode = parent || document.body;
  arr.forEach((el) => {
    if (el.parentNode === parentNode) {
      parentNode.removeChild(el);
    }
  });
};

export {
  createElements,
  attachElements,
  detachElements,
};
