import React from "react";
import { getMovieReviews } from "@/lib/queries";
import SectionTitle from "../utils/texts/SectionTitle";
import { ErrorMovieSection } from "../helpers/Error";
import EmptyList from "../utils/EmptyList";
import Image from "next/image";
import { formatDate, imageCardUrl } from "@/lib/utils";
import Ratings from "../utils/texts/Ratings";
import Comment from "./Comment";

const Reviews = async ({ id }: { id: number }) => {
  try {
    const response = await getMovieReviews({ id });
    if (!response.data) throw new Error(response.message);
    const reviews = response.data.results;

    return (
      <div className="md:max-h-[600px] overflow-y-auto pr-5 tiny-scrollbar">
        <SectionTitle>
          <>Reviews</>
        </SectionTitle>
        {reviews.length < 1 ? (
          <EmptyList
            type="reviews found"
            message="We couldn't find any reviews for this movie at the moment."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => {
              return (
                <div
                  key={review.id}
                  className="bg-gray-900 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={
                        review.author_details.avatar_path
                          ? imageCardUrl(review.author_details.avatar_path)
                          : "/placeholder.png"
                      }
                      width={50}
                      height={50}
                      alt={review.author}
                      className="object-cover object-center rounded-full aspect-square border border-gray-500/50"
                    />
                    <div>
                      <h3 className="font-medium text-sm">
                        {review.author_details.name ||
                          review.author_details.username}
                      </h3>
                      <Ratings
                        isReview
                        vote_average={review.author_details.rating ?? 0}
                      />
                    </div>
                    <div className="ml-auto text-sm text-gray-400">
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                  <Comment comment={review.content} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Reviews" />;
  }
};

export default Reviews;
