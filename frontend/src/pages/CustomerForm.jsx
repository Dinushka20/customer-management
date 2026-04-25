import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { COUNTRIES, CITIES } from '../utils/masterData';

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    nicNumber: '',
    mobileNumbers: [''], // Start with one empty slot
    addresses: [],
    familyMemberIds: []
  });

  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    // Fetch all customers for the Family Member dropdown
    api.get('/customers?size=1000').then(res => {
      // Exclude self if editing
      const list = res.data.content.filter(c => c.id !== Number(id));
      setAllCustomers(list);
    });

    if (isEdit) {
      api.get(`/customers/${id}`).then(res => {
        const c = res.data;
        setFormData({
          name: c.name,
          dateOfBirth: c.dateOfBirth,
          nicNumber: c.nicNumber,
          mobileNumbers: c.mobileNumbers?.length ? c.mobileNumbers : [''],
          // For addresses, we need to map the readable names back to IDs, 
          // or just assume we have IDs if backend returns them... 
          // Wait, the backend returns String names for City/Country! 
          // We must reverse lookup to get the IDs for editing.
          addresses: c.addresses.map(a => {
             const countryId = COUNTRIES.find(cnt => cnt.name === a.countryName)?.id || '';
             const cityId = CITIES.find(ct => ct.name === a.cityName)?.id || '';
             return { addressLine1: a.addressLine1, addressLine2: a.addressLine2 || '', countryId, cityId };
          }),
          familyMemberIds: c.familyMembers.map(f => f.id)
        });
      }).catch(() => toast.error('Failed to load customer details'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (index, value) => {
    const newMobiles = [...formData.mobileNumbers];
    newMobiles[index] = value;
    setFormData({ ...formData, mobileNumbers: newMobiles });
  };

  const addMobile = () => setFormData({ ...formData, mobileNumbers: [...formData.mobileNumbers, ''] });
  const removeMobile = (index) => {
    const newMobiles = formData.mobileNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, mobileNumbers: newMobiles });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    
    // Auto-clear city if country changes
    if (field === 'countryId') {
      newAddresses[index]['cityId'] = '';
    }
    
    setFormData({ ...formData, addresses: newAddresses });
  };

  const addAddress = () => setFormData({ 
    ...formData, 
    addresses: [...formData.addresses, { addressLine1: '', addressLine2: '', countryId: '', cityId: '' }] 
  });
  const removeAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: newAddresses });
  };

  const toggleFamilyMember = (memberId) => {
    const current = formData.familyMemberIds;
    if (current.includes(memberId)) {
      setFormData({ ...formData, familyMemberIds: current.filter(id => id !== memberId) });
    } else {
      setFormData({ ...formData, familyMemberIds: [...current, memberId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean payload
    const payload = {
      ...formData,
      mobileNumbers: formData.mobileNumbers.filter(m => m.trim() !== ''),
      addresses: formData.addresses.map(a => ({
        ...a,
        countryId: Number(a.countryId),
        cityId: Number(a.cityId)
      }))
    };

    try {
      if (isEdit) {
        await api.put(`/customers/${id}`, payload);
        toast.success('Customer updated successfully');
      } else {
        await api.post('/customers', payload);
        toast.success('Customer created successfully');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Validation failed. Check your inputs.');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Customer' : 'Create New Customer'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Full Name *</label>
            <input required type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>NIC Number *</label>
            <input required type="text" name="nicNumber" className="form-control" value={formData.nicNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '50%' }}>
          <label>Date of Birth *</label>
          <input required type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '30px 0' }} />

        {/* Mobile Numbers section */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Mobile Numbers</h3>
          {formData.mobileNumbers.map((mobile, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input 
                type="text" 
                placeholder="+94..." 
                className="form-control" 
                style={{ flex: 1 }}
                value={mobile} 
                onChange={(e) => handleMobileChange(index, e.target.value)} 
              />
              <button type="button" className="btn btn-danger" onClick={() => removeMobile(index)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addMobile} style={{ marginTop: '10px' }}>
            <Plus size={16} /> Add Mobile
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '30px 0' }} />

        {/* Addresses section */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Addresses</h3>
          {formData.addresses.map((address, index) => {
            const availableCities = CITIES.filter(c => c.countryId === Number(address.countryId));
            return (
              <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', marginBottom: '15px', position: 'relative' }}>
                <button type="button" className="btn btn-danger" onClick={() => removeAddress(index)} style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px' }}>
                  <Trash2 size={16} />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Address Line 1 *</label>
                    <input required type="text" className="form-control" value={address.addressLine1} onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input type="text" className="form-control" value={address.addressLine2} onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <select required className="form-control" value={address.countryId} onChange={(e) => handleAddressChange(index, 'countryId', e.target.value)}>
                      <option value="">Select Country</option>
                      {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <select required className="form-control" value={address.cityId} onChange={(e) => handleAddressChange(index, 'cityId', e.target.value)} disabled={!address.countryId}>
                      <option value="">Select City</option>
                      {availableCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn btn-secondary" onClick={addAddress} style={{ marginTop: '10px' }}>
            <Plus size={16} /> Add Address
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '30px 0' }} />

        {/* Family Members section */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Link Family Members</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allCustomers.map(c => {
              const isSelected = formData.familyMemberIds.includes(c.id);
              return (
                <div 
                  key={c.id}
                  onClick={() => toggleFamilyMember(c.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    background: isSelected ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--surface-border)'}`
                  }}
                >
                  {c.name} ({c.nicNumber})
                </div>
              );
            })}
            {allCustomers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No other customers available in the system.</p>}
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 30px' }}>
            <Save size={18} /> {isEdit ? 'Save Changes' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
