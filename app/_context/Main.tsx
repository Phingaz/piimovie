import React, { createContext, TransitionStartFunction, useTransition } from 'react';
import { User } from 'better-auth';

export type TMainCtx = {
  user?: User;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
};

const MainCtx = createContext<TMainCtx | undefined>(undefined);

type MainCtxProviderProps = { user?: User } & React.PropsWithChildren<object>;

export function MainCtxProvider({ user, children }: MainCtxProviderProps) {
  const [isLoading, startTransition] = useTransition();
  const contextValue = { user, isLoading, startTransition };

  return <MainCtx.Provider value={contextValue}>{children}</MainCtx.Provider>;
}

export const useMainCtx = () => {
  const context = React.useContext(MainCtx);
  if (!context) throw new Error('useMainCtx must be used within a MainCtxProvider');
  return context;
};

export default MainCtx;
