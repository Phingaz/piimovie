import Image, { ImageProps } from "next/image";
import React from "react";

type ImageComponentProps = Omit<ImageProps, "src" | "alt"> & {
  string?: string;
  title: string;
};

const ImageComponent = ({ string, title, ...props }: ImageComponentProps) => {
  return (
    <Image
      unoptimized
      src={string ? string : "/placeholder.png"}
      alt={title}
      width={0}
      height={0}
      className="rounded-lg object-cover transition-all ease-in-out duration-500 hover:scale-105 object-center hover:rounded-lg w-full h-full"
      {...props}
    />
  );
};

export default ImageComponent;
