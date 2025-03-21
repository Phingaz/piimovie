import React, { createContext, TransitionStartFunction, useTransition } from 'react';
import { NavigationCtxProvider } from './Navigation';

export type TMainCtx = {
  isLoading: boolean;
  startTransition: TransitionStartFunction;
};

const MainCtx = createContext<TMainCtx | undefined>(undefined);

type MainCtxProviderProps = {} & React.PropsWithChildren<object>;

export function MainCtxProvider({ children }: MainCtxProviderProps) {
  const [isLoading, startTransition] = useTransition();

  const contextValue = { isLoading, startTransition };

  return (
    <MainCtx.Provider value={contextValue}>
      <NavigationCtxProvider>{children}</NavigationCtxProvider>
    </MainCtx.Provider>
  );
}

export const useMainCtx = () => {
  const context = React.useContext(MainCtx);
  if (!context) throw new Error('useMainCtx must be used within a MainCtxProvider');
  return context;
};

export default MainCtx;
