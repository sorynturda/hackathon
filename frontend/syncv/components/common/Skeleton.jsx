import React from "react";

const Skeleton = ({ 
  width = "100%", 
  height = "1rem", 
  className = "",
  rounded = "rounded-md"
}) => {
  return (
    <div
      className={`bg-black/10 animate-pulse ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard = ({ className = "" }) => (
  <div className={`border border-black/10 rounded-lg p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton height="1.5rem" width="60%" />
      <Skeleton height="1rem" width="40%" />
      <Skeleton height="1rem" width="80%" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton height="1rem" width="30%" />
        <Skeleton height="2rem" width="5rem" rounded="rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonStatsCard = ({ className = "" }) => (
  <div className={`border border-black/10 rounded-lg p-6 text-center ${className}`}>
    <Skeleton height="1rem" width="60%" className="mx-auto mb-4" />
    <Skeleton height="2.5rem" width="4rem" className="mx-auto" />
  </div>
);

export const SkeletonMatchCard = ({ className = "" }) => (
  <div className={`border border-black/10 rounded-lg p-4 ${className}`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex-1">
        <Skeleton height="1.25rem" width="70%" className="mb-2" />
        <Skeleton height="1rem" width="50%" />
      </div>
      <div className="ml-4">
        <Skeleton height="2rem" width="3rem" rounded="rounded-full" />
      </div>
    </div>
    <div className="flex justify-between items-center">
      <Skeleton height="0.875rem" width="40%" />
      <div className="flex gap-2">
        <Skeleton height="2rem" width="4rem" rounded="rounded-md" />
        <Skeleton height="2rem" width="4rem" rounded="rounded-md" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ 
  count = 3, 
  SkeletonComponent = SkeletonCard,
  className = ""
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonComponent key={i} />
    ))}
  </div>
);

export default Skeleton;
