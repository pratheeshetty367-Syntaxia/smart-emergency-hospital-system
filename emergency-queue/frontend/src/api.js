import axios from 'axios';

// The base URL of your Django backend
const BASE_URL = 'http://localhost:8000/api';

const api = {

  // Get all patients (optional priority filter)
  getAllPatients: async (priority = null) => {
    const url = priority
      ? `${BASE_URL}/patients/?priority=${priority}`
      : `${BASE_URL}/patients/`;
    const response = await axios.get(url);
    return response.data;
  },

  // Get one patient by ID
  getPatient: async (id) => {
    const response = await axios.get(`${BASE_URL}/patients/${id}/`);
    return response.data;
  },

  // Admit a new patient
  admitPatient: async (patientData) => {
    const response = await axios.post(`${BASE_URL}/patients/`, patientData);
    return response.data;
  },

  // Update a patient's vitals
  updatePatient: async (id, updatedData) => {
    const response = await axios.put(`${BASE_URL}/patients/${id}/`, updatedData);
    return response.data;
  },

  // Discharge a patient
  dischargePatient: async (id) => {
    await axios.delete(`${BASE_URL}/patients/${id}/`);
  },

};

export default api;
