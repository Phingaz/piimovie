"use client";
import { CloudDownloadIcon, FileOutputIcon } from "lucide-react";
import React from "react";
import Queries from "../_context/Queries";
import useCustomParams from "../_hooks/useCustomParams";
import { Loader } from "../_components/utils/Loader";
import Pagination from "../_components/utils/Pagination";
import Search from "../_components/utils/Search";

const Download = () => {
  const { search } = useCustomParams();
  const { torrent } = React.useContext(Queries);
  const { data, isLoading, isError } = torrent;
  const torrents = data?.data;

  if (isLoading)
    return (
      <div className="w-full min-h-[97.4svh] bg-bg flex justify-center items-center">
        <Loader />
      </div>
    );

  if (isError || torrents?.length === 0)
    return (
      <div>
        <p className="text-3xl font-bold text-center">
          No torrents found, please refine your search
        </p>
      </div>
    );

  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{search ?? "Download"}</h1>
          <Search download />
        </div>
        {search && (
          <>
            <div className="grid grid-cols-1 gap-5 mb-5">
              {torrents?.map((el: any, i: number) => (
                <div key={i} className="w-full bg-bg-light rounded-lg">
                  <div
                    key={i}
                    className="flex md:flex-row flex-col md:justify-between md:items-center md:gap-2 gap-1 transition p-2 rounded-lg bg-accent-brighter bg-opacity-20 hover:scale-[1.02] ease-in-out"
                  >
                    <p className="flex-wrap bre text-sm font-semibold flex-[7]">
                      {el?.name}
                    </p>
                    <p className="flex-wrap text-sm bre font-semibold flex-[3]">
                      Seeders: {el?.seeders}
                    </p>
                    <p className="flex-wrap text-sm bre font-semibold flex-[3]">
                      Leechers: {el?.leechers}
                    </p>
                    <p className="flex-wrap bre text-xs font-semibold flex-[2]">
                      Size: {el?.size}
                    </p>
                    <p className="flex-wrap bre text-xs font-semibold flex-[3]">
                      Date: {el?.date}
                    </p>
                    <a
                      className="flex justify-center gap-3 items-center flex-[1] rounded-md text-accent-brighter/50 transition hover:text-accent-brighter px-1 md:py-0 py-1 cursor-pointer"
                      href={el?.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <FileOutputIcon />
                      </span>
                    </a>
                    <a
                      className="flex justify-center gap-3 items-center flex-[1] cursor-pointer transition rounded-md text-accent-brighter/50 hover:text-accent-brighter"
                      href={el?.magnet}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        <CloudDownloadIcon />
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
