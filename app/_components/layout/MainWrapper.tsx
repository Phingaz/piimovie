"use client";
import Queries from "@/app/_context/Queries";
import React from "react";
import { PageLoader } from "../utils/Loader";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getLandingMovies } = React.useContext(Queries);
  const { isLoading } = getLandingMovies;

  if (isLoading) return <PageLoader />;

  return <React.Fragment>{children}</React.Fragment>;
};

export default MainWrapper;
