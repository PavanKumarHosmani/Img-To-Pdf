import React, { useState } from "react";
import axios from "axios";
import "./PdfConverter.css";

const PdfConverter = () => {
  const [files, setFiles] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Multiple images
    setPdfBlobUrl(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return alert("Please select at least one image");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // Send multiple files

    try {
      const response = await axios.post(
        "http://localhost:8080/api/pdf/convert",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("PDF conversion failed. Check console for details.");
    }
  };

  return (
    <div className="pdf-converter">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleSubmit}>Convert to PDF</button>

      {files.length > 0 && (
        <div className="selected-files">
          <p>Selected Images:</p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {pdfBlobUrl && (
        <div className="preview">
          <a href={pdfBlobUrl} download="merged.pdf">
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfConverter;
