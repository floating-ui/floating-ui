interface NavigatorUAData {
  brands: Array<{brand: string; version: string}>;
  mobile: boolean;
  platform: string;
}

let uaString: string | undefined;

export function getUAString(): string {
  if (uaString) {
    return uaString;
  }

  const uaData = (navigator as any).userAgentData as
    | NavigatorUAData
    | undefined;

  if (uaData && Array.isArray(uaData.brands)) {
    uaString = uaData.brands
      .map((item) => `${item.brand}/${item.version}`)
      .join(' ');
    return uaString;
  }

  return navigator.userAgent;
}
