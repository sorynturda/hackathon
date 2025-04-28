import { useState, useEffect } from 'react';

export default function useModelLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);

  
  useEffect(() => {
    if (!isLoading) return;
    
   
    let interval;
    
    if (!modelReady) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (Math.random() * 2 + 0.5);
          return Math.min(next, 90);
        });
      }, 150);
    } else if (progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progress, modelReady]);

  const handleModelReady = () => {
    setModelReady(true);
  };

  return {
    isLoading,
    progress,
    handleModelReady,
    setIsLoading
  };
}