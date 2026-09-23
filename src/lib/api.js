// ============================================================
// api.js
// Single place that knows where the backend lives and how to talk to it.
// Nothing else in the app should build an API URL by hand.
// ============================================================

import axios from "axios";

// CRA only exposes env vars prefixed with REACT_APP_. See .env.example.
export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

const client = axios.create({
  baseURL: API_BASE,
  // Django reads repeated keys (?edit=a&edit=b). Axios would otherwise
  // serialise arrays as edit[]=a&edit[]=b, which the backend ignores.
  paramsSerializer: { indexes: null },
});

// True when a request was aborted by us (component unmounted, params
// changed mid-flight). These are not real errors and must not be shown.
export function isCanceled(error) {
  return axios.isCancel(error) || error?.code === "ERR_CANCELED";
}

// True for a 404 — an unknown product id, or one deactivated in the admin.
export function isNotFound(error) {
  return error?.response?.status === 404;
}

// ----------------------------------------------------------
// GET /api/products/
// `params` maps straight onto the documented query params:
//   category, collection, fabric, edit, is_best_seller, size,
//   min_price, max_price, search, sort, page, page_size
// Always resolves to the same shape, even if the API omits a key.
// ----------------------------------------------------------
export async function fetchProducts(params = {}, signal) {
  const { data } = await client.get("/products/", { params, signal });

  return {
    results: data?.results ?? [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  };
}

// ----------------------------------------------------------
// GET /api/products/<id>/
// Throws on 404 — callers check with isNotFound().
// ----------------------------------------------------------
export async function fetchProduct(id, signal) {
  const { data } = await client.get(`/products/${id}/`, { signal });
  return data;
}

// ----------------------------------------------------------
// POST /api/contact/
// Body is camelCase: { firstName, lastName, email, message }.
// Only `email` is required; the server trims whitespace itself.
// Resolves to { success, message } on 201, throws otherwise —
// callers sort the failure out with the helpers below.
// ----------------------------------------------------------
export async function submitContact(payload, signal) {
  const { data } = await client.post("/contact/", payload, { signal });
  return data;
}

// True for a 400 — the server rejected one or more fields. The body carries
// { errors: { <camelCaseField>: ["..."] } }, keyed by the names we sent.
export function isValidationError(error) {
  return error?.response?.status === 400;
}

// True for a 429 — five submissions per IP per hour, invalid ones included.
// Body is DRF's { detail: "..." }, a plain string, not per-field.
export function isRateLimited(error) {
  return error?.response?.status === 429;
}

export default client;
