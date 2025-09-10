import React, { useState } from "react";
import axios from "axios";

const ImageToPdf = ({ backendUrl }) => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertSync = async () => {
    if (!files || files.length === 0) {
      setError("Select at least one image");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      for (let f of files) formData.append("files", f);

      const res = await axios.post(`${backendUrl}/convert`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converted.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "20px", textAlign: "center" }}>
      <h2>🖼️ Image → PDF (Sync)</h2>
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      <button onClick={convertSync} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Converting…" : "Convert to PDF"}
      </button>
      {error && <div style={{ color: "red", marginTop: 15 }}>{error}</div>}
    </section>
  );
};

export default ImageToPdf;
