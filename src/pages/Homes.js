import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>📄 File Conversion & Compression</h2>
      <nav>
        <ul>
          <li><Link to="/image-to-pdf">Image → PDF (Sync)</Link></li>
          <li><Link to="/async-image-to-pdf">Image → PDF (Async)</Link></li>
          <li><Link to="/word-to-pdf">Word → PDF</Link></li>
          <li><Link to="/image-compression">Image Compression</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
