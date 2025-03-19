import { ListingLoader } from "@/components/helpers/Loaders";
import React from "react";

const PageLoader = () => {
  return (
    <ListingLoader
      title="Movie Listing"
      description="Loading your movie listing, please wait..."
    />
  );
};

export default PageLoader;
