import React, { useState } from "react";
import "./Contactpage.css";
import Navbar from './../../components/Navbar/Navbar';
import Footer from './../../components/Footer/Footer';
import {
  submitContact,
  isValidationError,
  isRateLimited,
} from "../../lib/api";

// Shown when the request never reached the server, or failed in a way the
// contract does not describe. Anything the API *does* say is shown verbatim.
const GENERIC_ERROR = "Something went wrong. Please try again.";

// The only keys that get their own message under an input. Anything else the
// server sends back is folded into the banner so it cannot be swallowed.
const FORM_FIELDS = ["firstName", "lastName", "email", "message"];

function ContactPage() {
  // Basic state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Per-field messages from a 400, keyed by the camelCase name we sent.
  const [fieldErrors, setFieldErrors] = useState({});
  // Form-level notice: the 201 message, a 429 throttle notice, or a failure.
  const [banner, setBanner] = useState(null); // { type: "success" | "error", text }
  // True while a request is in flight — blocks a second submit.
  const [submitting, setSubmitting] = useState(false);

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

  // Renders the first message for a field, if the server sent one.
  const errorFor = (field) => fieldErrors[field]?.[0];

  // Handles form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // The only check done here. Everything else — address format, length
    // limits — is the server's call, so the two cannot drift apart.
    if (!email.trim()) {
      setBanner(null);
      setFieldErrors({ email: ["Please enter your email address."] });
      return;
    }

    setSubmitting(true);
    setBanner(null);
    setFieldErrors({});

    try {
      const data = await submitContact({ firstName, lastName, email, message });

      // Use the server's wording rather than our own copy of it.
      setBanner({ type: "success", text: data?.message || "Message sent." });
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      if (isValidationError(error)) {
        const errors = error.response?.data?.errors;

        if (errors && typeof errors === "object") {
          setFieldErrors(errors);

          // Keys that have no input of their own still need to be visible.
          const stray = Object.keys(errors)
            .filter((key) => !FORM_FIELDS.includes(key))
            .map((key) => errors[key]?.[0])
            .filter(Boolean);

          if (stray.length) setBanner({ type: "error", text: stray.join(" ") });
        } else {
          setBanner({ type: "error", text: GENERIC_ERROR });
        }
      } else if (isRateLimited(error)) {
        // Not a per-field problem, so it belongs above the form.
        setBanner({
          type: "error",
          text: error.response?.data?.detail || GENERIC_ERROR,
        });
      } else {
        // No response at all (network failure), or an unexpected status.
        setBanner({ type: "error", text: GENERIC_ERROR });
      }
    } finally {
      setSubmitting(false);
    }
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
        {/* noValidate: the server owns validation, so its messages are the ones
            the user sees instead of the browser's built-in bubble. */}
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

          {/* Submit button — disabled in flight so a double-click cannot
              spend two of the five hourly submissions. */}
          <button type="submit" className="theme-btn" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default ContactPage;
