import { employeeProfileSample } from '@/assets/employeedata'
import { BankPayrollTab } from '@/components/profile/BankDetailsTab'
import { DocumentsTab } from '@/components/profile/DocumentsTab'
import { JobDetailsTab } from '@/components/profile/JobDetailsTab'
import { PersonalDetailsTab } from '@/components/profile/PersonalDetailsTab'
import { ProfileHeader, ProfileTabs, StickySaveBar } from '@/components/profile/ProfileHeaderTabs'
import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'

const Profile = () => {

    // const { id } = useParams();
    // const isSelfProfile = !id;     // /dashboard/profile
    // const employeeId = id ?? "me"; // backend resolves "me"

    // initialProfile = the normalized, backend-fetched snapshot of the employee profile at the moment the page loads.
    const initialProfile = employeeProfileSample
    const [activeTab, setActiveTab] = useState("personal")
    const userRole = "Employee"
    const [original, setOriginal] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [saving, setSaving] = useState(false);

    const handleStatusChange = () => {

    }

    const handleDeactivate = () => {

    }

    const handleJobChange = () => {

    }

    const handleUpload = () => {

    }

    const handleReplace = () => {

    }

    const handleBankChange = () => {

    }

    const handleVerify = () => {

    }

    const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(original);

    const handleChange = (section, key, value) => {
        setDraft((prev) => ({
        ...prev,
        [section]: {
            ...prev[section],
            [key]: value,
        },
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        // 🔗 API call here
        // await updateEmployeeProfile(draft);

        setOriginal(draft);
        setSaving(false);
    };

    const handleCancel = () => {
        setDraft(original);
    };

    useEffect(() => {
        const handler = (e) => {
            if (!hasUnsavedChanges) return;
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges]);


  return (
    <div>
        <ProfileHeader
            employee= {employeeProfileSample.master}
            userRole="Employee" //{userRole} // "HR" | "EMPLOYEE" | "ADMIN"
            onEditStatus={handleStatusChange}
            onDeactivate={handleDeactivate}
        />

        <ProfileTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            userRole={userRole}
        />

        {
            activeTab === "personal" && <PersonalDetailsTab
                data={employeeProfileSample.personal}
                masterData={employeeProfileSample.master}
                role="EMPLOYEE"
                onChange={handleChange}
            />
        }
        {
            activeTab === "job" && <JobDetailsTab
                master={employeeProfileSample.master}
                job={employeeProfileSample.job}
                role={userRole}
                onChange={handleJobChange}
            />

        }
        {
            activeTab === "bank" && <BankPayrollTab
                data={employeeProfileSample.bank}
                role={userRole}
                onChange={handleBankChange}
                onVerify={handleVerify}
            />

        }
        {
            activeTab === "documents" && <DocumentsTab
                documents={employeeProfileSample.documents}
                role={userRole}
                onUpload={handleUpload}
                onReplace={handleReplace}
            />
        }

        <StickySaveBar
            visible={hasUnsavedChanges}
            saving={saving}
            onSave={handleSave}
            onCancel={handleCancel}
        />


    </div>
  )
}

export default Profile
