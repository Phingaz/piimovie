import { ListingLoader } from "@/components/helpers/Loaders";
import React from "react";

const PageLoader = () => {
  return (
    <ListingLoader
      title="Search Result"
      description="Performing your search, please wait..."
    />
  );
};

export default PageLoader;
