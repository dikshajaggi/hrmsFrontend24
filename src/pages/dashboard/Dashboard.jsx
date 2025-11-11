import DashboardCards from '@/components/DashboardCards';
import DashboardCalendar from '@/components/DashboardCalendar';
import TodoCard from '@/components/TodoCard';
import React from 'react';
import QuickLinks from '@/components/QuickLinks';

const Dashboard = () => {
  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="flex flex-col gap-4 w-full lg:w-[70%] max-w-[1000px]">
          <DashboardCards />
          <DashboardCalendar />
        </div>
        <div className="flex justify-between flex-col gap-4 w-full lg:w-[30%] max-w-[500px]">
          <TodoCard />
          <QuickLinks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
