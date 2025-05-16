import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        emergencyContact: '',
        caseId: '',
        location: '',
        species: '',
        dateTime: '',
        biteSite: '',
        patientId: '',
        vaccinationStatus: '',
        vaccinationDate: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        const handleSaveData = async () => {
        const requiredFields = [
            'fullName', 'age', 'gender', 'phoneNumber', 'email', 'address', 'emergencyContact',
            'caseId', 'location', 'species', 'dateTime', 'biteSite',
            'patientId', 'vaccinationStatus', 'vaccinationDate'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in the ${field} field.`);
                return;
            }
        }

        setError('');

        const payload = {
            personalInfo: {
                full_name: formData.fullName,
                age: formData.age,
                gender: formData.gender,
                phone_number: formData.phoneNumber,
                email: formData.email,
                address: formData.address,
                emergency_contact: formData.emergencyContact
            },
            incidentData: {
                case_id: formData.caseId,
                location: formData.location,
                species: formData.species,
                date_time: formData.dateTime,
                bite_site: formData.biteSite
            },
            patientData: {
                patient_id: formData.patientId,
                vaccination_status: formData.vaccinationStatus,
                vaccination_date: formData.vaccinationDate
            }
        };

        try {
            const response = await fetch('http://localhost:8000/api/save-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Data saved successfully!');
                handleClearForm();
            } else {
                alert('Error saving data: ' + JSON.stringify(data));
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Network error. Unable to connect to the server.');
        }
    };


    const handleClearForm = () => {
        setFormData({
            fullName: '',
            age: '',
            gender: '',
            phoneNumber: '',
            email: '',
            address: '',
            emergencyContact: '',
            caseId: '',
            location: '',
            species: '',
            dateTime: '',
            biteSite: '',
            patientId: '',
            vaccinationStatus: '',
            vaccinationDate: ''
        });
        setError('');
    };

    const handleViewData = () => {
        console.log('Form Data:', formData);
    };

    return (
        <div className="staff-dashboard">
            <div className="logout-section">
                <h2>Staff Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <h3>Personal Information</h3>
            <div className="form-group">
                <label>Full Name:</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Gender:</label>
                <input name="gender" value={formData.gender} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Phone Number:</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Address:</label>
                <input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Emergency Contact:</label>
                <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
            </div>

            <h3>Incident Information</h3>
            <div className="form-group">
                <label>Case ID:</label>
                <input name="caseId" value={formData.caseId} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Date and Time of Bite Incident:</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Location:</label>
                <input name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Type of Animal:</label>
                <input name="species" value={formData.species} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Bite Site:</label>
                <input name="biteSite" value={formData.biteSite} onChange={handleChange} />
            </div>

            <h3>Medical Information</h3>
            <div className="form-group">
                <label>Patient ID:</label>
                <input name="patientId" value={formData.patientId} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Vaccination Status:</label>
                <input name="vaccinationStatus" value={formData.vaccinationStatus} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Vaccination Date:</label>
                <input type="date" name="vaccinationDate" value={formData.vaccinationDate} onChange={handleChange} />
            </div>

            <div className="button-group">
                <button onClick={handleSaveData}>Save All Data</button>
                <button onClick={handleClearForm}>Clear All Fields</button>
                <button onClick={handleViewData}>View Console Data</button>
            </div>
        </div>
    );
};

export default StaffDashboard;
