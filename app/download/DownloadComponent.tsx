import React from 'react';
import { searchMoviesForDownload } from '../queries/queries';
import SearchBar from '@/components/utils/SearchComponent';
import TorrentItem from '@/components/utils/TorrentCard';
import SimplePagination from '@/components/utils/buttons/SimplePagination';
import { SearchXIcon } from 'lucide-react';
import PageTitle from '@/components/utils/texts/PageTitle';
import PageSection from '@/components/utils/texts/PageSection';

const DownloadComponent = async ({ page, q }: { page: string; q: string }) => {
  try {
    if (!q) throw new Error('Empty query');

    const result = await searchMoviesForDownload({
      page: Number(page) || 1,
      query: q,
    });

    if (!result.data) throw new Error(result.message);

    const list = result.data?.data;

    return (
      <div className="container mx-auto mt mt-[100px] py-10 px-3 md:px-[2rem]">
        <PageSection>
          <PageTitle>Download</PageTitle>
          <SearchBar path="download" />
        </PageSection>

        <div className="grid md:gap-y-5 gap-3">
          {list?.map((el) => {
            return <TorrentItem key={el.hash} torrent={el} />;
          })}
        </div>
        <SimplePagination disabled={!q} currentPage={Number(page)} />
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto mt- mt-[100px] py-10 px-3 md:px-[2rem]">
        <PageSection>
          <PageTitle> Download</PageTitle>
          <SearchBar path="download" />
        </PageSection>
        <EmptySearch />
        <SimplePagination disabled={!q} currentPage={Number(page)} />
      </div>
    );
  }
};

const EmptySearch = () => {
  return (
    <div className="h-[calc(100svh-333px)] flex justify-center items-center flex-col border border-dashed border-gray-500/50 py-20 rounded-md bg-gray-900">
      <SearchXIcon size={70} className="mb-3 text-gray-400" />
      <h3 className="text-lg font-medium text-white mb-1">Empty result</h3>
      <p className="text-gray-400 max-w-md text-center">No torrents found, try refining your search</p>
    </div>
  );
};

export default DownloadComponent;
