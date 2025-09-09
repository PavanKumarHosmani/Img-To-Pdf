import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ImageToPdf from "./components/ImageToPdf";
// import AsyncImageToPdf from "./components/AsyncImageToPdf";
// import WordToPdf from "./components/WordToPdf";
// import Navbar from "./components/Navbar";
// import ImageCompression from "./components/ImageCompression";
import Footer from "./components/Footer";
import Header from "./components/Header";
// import MergePdfs from "./components/MergePdfs";

function App() {
  // Use env var if provided; fallback to localhost
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api/v1";

  // Simple Home page
  const Home = () => (
    <div style={{ padding: "20px" }}>
      <h2>Welcome 👋</h2>
      <p>Select a feature from the menu above.</p>
    </div>
  );

  // Wrapping components into "pages"
  const ImageToPdfPage = () => <ImageToPdf backendUrl={backendUrl} />;
  // const AsyncImageToPdfPage = () => <AsyncImageToPdf backendUrl={backendUrl} />;
  // const WordToPdfPage = () => <WordToPdf backendUrl={backendUrl} />;
  // const ImageCompressionPage = () => <ImageCompression backendUrl={backendUrl} />;

  return (
    <Router>
      <Header />
      {/* <Navbar /> */}
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-to-pdf" element={<ImageToPdfPage />} />
          {/* <Route path="/async-image-to-pdf" element={<AsyncImageToPdfPage />} />
       <Route path="/word-to-pdf" element={<WordToPdfPage />} />
          <Route path="/image-compression" element={<ImageCompressionPage />} />
          <Route path="/merge-pdfs" element={<MergePdfs backendUrl={backendUrl} />} /> */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
