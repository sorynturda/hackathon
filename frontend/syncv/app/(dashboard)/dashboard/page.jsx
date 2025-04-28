"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Layout from "../../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import StatsCard from "./components/StatsCard";
import MatchList from "./components/MatchList";
import SearchAndFilter from "./components/SearchAndFilter";
import FileUploadModal from "./components/FileUploadModal";
import Portal from "@/components/common/Portal";
import { useCVApi, useJDApi } from "@/lib/api";
import { useMatchApi } from "@/lib/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [cvCount, setCvCount] = useState(0);
  const [jdCount, setJdCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("score-desc");

  const { getAllMyCVs } = useCVApi();
  const { getAllMyJDs } = useJDApi();
  const { getAllMatches, deleteMatch, deleteAllMatches } = useMatchApi();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [cvsResponse, jdsResponse] = await Promise.all([
        getAllMyCVs(),
        getAllMyJDs(),
      ]);

      setCvCount(cvsResponse.data.length);
      setJdCount(jdsResponse.data.length);

      try {
        const matchesResponse = await getAllMatches();
        console.log("Backend matches data:", matchesResponse);

        const formattedMatches = matchesResponse.map((match) => ({
          id: match.id,
          matchId: match.id.toString(),
          cvId: match.cvId,
          jdId: match.jdId,
          cvName: match.candidateName,
          jdName: match.position,
          candidateName: match.candidateName,
          jobPosition: match.position,
          submittedDate: new Date(match.matchDate).toLocaleDateString(),
          matchScore: Math.round(match.score * 10),
          isViewed: false,
          missingSkills: match.missingSkills || [],
          matchingSkills: match.matchingSkills || [],
          reasoning: match.reasoning || "",
        }));

        setMatches(formattedMatches);
        setMatchCount(formattedMatches.length);
      } catch (error) {
        console.error("Error fetching matches:", error);

        const testMatches = generateTestMatches(
          cvsResponse.data,
          jdsResponse.data
        );
        setMatches(testMatches);
        setMatchCount(testMatches.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTestMatches = (cvs, jds) => {
    if (!cvs.length || !jds.length) return [];

    const testMatches = [];
    for (let i = 0; i < Math.min(cvs.length * jds.length, 20); i++) {
      const cv = cvs[i % cvs.length];
      const jd = jds[Math.floor(i / cvs.length) % jds.length];

      testMatches.push({
        id: i + 1,
        matchId: `match-${i + 1}`,
        cvId: cv.id,
        jdId: jd.id,
        cvName: cv.name || "Unnamed CV",
        jdName: jd.name || "Unnamed Job Description",
        candidateName: extractCandidateName(cv.name || "Unnamed"),
        jobPosition: extractJobPosition(jd.name || "Job Position"),
        submittedDate: new Date().toLocaleDateString(),
        matchScore: Math.floor(Math.random() * 60) + 40,
        isViewed: false,
      });
    }

    return testMatches;
  };

  const extractCandidateName = (fileName) => {
    const nameParts = fileName.split(/[_\.-]/);
    if (nameParts.length >= 2) {
      return `${nameParts[0]} ${nameParts[1]}`
        .replace(/CV|Resume|cv|resume/g, "")
        .trim();
    }
    return fileName;
  };

  const extractJobPosition = (fileName) => {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/_/g, " ")
      .replace(/job description|JD|jd/gi, "")
      .trim();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewMatch = (matchId) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.matchId === matchId ? { ...match, isViewed: true } : match
      )
    );

    window.location.href = `/matches/${matchId}`;
  };

  const handleDeleteMatch = (match) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMatch) return;

    try {
      await deleteMatch(selectedMatch.id);
      setMatches(matches.filter((match) => match.id !== selectedMatch.id));
      setMatchCount((prev) => prev - 1);
      setShowDeleteModal(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error(`Error deleting match ID: ${selectedMatch.id}`, error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedMatch(null);
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await deleteAllMatches();
      setMatches([]);
      setMatchCount(0);
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Error deleting all matches:", error);
    }
  };

  const handleCancelDeleteAll = () => {
    setShowDeleteAllModal(false);
  };

  return (
    <div className="w-full">
      <Layout className="">
        <div className="col-start-1 col-span-12 lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6 mb-6 lg:mb-12">
          <StatsCard title="CV Collection" count={cvCount} />
          <StatsCard title="JD Collection" count={jdCount} />
          <StatsCard title="Matches Collection" count={matchCount} />
        </div>

        <div className="col-start-1 col-span-12 lg:col-start-9 lg:col-span-3 md:h-auto lg:h-64 mt-2 lg:mt-0 mb-8 lg:mb-0">
          <div className="flex md:flex-row lg:flex-col justify-between gap-4 mb-4 lg:mb-12">
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="bg-black text-white px-4 sm:px-8 py-3 sm:py-4 rounded-md text-lg sm:h3 uppercase hover:bg-accent transition-colors flex-1 lg:flex-none"
            >
              ADD CV
            </button>
            <button
              onClick={() => setIsJDModalOpen(true)}
              className="bg-black text-white px-4 sm:px-8 py-3 sm:py-4 rounded-md text-lg sm:h3 uppercase hover:bg-accent transition-colors flex-1 lg:flex-none"
            >
              ADD JD
            </button>
          </div>
        </div>
      </Layout>

      <Layout>
        <div className="col-start-1 col-span-12 lg:col-span-11">
          <div className="flex items-center justify-between mb-6">
            <SearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />

            {matches.length > 0 && (
              <button
                className="group px-4 py-2 rounded-md body-small border-2 border-black text-black transition-colors duration-200 hover:bg-red hover:border-red hover:text-white flex-shrink-0 w-full sm:w-auto"
                onClick={() => setShowDeleteAllModal(true)}
              >
                <span className="flex items-center justify-center sm:justify-start gap-2">
                  <svg
                    className="w-4 h-4 group-hover:animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete All ({matches.length})
                </span>
              </button>
            )}
          </div>

          <MatchList
            matches={matches}
            searchTerm={searchTerm}
            sortOption={sortOption}
            onViewMatch={handleViewMatch}
            onDeleteMatch={handleDeleteMatch}
            loading={loading}
          />
        </div>
      </Layout>

      {/* Modals */}
      <FileUploadModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        title="Upload CV"
        fileType="cv"
        onUploadSuccess={fetchData}
      />
      <FileUploadModal
        isOpen={isJDModalOpen}
        onClose={() => setIsJDModalOpen(false)}
        title="Upload Job Description"
        fileType="jd"
        onUploadSuccess={fetchData}
      />

      <AnimatePresence>
        {showDeleteModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="h3 text-black mb-6">Delete Match</h3>
                <p className="body mb-8">
                  Are you sure you want to delete the match between "
                  {selectedMatch?.candidateName || "Unnamed Candidate"}" and "
                  {selectedMatch?.jobPosition || "Unnamed Position"}"? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-6 py-2.5 rounded-md body-small text-black hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2.5 rounded-md body-small bg-black text-white hover:bg-black/80 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteAllModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCancelDeleteAll}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="h3 text-black mb-6">Clear All Matches</h3>
                <p className="body mb-8">
                  Are you sure you want to delete all {matches.length} matches?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDeleteAll}
                    className="px-6 py-2.5 rounded-md body-small text-black hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeleteAll}
                    className="px-6 py-2.5 rounded-md body-small bg-black text-white hover:bg-black/80 transition-colors"
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
