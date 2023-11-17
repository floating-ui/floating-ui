export function getPackageContext(path) {
  if (
    path.includes('react') ||
    path.includes('use') ||
    path.includes('floating') ||
    path.includes('composite') ||
    path.includes('hooks') ||
    path.includes('inner')
  ) {
    return 'react';
  } else if (path.includes('vue')) {
    return 'vue';
  } else if (path.includes('react-native')) {
    return 'react-native';
  } else {
    return 'dom';
  }
}
