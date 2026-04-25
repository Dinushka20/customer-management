import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Users } from 'lucide-react';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerView from './pages/CustomerView';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="header animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary-color)', padding: '10px', borderRadius: '12px' }}>
              <Users size={28} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0 }}>OmniDB</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Customer Management System</p>
            </div>
          </div>
          <nav>
            <Link to="/" className="btn btn-secondary">Dashboard</Link>
          </nav>
        </header>

        <main className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/create" element={<CustomerForm />} />
            <Route path="/edit/:id" element={<CustomerForm />} />
            <Route path="/view/:id" element={<CustomerView />} />
          </Routes>
        </main>
        
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--surface-bg)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--surface-border)'
          }
        }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
