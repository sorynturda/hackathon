"use client";
import React, { useState, useEffect } from "react";
import { useCVApi, useApiClient } from "../../../../lib/api";
import { useMatchApi } from "../../../../lib/api";
import Layout from "../../../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/common/Portal";
import { useRouter } from "next/navigation";

const CVManager = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showMatchSuccessModal, setShowMatchSuccessModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const router = useRouter();

  const { getAllMyCVs, deleteCV } = useCVApi();
  const { getApiClient } = useApiClient();
  const { matchCVWithJDs } = useMatchApi();

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await getAllMyCVs();
      setCvs(response.data || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  useEffect(() => {
    if (showDeleteModal || showDeleteAllModal || showMatchSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDeleteModal, showDeleteAllModal, showMatchSuccessModal]);

  const filteredCVs = cvs.filter((cv) => {
    if (filter === "all") return true;
    if (filter === "matched") return cv.isMatched;
    if (filter === "unmatched") return !cv.isMatched;
    return true;
  });

  const handleRunMatch = async (cvId, cvName) => {
    try {
      setMatchLoading(true);
      setSelectedCV({ id: cvId, name: cvName });

      const matchResults = await matchCVWithJDs(cvId);
      console.log("Match results:", matchResults);

      setShowMatchSuccessModal(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(`Error running match for CV ID: ${cvId}`, error);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleViewCV = async (cvId, fileName) => {
    try {
      const api = await getApiClient();
      const response = await api.get(`/api/cvs/download/${cvId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error(`Error viewing CV ID: ${cvId}`, error);
    }
  };

  const handleDeleteClick = (cv) => {
    setSelectedCV(cv);
    setShowDeleteModal(true);
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCV) return;

    try {
      const api = await getApiClient();
      await api.delete(`/api/cvs/${selectedCV.id}`);
      setCvs(cvs.filter((cv) => cv.id !== selectedCV.id));
      setShowDeleteModal(false);
      setSelectedCV(null);
    } catch (error) {
      console.error(`Error deleting CV ID: ${selectedCV.id}`, error);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const api = await getApiClient();
      const cvsToDelete = filteredCVs.map((cv) => cv.id);
      await api.delete("/api/cvs", { ids: cvsToDelete });
      setCvs((prev) => prev.filter((cv) => !cvsToDelete.includes(cv.id)));
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Error deleting multiple CVs:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCV(null);
  };

  const handleCancelDeleteAll = () => {
    setShowDeleteAllModal(false);
  };

  const handleCloseMatchSuccessModal = () => {
    setShowMatchSuccessModal(false);
  };

  return (
    <div className="w-full">
      <Layout>
        <div className="col-start-1 col-span-11 max-md:mt-10">
          <div className="mb-8">
            <h1 className="h2 text-black mb-4">CV Manager</h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2 sm:gap-4 w-full sm:w-auto"></div>
            {filteredCVs.length > 0 && (
              <button
                className="group px-4 py-2 rounded-md body-small border-2 border-black text-black transition-colors duration-200 hover:bg-red hover:border-red hover:text-white flex-shrink-0 w-full sm:w-auto"
                onClick={handleDeleteAllClick}
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
                  Delete All ({filteredCVs.length})
                </span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="body-small text-black/60 mt-2">Loading CVs...</p>
              </div>
            ) : filteredCVs.length === 0 ? (
              <div className="p-8 text-center body text-black/50">
                No CVs found in this category
              </div>
            ) : (
              <div className="divide-y-2 divide-black">
                {filteredCVs.map((cv, index) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 sm:p-6 flex flex-col gap-4"
                  >
                    <div className="flex-1">
                      <div className="body font-semibold mb-1">
                        {cv.name || "Unnamed CV"}
                      </div>
                      <p className="body-small text-black/60">
                        Uploaded: {new Date(cv.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      {cv.isMatched && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full body-small">
                          Matched
                        </span>
                      )}
                      <button
                        onClick={() => handleViewCV(cv.id, cv.name)}
                        className="bg-black text-white px-3 sm:px-4 py-2 rounded-md body-small hover:bg-black/80 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="hidden sm:inline">View CV</span>
                        <span className="sm:hidden">View</span>
                      </button>
                      <button
                        onClick={() => handleRunMatch(cv.id, cv.name)}
                        disabled={matchLoading}
                        className={`${
                          matchLoading ? "bg-accent/70" : "bg-accent"
                        } text-white px-3 sm:px-4 py-2 rounded-md body-small hover:bg-black transition-colors flex items-center gap-2`}
                      >
                        {matchLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">
                              Matching...
                            </span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Run Match</span>
                            <span className="sm:hidden">Match</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cv)}
                        className="bg-white border-2 border-red text-red px-3 sm:px-4 py-2 rounded-md body-small hover:bg-red hover:text-white transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
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
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>

      <AnimatePresence>
        {showDeleteModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-black"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="h3 text-black mb-4">Confirm Deletion</h3>
                <p className="body mb-6 break-words overflow-hidden">
                  Are you sure you want to delete the CV "
                  <span className="font-semibold truncate inline-block max-w-[240px] align-bottom">
                    {selectedCV?.name || "Unnamed CV"}
                  </span>
                  "? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-md body-small bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-md body-small bg-red text-white hover:bg-red/80 transition-colors"
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCancelDeleteAll}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-black"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="h3 text-black mb-4">Confirm Deletion</h3>
                <p className="body mb-6">
                  Are you sure you want to delete all {filteredCVs.length} CVs
                  {filter !== "all" ? ` from "${filter}"` : ""}? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelDeleteAll}
                    className="px-4 py-2 rounded-md body-small bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDeleteAll}
                    className="px-4 py-2 rounded-md body-small bg-red text-white hover:bg-red/80 transition-colors"
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMatchSuccessModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseMatchSuccessModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2 border-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="h3 text-black">Match Completed</h3>
                </div>
                <p className="body mt-4 mb-6">
                  Successfully matched CV "
                  <span className="font-semibold">
                    {selectedCV?.name || ""}
                  </span>
                  " with available Job Descriptions. Redirecting to dashboard to
                  view results...
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseMatchSuccessModal}
                    className="px-4 py-2 rounded-md body-small bg-accent text-white hover:bg-accent/80 transition-colors"
                  >
                    Close
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

export default CVManager;
