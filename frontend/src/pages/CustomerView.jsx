import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Phone, Calendar, CreditCard, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    api.get(`/customers/${id}`).then(res => {
      setCustomer(res.data);
    }).catch(() => {
      toast.error('Failed to load customer mapping');
      navigate('/');
    });
  }, [id, navigate]);

  if (!customer) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ margin: 0 }}>Customer Details</h2>
        </div>
        <Link to={`/edit/${customer.id}`} className="btn btn-primary">
          <Edit size={18} /> Edit
        </Link>
      </div>

      {/* Basic Info */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {customer.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          System ID: {customer.id} &bull; Created: {new Date(customer.createdAt).toLocaleDateString()}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard color="var(--primary-color)" />
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NIC Number</p>
              <p style={{ fontWeight: '500' }}>{customer.nicNumber}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar color="var(--primary-color)" />
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date of Birth</p>
              <p style={{ fontWeight: '500' }}>{customer.dateOfBirth}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Contact Info */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Phone size={20} color="var(--primary-color)" /> Mobile Numbers
          </h3>
          {customer.mobileNumbers?.length ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {customer.mobileNumbers.map((num, i) => (
                <li key={i} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', marginBottom: '8px', borderRadius: '6px' }}>{num}</li>
              ))}
            </ul>
          ) : <p style={{ color: 'var(--text-muted)' }}>No mobile numbers recorded.</p>}
        </div>

        {/* Family Members */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UsersIcon size={20} color="var(--primary-color)" /> Family Linked
          </h3>
          {customer.familyMembers?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {customer.familyMembers.map((fm) => (
                <Link key={fm.id} to={`/view/${fm.id}`} style={{ padding: '8px 12px', background: 'rgba(99,102,241,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.9rem', transition: 'all 0.2s', ':hover': {background: 'var(--primary-color)'} }}>
                  {fm.name}
                </Link>
              ))}
            </div>
          ) : <p style={{ color: 'var(--text-muted)' }}>No family connections.</p>}
        </div>
      </div>

      {/* Addresses */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '12px', marginTop: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <MapPin size={20} color="var(--primary-color)" /> Known Addresses
        </h3>
        {customer.addresses?.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
            {customer.addresses.map((a) => (
              <div key={a.id} style={{ padding: '15px', borderLeft: '4px solid var(--primary-color)', background: 'rgba(0,0,0,0.2)', borderRadius: '4px 8px 8px 4px' }}>
                <p style={{ marginBottom: '5px' }}>{a.addressLine1}</p>
                {a.addressLine2 && <p style={{ marginBottom: '5px' }}>{a.addressLine2}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{a.cityName}, {a.countryName}</p>
              </div>
            ))}
          </div>
        ) : <p style={{ color: 'var(--text-muted)' }}>No addresses recorded.</p>}
      </div>
    </div>
  );
}
