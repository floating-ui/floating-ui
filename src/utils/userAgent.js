// @flow
type Navigator = Navigator & { userAgentData?: NavigatorUAData };

interface NavigatorUAData {
  brands: Array<{ brand: string, version: string }>;
  mobile: boolean;
  platform: string;
}

export default function getUAString(): string {
  const uaData = (navigator: Navigator).userAgentData;

  if (uaData?.brands) {
    return uaData.brands
      .map((item) => `${item.brand}/${item.version}`)
      .join(' ');
  }

  return navigator.userAgent;
}
