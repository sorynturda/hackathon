import React from "react";

const EmptyState = ({ 
  title, 
  description, 
  imageSrc = null, 
  actionButton = null,
  className = ""
}) => {
  return (
    <div className={`p-8 text-center ${className}`}>
      {imageSrc && (
        <div className="mb-6 flex justify-center">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-70"
          />
        </div>
      )}
      
      {/* Placeholder pentru când nu avem încă imagine */}
      {!imageSrc && (
        <div className="mb-6 flex justify-center">
          <div className="w-48 h-48 bg-black/5 rounded-lg flex items-center justify-center">
            <div className="text-6xl text-black/20">📄</div>
          </div>
        </div>
      )}
      
      <h3 className="body font-semibold text-black mb-2">{title}</h3>
      <p className="body-small text-black/60 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionButton && (
        <div className="flex justify-center">
          {actionButton}
        </div>
      )}
    </div>
  );
};

// Empty states specifice pentru diferite secțiuni
export const EmptyStateNoMatches = ({ onCreateMatch }) => (
  <EmptyState
    imageSrc="/images/empty-states/nomatch.png"
    title="No matches yet"
    description="Start by uploading CVs and Job Descriptions, then run your first match to see candidates ranked by compatibility."
    actionButton={
      onCreateMatch && (
        <button
          onClick={onCreateMatch}
          className="bg-accent text-white px-6 py-3 rounded-md body hover:bg-black transition-colors"
        >
          Get Started
        </button>
      )
    }
  />
);

export const EmptyStateNoCVs = ({ onUploadCV }) => (
  <EmptyState
    imageSrc="/images/empty-states/nocv.png"
    title="No CVs uploaded"
    description="Upload your first CV to start building your candidate database. Drag and drop files or click to browse."
    actionButton={
      onUploadCV && (
        <button
          onClick={onUploadCV}
          className="bg-accent text-white px-6 py-3 rounded-md body hover:bg-black transition-colors"
        >
          Upload CV
        </button>
      )
    }
  />
);

export const EmptyStateNoJDs = ({ onUploadJD }) => (
  <EmptyState
    imageSrc="/images/empty-states/nojd.png"
    title="No Job Descriptions uploaded"
    description="Add your first job description to start matching candidates. Upload JDs in PDF, DOC, or DOCX format."
    actionButton={
      onUploadJD && (
        <button
          onClick={onUploadJD}
          className="bg-accent text-white px-6 py-3 rounded-md body hover:bg-black transition-colors"
        >
          Upload JD
        </button>
      )
    }
  />
);

export const EmptyStateSearchResults = ({ searchTerm, onClearSearch }) => (
  <EmptyState
    imageSrc="/images/empty-states/nomatch.png"
    title="No results found"
    description={`No matches found for "${searchTerm}". Try adjusting your search terms or filters.`}
    actionButton={
      onClearSearch && (
        <button
          onClick={onClearSearch}
          className="bg-black text-white px-6 py-3 rounded-md body hover:bg-black/80 transition-colors"
        >
          Clear Search
        </button>
      )
    }
  />
);

export const EmptyStateError = ({ message, onRetry }) => (
  <EmptyState
    title="Something went wrong"
    description={message || "We encountered an error while loading your data. Please try again."}
    actionButton={
      onRetry && (
        <button
          onClick={onRetry}
          className="bg-accent text-white px-6 py-3 rounded-md body hover:bg-black transition-colors"
        >
          Try Again
        </button>
      )
    }
  />
);

export default EmptyState;
