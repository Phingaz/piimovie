import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";

const SectionTitle = ({
  children,
  className,
}: {
  className?: string;
  children: ReactElement;
}) => {
  return (
    <h2 className={cn("mb-3 text-lg md:text-xl font-semibold", className)}>
      {children}
    </h2>
  );
};

export default SectionTitle;
