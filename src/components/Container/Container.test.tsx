import React from 'react';
import { render } from '@testing-library/react';
import { Container } from './Container';

test('renderiza componente Container', () => {
  const { queryByTestId } = render(
    <Container>
      <div>Teste</div>
    </Container>
  );

  expect(queryByTestId('container')).toBeTruthy();
});

test('renderiza componente Container passando prop removePadding', () => {
  const { queryByTestId } = render(
    <Container removePadding>
      <div>Teste com removePadding</div>
    </Container>
  );

  const container = queryByTestId('container');
  const style = window.getComputedStyle(container);

  expect(style.padding).toBe("0px");
});
