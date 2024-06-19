import { useCycle } from "framer-motion";
import React, { createContext } from "react";
import { QueriesCtxProvider } from "./Queries";

export type TMainCtx = {
  isMobile: boolean;
  mobileNav: boolean;
  toggleMobileNav: () => void;
};

const Main = createContext<TMainCtx>({
  isMobile: false,
  mobileNav: false,
  toggleMobileNav: () => {},
});

export function MainCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const isMobile = window.innerWidth < 768;

  const contextValue = {
    isMobile,
    mobileNav,
    toggleMobileNav,
  };

  return (
    <Main.Provider value={contextValue}>
      <QueriesCtxProvider>{children}</QueriesCtxProvider>
    </Main.Provider>
  );
}

export default Main;
