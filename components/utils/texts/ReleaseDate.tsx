import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import React from "react";

const ReleaseDate = ({ release_date }: { release_date: string }) => {
  const cleanDate = formatDate(release_date);

  return (
    <span className="flex gap-1 items-center">
      <Calendar size={20} />
      <p className="text-sm">{cleanDate}</p>
    </span>
  );
};

export default ReleaseDate;
