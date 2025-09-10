import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import config from "./config";

function App() {
  const canonicalUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://yourdomain.com/";

  // JSON-LD: Software schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free Online Image to PDF Converter",
    operatingSystem: "Any",
    applicationCategory: "MultimediaApplication",
    description:
      "Convert JPG, PNG, and WebP images to a single PDF online for free. Secure, fast, and works on all devices.",
    url: canonicalUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  // JSON-LD: FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this converter free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, this tool is 100% free. You can convert unlimited images into PDF without cost.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to install software?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No installation needed. This works directly in your browser on desktop and mobile devices.",
        },
      },
      {
        "@type": "Question",
        name: "Which formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can upload JPG, PNG, JPEG, and WebP images for conversion.",
        },
      },
      {
        "@type": "Question",
        name: "Is it secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, your files are processed securely and never shared.",
        },
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
      }}
    >
      <Helmet>
        <title>
          Free Online Image to PDF Converter | Merge JPG & PNG to PDF
        </title>
        <meta
          name="description"
          content="Convert images (JPG, PNG, WebP) to a single PDF online for free. Fast, secure, no signup required."
        />
        <meta
          name="keywords"
          content="image to pdf, convert jpg to pdf, png to pdf, free pdf tool, merge images to pdf"
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Free Online Image to PDF Converter" />
        <meta
          property="og:description"
          content="Easily merge JPG, PNG, and WebP images into a single PDF online."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${canonicalUrl}/og-image.jpg`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free Online Image to PDF Converter"
        />
        <meta
          name="twitter:description"
          content="Convert images to PDF online for free. Works with JPG, PNG, WebP."
        />
        <meta
          name="twitter:image"
          content={`${canonicalUrl}/og-image.jpg`}
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Header */}
      <header
        style={{
          background: "#1E40AF",
          color: "white",
          padding: "16px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Free Online Image to PDF Converter</h1>
        <p style={{ margin: "8px 0 0" }}>
          Merge multiple images into a single high-quality PDF
        </p>
      </header>

      {/* Main tool */}
      <main style={{ flex: 1, padding: "20px" }}>
        <section style={{ display: "flex", justifyContent: "center" }}>
          <PdfConverter />
        </section>

        {/* FAQ Section */}
        <section
          style={{
            maxWidth: 800,
            margin: "40px auto",
            padding: "0 20px",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqSchema.mainEntity.map((faq, idx) => (
              <div key={idx} style={{ marginBottom: 15, textAlign: "left" }}>
                <h3 style={{ fontSize: "1.1rem", color: "#1E40AF" }}>
                  {faq.name}
                </h3>
                <p style={{ marginTop: 5, color: "#333" }}>
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "#1F2937",
          color: "#D1D5DB",
          padding: "12px 20px",
          textAlign: "center",
        }}
      >
        <p>© 2025 My Converter App | Built with React & Spring Boot</p>
      </footer>
    </div>
  );
}

// Inline PdfConverter
const PdfConverter = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async () => {
    if (files.length === 0) return alert("Please select at least one image");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      setProgress(0);

      const response = await axios.post(`${config.backendUrl}/convert`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setLoading(false);
      setProgress(0);
    } catch (err) {
      console.error("Conversion failed:", err);
      alert("PDF conversion failed.");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        minWidth: 260,
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 20, color: "#333", fontSize: "1.3rem" }}>
        📑 Upload & Convert
      </h2>
{/* Hidden file input */}
<input
  id="fileInput"
  type="file"
  multiple
  accept="image/*"
  onChange={handleFileChange}
  disabled={loading}
  style={{ display: "none" }}
/>

{/* Custom styled button */}
<label
  htmlFor="fileInput"
  style={{
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#1E40AF",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background 0.3s",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1E40AF")}
>
  📂 Choose Images
</label>


      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 20px",
          backgroundColor: loading ? "#aaa" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem",
          marginTop: 10,
          transition: "background 0.3s",
        }}
      >
        {loading ? "Converting…" : "Convert to PDF"}
      </button>

      {/* Show file list */}
      {files.length > 0 && (
        <ul style={{ marginTop: 20, textAlign: "left" }}>
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}

      {/* Progress Bar */}
      {loading && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              height: 20,
              width: "100%",
              backgroundColor: "#f3f3f3",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,.2)",
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
                fontSize: "0.8rem",
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

export default App;
