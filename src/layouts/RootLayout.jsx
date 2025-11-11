import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="min-h-screen w-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;
