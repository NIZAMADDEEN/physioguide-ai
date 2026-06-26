import api from "./api";

/**
 * Report service — Flask API implementation.
 */

/**
 * Fetches all clinical therapy reports for the authenticated user.
 * @returns {Promise<Array>} List of report objects
 */
export async function getReports() {
  const response = await api.get("/reports");
  return response.data; // Expects array of reports
}

/**
 * Fetches a specific clinical report by ID.
 * @param {string} id
 * @returns {Promise<Object|null>} The report object
 */
export async function getReportById(id) {
  if (!id) return null;
  const response = await api.get(`/reports/${id}`);
  return response.data; // Expects report details
}

/**
 * Requests a PDF export for the given report.
 * Returns a blob URL suitable for triggering a browser download.
 * @param {string} id
 * @returns {Promise<string>} Blob URL
 */
export async function exportPdf(id) {
  const response = await api.get(`/reports/${id}/export`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
}
