import React from "react";

const MovieDetailInfo = ({ title, info }: { title: string; info: string }) => {
  return (
    <span className="flex gap-2 font-[500] text-gray-300 text-[13px]">
      <p className="text-gray-400">{title}:</p>{" "}
      <p className="font-[600]">{info}</p>
    </span>
  );
};

export default MovieDetailInfo;
