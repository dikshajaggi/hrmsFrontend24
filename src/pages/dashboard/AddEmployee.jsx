import { createEmployee, getBranches, getDepartments, getDesignations, getProjectSites } from "@/apis";
import { Grid, Input, RadioGroup, Section, Select } from "@/components/AddEmployeeReusable";
import { useEffect, useState } from "react";

export default function AddEmployee() {
    const [showPersonal, setShowPersonal] = useState(false);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [projectSites, setProjectSites] = useState([]);
    
    const employmentTypes = ["permanent", "contract", "consultant", "intern"] 
    const maritalStatus = ["married", "single"]
    const genderTypes = ["male", "female"]

    const [form, setForm] = useState({
      name: "",
      dob: "",
      employee_code: "",
      gender: "",
      date_of_joining: "",
      branch_id: "",
      department_id: "",
      designation_id: "",
      project_site_id: "",
      job_details: {
        employment_type : "",
        notice_period_days: null,
        probation_period: null,
      },
      personal_details: {
        email: "",
        contact: "",
        marital_status: ""
      },
    });

    const handleNestedChange = (section, key, value) => {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    };

    const handleChange = (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    }

    const handleSubmit = async (e) => {    
      e.preventDefault()
      console.log(form, "form chek chekc")
      try {
        const payload = {
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          employee_code: form.employee_code,
          date_of_joining: form.date_of_joining,
          branch_id: form.branch_id,
          department_id: form.department_id,
          designation_id: form.designation_id,
          project_site_id: form.project_site_id,
          job_details: {
            employment_type : form.job_details.employment_type,
            notice_period_days: form.job_details.notice_period_days,
            probation_period: form.job_details.probation_period,
          },
          personal_details: {
            email: form.personal_details.email,
            contact: form.personal_details.contact,
            marital_status: form.personal_details.marital_status,
          },
        }
    
          const res = await createEmployee(payload);
          console.log(res, "response.....")
            } catch (err) {
          console.error("Creation failed", err);
          alert("Failed to add employee");
        } 
    };

    async function fetchMasters() {
        try {
            const [branchRes, designationRes, projectSiteRes,departments] = await Promise.all([
                getBranches(),
                getDesignations(),
                getProjectSites(),
                getDepartments()
            ]);

            setBranches(branchRes);
            setDesignations(designationRes);
            setProjectSites(projectSiteRes);
            setDepartments(departments)
        } catch (err) {
            console.error("Failed to load master data", err);
        }
    }

    useEffect(() => {
        fetchMasters()
    }, []);



  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add New Employee
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Fields marked with <span className="text-red-500">*</span> are required.
          You can complete remaining details later.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6 max-w-5xl mx-auto">
        {/* SECTION 1: BASIC DETAILS */}
        <Section title="Basic Details">
          <Grid>
            <Input label="Employee Code" onChange={(e) => handleChange("employee_code", e.target.value)} required />
            <Input label="Full Name" onChange={(e) => handleChange("name", e.target.value)} required />
            <Input label="Date of Joining" type="date" onChange={(e) => {
              const value = e.target.value;
              handleChange("date_of_joining", new Date(value))}
             } required />
             <Select label="Gender" options = {genderTypes} 
              value={form.gender} 
              onChange={(e) => handleChange("gender", e.target.value)}  
              optionLabel="gender"
              optionValue="gender"
            />
            <Input label="Date of Birth" type="date"  onChange={(e) =>  {
                const value = e.target.value;
                handleChange("dob", new Date(value))
              }}
            />
          </Grid>
        </Section>
        {/* SECTION 2: ORGANIZATION DETAILS */}
        <Section title="Organization Details">
          <Grid>
            <Select
            label="Branch"
            options={branches}
            value={form.branch_id}
            onChange={(e) =>
              handleChange("branch_id", Number(e.target.value))
            }
            optionLabel="branch_name"
            optionValue="branch_id"
          />
  
          <Select
            label="Department"
            options={departments}
            value={form.department_id}
            onChange={(e) =>
              handleChange("department_id", Number(e.target.value))
            }
            optionLabel="department_name"
            optionValue="department_id"
          />
  
          <Select
            label="Designation"
            options={designations}
            value={form.designation_id}
            onChange={(e) =>{
              console.log(e.target, e.target.value, "designation value");
              handleChange("designation_id", Number(e.target.value));
            }}
            optionLabel="designation_name"
            optionValue="designation_id"
          />
  
          <Select
            label="Project Site"
            options={projectSites}
            value={form.project_site_id}
            onChange={(e) =>
              handleChange("project_site_id",Number(e.target.value))
            }
            optionLabel="site_name"
            optionValue="site_id"
          />
          </Grid>
        </Section>

        {/* SECTION 3: JOB DETAILS */}
        <Section title="Job Details">
          <Grid>
            <Select
              label="Employment Type"
              options={employmentTypes}
              value={form.job_details.employment_type}
              onChange={(e) =>
                handleNestedChange("job_details", "employment_type", e.target.value)
              }
              optionLabel="employment_type"
              optionValue="employment_type"
            />
            <Input label="Probation Period" type="text" placeholder="e.g. 6 months" value={form.job_details.probation_period} 
              onChange={(e) =>
                handleNestedChange(
                  "job_details",
                  "probation_period",
                  e.target.value
                )
            }/>
            <div>
                <Input
                  label="Notice Period (days)"
                  type="number"
                  min={0}
                  value={form.job_details.notice_period_days}
                  onChange={(e) =>
                    handleNestedChange(
                      "job_details",
                      "notice_period_days",
                      Math.max(0, Number(e.target.value))
                    )
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Default value is set from HR settings</p>
            </div>
          </Grid>
        </Section>

        {/* SECTION 4: PERSONAL DETAILS */}
        <Section
          title="Personal Details"
          collapsible
          expanded={showPersonal}
          onToggle={() => setShowPersonal(!showPersonal)}
          badge="Optional"
        >
          <Grid>
            <Input label="Phone Number" onChange={(e) => handleNestedChange("personal_details", "contact", e.target.value)} />
            <Input label="Email" type="email" onChange={(e) => handleNestedChange("personal_details", "email", e.target.value)}/>
            <Select label="Marital Status" 
              value={form.personal_details.marital_status} 
              options={maritalStatus} 
              onChange={(e) => handleNestedChange("personal_details", "marital_status", e.target.value)} 
              optionLabel="marital_status"
              optionValue="marital_status"
            />
          </Grid>
        </Section>

        {/* ACTION BAR */}
        <div className="sticky bottom-0 bg-white border-t pt-4 pb-3 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={(e) => handleSubmit(e)}
          >
            Create Employee
          </button>
        </div>
      </form>
    </div>
  );
}
