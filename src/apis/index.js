import api from "./axiosInstance";


//----------------------import apis-----------------------
export const importData = (importType, formData) => {
  return api.post(`/import/${importType}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


//----------------------employee apis-----------------------
export const getEmployees = async () => {
  const res = await api.get("/emp");
  return res.data.data;
};