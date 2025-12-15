// src/components/attendance/AttendancePage.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  fetchAttendanceGrid,
  saveAttendanceBulk,
} from '../../apis/index';
import { AttendanceMonthNavigator } from './AttendanceMonthNavigator';
import { AttendanceLegend } from './AttendanceLegend';
import { AttendanceGrid } from './AttendanceGrid';
import "./attendance.css"
import { ChevronLeft, ChevronRight } from 'lucide-react';


const MIN_YEAR = 2024;
const MAX_YEAR = 2026;

export const AttendancePage = ({selectedBranch, selectedSite}) => {
  const today = new Date();

  const branchId = selectedBranch === "all" ? undefined : Number(selectedBranch); // we never send all to backend
  const siteId = selectedSite === "all" ? undefined : Number(selectedSite); // we never send all to backend

  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [year, setYear] = useState(today.getFullYear());
  const [employees, setEmployees] = useState([]);
  const [days, setDays] = useState([]);
  const [gridData, setGridData] = useState({});
  const [originalGrid, setOriginalGrid] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [pageSize] = useState(100);    // 100 employees per page (500 total = 5 pages)
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const totalEmployeesRef = useRef(0);

  // Guard: limit year
  useEffect(() => {
    if (year < MIN_YEAR) setYear(MIN_YEAR);
    if (year > MAX_YEAR) setYear(MAX_YEAR);
  }, [year]);

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
    setPage(1); // reset page on month change
  };

  const loadGrid = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchAttendanceGrid({
        branchId,
        siteId,
        month: month + 1, // API expects 1-12
        year,
        page,
        pageSize,
      });

      console.log(res, "resres")
      setEmployees(res.employees);
      setDays(res.days);
      setGridData(res.attendance);
      setOriginalGrid(JSON.parse(JSON.stringify(res.attendance)));
      totalEmployeesRef.current = res.pagination.totalEmployees;
      setUnsavedChanges(false);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Failed to load attendance. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, page, pageSize]);

  // Warn if leaving page with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [unsavedChanges]);

  const handleCellChange = (
    employeeId,
    date,
    status
  ) => {
    setGridData(prev => {
      const copy = { ...prev };
      const empData = { ...(copy[employeeId] || {}) };
      const existing = empData[date] || { status: null, remarks: null };
      empData[date] = { ...existing, status };
      copy[employeeId] = empData;
      return copy;
    });
    setUnsavedChanges(true);
  };

  const updatesToSend = useMemo(() => {
    const updates = [];
    Object.keys(gridData).forEach(empIdStr => {
      const empId = Number(empIdStr);
      const empCurrent = gridData[empId] || {};
      const empOriginal = originalGrid[empId] || {};
      Object.keys(empCurrent).forEach(date => {
        const curr = empCurrent[date];
        const orig = empOriginal[date];

        const currStatus = curr?.status ?? null;
        const origStatus = orig?.status ?? null;

        if (currStatus !== origStatus) {
          updates.push({
            employee_id: empId,
            date,
            status: currStatus,
          });
        }
      });
    });
    return updates;
  }, [gridData, originalGrid]);

  const handleSave = async () => {
    if (!updatesToSend.length) {
      setUnsavedChanges(false);
      return;
    }
    setSaving(true);
    try {
      await saveAttendanceBulk({
        month: month + 1,
        year,
        updates: updatesToSend,
      });
      // After success, treat current as original
      setOriginalGrid(JSON.parse(JSON.stringify(gridData)));
      setUnsavedChanges(false);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          'Failed to save attendance. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const totalPages = useMemo(() => {
    if (!totalEmployeesRef.current) return 1;
    return Math.max(
      1,
      Math.ceil(totalEmployeesRef.current / pageSize)
    );
  }, [pageSize]);

  return (
    <div className="flex flex-col p-6 mt-4 gap-4">
      <div className="attendance-page-header mb-4">
        <h2 className='text-xl font-semibold'>Attendance Sheet</h2>
        <AttendanceMonthNavigator
          month={month}
          year={year}
          minYear={MIN_YEAR}
          maxYear={MAX_YEAR}
          onChange={handleMonthChange}
        />
      </div>

      <AttendanceLegend />

      <div className="flex items-center gap-1 ml-auto">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer"
          onClick={handleSave}
          disabled={saving || !unsavedChanges}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {unsavedChanges && (
          <span className="text-[#b91c1c] text-sm">
            ● Unsaved changes
          </span>
        )}
      </div>

      {error && <div className="attendance-error">{error}</div>}

      <AttendanceGrid
        employees={employees}
        days={days}
        gridData={gridData}
        onCellChange={handleCellChange}
        loading={loading}
      />

      {/* Pagination for employees (500+ optimized) */}
      <div className="attendance-pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          <ChevronLeft />
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
