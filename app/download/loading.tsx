import { DownloadLoader } from "@/components/helpers/Loaders";
import React from "react";

const PageLoader = () => {
  return (
    <DownloadLoader
      title="Download"
      description="Performing your search, please wait..."
    />
  );
};

export default PageLoader;
