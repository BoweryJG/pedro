import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Dr. Greg Pedro - Staten Island Advanced Dentistry`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};