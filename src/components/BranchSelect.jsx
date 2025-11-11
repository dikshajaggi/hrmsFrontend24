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

const branches = [
  { value: "delhi", label: 'Delhi' },
  { value: "pune", label: 'Pune' },
  { value: "kochi", label: 'Kochi' },
  { value: "mumbai", label: 'Mumbai' },
  { value: "all", label: 'All' }
];

const BranchSelect = ({selectedBranch, setSelectedBranch}) => {    
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
                <SelectGroup>
                {branches.map((item , index) => { 
                    return (
                    <SelectItem value={item.value} key={index}>{item.label}</SelectItem>
                    )}
                )}
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
    )
}

export default BranchSelect
