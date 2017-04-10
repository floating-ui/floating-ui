import getStyleComputedProperty from './getStyleComputedProperty';
import includeScroll from './includeScroll';
import getScrollParent from './getScrollParent';

export default function getOffsetRectRelativeToArbitraryNode(children, parent) {
    const childrenRect = children.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const scrollParent = getScrollParent(children);
    let offsets = {
        top: childrenRect.top - parentRect.top,
        left: childrenRect.left - parentRect.left,
        bottom: childrenRect.top - parentRect.top + childrenRect.height,
        right: childrenRect.left - parentRect.left + childrenRect.width,
        width: childrenRect.width,
        height: childrenRect.height,
    };

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (parent.nodeName === 'HTML') {
        const styles = getStyleComputedProperty(parent);
        const borderTopWidth = Number(styles.borderTopWidth.split('px')[0]);
        const borderLeftWidth = Number(styles.borderLeftWidth.split('px')[0]);
        const marginTop = Number(styles.marginTop.split('px')[0]);
        const marginLeft = Number(styles.marginLeft.split('px')[0]);

        offsets.top -= borderTopWidth - marginTop;
        offsets.bottom -= borderTopWidth - marginTop;
        offsets.left -= borderLeftWidth - marginLeft;
        offsets.right -= borderLeftWidth - marginLeft;
    }

    if (parent.contains(scrollParent) && scrollParent.nodeName !== 'BODY') {
        offsets = includeScroll(offsets, parent);
    }

    return offsets;
}
