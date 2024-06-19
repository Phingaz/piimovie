import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full grid place-content-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

const SectionLoader = () => {
  return (
    <React.Fragment>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          className={`min-w-0 min-h-[350px] grow-0 shrink-0 basis-[62%] sm:basis-[47%] aspect-[2.2/3] md:basis-[31%] lg:basis-[27%] relative overflow-clip bg-accent animate-pulse rounded-lg ${
            index === 0 ? "pl-0" : "pl-[var(--slide-spacing)]"
          }`}
          key={index}
        ></div>
      ))}
    </React.Fragment>
  );
};

const PageLoader = () => {
  return (
    <div className="w-full h-[100svh] bg-black grid place-content-center text-white">
      <div className="loader"></div>
      <p className="animate-pulse font-bold">Please wait</p>
    </div>
  );
};

export { Loader, SectionLoader, PageLoader };
