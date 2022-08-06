// @flow
type Navigator = Navigator & { userAgentData?: NavigatorUAData };

interface NavigatorUAData {
  brands: Array<{brand: string; version: string}>;
  mobile: boolean;
  platform: string;
}

function getUAString(): string {

  const uaData = (navigator: Navigator).userAgentData;

  if (uaData?.brands) {
    return uaData.brands
      .map((item) => `${item.brand}/${item.version}`)
      .join(' ');
  }

  return navigator.userAgent;
}

export default function isLayoutViewport() {
   return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
