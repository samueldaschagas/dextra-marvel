import React from 'react';
import "./container.scss";

type TContainerProps = {
    children:  React.ReactNode;
};

export function Container({children}: TContainerProps) {
    return (
        <div className="container">
            {children}
        </div>
    )
}
