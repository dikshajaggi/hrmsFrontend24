import React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx"
import { useQuery } from 'react-query';
import { getBranches } from '@/apis/index.js';

const BranchSelect = ({selectedBranch, setSelectedBranch}) => {    
    const { data: branches = [], isLoading } = useQuery(
    ["branches"],
    getBranches,
    { refetchOnWindowFocus: false }
    );

    console.log(branches, "branches")

    return (
        <div className='flex items-center justify-evenly gap-2'>
        <label className="font-semibold">Select Branch:</label>
            <Select value={selectedBranch} 
            onValueChange={(value) => setSelectedBranch(value)}
            defaultValue="delhi">
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
                {isLoading ? <SelectGroup></SelectGroup> : <SelectGroup>
                {branches.map((item , index) => { 
                    return (
                    <SelectItem value={item.branch_name} key={index}>{item.branch_name}</SelectItem>
                    )}
                )}
                </SelectGroup>}
            </SelectContent>
            </Select>
        </div>
    )
}

export default BranchSelect
