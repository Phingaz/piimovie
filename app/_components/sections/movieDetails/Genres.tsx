import { Genre } from "@/app/types";
import React from "react";

const Genres = ({ genres }: { genres: Genre[] }) => {
  return (
    <div className="flex justify-between w-full items-center">
      <span className="flex flex-wrap gap-3">
        {genres?.map((el) => (
          <p
            key={el.id}
            className="text-gray-700 text-justify text-sm bg-white py-1 px-2 rounded-md font-semibold"
          >
            {el.name}
          </p>
        ))}
      </span>
    </div>
  );
};

export default Genres;
