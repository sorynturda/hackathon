"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const MatchList = ({
  matches,
  searchTerm,
  sortOption,
  loading,
  onViewMatch,
}) => {
  const filteredMatches = matches
    .filter(
      (match) =>
        match.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "score-desc":
          return b.matchScore - a.matchScore;
        case "score-asc":
          return a.matchScore - b.matchScore;
        case "date-desc":
          return new Date(b.submittedDate) - new Date(a.submittedDate);
        case "date-asc":
          return new Date(a.submittedDate) - new Date(b.submittedDate);
        case "name-desc":
          return b.candidateName.localeCompare(a.candidateName);
        case "name-asc":
          return a.candidateName.localeCompare(b.candidateName);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="bg-white flex flex-col h-full">
        <div className="p-4 sm:p-6 border-b-2 border-black">
          <h2 className="body">List of Candidates</h2>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="body-small text-black/60 mt-2">Loading matches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="p-4 sm:p-6 border-b-2 border-black">
        <h2 className="body">List of Candidates</h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="divide-y-2 divide-black">
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id || match.matchId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
            >
              <div className="flex-1 md:flex-[2_2_0%]">
                <div className="body font-semibold mb-1">
                  {match.isViewed ? (
                    match.candidateName
                  ) : (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                      {match.candidateName}
                    </div>
                  )}
                </div>
                <p className="body-small text-black/60 mb-3 md:mb-0">
                  Submitted date: {match.submittedDate}
                </p>

                {onViewMatch ? (
                  <button
                    onClick={() => onViewMatch(match.matchId || match.id)}
                    className="inline-block bg-accent text-white px-4 py-2 rounded-md body-small hover:bg-black transition-colors mt-2 md:hidden"
                  >
                    View
                  </button>
                ) : (
                  <Link
                    href={`/matches/${match.matchId || match.id}`}
                    className="inline-block bg-accent text-white px-4 py-2 rounded-md body-small hover:bg-black transition-colors mt-2 md:hidden"
                  >
                    View
                  </Link>
                )}
              </div>

              <div className="flex-1 md:text-center">
                <p className="body">{match.jobPosition}</p>
                <p className="body-small text-black/60">Job Position</p>
              </div>

              <div className="flex-1 md:text-right">
                <p
                  className={`h3 ${
                    match.matchScore > 70
                      ? "text-green-600"
                      : match.matchScore > 40
                      ? "text-black"
                      : "text-red-600"
                  }`}
                >
                  {match.matchScore}%
                </p>
                <p className="body-small text-black/60">Match Score</p>
              </div>

              {onViewMatch ? (
                <button
                  onClick={() => onViewMatch(match.matchId || match.id)}
                  className="hidden md:inline-block bg-accent text-white px-6 py-2 rounded-md body-small hover:bg-black transition-colors"
                >
                  View
                </button>
              ) : (
                <Link
                  href={`/matches/${match.matchId || match.id}`}
                  className="hidden md:inline-block bg-accent text-white px-6 py-2 rounded-md body-small hover:bg-black transition-colors"
                >
                  View
                </Link>
              )}
            </motion.div>
          ))}

          {filteredMatches.length === 0 && (
            <div className="p-8 text-center body text-black/50">
              {searchTerm
                ? "No matches found for your search criteria."
                : "No matches found. Run a match by clicking 'Run Match' in CV or JD Manager."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
