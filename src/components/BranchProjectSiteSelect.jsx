import React, { useEffect } from 'react'
import { useQuery } from 'react-query';
import { getBranches, getProjectSites } from '@/apis/index.js';
import ModernSelect from './common/ModernSelect.jsx';


// ------------------------------ branch -------------------------------------------

export const BranchSelect = ({ selectedBranch, setSelectedBranch }) => {
  
  const { data: branches = [], isLoading } = useQuery(
    ["branches"],
    getBranches,
    { refetchOnWindowFocus: false }
  );

  // Set default = Head Office
  useEffect(() => {
    if (!isLoading && branches.length > 0 && !selectedBranch) {
      const headOffice = branches.find(
        b => b.branch_name.toLowerCase() === "head office"
      );
      if (headOffice) {
        setSelectedBranch(headOffice.branch_name);
      }
    }
  }, [isLoading, branches]);

  // ADD "ALL" + branch names
  const options = branches.map(b => b.branch_name);

  return (
    <ModernSelect
      label="Branch"
      options={options}
      value={selectedBranch}
      onChange={(val) => setSelectedBranch(val)}   
    />
  );
};

// ------------------------------ project site -------------------------------------------

export const ProjectSiteSelect = ({ selectedSite, setSelectedSite }) => {
  
  const { data: projectSites = [], isLoading } = useQuery(
    ["projectSites"],
    getProjectSites,
    { refetchOnWindowFocus: false }
  );

  // Set default = Head Site 1
  useEffect(() => {
    if (!isLoading && projectSites.length > 0 && !selectedSite) {
      const headOffice = projectSites.find(
        ps => ps.site_name.toLowerCase() === "head site 1"
      );
      if (headOffice) {
        setSelectedSite(headOffice.site_name);
      }
    }
  }, [isLoading, projectSites]);


  // ADD "ALL" + project names
  const options = projectSites.map(b => b.site_name);

  return (
    <ModernSelect
      label="Project Site"
      options={options}
      value={selectedSite}
      onChange={(val) => setSelectedSite(val)}   
    />
  );
};