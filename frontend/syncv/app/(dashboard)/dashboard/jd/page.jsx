"use client";
import React, { useState, useEffect } from "react";
import { useJDApi, useApiClient } from "../../../../lib/api";
import { useMatchApi } from "../../../../lib/api";
import Layout from "../../../../components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/common/Portal";
import { useRouter } from "next/navigation";

const JDManager = () => {
  const [jds, setJDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showMatchSuccessModal, setShowMatchSuccessModal] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);
  const router = useRouter();
  const { getAllMyJDs, deleteJD } = useJDApi();
  const { getApiClient } = useApiClient();
  const { matchJDWithCVs } = useMatchApi();
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [additionalSkills, setAdditionalSkills] = useState("");
  const [skillInputs, setSkillInputs] = useState([{ name: "", weight: 0 }]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [weightError, setWeightError] = useState(false);
  const [currentJdForSkills, setCurrentJdForSkills] = useState(null);

  const fetchJDs = async () => {
    try {
      setLoading(true);
      const response = await getAllMyJDs();
      setJDs(response.data || []);
    } catch (error) {
      console.error("Error fetching JDs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJDs();
  }, []);

  // Lock body scroll when delete modal is open
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

  const filteredJDs = jds.filter((jd) => {
    if (filter === "all") return true;
    if (filter === "matched") return jd.isMatched;
    if (filter === "unmatched") return !jd.isMatched;
    return true;
  });

  const handleRunMatch = (jdId, jdName) => {
    setCurrentJdForSkills({ id: jdId, name: jdName });

    setSkillInputs([{ name: "", weight: 0 }]);
    setTotalWeight(0);
    setWeightError(false);
    setShowSkillsModal(true);
  };

  const handleSkillNameChange = (index, value) => {
    const newSkillInputs = [...skillInputs];
    newSkillInputs[index].name = value;
    setSkillInputs(newSkillInputs);
  };

  const handleSkillWeightChange = (index, value) => {
    const weightValue = parseInt(value) || 0;

    const newSkillInputs = [...skillInputs];
    newSkillInputs[index].weight = weightValue;

    const newTotalWeight = newSkillInputs.reduce(
      (sum, skill) => sum + skill.weight,
      0
    );
    setTotalWeight(newTotalWeight);

    setWeightError(newTotalWeight > 100);

    setSkillInputs(newSkillInputs);
  };

  const addSkillInput = () => {
    setSkillInputs([...skillInputs, { name: "", weight: 0 }]);
  };

  const removeSkillInput = (index) => {
    if (skillInputs.length === 1) return;

    const newSkillInputs = skillInputs.filter((_, i) => i !== index);
    setSkillInputs(newSkillInputs);

    const newTotalWeight = newSkillInputs.reduce(
      (sum, skill) => sum + skill.weight,
      0
    );
    setTotalWeight(newTotalWeight);
    setWeightError(newTotalWeight > 100);
  };

  const handleConfirmMatch = async () => {
    if (totalWeight !== 100) {
      setWeightError(true);
      return;
    }

    try {
      setMatchLoading(true);
      setShowSkillsModal(false);
      setSelectedJD(currentJdForSkills);

      const skillsToSend = skillInputs
        .filter((skill) => skill.name.trim() !== "")
        .map((skill) => ({
          skill: skill.name.trim(),
          weight: skill.weight / 100,
        }));

      console.log("Skills to send:", skillsToSend);

      const matchResults = await matchJDWithCVs(
        currentJdForSkills.id,
        skillsToSend
      );

      console.log("Match results:", matchResults);

      setShowMatchSuccessModal(true);
      setSkillInputs([{ name: "", weight: 0 }]);
      setTotalWeight(0);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(`Error matching JD ID: ${currentJdForSkills?.id}`, error);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleCancelSkills = () => {
    setShowSkillsModal(false);
    setSkillInputs([{ name: "", weight: 0 }]);
    setTotalWeight(0);
    setWeightError(false);
    setCurrentJdForSkills(null);
  };

  const handleViewJD = async (jdId, fileName) => {
    try {
      const api = await getApiClient();
      const response = await api.get(`/api/jds/download/${jdId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error(`Error viewing JD ID: ${jdId}`, error);
    }
  };

  const handleDeleteClick = (jd) => {
    setSelectedJD(jd);
    setShowDeleteModal(true);
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJD) return;

    try {
      const api = await getApiClient();
      await api.delete(`/api/jds/${selectedJD.id}`);
      setJDs(jds.filter((jd) => jd.id !== selectedJD.id));
      setShowDeleteModal(false);
      setSelectedJD(null);
    } catch (error) {
      console.error(`Error deleting JD ID: ${selectedJD.id}`, error);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const api = await getApiClient();
      const jdsToDelete = filteredJDs.map((jd) => jd.id);
      await api.delete("/api/jds", { ids: jdsToDelete });
      setJDs((prev) => prev.filter((jd) => !jdsToDelete.includes(jd.id)));
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error("Error deleting multiple JDs:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedJD(null);
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
            <h1 className="h2 text-black mb-4">Job Description Manager</h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2 sm:gap-4 w-full sm:w-auto"></div>

            {filteredJDs.length > 0 && (
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
                  Delete All ({filteredJDs.length})
                </span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="body-small text-black/60 mt-2">
                  Loading Job Descriptions...
                </p>
              </div>
            ) : filteredJDs.length === 0 ? (
              <div className="p-8 text-center body text-black/50">
                No Job Descriptions found in this category
              </div>
            ) : (
              <div className="divide-y-2 divide-black">
                {filteredJDs.map((jd, index) => (
                  <motion.div
                    key={jd.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 sm:p-6 flex flex-col gap-4"
                  >
                    <div className="flex-1">
                      <div className="body font-semibold mb-1">
                        {jd.name || "Unnamed Job Description"}
                      </div>
                      <p className="body-small text-black/60">
                        Uploaded: {new Date(jd.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      {jd.isMatched && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full body-small">
                          Matched
                        </span>
                      )}
                      <button
                        onClick={() => handleViewJD(jd.id, jd.name)}
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
                        <span className="hidden sm:inline">View JD</span>
                        <span className="sm:hidden">View</span>
                      </button>
                      <button
                        onClick={() => handleRunMatch(jd.id, jd.name)}
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
                        onClick={() => handleDeleteClick(jd)}
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
                  Are you sure you want to delete the Job Description "
                  <span className="font-semibold truncate inline-block max-w-[240px] align-bottom">
                    {selectedJD?.name || "Unnamed Job Description"}
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
                  Are you sure you want to delete all {filteredJDs.length} Job
                  Descriptions
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
                  Successfully matched Job Description "
                  <span className="font-semibold">
                    {selectedJD?.name || ""}
                  </span>
                  " with available CVs. Redirecting to dashboard to view
                  results...
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

      <AnimatePresence>
        {showSkillsModal && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCancelSkills}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border-2 border-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="h3 text-black mb-4">
                  Technical Skills Weighting
                </h3>
                <p className="body-small mb-4">
                  Assign importance weights to technical skills for matching job
                  description "
                  <span className="font-semibold">
                    {currentJdForSkills?.name || ""}
                  </span>
                  ". Total weight must equal 100%.
                </p>

                <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-4">
                  <p className="body-small text-black/70">
                    Want to use default skills from the job description?
                  </p>
                  <button
                    onClick={() => {
                      setSkillInputs([]);
                      setTotalWeight(100);
                      setWeightError(false);

                      handleConfirmMatch();
                    }}
                    className="px-4 py-2 rounded-md border border-accent text-accent hover:bg-accent hover:text-white transition-colors body-small"
                  >
                    Use Default Skills
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="body-small font-semibold">
                      Custom Technical Skills
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`body-small ${
                          weightError
                            ? "text-red"
                            : totalWeight === 100
                            ? "text-green"
                            : "text-black/70"
                        }`}
                      >
                        Total: {totalWeight}%
                      </span>
                      <span className="body-small text-black/50">
                        (Goal: 100%)
                      </span>
                    </div>
                  </div>

                  {/* Skill inputs */}
                  <div className="space-y-3 mb-4">
                    {skillInputs.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            // Prevent spaces in skill names
                            const value = e.target.value.replace(/\s+/g, "");
                            handleSkillNameChange(index, value);
                          }}
                          placeholder="Skill name (no spaces, e.g. JavaScript)"
                          className="flex-1 p-2 border-2 border-black/20 rounded-md focus:border-accent focus:outline-none body-small"
                        />
                        <div className="flex items-center w-24 border-2 border-black/20 rounded-md overflow-hidden">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={skill.weight}
                            onChange={(e) =>
                              handleSkillWeightChange(index, e.target.value)
                            }
                            onKeyPress={(e) => {
                              if (!/\d/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-16 p-2 border-0 focus:outline-none body-small text-right"
                          />
                          <span className="pr-2 text-black/70">%</span>
                        </div>
                        <button
                          onClick={() => removeSkillInput(index)}
                          disabled={skillInputs.length === 1}
                          className={`p-2 rounded-md ${
                            skillInputs.length === 1
                              ? "text-black/30"
                              : "text-red hover:bg-red/10"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addSkillInput}
                      className="flex-1 p-2 border border-black/20 rounded-md text-black/70 hover:border-accent hover:text-accent transition-colors body-small flex items-center justify-center gap-2"
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
                          strokeWidth={1.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Skill
                    </button>

                    <button
                      onClick={() => {
                        if (skillInputs.length > 0 && totalWeight < 100) {
                          const validSkills = skillInputs.filter(
                            (skill) => skill.name.trim() !== ""
                          );
                          if (validSkills.length > 0) {
                            const remainingWeight = 100 - totalWeight;
                            const weightPerSkill = Math.floor(
                              remainingWeight / validSkills.length
                            );
                            const extraWeight =
                              remainingWeight % validSkills.length;

                            const newSkillInputs = [...skillInputs];
                            let validIndex = 0;

                            for (let i = 0; i < newSkillInputs.length; i++) {
                              if (newSkillInputs[i].name.trim() !== "") {
                                newSkillInputs[i].weight += weightPerSkill;
                                if (validIndex < extraWeight) {
                                  newSkillInputs[i].weight += 1;
                                }
                                validIndex++;
                              }
                            }

                            setSkillInputs(newSkillInputs);
                            setTotalWeight(100);
                            setWeightError(false);
                          }
                        }
                      }}
                      className="flex-1 p-2 border border-accent rounded-md text-accent hover:bg-accent hover:text-white transition-colors body-small"
                    >
                      Auto-Balance
                    </button>
                  </div>
                </div>

                {weightError && (
                  <div className="mb-4 p-2 bg-red/10 text-red body-small rounded-md">
                    Total weight must equal exactly 100%. Current total:{" "}
                    {totalWeight}%
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancelSkills}
                    className="px-4 py-2 rounded-md body-small bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmMatch}
                    disabled={matchLoading || totalWeight !== 100}
                    className={`px-4 py-2 rounded-md body-small ${
                      matchLoading
                        ? "bg-accent/70 text-white"
                        : totalWeight !== 100
                        ? "bg-black/30 text-white cursor-not-allowed"
                        : "bg-accent text-white hover:bg-accent/80"
                    } transition-colors flex items-center gap-2`}
                  >
                    {matchLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Confirm Match"
                    )}
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

export default JDManager;
