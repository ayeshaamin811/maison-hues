// ============================================================
// useProducts.js
// One hook for every product listing on the site. Pass the query
// params, get back the products plus loading / error state:
//
//   const { products, loading, error, retry } = useProducts({
//     category: "casual",
//     page_size: 96,
//   });
//
// In-flight requests are aborted when the params change or the
// component unmounts, so a slow response can't overwrite a newer one.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { fetchProducts, isCanceled } from "../lib/api";

export default function useProducts(params) {
  // Serialising the params gives the effect a stable dependency, so callers
  // can pass an object literal inline without causing a refetch every render.
  const paramsKey = JSON.stringify(params || {});

  // Bumped by retry() to force the effect to run again after a failure.
  const [attempt, setAttempt] = useState(0);

  const [state, setState] = useState({
    products: [],
    count: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchProducts(JSON.parse(paramsKey), controller.signal)
      .then(({ results, count }) => {
        if (!active) return;
        setState({ products: results, count, loading: false, error: null });
      })
      .catch((error) => {
        // An aborted request is expected, not a failure to report.
        if (!active || isCanceled(error)) return;
        setState({ products: [], count: 0, loading: false, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [paramsKey, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
