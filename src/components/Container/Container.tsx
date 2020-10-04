import React from 'react';
import './Container.scss';

type TContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: TContainerProps) {
  return <div className="container">{children}</div>;
}
