"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePrevNextButtons } from "@/app/_hooks/useCarousel";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";

const CarouselBtns = ({
  isLanding,
  emblaApi,
  hideButtons,
}: {
  hideButtons?: boolean;
  isLanding?: boolean;
  emblaApi: EmblaCarouselType | undefined;
}) => {
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (hideButtons) return null;

  return (
    <div
      className={cn(
        "flex gap-2 items-center w-fit absolute z-1",
        isLanding
          ? "md:right-20 md:-top-[52px] right-0 -top-20"
          : "right-0 -top-[42px]"
      )}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        className={cn(
          "cursor-pointer rounded-sm p-[4px] bg-gray-200 disabled:bg-gray-800",
          isLanding ? "scale-100" : "scale-80"
        )}
      >
        <ArrowLeft
          size={20}
          className={`${prevBtnDisabled ? "text-gray-600" : "text-gray-700"}`}
        />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className={cn(
          "cursor-pointer rounded-sm p-[4px] bg-gray-200 disabled:bg-gray-800",
          isLanding ? "scale-100" : "scale-80"
        )}
      >
        <ArrowRight
          size={20}
          className={`${nextBtnDisabled ? "text-gray-600" : "text-gray-700"}`}
        />
      </motion.button>
    </div>
  );
};

export default CarouselBtns;
