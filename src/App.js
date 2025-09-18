import React, { useState } from "react";
import { Helmet } from "react-helmet";
import PdfConverter from "./components/PdfConverter"; // the component we just created
import config from "./config";

function App() {
  const canonicalUrl =
    typeof window !== "undefined" ? window.location.href : "https://yourdomain.com/";

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this converter free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, this tool is 100% free. You can convert unlimited images into PDF without cost." },
      },
      {
        "@type": "Question",
        name: "Do I need to install software?",
        acceptedAnswer: { "@type": "Answer", text: "No installation needed. This works directly in your browser on desktop and mobile devices." },
      },
      {
        "@type": "Question",
        name: "Which formats are supported?",
        acceptedAnswer: { "@type": "Answer", text: "You can upload JPG, PNG, JPEG, and WebP images for conversion." },
      },
      {
        "@type": "Question",
        name: "Is it secure?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, your files are processed securely and never shared." },
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f9fafb" }}>
      <Helmet>
        <title>Free Online Image to PDF Converter | Merge JPG & PNG to PDF</title>
        <meta name="description" content="Convert images (JPG, PNG, WebP) to a single PDF online for free. Fast, secure, no signup required." />
        <meta name="keywords" content="image to pdf, convert jpg to pdf, png to pdf, free pdf tool, merge images to pdf" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Free Online Image to PDF Converter" />
        <meta property="og:description" content="Easily merge JPG, PNG, and WebP images into a single PDF online." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${canonicalUrl}/og-image.jpg`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Image to PDF Converter" />
        <meta name="twitter:description" content="Convert images to PDF online for free. Works with JPG, PNG, WebP." />
        <meta name="twitter:image" content={`${canonicalUrl}/og-image.jpg`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Header */}
      <header style={{ background: "#1E40AF", color: "white", padding: "16px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>Free Online Image to PDF Converter</h1>
        <p style={{ margin: "8px 0 0" }}>Merge multiple images into a single high-quality PDF</p>
      </header>

      {/* Main tool */}
      <main style={{ flex: 1, padding: "20px" }}>
        <section style={{ display: "flex", justifyContent: "center" }}>
          <PdfConverter backendUrl={config.backendUrl || "http://localhost:8080/api/v1"} />
        </section>

        {/* FAQ Section */}
        <section style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>Frequently Asked Questions</h2>
          {faqSchema.mainEntity.map((faq, idx) => (
            <div key={idx} style={{ marginBottom: 15, textAlign: "left" }}>
              <h3 style={{ fontSize: "1.1rem", color: "#1E40AF" }}>{faq.name}</h3>
              <p style={{ marginTop: 5, color: "#333" }}>{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#1F2937", color: "#D1D5DB", padding: "12px 20px", textAlign: "center" }}>
        <p>© 2025 My Converter App | Built with React & Spring Boot</p>
      </footer>
    </div>
  );
}

export default App;
