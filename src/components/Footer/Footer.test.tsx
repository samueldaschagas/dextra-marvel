import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

function setup() {
  return render(<Footer />);
}

describe('Componente Footer', () => {
  test('renderiza componente', () => {
    const { getByTestId } = setup();

    expect(getByTestId('footer')).toBeTruthy();
  });

  test('renderiza elementos hr, footer e img', () => {
    const { container } = setup();

    const footerElement = container.querySelector('.footer');
    const hrElement = container.querySelector('hr');
    const imgElement = container.querySelector('img');

    expect(footerElement).toBeTruthy();
    expect(hrElement).toBeTruthy();
    expect(imgElement).toBeTruthy();
  });

  test('renderiza link com endereço da Dextra', () => {
    const { getByTestId } = setup();

    const dextraLink = getByTestId('dextra-link')

    expect(dextraLink.getAttribute('href')).toBe('https://dextra.com.br');
  });
});
