import ErrorPageComponent from "@/components/helpers/Error";
import MovieComponent from "@/components/movie/MovieComponent";
import { getMovieInfo } from "@/lib/queries";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ movie: string }>;
}): Promise<Metadata> {
  try {
    const id = (await params).movie;
    const response = await getMovieInfo({ id });

    if (!response.data) throw new Error(response.message);

    return {
      title: `${response.data.title} | Movie Info`,
      description: response.data.overview || "Find out more about this movie.",
    };
  } catch {
    return {
      title: "Error | Movie Not Found",
      description: "Something went wrong while fetching the movie details.",
    };
  }
}

const Page = async ({ params }: { params: Promise<{ movie: string }> }) => {
  try {
    const id = (await params).movie;
    const response = await getMovieInfo({ id });

    if (!response.data) throw new Error(response.message);

    return <MovieComponent movie={response.data} />;
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default Page;
