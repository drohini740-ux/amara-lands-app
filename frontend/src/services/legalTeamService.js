import api from "./api";

// =====================================================
// LEGAL TEAM SERVICE
// API prefix: /api/v1
// Backend routes: /legal-team/cases
// =====================================================

// Get all legal cases for the Legal Team
export const getAllLegalCases = async () => {
  const response = await api.get("/legal-team/cases");
  return response.data;
};

// Get one legal case by ID
export const getLegalCaseById = async (id) => {
  const response = await api.get(`/legal-team/cases/${id}`);
  return response.data;
};