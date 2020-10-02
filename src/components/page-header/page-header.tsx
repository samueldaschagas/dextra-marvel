import React from 'react';
import { Container } from '../container/container';
import Divider from '../divider';
import './page-header.scss';

type TPageHeaderProps = {
    title: string;
};

export function PageHeader({ title }: TPageHeaderProps) {
    return (
        <Container>
            <h2 className="title">{title}</h2>
            <Divider />
        </Container>
    );
}