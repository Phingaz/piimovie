import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import React from "react";

type ImageComponentProps = Omit<ImageProps, "src" | "alt"> & {
  string?: string;
  title: string;
  className?: string;
};

const ImageComponent = ({
  string,
  title,
  className,
  ...props
}: ImageComponentProps) => {
  return (
    <Image
      placeholder="blur"
      blurDataURL="/placeholder.png"
      unoptimized
      src={string ? string : "/placeholder.png"}
      alt={title}
      width={0}
      height={0}
      className={cn(
        "rounded-lg object-cover transition-all ease-in-out duration-500 hover:scale-105 object-center hover:rounded-lg w-full h-full",
        className
      )}
      {...props}
    />
  );
};

export default ImageComponent;
