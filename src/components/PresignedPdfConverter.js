import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const PresignedPdfConverter = () => {
  const [files, setFiles] = useState([]);
  const [operationId, setOperationId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setDownloadUrl(null);
    setUploadProgress({});
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select at least one file.");

    try {
      setLoading(true);

      // 1️⃣ Get presigned URLs from backend
      const { data } = await axios.post(
        `${config.backendUrl}/upload-urls?fileCount=${files.length}`
      );
      const { operationId, uploadUrls } = data;
      setOperationId(operationId);

      // 2️⃣ Upload files directly to S3
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = uploadUrls[i].url;

        await axios.put(url, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
          },
        });
      }

      // 3️⃣ Trigger backend conversion
      const { data: convertData } = await axios.post(
        `${config.backendUrl}/convert/start`,
        {
          operationId,
          fileKeys: uploadUrls.map((u) => u.fileKey),
        }
      );

      setDownloadUrl(convertData.downloadUrl);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Upload or conversion failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Image → PDF Converter</h2>

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />

      {files.length > 0 && (
        <div>
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file) => (
              <li key={file.name}>
                {file.name} - {uploadProgress[file.name] || 0}%
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload} disabled={loading || files.length === 0}>
        {loading ? "Processing..." : "Upload & Convert"}
      </button>

      {downloadUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PresignedPdfConverter;
