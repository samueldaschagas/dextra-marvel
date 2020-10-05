import React from 'react';
import './Container.scss';

type TContainerProps = {
  children: React.ReactNode;
  removePadding?: boolean;
};

export function Container({ children, removePadding }: TContainerProps) {
  return (
    <div className="container" style={removePadding ? { padding: 0 } : {}}>
      {children}
    </div>
  );
}
