
const makeDate = (y, m, d) =>
  new Date(y, m - 1, d).toISOString().slice(0, 10);

/**
 * Employees (sample 12 employees)
 */
export const mockEmployees = [
  { employee_id: 1, employee_code: "EMP001", name: "Amit Sharma", designation_name: "Frontend Dev" },
  { employee_id: 2, employee_code: "EMP002", name: "Neha Verma", designation_name: "Backend Dev" },
  { employee_id: 3, employee_code: "EMP003", name: "Rohit Singh", designation_name: "QA Engineer" },
  { employee_id: 4, employee_code: "EMP004", name: "Pooja Malhotra", designation_name: "HR Executive" },
  { employee_id: 5, employee_code: "EMP005", name: "Karan Mehta", designation_name: "Tech Lead" },
  { employee_id: 6, employee_code: "EMP006", name: "Simran Kaur", designation_name: "Designer" },
];

/**
 * Days metadata (July 2024 example)
 * - 4th & 18th are holidays
 * - 2nd & 4th Saturdays OFF
 */
/**
 * Generate correct days of a month dynamically
 * Works for all months & leap years
 */
export function generateMockDays(year, month) {
  const days = [];
  const date = new Date(year, month - 1, 1); // month = 1–12

  while (date.getMonth() === month - 1) {
    const iso = date.toISOString().slice(0, 10);
    const weekday = date.getDay(); // 0 Sun .. 6 Sat

    const dayOfMonth = date.getDate();
    const isSaturday = weekday === 6;
    const isSunday = weekday === 0;

    days.push({
      date: iso,
      isHoliday: dayOfMonth === 4 || dayOfMonth === 18,
      holidayDescription:
        dayOfMonth === 4
          ? "Founders Day"
          : dayOfMonth === 18
          ? "Company Holiday"
          : undefined,
      isSaturdayOff: isSaturday && (dayOfMonth === 13 || dayOfMonth === 27),
      locked: isSunday
    });

    date.setDate(date.getDate() + 1);
  }

  return days;
}


/**
 * Attendance map
 */
export const mockAttendance = {
  1: {
    [makeDate(2024, 7, 1)]: { status: "present" },
    [makeDate(2024, 7, 2)]: { status: "casual_leave" },
    [makeDate(2024, 7, 3)]: { status: "half_day_casual_1" },
    [makeDate(2024, 7, 5)]: { status: "present" },
  },
  2: {
    [makeDate(2024, 7, 1)]: { status: "present" },
    [makeDate(2024, 7, 2)]: { status: "sick_leave" },
    [makeDate(2024, 7, 3)]: { status: "sick_leave_1" },
  },
  3: {
    [makeDate(2024, 7, 6)]: { status: "wfh" },
    [makeDate(2024, 7, 7)]: { status: null },
  },
};

/**
 * Final grid response
 */
export function getMockAttendanceGrid(
  page,
  pageSize,
  year, month
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    employees: mockEmployees.slice(start, end),
    days: generateMockDays(year, month),
    attendance: mockAttendance,
    pagination: {
      page,
      pageSize,
      totalEmployees: mockEmployees.length
    }
  };
}
