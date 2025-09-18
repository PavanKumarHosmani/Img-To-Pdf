import React, { useState } from "react";
import axios from "axios";

const PdfConverter = ({ backendUrl }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return alert("Please select at least one image");

    try {
      setLoading(true);
      setProgress(0);

      console.log("Requesting upload URLs from backend...");
      // Step 1: Get presigned URLs
      const { data } = await axios.post(`${backendUrl}/upload-urls`, {
        fileCount: files.length,
      });
      const { operationId, uploadUrls } = data;
      console.log("Received upload URLs:", uploadUrls);

      // Step 2: Upload files to S3
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = uploadUrls[i].url;
        console.log(`Uploading file ${file.name} to S3...`);

        await axios.put(url, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              // Calculate overall progress across all files
              setProgress(Math.round(((i + percent / 100) / files.length) * 100));
            }
          },
        });

        console.log(`${file.name} uploaded successfully`);
      }

      // Step 3: Start conversion
      console.log("Starting conversion on backend...");
      const response = await axios.post(`${backendUrl}/convert/start`, {
        operationId,
        fileKeys: uploadUrls.map((u) => u.fileKey),
      });
      console.log("Conversion response:", response.data);

      // Step 4: Download PDF
      const downloadUrl = response.data.downloadUrl;
      if (!downloadUrl) throw new Error("Download URL not returned from backend");

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "converted.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setProgress(100);
      setLoading(false);
      console.log("Conversion and download complete!");
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("Conversion failed. Check console for details.");

      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2>📑 Upload & Convert Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        style={{ margin: "10px 0" }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#aaa" : "#1E40AF",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Converting..." : "Convert to PDF"}
      </button>

      {files.length > 0 && (
        <div style={{ marginTop: 10, textAlign: "left" }}>
          <strong>Selected Images:</strong>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              height: 20,
              width: "100%",
              backgroundColor: "#f3f3f3",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#4CAF50",
                textAlign: "center",
                lineHeight: "20px",
                color: "white",
                transition: "width 0.3s ease",
              }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfConverter;
