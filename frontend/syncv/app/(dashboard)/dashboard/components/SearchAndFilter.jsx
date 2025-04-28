"use client";
import React from "react";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-end">
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-black/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border-2 border-black/10 bg-white body-small
                   focus:border-accent focus:outline-none transition-colors hover:border-black/20"
        />
      </div>

      <div className="w-full sm:w-48">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full px-4 py-2 rounded-md border-2 border-black/10 bg-white body-small
                   focus:border-accent focus:outline-none transition-colors hover:border-black/20
                   appearance-none cursor-pointer
                   bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23666%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]
                   bg-[length:1.2em] bg-[right_0.8rem_center] bg-no-repeat"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="score-desc">Score (Highest)</option>
          <option value="score-asc">Score (Lowest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
