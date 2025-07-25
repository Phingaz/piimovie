'use client';
import React, { useState } from 'react';
import ImageComponent from '../utils/ImageComponent';
import { imageCardUrl, imageUrl } from '@/lib/utils';
import { Poster } from '@/app/_types/utils';
import { Button } from '../ui/button';
import ModalComponent from '../general/Modal';

const ImageModalCard = ({ el, i, images }: { el: Poster; i: number; images: Poster[] }) => {
  const [index, setIndex] = useState(i);
  const img = images[index];

  const goPrev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <ModalComponent
      className="w-[min(1000px,90svw)] aspect-[3/4]"
      trigger={
        <Button className="block w-full h-full p-0 rounded m-0">
          <ImageComponent
            title={el.file_path}
            string={imageCardUrl(el.file_path)}
            className="w-full h-full aspect-square rounded hover:rounded"
          />
        </Button>
      }
    >
      <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          aria-label="Previous image"
          className="rounded-full bg-gray-800/50"
        >
          &#8592;
        </Button>
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          aria-label="Next image"
          className="rounded-full bg-gray-800/50"
        >
          &#8594;
        </Button>
      </span>
      <ImageComponent
        fill
        title={img.file_path}
        string={imageUrl(img.file_path, 'original')}
        className="size-full rounded object-cover hover:scale-100"
      />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded">
        {index + 1} / {images.length}
      </span>
    </ModalComponent>
  );
};

export default ImageModalCard;
