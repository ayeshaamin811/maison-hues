// ============================================================
// ProductStates.jsx
// Shared loading skeleton and error UI for anything that lists products.
// GridSkeleton reuses the calling page's own grid class, so the columns
// and gaps stay exactly what that page already had.
// ============================================================

import React from "react";
import "./ProductStates.css";

// One placeholder card: image block + two text lines.
export function CardSkeleton() {
  return (
    <div className="ps-card">
      <div className="ps-block" />
      <div className="ps-line" />
      <div className="ps-line ps-line-short" />
    </div>
  );
}

// A full grid of placeholder cards. `className` is the page's existing
// grid class (e.g. "collection-page-grid") so the layout matches.
export function GridSkeleton({ className, count = 8 }) {
  return (
    <div className={className} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// Shown when the request fails outright (backend down, network error).
export function ErrorState({
  onRetry,
  message = "Sorry, we couldn't load these products.",
}) {
  return (
    <div className="ps-error" role="alert">
      <p className="ps-error-text">{message}</p>
      {onRetry && (
        <button type="button" className="ps-retry-btn" onClick={onRetry}>
          TRY AGAIN
        </button>
      )}
    </div>
  );
}
