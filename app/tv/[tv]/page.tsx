import { getDetails } from '@/app/queries/queries';
import ErrorPageComponent from '@/components/helpers/Error';
import ShowComponent from '@/components/show/ShowComponent';
import { Metadata } from 'next';
import React from 'react';

const type = 'tv';

export async function generateMetadata({ params }: { params: Promise<{ tv: string }> }): Promise<Metadata> {
  try {
    const id = (await params).tv;
    const response = await getDetails({ id, type });

    if (!response.data) throw new Error(response.message);

    return {
      title: `${response.data.original_name} | Show Info`,
      description: response.data.overview || 'Find out more about this show.',
    };
  } catch {
    return {
      title: 'Error | Show Not Found',
      description: 'Something went wrong while fetching the show details.',
    };
  }
}

const Page = async ({ params }: { params: Promise<{ tv: string }> }) => {
  try {
    const id = (await params).tv;
    const response = await getDetails({ id, type });

    if (!response.data) throw new Error(response.message);

    return <ShowComponent type={type} show={response.data} />;
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default Page;
