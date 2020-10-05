import React from 'react';
import { Container } from '../Container';
import './PageHeader.scss';

type TPageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: TPageHeaderProps) {
  return (
    <Container>
      <h2 className="pageheader__title">{title}</h2>
      <hr className="pageheader__divider" />
    </Container>
  );
}
