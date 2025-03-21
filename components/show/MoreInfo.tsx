import { Flag, Globe, CircleCheck, MessageCircle, Building, MapPin, FileType } from 'lucide-react';
import SectionTitle from '../utils/texts/SectionTitle';
import { ShowDetail } from '@/app/types/show';
import CreatorCard from './CreatorCard';
import NetworkBadge from './Networks';

const MoreInfo = ({ show }: { show: ShowDetail }) => {
  return (
    <div className="p-4 bg-background rounded-md border border-gray-500/50 col-span-2">
      <SectionTitle>
        <>Show Information</>
      </SectionTitle>
      <div className="grid md:grid-cols-3 md:gap-5 gap-0 mt-2">
        <div className="flex flex-col col-span-1">
          {/* Origin Country */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Flag size={16} />
            <span className="font-medium">Origin:</span>
            <span>{show?.origin_country.join(', ')}</span>
          </div>

          {/* Original Language */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Globe size={16} />
            <span className="font-medium">Language:</span>
            <span>{show?.original_language === 'en' ? 'English' : show?.original_language}</span>
          </div>

          {/* Status */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <CircleCheck size={16} />
            <span className="font-medium">Status:</span>
            <span>{show?.status}</span>
          </div>

          {/* Type */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <FileType size={16} />
            <span className="font-medium">Type:</span>
            <span>{show?.type}</span>
          </div>
        </div>

        <div className="flex flex-col col-span-2">
          {/* Spoken Languages */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <MessageCircle size={16} />
            <span className="font-medium">Spoken Languages:</span>
            <span>{show?.spoken_languages?.map((l) => l.name).join(', ')}</span>
          </div>

          {/* Production Countries */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <MapPin size={16} />
            <span className="font-medium">Countries:</span>
            <span>{show?.production_countries?.map((c) => c.name).join(', ')}</span>
          </div>

          {/* Production Companies */}
          <div className="flex items-start gap-1 p-1 text-[13px]">
            <Building size={16} />
            <span className="font-medium">Companies:</span>
            <span>{show?.production_companies?.map((c: { name: string }) => c.name).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-16 mt-4 items-center">
        {/* creators */}
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">Creators:</span>
          <div className="flex gap-3 items-center flex-wrap">
            {show.created_by.map((creator) => {
              return <CreatorCard key={creator.credit_id} creator={creator} />;
            })}
          </div>
        </div>
        {/* networks */}
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">Networks:</span>
          <div className="flex gap-3 items-center flex-wrap">
            {show.networks.map((network) => {
              return <NetworkBadge key={network.id} network={network} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfo;
