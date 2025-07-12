'use client';
import React, { useCallback } from 'react';
import ImageComponent from '../utils/ImageComponent';
import { imageCardUrl, imageUrl } from '@/lib/utils';
import { Poster } from '@/app/_types/utils';
import { Button } from '../ui/button';
import ModalComponent from '../general/Modal';
import NextImage from 'next/image';

const ImageModalCard = ({ el }: { el: Poster }) => {
  const imgSrc = imageUrl(el.file_path);

  const handlePreload = useCallback(() => {
    if (typeof window !== 'undefined' && !document.querySelector(`link[rel="preload"][href="${imgSrc}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imgSrc;
      document.head.appendChild(link);
    }
  }, [imgSrc]);

  return (
    <ModalComponent
      className="w-[min(800px,90vw)] aspect-[3/4]"
      trigger={
        <Button onMouseEnter={handlePreload} className="w-full h-full p-0 rounded-lg m-0">
          <ImageComponent
            string={imageCardUrl(el.file_path)}
            title={el.file_path}
            className="w-full h-full aspect-[3/4] rounded-lg"
          />
        </Button>
      }
    >
      <NextImage
        fill
        alt={el.file_path}
        title={el.file_path}
        src={imgSrc}
        loading="lazy"
        className="w-full h-full object-cover object-center rounded-lg"
      />
    </ModalComponent>
  );
};

export default ImageModalCard;
