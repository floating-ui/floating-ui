// TODO: Remove everything related to Fluent UI and replace it with a custom UI
import {
  Button,
  FluentProvider,
  makeStyles,
  shorthands,
  tokens,
  Tooltip,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {ArrowReset24Filled, Bug24Filled} from '@fluentui/react-icons';
import React from 'react';

import {useDevtools} from '../contexts/devtools';

const useStyles = makeStyles({
  aside: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    alignSelf: 'flex-end',
    zIndex: '1',
    ...shorthands.margin(tokens.spacingHorizontalL),
  },
});

export const SidePanel = React.memo(() => {
  const styles = useStyles();
  const devtools = useDevtools();
  return (
    <FluentProvider
      theme={devtools.theme === 'dark' ? webDarkTheme : webLightTheme}
    >
      <aside className={styles.aside}>
        <Tooltip relationship="label" content="Reload">
          <Button
            appearance="secondary"
            icon={<ArrowReset24Filled />}
            iconPosition="after"
            onClick={devtools.forceUpdateSerializedData}
          />
        </Tooltip>
        <Tooltip relationship="label" content="Debug">
          <Button
            onClick={devtools.debug}
            appearance="secondary"
            icon={<Bug24Filled />}
            iconPosition="after"
          />
        </Tooltip>
      </aside>
    </FluentProvider>
  );
});
