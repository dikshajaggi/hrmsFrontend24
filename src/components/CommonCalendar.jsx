import { useState, useEffect, useMemo } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { sampleData } from "../assets/sampleData.js";
import DashboardLoading from './DashboardLoading.jsx';
import BranchSelect from './BranchSelect.jsx';
import './calendar-modern.css';

const localizer = momentLocalizer(moment);

const CommonCalendar = () => {
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedBranch, setSelectedBranch] = useState("delhi");

  const fetchCalendarEvents = async () => {
    setLoading(true);
    try {
      const data = sampleData;
      setEvents(
        data.events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      );
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, [selectedBranch]);

  // Precompute event type map for performance
  const eventTypeMap = useMemo(() => {
    const map = {};
    events.forEach(e => {
      const key = moment(e.start).format('YYYY-MM-DD');
      map[key] = e.type;
    });
    return map;
  }, [events]);

  const cellStyles = {
    holiday: { backgroundColor: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid #ef4444' },
    birthday: { backgroundColor: 'rgba(249, 115, 22, 0.08)', borderLeft: '3px solid #f97316' },
    weekendOff: { backgroundColor: 'rgba(107, 114, 128, 0.05)', borderLeft: '3px solid #6b7280' },
  };

  const eventStyleGetter = event => {
    const styles = {
      holiday: { backgroundColor: '#ef4444', borderLeft: '4px solid #dc2626' },
      birthday: { backgroundColor: '#f97316', borderLeft: '4px solid #ea580c' },
      weekendOff: { backgroundColor: '#6b7280', borderLeft: '4px solid #4b5563' },
    };
    return {
      style: {
        ...styles[event.type],
        borderRadius: '0.5rem',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '600',
        padding: '0.375rem 0.75rem',
        border: 'none',
        display: 'block',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      },
    };
  };

  const dayPropGetter = date => {
    const type = eventTypeMap[moment(date).format('YYYY-MM-DD')];
    return type ? { style: cellStyles[type] } : {};
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
      {loading ? (
        <DashboardLoading />
      ) : (
        <div className="w-full max-w-7xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
              {selectedBranch === "all" ? `${selectedBranch} Branches` : `${selectedBranch} Branch`}
            </h2>
            <BranchSelect
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </div>

          {/* Responsive wrapper */}
          <div className="bg-white/70 rounded-2xl p-4 sm:p-6 border border-white/30 shadow-sm overflow-x-auto">
            <div className="min-w-[1000px] sm:min-w-full min-h-[600px] md:min-h-[700px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                view={view}
                date={date}
                onView={setView}
                onNavigate={date => setDate(new Date(date))}
                defaultView="month"
                style={{ height: '100%', minHeight: "650px", width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonCalendar;
