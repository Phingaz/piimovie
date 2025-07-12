import React from 'react';
import SectionTitle from '../utils/texts/SectionTitle';
import { getKeyWords } from '@/app/_queries/queries';
import { ListType } from '@/app/_types/utils';

const Keywords = async ({ id, type }: { id: number; type: ListType }) => {
  try {
    const response = await getKeyWords({ id, type });
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
  } catch {
    return null;
  }
};
export default Keywords;
