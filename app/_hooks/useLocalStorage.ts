import React from 'react';

const useLocalStorage = <T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    }
    return initialValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export default useLocalStorage;
