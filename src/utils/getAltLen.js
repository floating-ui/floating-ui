// @flow

export default (len: 'width' | 'height'): 'width' | 'height' =>
  len === 'width' ? 'height' : 'width';
