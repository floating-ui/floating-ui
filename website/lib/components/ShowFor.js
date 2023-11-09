import {useAppContext} from '../../pages/_app';

export function ShowFor({children, packages}) {
  const {packageContext} = useAppContext();
  if (packages.includes(packageContext)) {
    return children;
  }
}
