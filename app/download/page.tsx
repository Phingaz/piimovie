"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const Download = () => {
  const title = useSearchParams().get("title");
  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <h1 className="mb-8 text-4xl font-bold">{title}</h1>
        <div className="grid grid-cols-1 gap-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-bg-dark p-4 rounded-lg border">
              <div className="w-full bg-bg-light rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Download;
