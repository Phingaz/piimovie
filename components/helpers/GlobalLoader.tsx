import { useMainCtx } from '@/app/_context/Main';
import React from 'react';

const GlobalLoader = () => {
  const { isLoading } = useMainCtx();

  return (
    <>
      {isLoading ? (
        <div className="absolute top-0 right-0 bg-black z-[1000] w-full h-[1000svh] overflow-hidden overflow-y-hidden"></div>
      ) : null}
    </>
  );
};

export default GlobalLoader;
