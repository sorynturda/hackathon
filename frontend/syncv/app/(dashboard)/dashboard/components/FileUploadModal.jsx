"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "../../../../components/common/Portal";
import { useCVApi, useJDApi } from "../../../../lib/api";

const FileUploadOverlay = ({ isOpen, onClose, title, fileType }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { uploadCV, uploadMultipleCVs } = useCVApi();
  const { uploadJD, uploadMultipleJDs } = useJDApi();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    console.log("Starting upload with files:", files);

    try {
      let response;

      if (fileType === "cv") {
        console.log("Uploading CVs...");
        if (files.length === 1) {
          console.log("Single CV upload");
          response = await uploadCV(files[0]);
        } else {
          console.log("Multiple CVs upload");
          response = await uploadMultipleCVs(files);
        }
      } else if (fileType === "jd") {
        console.log("Uploading JDs...");
        if (files.length === 1) {
          console.log("Single JD upload");
          response = await uploadJD(files[0]);
        } else {
          console.log("Multiple JDs upload");
          response = await uploadMultipleJDs(files);
        }
      }

      console.log("Upload response:", response);

      if (response.data) {
        console.log("Upload successful");
        onClose();
      }
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    } finally {
      setUploading(false);
    }
  };

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "tween",
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="fixed inset-0 bg-black z-[9999]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-10"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="absolute inset-0 flex flex-col">
            <div className="pt-16 pb-8 px-4 text-center">
              <h1 className="h1 text-white mb-8">{title}</h1>
            </div>

            <div
              className="px-4 flex-1 overflow-hidden"
              style={{ height: "calc(100% - 180px - 80px)" }}
            >
              <div className="mx-auto mb-4" style={{ maxWidth: "32rem" }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    w-full aspect-video border-4 border-dashed rounded-lg 
                    flex flex-col items-center justify-center cursor-pointer
                    transition-colors duration-300
                    ${
                      isDragging
                        ? "border-accent bg-accent/10"
                        : "border-white/30 hover:border-accent"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />

                  <svg
                    className="w-16 h-16 mb-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>

                  <p className="h3 text-white mb-2">Drag & drop files here</p>
                  <p className="body text-white/60">
                    or click to browse from your computer
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mx-auto" style={{ maxWidth: "32rem" }}>
                  <div className="text-white/60 body-small mb-2">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected
                  </div>

                  <div
                    className="border border-white/10 rounded-md p-4 overflow-y-auto"
                    style={{
                      height: "calc(100% - 80px)",
                      maxHeight: "calc(100vh - 500px)",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="bg-white/10 px-4 py-2 rounded-md flex items-center justify-between"
                        >
                          <span className="body-small text-white truncate max-w-[80%]">
                            {file.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-white/60 hover:text-accent transition-colors"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="absolute bottom-0 w-full py-6 px-4 bg-black/80 backdrop-blur-sm border-t border-white/10 flex justify-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`
                    px-8 py-3 h3 rounded-md transition-colors w-64
                    ${
                      uploading
                        ? "bg-white/20 text-white/50 cursor-not-allowed"
                        : "bg-accent text-white hover:bg-white hover:text-black"
                    }
                  `}
                >
                  {uploading ? "UPLOADING..." : "UPLOAD"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return <Portal>{overlayContent}</Portal>;
};

export default FileUploadOverlay;
