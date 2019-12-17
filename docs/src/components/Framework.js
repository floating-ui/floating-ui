import styled from '@emotion/styled';

export const media = {
  xs: '@media (min-width: 360px)',
  sm: '@media (min-width: 600px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 992px)',
  xl: '@media (min-width: 1200px)',
};

export const Container = styled.div`
  padding: 0 15px;
  max-width: 940px;
  margin: 0 auto;
`;
