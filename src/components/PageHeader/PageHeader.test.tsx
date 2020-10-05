import { render } from '@testing-library/react';
import React from 'react';
import { PageHeader } from './PageHeader';

test('renderiza PageHeader com title passado em prop', () => {
  const { getByText } = render(<PageHeader title="Comics" />);

  expect(getByText('Comics')).toBeInTheDocument();
});

test('renderiza elemento hr em PageHeader', () => {
  const { container } = render(<PageHeader title="Comics" />);
  const hrElement = container.querySelector('hr');

  expect(hrElement).toBeTruthy();
});
