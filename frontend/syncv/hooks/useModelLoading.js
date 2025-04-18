import { useState, useEffect } from 'react';

export default function useModelLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);

  // Simulate realistic loading with proper timing
  useEffect(() => {
    if (!isLoading) return;
    
    // This is a simulation of asset loading
    // In a production app, you might track real loading progress
    let interval;
    
    if (!modelReady) {
      interval = setInterval(() => {
        setProgress(prev => {
          // Cap progress at 90% until the model is actually ready
          // This prevents showing 100% when the model isn't visible yet
          const next = prev + (Math.random() * 2 + 0.5);
          return Math.min(next, 90);
        });
      }, 150);
    } else if (progress < 100) {
      // Once model is ready, quickly complete to 100%
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            // Delay the final completion to ensure smooth transition
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

  // Function to call when the 3D model is actually ready to be shown
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