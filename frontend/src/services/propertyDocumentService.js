import api from "./api";

export const uploadDocument = async (propertyId, formData) => {
  const response = await api.post(
    `/property-documents/${propertyId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getDocuments = async (propertyId) => {
  const response = await api.get(`/property-documents/${propertyId}`);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/property-documents/${id}`);
  return response.data;
};