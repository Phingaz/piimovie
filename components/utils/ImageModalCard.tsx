'use client';
import React from 'react';
import ImageComponent from './ImageComponent';
import { imageCardUrl, imageUrl } from '@/lib/utils';
import { Poster } from '@/app/types';
import useModal from '@/app/_hooks/useModal';
import Modal from './Modal';
import Image from 'next/image';

const ImageModalCard = ({ el }: { el: Poster }) => {
  const imageModal = useModal();

  return (
    <div className="w-full h-full">
      <button onClick={imageModal.open} className="cursor-pointer">
        <ImageComponent
          string={el.file_path ? imageCardUrl(el.file_path) : '/placeholder.png'}
          title={el.file_path}
          className="w-full h-full aspect-[3/4]"
        />
      </button>

      <Modal isOpen={imageModal.isOpen} onClose={imageModal.close} title="Image Modal" className="h-[70svh] w-[70svw]">
        <Image
          fill
          alt={el.file_path}
          title={el.file_path}
          src={el.file_path ? imageUrl(el.file_path) : '/placeholder.png'}
          className="w-full h-full object-cover object-center rounded-lg"
        />
      </Modal>
    </div>
  );
};

export default ImageModalCard;
