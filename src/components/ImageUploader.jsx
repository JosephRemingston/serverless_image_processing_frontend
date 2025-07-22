import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSignedUrl, uploadToS3 } from "../api/media";
import { useAuth } from "../context/AuthContext";
import { Loader2, CheckCircle, XCircle, UploadCloud } from "lucide-react";

const dropVariants = { hover: { scale: 1.02, borderColor: "#0097B3" } };
const statusVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function ImageUploader() {
  const { state } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Drag & drop a PNG or click to select");

  const onSelect = useCallback((f) => {
    if (!f) return;
    if (f.type !== "image/png") {
      setStatus("error");
      setMessage("Only PNG allowed");
    } else {
      setFile(f);
      setStatus("ready");
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setMessage("Generating signed URL...");
    try {
      const data = await generateSignedUrl(state.token);
      const signedUrl = data["signed url"];
      setMessage("Uploading...");
      await uploadToS3(signedUrl, file, (e) =>
        setProgress(Math.round((e.loaded * 100) / e.total))
      );
      setStatus("success");
      setMessage("Upload successful!");
    } catch (err) {
      setStatus("error");
      setMessage("Upload failed. Try again.");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <motion.div
        className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer bg-white"
        variants={dropVariants}
        whileHover="hover"
        onClick={() => document.getElementById("fileInput").click()}
        onDrop={(e) => {
          e.preventDefault();
          onSelect(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {!file && (
          <>
            <UploadCloud size={48} className="text-[#0097B3] mb-2" />
            <p className="text-gray-500">{message}</p>
          </>
        )}
        {file && (
          <AnimatePresence>
            <motion.div
              className="relative"
              key="thumb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-40 h-40 object-cover rounded-md shadow-md"
              />
              {status === "uploading" && (
                <svg className="absolute inset-0 w-full h-full">
                  <circle
                    cx="80"
                    cy="80"
                    r="78"
                    stroke="#0097B3"
                    strokeWidth="4"
                    fill="none"
                    style={{
                      strokeDasharray: 2 * Math.PI * 78,
                      strokeDashoffset: 2 * Math.PI * 78 * ((100 - progress) / 100),
                      transition: "stroke-dashoffset 0.3s",
                    }}
                  />
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/png"
          className="hidden"
          onChange={(e) => onSelect(e.target.files[0])}
        />
      </motion.div>

      {file && status === "ready" && (
        <motion.button
          onClick={handleUpload}
          className="mt-4 w-full bg-[#0097B3] text-white py-3 rounded-lg font-semibold hover:bg-[#007a90] transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upload {file.name}
        </motion.button>
      )}

      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            className="mt-4 flex items-center space-x-2 text-lg"
            initial="initial"
            animate="animate"
            exit="initial"
            variants={statusVariants}
          >
            {status === "success" ? (
              <CheckCircle size={32} className="text-green-600" />
            ) : (
              <XCircle size={32} className="text-red-500" />
            )}
            <span className={status === "success" ? "text-green-600" : "text-red-500"}>
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
