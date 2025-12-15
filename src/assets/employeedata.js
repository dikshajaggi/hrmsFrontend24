export const employeeMasterSample = {
  employee_id: 101,
  employee_code: "EMP-0101",
  name: "Rahul Sharma",
  dob: "1996-04-18",
  gender: "male",
  date_of_joining: "2023-06-12",
  status: "active",

  designation: {
    designation_id: 3,
    designation_name: "Senior Software Engineer",
    level: "senior",
  },

  department: {
    department_id: 2,
    department_name: "Engineering",
  },

  branch: {
    branch_id: 1,
    branch_name: "Bangalore HQ",
  },

  projectSite: {
    site_id: 5,
    site_name: "Whitefield Tech Park",
    site_type: "office",
  },
};


export const employeePersonalDetailsSample = {
  employee_id: 101,
  contact: "9876543210",
  email: "rahul.sharma@company.com",
  blood_group: "B+",
  father_or_husband_name: "Mahesh Sharma",
  marital_status: "Married",
  anniversary_date: "2021-02-14",
  current_address:
    "Flat 402, Green Residency, Whitefield, Bangalore, Karnataka - 560066",
  permanent_address:
    "House No. 21, Shastri Nagar, Jaipur, Rajasthan - 302016",
  next_to_kin_name: "Anita Sharma",
  next_to_kin_relation: "Wife",
  next_to_kin_contact: "9123456789",
  aadhaar_no: "1234-5678-9012",
  pan_no: "ABCDE1234F",
};


export const employeeJobDetailsSample = {
  employee_id: 101,
  employment_type: "permanent",
  reporting_manager_id: 42,
  probation_period: "6 months",
  notice_period_days: 30,
  notice_period_start_date: null,

  manager: {
    employee_id: 42,
    name: "Neha Verma",
    designation: {
      designation_name: "Engineering Manager",
    },
  },
};

export const employeeDocumentsSample = [
  {
    document_id: 1,
    employee_id: 101,
    doc_type: "Aadhaar Card",
    doc_path: "/docs/rahul_sharma_aadhaar.pdf",
    created_at: "2023-06-15",
  },
  {
    document_id: 2,
    employee_id: 101,
    doc_type: "PAN Card",
    doc_path: "/docs/rahul_sharma_pan.pdf",
    created_at: "2023-06-15",
  },
  {
    document_id: 3,
    employee_id: 101,
    doc_type: "Offer Letter",
    doc_path: "/docs/rahul_sharma_offer.pdf",
    created_at: "2023-06-12",
  },
];

export const bankDetails = {
  bank_name: "HDFC Bank",
  account_number: "123456789012",
  ifsc_code: "HDFC0001234",
  account_holder_name: "Rahul Sharma",
  pan_no: "ABCDE1234F",
  status: "pending", // pending | verified
};


export const employeeProfileSample = {
  master: employeeMasterSample,
  personal: employeePersonalDetailsSample,
  job: employeeJobDetailsSample,
  documents: employeeDocumentsSample,
  bank: bankDetails
};
