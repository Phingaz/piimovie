import { runTimeInHourAndMin } from "@/lib/utils";
import { Clock } from "lucide-react";
import React from "react";

const RunTimeDetails = ({ runtime }: { runtime: number }) => {
  return (
    <span className="flex gap-1 font-[500] text-[13px]">
      <Clock size={20} />
      <p className="font-[600]">{runTimeInHourAndMin(runtime)}</p>
    </span>
  );
};

export default RunTimeDetails;
