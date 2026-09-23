// ============================================================
// useProduct.js
// Single-product version of useProducts, for the detail page.
// Separates "request failed" from "product does not exist", because
// the two need different UI: a retry message vs the not-found screen.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { fetchProduct, isCanceled, isNotFound } from "../lib/api";

export default function useProduct(id) {
  const [attempt, setAttempt] = useState(0);

  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    // No id in the URL at all — nothing to fetch.
    if (!id) {
      setState({ product: null, loading: false, error: null, notFound: true });
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    setState({ product: null, loading: true, error: null, notFound: false });

    fetchProduct(id, controller.signal)
      .then((product) => {
        if (!active) return;
        setState({ product, loading: false, error: null, notFound: false });
      })
      .catch((error) => {
        if (!active || isCanceled(error)) return;

        // A 404 is a real answer ("no such product"), not a broken request.
        setState({
          product: null,
          loading: false,
          error: isNotFound(error) ? null : error,
          notFound: isNotFound(error),
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
