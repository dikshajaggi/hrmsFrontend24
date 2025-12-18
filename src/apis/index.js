import { getMockAttendanceGrid } from "@/components/dashboard-attendance/attendanceMockData";
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

//----------------------designation apis-----------------------
export const getDesignations = async () => {
 const res = await api.get("/designation");
  return res.data.data;
}

//----------------------holiday and saturday off apis-----------------------
export const getHolidays = async ({ queryKey }) => {
  const [_key, { branch_id, site_id, year }] = queryKey;

  const res = await api.get("/holidays", {
    params: { branch_id, site_id, year }
  });

  return res.data.data;
};

export const getSaturdayOffs = async ({ queryKey }) => {
  const [_key, { branch_id, site_id, year, month }] = queryKey;

  const res = await api.get("/saturdayOffs", {
    params: { branch_id, site_id, year, month }
  });

  return res.data;
};

export const setSaturdayOffRule = async ({ branch_id, site_id, off_saturdays }) => {
  const res = await api.post("/saturdayOffs/rule", {
    branch_id,
    site_id,
    off_saturdays,
  });

  return res.data;
};

export const getSaturdayRule = async ({ branch_id, site_id }) => {
  const res = await api.get("/saturdayOffs/rule", {params: { branch_id, site_id }});

  return res.data;
}

export const setSaturdayOffCustomRule = async ({ branch_id, site_id, year, month, dates }) => {
  const res = await api.post("/saturdayOffs/rule/custom", {
    branch_id,
    site_id,
    year, 
    month, 
    dates
  });
  return res.data;
};

export const getSaturdayOffCustomRule = async ({ queryKey }) => {
  const [_key, params] = queryKey;

  const { branch_id, site_id, year, month } = params;

  const res = await api.get("/saturdayOffs/rule/custom", {
    params: { branch_id, site_id, year, month }
  });

  return res.data;
};


//----------------------attendance apis------------------


export async function fetchAttendanceGrid1(
  branchId,
  siteId,
  month,
  year,
  page,
  pageSize
) {
  const params = {branchId, siteId, month, year, page, pageSize}
  const { data } = await api.get('/attendance/grid', {
    params,
  });
  return data;
}

export async function saveAttendanceBulk(month, year, updates) {
  const body = {month,  year, updates}
  const { data } = await api.post('/attendance/bulk-upsert', body);
  return data;
}

const USE_MOCK = true;


export async function fetchAttendanceGrid(
  {month,
  year,
  page,
  pageSize}
) {
  const params = {month,
  year,
  page,
  pageSize}

  if (USE_MOCK) {
    console.log(page, pageSize, "pageee")
    return getMockAttendanceGrid(params.page, params.pageSize, params.year, params.month);
  }
  return fetchAttendanceGrid1(params);
}

// export async function saveAttendanceBulk(data) {
//   if (USE_MOCK) {
//     return mockSaveAttendanceBulk1(data);
//   }
//   return realSave(data);
// }



//----------------------leave apis-----------------------

//----------------------employee apis-----------------------
export const getEmployees = async () => {
  const res = await api.get("/emp");
  return res.data.data;
};

export const updateEmployees = async (id, payload) => {
  const res = await api.patch(`/emp/${id}`, payload);
  return res.data.data;
}

export const deleteEmployees = async (id) => {
  const res = await api.delete(`/emp/${id}`);
  return res.data.data;
}