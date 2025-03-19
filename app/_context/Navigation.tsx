import { useCycle } from "framer-motion";
import React, { createContext } from "react";
import useWindowDimensions from "../_hooks/useMediaQuery";

export type TNAvigationCtx = {
  mobileNav: boolean;
  toggleMobileNav: () => void;
};

const NavigationCtx = createContext<TNAvigationCtx | undefined>(undefined);

export function NavigationCtxProvider({ children }: React.PropsWithChildren) {
  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const { currentWindowWidth } = useWindowDimensions();
  const isMobile = currentWindowWidth < 768;

  const contextValue = {
    isMobile,
    mobileNav,
    toggleMobileNav,
  };

  return (
    <NavigationCtx.Provider value={contextValue}>
      {children}
    </NavigationCtx.Provider>
  );
}

export const useNavigationCtx = () => {
  const context = React.useContext(NavigationCtx);
  if (!context)
    throw new Error(
      "useNavigationCtx must be used within a NavigationCtxProvider"
    );
  return context;
};

export default NavigationCtx;
