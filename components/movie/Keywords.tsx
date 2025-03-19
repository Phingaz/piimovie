import React from "react";
import { getMovieKeyWords } from "@/lib/queries";
import SectionTitle from "../utils/texts/SectionTitle";

const MovieKeywords = async ({ id }: { id: number }) => {
  try {
    const response = await getMovieKeyWords({ id });
    if (!response.data) throw new Error(response.message);
    const keywords = response.data.keywords;

    if (keywords.length < 1) return null;

    return (
      <div className="w-full relative flex gap-2 flex-col">
        <SectionTitle className="mb-0">
          <>Keywords</>
        </SectionTitle>
        <div className="flex-wrap flex gap-2">
          {keywords.map((el) => (
            <span
              key={el.id}
              className="capitalize border border-gray-500 text-sm rounded-sm text-gray-400 px-[6px] py-[3px] bg-black/20"
            >
              {el.name}
            </span>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default MovieKeywords;
