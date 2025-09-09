import React from "react";
import ImageToPdf from "../components/ImageToPdf";
import config from "../config";

const ImageToPdfPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Image → PDF (Sync)</h2>
      <ImageToPdf backendUrl={config.backendUrl} />
    </div>
  );
};

export default ImageToPdfPage;
