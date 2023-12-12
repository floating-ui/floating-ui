import {createElement, forwardRef} from 'react';

function _extends() {
  const _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (
            Object.prototype.hasOwnProperty.call(source, key)
          ) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded = ['as', 'children', 'contentId'],
  _excluded2 = ['as', 'id'];
// The user may want to provide their own ID (maybe there are multiple nav
// menus on a page a use might want to skip at various points in tabbing?).
var defaultId = 'reach-skip-nav'; ////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavLink
 *
 * Renders a link that remains hidden until focused to skip to the main content.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavlink
 */

var SkipNavLink = /*#__PURE__*/ forwardRef(
  function SkipNavLink(_ref, forwardedRef) {
    var _ref$as = _ref.as,
      Comp = _ref$as === void 0 ? 'a' : _ref$as,
      _ref$children = _ref.children,
      children =
        _ref$children === void 0
          ? 'Skip to content'
          : _ref$children,
      contentId = _ref.contentId,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

    var id = contentId || defaultId;
    return /*#__PURE__*/ createElement(
      Comp,
      _extends({}, props, {
        ref: forwardedRef,
        href: '#' + id, // TODO: Remove in 1.0 (kept for back compat)
        'data-reach-skip-link': '',
        'data-reach-skip-nav-link': '',
      }),
      children,
    );
  },
);
/**
 * @see Docs https://reach.tech/skip-nav#skipnavlink-props
 */

if (process.env.NODE_ENV !== 'production') {
  SkipNavLink.displayName = 'SkipNavLink';
} ////////////////////////////////////////////////////////////////////////////////

/**
 * SkipNavContent
 *
 * Renders a div as the target for the link.
 *
 * @see Docs https://reach.tech/skip-nav#skipnavcontent
 */

var SkipNavContent = /*#__PURE__*/ forwardRef(
  function SkipNavContent(_ref2, forwardedRef) {
    var _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? 'div' : _ref2$as,
      idProp = _ref2.id,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded2);

    var id = idProp || defaultId;
    return /*#__PURE__*/ createElement(
      Comp,
      _extends({}, props, {
        ref: forwardedRef,
        id: id,
        'data-reach-skip-nav-content': '',
      }),
    );
  },
);
/**
 * @see Docs https://reach.tech/skip-nav#skipnavcontent-props
 */

if (process.env.NODE_ENV !== 'production') {
  SkipNavContent.displayName = 'SkipNavContent';
} ////////////////////////////////////////////////////////////////////////////////

export {SkipNavContent, SkipNavLink};
