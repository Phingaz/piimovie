import { useCycle } from "framer-motion";
import React, { createContext } from "react";
import { QueriesCtxProvider } from "./Queries";
import useWindowDimensions from "../_hooks/useMediaQuery";
import useLocalStorage from "../_hooks/useLocalStorage";
import { Movie } from "../types";

export type TMainCtx = {
  isMobile: boolean;
  mobileNav: boolean;
  toggleMobileNav: () => void;
  // fav
  favMovies: Movie[];
  manageFav: (movie: Movie) => void;
};

const Main = createContext<TMainCtx>({
  isMobile: false,
  mobileNav: false,
  toggleMobileNav: () => {},
  // fav
  favMovies: [],
  manageFav: () => {},
});

export function MainCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const { currentWindowWidth } = useWindowDimensions();
  const isMobile = currentWindowWidth < 768;

  const [favMovies, setFavMovies] = useLocalStorage(
    "@favMovies",
    [] as Movie[]
  );
  const manageFav = (movie: Movie) => {
    const isFav = favMovies.find((favMovie) => favMovie.id === movie.id);

    if (isFav) {
      setFavMovies((prevFavMovies) =>
        prevFavMovies.filter((favMovie) => favMovie.id !== movie.id)
      );
    } else {
      setFavMovies((prevFavMovies) => [...prevFavMovies, movie]);
    }
  };

  const contextValue = {
    isMobile,
    mobileNav,
    toggleMobileNav,
    // fav
    favMovies,
    manageFav,
  };

  return (
    <Main.Provider value={contextValue}>
      <QueriesCtxProvider>{children}</QueriesCtxProvider>
    </Main.Provider>
  );
}

export default Main;
