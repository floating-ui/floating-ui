/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {{top:Number,left:Number,width:Number,height:Number}} offsets
 * @returns {ClientRect} ClientRect like output
 */
export default function getClientRect(offsets) {
  return {
    ...offsets,
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height,
  };
}
