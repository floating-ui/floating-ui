import getStyleComputedProperty from './getStyleComputedProperty';

export default function getOffsetRectRelativeToArbitraryNode(children, parent) {
    const childrenRect = children.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const offsets = {
        top: childrenRect.top - parentRect.top,
        left: childrenRect.left - parentRect.left,
        bottom: childrenRect.top - parentRect.top + childrenRect.height,
        right: childrenRect.left - parentRect.left + childrenRect.width,
        width: childrenRect.width,
        height: childrenRect.height,
    };

    // subtract borderTopWidth and borderTopWidth from final result
    const styles = getStyleComputedProperty(parent);
    const borderTopWidth = Number(styles.borderTopWidth.split('px')[0]);
    const borderLeftWidth = Number(styles.borderLeftWidth.split('px')[0]);
    const marginTop = Number(styles.marginTop.split('px')[0]);
    const marginLeft = Number(styles.marginLeft.split('px')[0]);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    return offsets;
}
