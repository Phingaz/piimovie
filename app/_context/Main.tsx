import React, { createContext } from "react";
import { NavigationCtxProvider } from "./Navigation";
import { FavoriteCtxProvider } from "./Favorite";

export type TMainCtx = object;

const MainCtx = createContext<TMainCtx | undefined>(undefined);

export function MainCtxProvider({ children }: React.PropsWithChildren<object>) {
  const contextValue = {};

  return (
    <MainCtx.Provider value={contextValue}>
      <NavigationCtxProvider>
        <FavoriteCtxProvider>{children}</FavoriteCtxProvider>
      </NavigationCtxProvider>
    </MainCtx.Provider>
  );
}

export const useMainCtx = () => {
  const context = React.useContext(MainCtx);
  if (!context)
    throw new Error("useMainCtx must be used within a MainCtxProvider");
  return context;
};

export default MainCtx;
