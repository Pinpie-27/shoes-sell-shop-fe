import React from 'react';

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Img: React.FC<ImgProps> = ({ src, alt = '', width = '100%', height = '100%' }) => (
    <img src={src} alt={alt} width={width} height={height} />
);
