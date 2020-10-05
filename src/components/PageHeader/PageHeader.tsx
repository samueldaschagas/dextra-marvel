import React from 'react';
import './PageHeader.scss';

type TPageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: TPageHeaderProps) {
  return (
    <div className="pageheader">
      <h2 className="pageheader__title">{title}</h2>
      <hr className="pageheader__divider" />
    </div>
  );
}
