import React, { useState } from 'react';

function AdmitForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'M',
    chief_complaint: '',
    heart_rate: '',
    systolic_bp: '',
    spo2: '',
    temperature: '',
    respiratory_rate: '',
    gcs_score: 15,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Admit New Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Chief Complaint</label>
              <input name="chief_complaint" value={form.chief_complaint} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Heart Rate (bpm)</label>
              <input name="heart_rate" type="number" value={form.heart_rate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Systolic BP (mmHg)</label>
              <input name="systolic_bp" type="number" value={form.systolic_bp} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>SpO₂ (%)</label>
              <input name="spo2" type="number" value={form.spo2} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Temperature (°C)</label>
              <input name="temperature" type="number" step="0.1" value={form.temperature} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Respiratory Rate</label>
              <input name="respiratory_rate" type="number" value={form.respiratory_rate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>GCS Score (3-15)</label>
              <input name="gcs_score" type="number" min="3" max="15" value={form.gcs_score} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Admit Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdmitForm;
