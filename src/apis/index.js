import api from "./axiosInstance";


//----------------------import apis-----------------------
export const importData = (importType, formData) => {
  return api.post(`/import/${importType}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


//----------------------branch apis-----------------------
export const getBranches = async () => {
 const res = await api.get("/branch");
  return res.data.data;
}

//----------------------project site apis-----------------------
export const getProjectSites = async () => {
 const res = await api.get("/projectSite");
  return res.data.data;
}

//----------------------department apis-----------------------
export const getDepartments = async () => {
 const res = await api.get("/department");
  return res.data.data;
}

//----------------------employee apis-----------------------
export const getEmployees = async () => {
  const res = await api.get("/emp");
  return res.data.data;
};