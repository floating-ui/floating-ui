// @flow
import getUAString from '../utils/userAgent';

export default function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
