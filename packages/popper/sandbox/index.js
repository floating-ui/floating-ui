import Popper from "../src";

const ref = document.getElementById("ref");
const popper = document.getElementById("popper");

const popperInstance = new Popper(ref, popper, {
  // placement: 'bottom',
  placement: "bottom-end",

  modifiers: {
    flip: {
      // behavior: ['bottom','left']
      behavior: ["bottom-end", "left"]
    }
  }
});
