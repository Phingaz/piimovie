'use client';
import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';
import React from 'react';

type ImageComponentProps = Omit<ImageProps, 'src' | 'alt'> & {
  string?: string;
  title: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  sizes?: string;
};

const shimmerDataURL = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="600" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#1f2937" offset="20%" />
        <stop stop-color="#374151" offset="50%" />
        <stop stop-color="#1f2937" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="400" height="600" fill="#1f2937" />
    <rect id="r" width="400" height="600" fill="url(#g)" opacity="0.5" />
    <animateTransform xlink:href="#r" attributeName="transform" type="translate" values="-400 0;400 0;-400 0" dur="2s" repeatCount="indefinite"/>
  </svg>`,
).toString('base64')}`;

const ImageComponent = ({
  string,
  title,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}: ImageComponentProps) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const blurDataURL = string && string !== '/placeholder.png' ? shimmerDataURL : '/placeholder.png';

  return (
    <Image
      placeholder="blur"
      blurDataURL={blurDataURL}
      src={imageError ? '/placeholder.png' : string || '/placeholder.png'}
      alt={title}
      width={0}
      height={0}
      sizes={sizes}
      priority={priority}
      onLoad={handleImageLoad}
      onError={handleImageError}
      className={cn(
        'object-cover transition-all ease-in-out duration-500 hover:scale-105 object-center hover:rounded-lg size-full',
        !imageLoaded && 'animate-pulse',
        imageLoaded && 'animate-none',
        className,
      )}
      style={{ filter: imageLoaded ? 'none' : 'blur(8px)' }}
      {...props}
    />
  );
};

export default ImageComponent;
