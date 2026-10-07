import React, { useState } from "react";
import "./Contactpage.css";
import Navbar from './../../components/Navbar/Navbar';
import Footer from './../../components/Footer/Footer';

function ContactPage() {
  // Basic state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Per-field local messages (only the required-email check is done client-side).
  const [fieldErrors, setFieldErrors] = useState({});
  // Form-level notice: a success message after the form is submitted locally.
  const [banner, setBanner] = useState(null); // { type: "success" | "error", text }

  // Drops a field's error the moment the user edits it, so a stale message
  // never sits under an input the user has already fixed.
  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Renders the first message for a field, if there is one.
  const errorFor = (field) => fieldErrors[field]?.[0];

  // Handles form submit — no backend involved for now.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Keep the existing local email check.
    if (!email.trim()) {
      setBanner(null);
      setFieldErrors({ email: ["Please enter your email address."] });
      return;
    }

    setFieldErrors({});
    setBanner({ type: "success", text: "Thank you, we'll get back to you soon." });

    // Reset the form after a successful submit.
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");

    // TODO: connect to backend/email service when re-enabled.
  };

  return (
    <>
      {/* Navbar sits outside the constrained container so it can be full-width */}
      <Navbar />

      <div className="contact-page container">
        {/* Head Office Section */}
        <section className="office-section">
          <h2 className="section-title">Head Office</h2>
          <h3 className="company-name">M-Basics by Maria B Designs Private Limited</h3>

          <p className="office-info">
            5.5 KM, Raiwind Road (Near Fatehbad Village) Lahore, Pakistan.
          </p>
          <p className="office-info">Timings: Monday to Saturday</p>
          <p className="office-info">(09:00 am to 05:00 pm)</p>
          <p className="office-info">
            Email Us: <a href="mailto:maison.hues11@gmail">maison.hues11@gmail</a>
          </p>
        </section>

        {/* Online Order Queries Section */}
        <section className="office-section">
          <h2 className="section-title">For Online Order Queries</h2>
          <h3 className="company-name">M-Basics by Maria B Designs Private Limited</h3>

          <p className="office-info">Customer Service Timings:</p>
          <p className="office-info">
            Monday to Saturday (11:00 am to 11:00 pm)(09:00 am to 05:00 pm)
          </p>
          <p className="office-info">
            <a href="tel:+923111162742">+92 311 1162742</a>
          </p>
          <p className="office-info">
            Email Us: <a href="mailto:help@mbasics.ae">help@mbasics.ae</a>
          </p>
        </section>

        {/* Contact Form Section */}
        {/* noValidate: validation is done locally (on submit) so we control
            the messages shown instead of the browser's built-in bubbles. */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {/* Form-level notice — success, rate limit, or a failed request */}
          {banner && (
            <p
              className={"form-banner form-banner--" + banner.type}
              role="status"
              aria-live="polite"
            >
              {banner.text}
            </p>
          )}

          {/* First name / Last name row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={handleChange("firstName", setFirstName)}
                aria-invalid={Boolean(errorFor("firstName"))}
              />
              {errorFor("firstName") && (
                <p className="field-error">{errorFor("firstName")}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={handleChange("lastName", setLastName)}
                aria-invalid={Boolean(errorFor("lastName"))}
              />
              {errorFor("lastName") && (
                <p className="field-error">{errorFor("lastName")}</p>
              )}
            </div>
          </div>

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange("email", setEmail)}
              aria-invalid={Boolean(errorFor("email"))}
            />
            {errorFor("email") && (
              <p className="field-error">{errorFor("email")}</p>
            )}
          </div>

          {/* Message field */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Your message"
              rows="5"
              value={message}
              onChange={handleChange("message", setMessage)}
              aria-invalid={Boolean(errorFor("message"))}
            />
            {errorFor("message") && (
              <p className="field-error">{errorFor("message")}</p>
            )}
          </div>

          {/* Submit button */}
          <button type="submit" className="theme-btn">
            Send Message
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default ContactPage;
