"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useMatchApi } from "@/lib/api";
import Link from "next/link";
import jsPDF from "jspdf";

const MatchDetails = () => {
  const { matchId } = useParams();
  const router = useRouter();
  const { getMatchById } = useMatchApi();

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch match details
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const data = await getMatchById(matchId);

        if (mounted) {
          setMatchData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching match details:", err);
        if (mounted) {
          setError("Failed to load match details");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [matchId, getMatchById]);

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 7.5) return "text-green";
    if (score >= 5) return "text-accent";
    return "text-red";
  };

  const getScoreBgColor = (score) => {
    if (score >= 7.5) return "bg-green";
    if (score >= 5) return "bg-accent";
    return "bg-red";
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/dashboard");
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-t-transparent border-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen ">
        <Layout>
          <div className="col-span-10 col-start-2">
            <div className="p-6">
              <h3 className="h3 text-red mb-2">Error</h3>
              <p className="body text-black mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="bg-black text-white py-2 px-6"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  if (!matchData) return null;

  const scorePercent = Math.round(matchData.score * 10);

  return (
    <div className="w-full min-h-screen pt-[5vh] pb-[10vh]">
      <Layout>
        <div className="col-span-10 col-start-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center mb-12"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="body-small">Back</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 lg:col-span-8"
            >
              <div className="border-b border-black/10 pb-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="body-small text-black/60">
                      Match #{matchData.id}
                    </div>
                    <h1 className="h2 text-black">{matchData.candidateName}</h1>
                    <div className="body text-black/80 mt-1 pt-5">
                      {matchData.position}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="body-small text-black/60">
                        Match Score
                      </div>
                      <div className={`h2 ${getScoreColor(matchData.score)}`}>
                        {scorePercent}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 border-b border-black/10">
                <div className="flex space-x-8">
                  {["overview", "skills", "reasoning"].map((tab) => (
                    <button
                      key={tab}
                      className={`pb-3 relative capitalize ${
                        activeTab === tab ? "text-black" : "text-black/40"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      <span className="body">{tab}</span>
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "overview" && (
                  <OverviewTab
                    matchData={matchData}
                    scorePercent={scorePercent}
                    getScoreColor={getScoreBgColor}
                  />
                )}

                {activeTab === "skills" && (
                  <SkillsTab
                    matchData={matchData}
                    getScoreColor={getScoreColor}
                  />
                )}

                {activeTab === "reasoning" && (
                  <ReasoningTab matchData={matchData} />
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-12 lg:col-span-4"
            >
              <div className="bg-black text-white p-6 mb-6">
                <h3 className="h3 mb-6">Match Details</h3>

                <div className="space-y-4">
                  <div>
                    <div className="body-small text-white/60">Match Date</div>
                    <div className="body">
                      {formatDate(matchData.matchDate)}
                    </div>
                  </div>

                  <div>
                    <div className="body-small text-white/60">CV ID</div>
                    <div className="body">#{matchData.cvId}</div>
                  </div>

                  <div>
                    <div className="body-small text-white/60">JD ID</div>
                    <div className="body">#{matchData.jdId}</div>
                  </div>

                  <div>
                    <div className="body-small text-white/60">Matched By</div>
                    <div className="body">{matchData.userEmail}</div>
                  </div>
                </div>
              </div>

              <div className="border border-black/10 p-6">
                <h3 className="h3 mb-6">Actions</h3>

                <div className="space-y-4">
                  <button
                    onClick={() => generateMatchReport(matchData)}
                    className="w-full bg-accent text-black body py-3 hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Download Match Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

const OverviewTab = ({ matchData, scorePercent, getScoreColor }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="h3 mb-4">Match Overview</h3>
        <div className="h-3 bg-black/10 rounded-full w-full mb-1 overflow-hidden">
          <div
            className={`h-full ${getScoreColor(matchData.score)}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <div className="flex justify-between body-small text-black/60">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green"></div>
            <h4 className="body font-semibold">
              Matching Skills ({matchData.matchingSkills.length})
            </h4>
          </div>

          {matchData.matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchData.matchingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-green/10 text-green py-1 px-3 rounded-full body-small"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="body-small text-black/60">No matching skills found</p>
          )}
        </div>

        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red"></div>
            <h4 className="body font-semibold">
              Missing Skills ({matchData.missingSkills.length})
            </h4>
          </div>

          {matchData.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchData.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-red/10 text-red py-1 px-3 rounded-full body-small"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="body-small text-black/60">
              No missing skills identified
            </p>
          )}
        </div>
      </div>

      <div
        className={`p-6 rounded-sm ${
          scorePercent >= 75
            ? "bg-green/10"
            : scorePercent >= 50
            ? "bg-accent/10"
            : "bg-red/10"
        }`}
      >
        <h4 className="body font-semibold mb-2">Recommendation</h4>
        <p className="body">
          {scorePercent >= 75
            ? "Strong match. Candidate has most required skills for this position."
            : scorePercent >= 50
            ? "Potential match. Consider interviewing to assess cultural fit and skill development potential."
            : "Not recommended for this position. Significant skill gaps exist."}
        </p>
      </div>
    </div>
  );
};

const SkillsTab = ({ matchData, getScoreColor }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="h3 mb-4">Skill Breakdown</h3>
          <div className="border border-black/10 p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="body">Matching Skills</span>
                  <span className={`body ${getScoreColor(7.5)}`}>
                    {matchData.matchingSkills.length}
                  </span>
                </div>
                <div className="h-2 bg-black/10 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-green"
                    style={{
                      width: `${
                        (matchData.matchingSkills.length /
                          (matchData.matchingSkills.length +
                            matchData.missingSkills.length)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="body">Missing Skills</span>
                  <span className={`body ${getScoreColor(3)}`}>
                    {matchData.missingSkills.length}
                  </span>
                </div>
                <div className="h-2 bg-black/10 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-red"
                    style={{
                      width: `${
                        (matchData.missingSkills.length /
                          (matchData.matchingSkills.length +
                            matchData.missingSkills.length)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="body">Overall Match</span>
                  <span className={`body ${getScoreColor(matchData.score)}`}>
                    {Math.round(matchData.score * 10)}%
                  </span>
                </div>
                <div className="h-2 bg-black/10 rounded-full w-full overflow-hidden">
                  <div
                    className={`h-full ${
                      matchData.score >= 7.5
                        ? "bg-green"
                        : matchData.score >= 5
                        ? "bg-accent"
                        : "bg-red"
                    }`}
                    style={{ width: `${matchData.score * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="h3 mb-4">Skills Distribution</h3>
          <div className="border border-black/10 p-6 h-full flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#f44336"
                  strokeWidth="10"
                  strokeDasharray={`${
                    (matchData.missingSkills.length /
                      (matchData.matchingSkills.length +
                        matchData.missingSkills.length)) *
                    283
                  } 283`}
                  transform="rotate(-90) translate(-100, 0)"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#4caf50"
                  strokeWidth="10"
                  strokeDasharray={`${
                    (matchData.matchingSkills.length /
                      (matchData.matchingSkills.length +
                        matchData.missingSkills.length)) *
                    283
                  } 283`}
                  strokeDashoffset={`${
                    -(
                      matchData.missingSkills.length /
                      (matchData.matchingSkills.length +
                        matchData.missingSkills.length)
                    ) * 283
                  }`}
                  transform="rotate(-90) translate(-100, 0)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="body-small text-black/60">Skills Match</span>
                <span className="h3">
                  {Math.round(
                    (matchData.matchingSkills.length /
                      (matchData.matchingSkills.length +
                        matchData.missingSkills.length)) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-black/10 p-6">
          <h4 className="body font-semibold mb-4">Matching Skills</h4>
          <ul className="space-y-2">
            {matchData.matchingSkills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2 body-small">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="#4caf50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ReasoningTab = ({ matchData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="h3 mb-4">AI Match Reasoning</h3>
        <div className="border border-black/10 p-6">
          <p className="body whitespace-pre-line">{matchData.reasoning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-accent/10 p-6">
          <h4 className="body font-semibold mb-4">Key Strengths</h4>
          <ul className="space-y-3">
            {matchData.matchingSkills.length > 0 ? (
              matchData.matchingSkills.map((skill, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-accent mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="body-small">
                    Strong match in{" "}
                    <span className="font-semibold">{skill}</span>
                  </span>
                </li>
              ))
            ) : (
              <li className="body-small">No specific strengths identified</li>
            )}
          </ul>
        </div>

        <div className="bg-black/5 p-6">
          <h4 className="body font-semibold mb-4">Development Areas</h4>
          <ul className="space-y-3">
            {matchData.missingSkills.slice(0, 3).map((skill, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-black/60 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="body-small">
                  Skill gap in <span className="font-semibold">{skill}</span>
                </span>
              </li>
            ))}
            {matchData.missingSkills.length > 3 && (
              <li className="body-small italic text-black/60">
                Plus {matchData.missingSkills.length - 3} other skill gaps...
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const generateMatchReport = (matchData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Match Report", pageWidth / 2, y, { align: "center" });
  y += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Match ID: ${matchData.id}`, 20, y);
  y += 8;
  doc.text(
    `Date: ${new Date(matchData.matchDate).toLocaleDateString()}`,
    20,
    y
  );
  y += 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Candidate:", 20, y);
  y += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(matchData.candidateName, 25, y);
  y += 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Position:", 20, y);
  y += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(matchData.position, 25, y);
  y += 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Match Score:", 20, y);
  y += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`${Math.round(matchData.score * 10)}%`, 25, y);
  y += 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Matching Skills:", 20, y);
  y += 8;
  doc.setFontSize(12);

  matchData.matchingSkills.forEach((skill) => {
    doc.text(`• ${skill}`, 25, y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  if (matchData.matchingSkills.length === 0) {
    doc.text("None found", 25, y);
    y += 6;
  }

  y += 5;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Missing Skills:", 20, y);
  y += 8;
  doc.setFontSize(12);

  matchData.missingSkills.forEach((skill) => {
    doc.text(`• ${skill}`, 25, y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  if (matchData.missingSkills.length === 0) {
    doc.text("None found", 25, y);
    y += 6;
  }

  y += 10;

  if (matchData.reasoning && matchData.reasoning.trim()) {
    doc.addPage();
    y = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AI Reasoning:", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const reasoningText = doc.splitTextToSize(
      matchData.reasoning,
      pageWidth - 40
    );
    doc.text(reasoningText, 20, y);
  }

  const filename = `Match_Report_${matchData.candidateName.replace(
    /\s+/g,
    "_"
  )}_${matchData.id}.pdf`;

  doc.save(filename);
};

export default MatchDetails;
