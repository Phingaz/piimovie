import React, { createContext, TransitionStartFunction, useTransition } from 'react';
import { NavigationCtxProvider } from './Navigation';
import { FavoriteCtxProvider } from './Favorite';

export type TMainCtx = {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
};

const MainCtx = createContext<TMainCtx | undefined>(undefined);

export function MainCtxProvider({ children }: React.PropsWithChildren<object>) {
  const [isLoading, startTransition] = useTransition();

  const contextValue = { isLoading, startTransition };

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
  if (!context) throw new Error('useMainCtx must be used within a MainCtxProvider');
  return context;
};

export default MainCtx;
