"use client";
import { Download, Link2 } from "lucide-react";
import React from "react";
import Queries from "../_context/Queries";
import useCustomParams from "../_hooks/useCustomParams";
import { Loader } from "../_components/utils/Loader";
import Pagination from "../_components/utils/Pagination";
import Search from "../_components/utils/Search";

const DownloadComponent = () => {
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

  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex md:justify-between md:items-center mb-8 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">{search ?? "Download"}</h1>
          <Search download />
        </div>
        {isError ? (
          <p className="text-xl font-bold text-center text-white">
            No torrents found, please refine your search
          </p>
        ) : (
          search && (
            <>
              <div className="grid grid-cols-1 gap-5 mb-5">
                {torrents?.map((el: any, i: number) => (
                  <div key={i} className="w-full bg-bg-light rounded-lg">
                    <div
                      key={i}
                      className="flex md:flex-row flex-col md:justify-between md:items-start md:gap-2 gap-1 transition p-2 md:p-3 rounded-lg bg-accent-brighter bg-opacity-20 hover:scale-[1.02] ease-in-out"
                    >
                      <TorrentInfo info={el?.name} />
                      <div className="flex mt-5md:mt-0 gap-0 md:gap-5">
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="grid grid-cols-2 gap-3 items-center">
                            <TorrentInfo title="Seeders" info={el?.seeders} />
                            <TorrentInfo title="Leechers" info={el?.leechers} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 items-center">
                            <TorrentInfo title="Size" info={el?.size} />
                            <TorrentInfo title="Date" info={el?.date} />
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <a
                            className="flex justify-center gap-3 items-center rounded-md text-accent-brighter/50 transition hover:text-accent-brighter cursor-pointer"
                            href={el?.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Link2 />
                          </a>
                          <a
                            className="flex justify-center gap-3 items-center cursor-pointer transition text-accent-brighter/50 hover:text-accent-brighter"
                            href={el?.magnet}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default DownloadComponent;

const TorrentInfo = ({ title, info }: { title?: string; info: string }) => {
  return (
    <p className="text-sm break-all font-[500]">
      {title ? `${title}: ${info}` : info}
    </p>
  );
};
