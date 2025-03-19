"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "cursor-pointer flex items-center gap-2 text-main hover:text-main/80 transition text-sm font-[500] w-fit outline-0 ring-0 border-0 bg-black/50 px-2 py-1 rounded-sm",
        className
      )}
    >
      <ArrowLeft size={20} color="currentColor" />
      Go back
    </button>
  );
};

export default GoBack;
