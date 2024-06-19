import React from "react";

const ErrorSection = () => {
  return (
    <p>
      Unable to Load this section, something went wrong. <br /> Try refreshing
      the page to fix the error
    </p>
  );
};
const InvalidMovieId = () => {
  return (
    <div className="min-h-[97.4svh] bg-bg grid place-content-center text-center text-white">
      <p>
        Invalid Movie ID. <br /> Please check the URL and try again
      </p>
    </div>
  );
};

export { ErrorSection, InvalidMovieId };
