import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useAuth } from './service/AuthContext.jsx';
import DashboardHeader from './pages/dashboard/DashBoardHeader';

function App() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Check if we are in the dashboard or admin area
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (isDashboard) {
    return (
      <div className="flex flex-col h-screen bg-bg-main overflow-hidden">
        {/* We use a different, cleaner Navbar for the Dashboard */}
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <Outlet /> {/* This will render the Sidebar + Page content */}
        </div>
      </div>
    );
  }

  // Normal Public Layout
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default App