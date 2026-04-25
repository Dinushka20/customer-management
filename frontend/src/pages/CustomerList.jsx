import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Upload, Trash2, Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import BulkUploadModal from '../components/BulkUploadModal';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', {
        params: { search, page, size: 10 }
      });
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to fetch customers');
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => fetchCustomers(), 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customers</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={18} /> Bulk Upload
          </button>
          <Link to="/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Plus size={18} /> New Customer
          </Link>
        </div>
      </div>

      <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by name or NIC..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          style={{ paddingLeft: '40px' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>NIC</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>DOB</th>
              <th style={{ padding: '12px' }}>Mobiles</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '12px' }}>{c.nicNumber}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{c.name}</td>
                <td style={{ padding: '12px' }}>{c.dateOfBirth}</td>
                <td style={{ padding: '12px' }}>
                  {c.mobileNumbers?.length ? (
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>
                      {c.mobileNumbers[0]} {c.mobileNumbers.length > 1 && `(+${c.mobileNumbers.length - 1})`}
                    </span>
                  ) : '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Link to={`/view/${c.id}`} className="btn btn-secondary" style={{ padding: '6px' }} title="View">
                      <Eye size={16} />
                    </Link>
                    <Link to={`/edit/${c.id}`} className="btn btn-primary" style={{ padding: '6px' }} title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button className="btn btn-danger" style={{ padding: '6px', minWidth: 'auto' }} onClick={() => handleDelete(c.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button 
            className="btn btn-secondary" 
            disabled={page === 0} 
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <span style={{ padding: '10px' }}>Page {page + 1} of {totalPages}</span>
          <button 
            className="btn btn-secondary" 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {isUploadModalOpen && (
        <BulkUploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onSuccess={() => { setIsUploadModalOpen(false); setPage(0); fetchCustomers(); }} 
        />
      )}
    </div>
  );
}
