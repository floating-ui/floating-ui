import React from 'react';
import styled from '@emotion/styled';
import { UNPKG_CDN_URL } from '../../variables';
import { media, Container } from './Framework';
import { Gift } from 'react-feather';

import npmLogo from '../images/npm-logo.svg';
import { css } from '@emotion/core';

const InstallBarStyled = styled.div`
  background: #c83b50;
  padding: 15px 0;
  font-weight: bold;
  margin-bottom: 25px;
`;

const InstallBarContainer = styled(Container)`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  max-width: 1000px;
  color: white;

  ${media.lg} {
    flex-direction: row;
  }
`;

const Bar = styled.div`
  display: flex;
  background: #642f45;
  border-radius: 4px;
  color: #ffd3f8;
  font-family: Menlo, SFMono-Regular, Consolas, Liberation Mono, monospace;
  font-size: 14px;
  overflow: hidden;
  font-weight: normal;
  margin: 5px;
  max-width: 100%;
  overflow-x: auto;

  ${media.sm} {
    max-width: none;
  }

  ${media.lg} {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  text-align: center;
  padding: 0 15px;
  color: white;
`;

const Logo = styled.img`
  max-width: 50px;
  user-select: none;
`;

const TextWrapper = styled.div`
  padding: 10px 15px;
  white-space: nowrap;
`;

const InstallBar = () => (
  <InstallBarStyled>
    <InstallBarContainer>
      <div
        css={css`
          margin-right: 15px;
          margin-bottom: 5px;
          margin-top: 5px;
          ${media.lg} {
            margin-top: 0;
            margin-bottom: 0;
          }
        `}
      >
        <Gift
          css={css`
            vertical-align: -5px;
            margin-right: 10px;
          `}
        />
        Install Popper
      </div>
      <Bar>
        <LogoWrapper>
          <Logo src={npmLogo} draggable="false" />
        </LogoWrapper>
        <TextWrapper>npm i @popperjs/core</TextWrapper>
      </Bar>
      <Bar>
        <LogoWrapper>CDN</LogoWrapper>
        <TextWrapper>{UNPKG_CDN_URL}</TextWrapper>
      </Bar>
    </InstallBarContainer>
  </InstallBarStyled>
);

export default InstallBar;
