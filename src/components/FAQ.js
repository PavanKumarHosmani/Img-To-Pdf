import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "Is this converter free?",
      answer: "Yes, this tool is 100% free. You can convert unlimited images into PDF without cost."
    },
    {
      question: "Do I need to install software?",
      answer: "No installation needed. This works directly in your browser on desktop and mobile devices."
    },
    {
      question: "Which formats are supported?",
      answer: "You can upload JPG, PNG, JPEG, and WebP images for conversion."
    },
    {
      question: "Is it secure?",
      answer: "Yes, your files are processed securely and never shared."
    }
  ];

  return (
    <section style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>Frequently Asked Questions</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} style={{ marginBottom: 15, textAlign: "left" }}>
          <h3 style={{ fontSize: "1.1rem", color: "#1E40AF" }}>{faq.question}</h3>
          <p style={{ marginTop: 5, color: "#333" }}>{faq.answer}</p>
        </div>
      ))}
    </section>
  );
};

export default FAQ;
