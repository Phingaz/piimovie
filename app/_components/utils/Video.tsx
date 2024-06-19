import { Loader } from "./Loader";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Queries from "@/app/_context/Queries";

export const Video = () => {
  const { video } = React.useContext(Queries);

  const { data, isPending, isError } = video;

  const [page, setPage] = React.useState(0);

  return (
    <div className="w-full h-[450px]">
      {isPending ? (
        <Loader />
      ) : isError ? (
        <p className="text-black text-center">
          Unable to load video trailer for this movie
        </p>
      ) : (
        <div className="relative w-full h-full group">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${data.results[page]?.key}`}
            title={data.results[page]?.name}
          ></iframe>
          <div className="absolute top-0 left-0 w-[50px] h-full hidden group-hover:flex z-20 justify-center items-center">
            <button
              className="w-full flex justify-center items-center"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 0}
            >
              <span className=" bg-black p-2 rounded-full">
                <ArrowLeft className="size-4 text-white" />
              </span>
            </button>
          </div>
          <div className="absolute top-0 right-0 w-[50px] h-full hidden group-hover:flex z-20 justify-center items-center">
            <button
              className="w-full flex justify-center items-center"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === data.results.length - 1}
            >
              <span className=" bg-black p-2 rounded-full">
                <ArrowRight className="size-4 text-white" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
