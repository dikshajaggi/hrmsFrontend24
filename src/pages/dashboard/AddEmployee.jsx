import { getBranches, getDepartments, getDesignations, getProjectSites } from "@/apis";
import { Grid, Input, RadioGroup, Section, Select } from "@/components/AddEmployeeReusable";
import { useEffect, useState } from "react";

export default function AddEmployee() {
    const [showPersonal, setShowPersonal] = useState(false);
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [projectSites, setProjectSites] = useState([]);
    const [noticePeriod, setNoticePeriod] = useState(0);

    const handleNoticePeriod = (e) => {
        const value = e.target.value;

        if (value === "") {
        setNoticePeriod("");
        return;
        }

        const numericValue = Number(value);

        if (numericValue >= 0) {
        setNoticePeriod(numericValue);
        }
    }


    async function fetchSettings() {
        try {
        // const res = await getHRSettings(); 
        // setNoticePeriod(res.default_notice_period_days);
        setNoticePeriod(60)
        } catch (err) {
        console.error("Failed to fetch HR settings", err);
        }
    }

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
        fetchMasters();
        fetchSettings()
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
            <Input label="Employee Code" required />
            <Input label="Full Name" required />
            <Input label="Date of Joining" type="date" required />
          </Grid>
        </Section>
        {/* SECTION 2: ORGANIZATION DETAILS */}
        <Section title="Organization Details">
          <Grid>
            <Select label="Branch" options={branches.slice(1)} required /> 
            <Select label="Department" options={departments.slice(1)} />
            <Select label="Designation" options={designations.slice(1)} />
            <Select label="Project Site" options={projectSites.slice(1)} />
          </Grid>
        </Section>

        {/* SECTION 3: JOB DETAILS */}
        <Section title="Job Details">
          <Grid>
            <RadioGroup
              label="Employment Type"
              options={["Permanent", "Contract", "Intern"]}
            />
            <Input label="Reporting Manager" placeholder="Enter name" />
            <Input label="Probation Period" placeholder="e.g. 6 months" />
            <div>
                <Input label="Notice Period (days)" type="number"  min={0} value={noticePeriod} onChange={handleNoticePeriod}/>
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
            <Input label="Phone Number" />
            <Input label="Email" type="email" />
            <Select label="Gender" />
            <Input label="Date of Birth" type="date" />
            <Select label="Marital Status" />
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
          >
            Create Employee
          </button>
        </div>
      </form>
    </div>
  );
}
