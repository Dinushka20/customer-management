import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, UserPlus, Settings, LogOut, Bell } from 'lucide-react';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerView from './pages/CustomerView';

// Helper component to handle active links
function NavItem({ to, icon: Icon, label }) {
  const location = useLocation();
  // Basic active matching logic
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      {label}
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="dashboard-layout">
        
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div style={{ background: '#ffffff', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <Users size={24} color="var(--primary-color)" />
            </div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Customer Management</h2>
          </div>
          
          <nav className="sidebar-nav">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/create" icon={UserPlus} label="Add Customer" />
          </nav>
        </aside>

        {/* Right Main Content */}
        <main className="main-content">

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Routes>
              <Route path="/" element={<CustomerList />} />
              <Route path="/create" element={<CustomerForm />} />
              <Route path="/edit/:id" element={<CustomerForm />} />
              <Route path="/view/:id" element={<CustomerView />} />
            </Routes>
          </div>
        </main>
        
        {/* Global Toast configuration adjusted for Light Theme */}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--surface-bg)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)'
          }
        }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
