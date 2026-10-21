
import api from "./api";

// Upload a document for a property
export const uploadDocument = async (propertyId, formData) => {
  const response = await api.post(
    `/property-documents/${propertyId}`,
    formData
  );

  return response.data;
};

// Get documents for a property
export const getDocuments = async (propertyId) => {
  const response = await api.get(
    `/property-documents/${propertyId}`
  );

  return response.data;
};

// Delete a document by its document ID
export const deleteDocument = async (id) => {
  const response = await api.delete(
    `/property-documents/${id}`
  );

  return response.data;
};
