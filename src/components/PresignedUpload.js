import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const PresignedUpload = () => {
  const [files, setFiles] = useState([]);
  const [operationId, setOperationId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setDownloadUrl(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select at least one image");

    try {
      setLoading(true);
      // 1️⃣ Request presigned URLs
      const res = await axios.post(`${config.backendUrl}/upload-urls`, null, {
        params: { fileCount: files.length },
      });

      const { operationId, uploadUrls } = res.data;
      setOperationId(operationId);

      // 2️⃣ Upload files to S3 using presigned URLs
      const uploadPromises = files.map((file, idx) => {
        const { url } = uploadUrls[idx];
        return axios.put(url, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (event) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.round((event.loaded * 100) / event.total),
            }));
          },
        });
      });

      await Promise.all(uploadPromises);

      // 3️⃣ Start conversion on backend
      const startRes = await axios.post(`${config.backendUrl}/convert/start`, {
        operationId,
        fileKeys: uploadUrls.map(u => u.fileKey),
      });

      setDownloadUrl(startRes.data.downloadUrl);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Upload or conversion failed");
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%", maxWidth: 420, padding: 20,
      borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "white", textAlign: "center"
    }}>
      <h2 style={{ marginBottom: 20, color: "#333", fontSize: "1.3rem" }}>📑 Upload & Convert</h2>

      <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={loading} />

      {files.length > 0 && (
        <ul style={{ textAlign: "left", marginTop: 10 }}>
          {files.map(file => (
            <li key={file.name}>
              {file.name} - {uploadProgress[file.name] || 0}%
            </li>
          ))}
        </ul>
      )}

      <button onClick={handleUpload} disabled={loading} style={{
        marginTop: 15, padding: "12px 20px",
        backgroundColor: loading ? "#aaa" : "#4CAF50",
        color: "white", border: "none", borderRadius: 8,
        cursor: loading ? "not-allowed" : "pointer"
      }}>
        {loading ? "Processing…" : "Convert to PDF"}
      </button>

      {downloadUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={downloadUrl} download="merged.pdf" style={{ color: "#1E40AF" }}>⬇ Download Merged PDF</a>
        </div>
      )}
    </div>
  );
};

export default PresignedUpload;
