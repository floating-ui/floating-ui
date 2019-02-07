import Popper from "../src";
import interact from 'interactjs';

const ref = document.getElementById("ref");
const popper = document.getElementById("popper");

const popperInstance = new Popper(ref, popper, {
  // placement: 'bottom',
  placement: "bottom-end",

  modifiers: {
    flip: {
      // behavior: ['bottom','left']
      behavior: ["bottom-end", "left"],
      flipVariations:true
    }
  }
});

popperInstance.enableEventListeners()


interact('#ref').draggable({
  restrict: {
    restriction: "parent",
    // endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
  },
  onmove: dragMoveListener,
  onend: popperInstance.update
})

function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}