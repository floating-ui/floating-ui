import React from 'react';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: flex;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Container = styled.div`
  flex: 0 0 33.3333333333%;
  padding: 20px;

  a {
    color: #fff;
    text-decoration: none;
  }
`;

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2rem 1.5rem -1.5rem rgba(33, 37, 41, 0.15),
    0 0 1.5rem 0.5rem rgba(33, 37, 41, 0.05);
  transition: 0.1s ease;
`;

const Title = styled.div`
  margin-top: 15px;
`;

const Description = styled.div`
  font-size: 12px;
`;

const ProductCard = ({ title, image, description, url }) => (
  <Container>
    <a href={url} target="_blank" rel="sponsored noopener noreferrer">
      <Image src={image} />
    </a>
    <Title>
      <a href={url} target="_blank" rel="sponsored noopener noreferrer">
        {title}
      </a>
    </Title>
    <Description>{description}</Description>
  </Container>
);

export { ProductCard, Grid };
