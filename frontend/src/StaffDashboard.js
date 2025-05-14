import React, { useState } from 'react';

const StaffDashboard = () => {
    // State for Incident Data
    const [incidentData, setIncidentData] = useState({
        caseId: '', 
        location: '',
        species: '',
        dateTime: '',
        biteSite: ''
    });

    // State for Patient & Vaccination Records
    const [patientData, setPatientData] = useState({
        patientId: '',
        vaccinationStatus: '',
        vaccinationDate: ''
    });

    // State for Personal Information
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        age: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        emergencyContact: ''
    });

    // State for Errors
    const [error, setError] = useState('');

    // Handle input changes for Incident Data
    const handleIncidentChange = (e) => {
        setIncidentData({
            ...incidentData,
            [e.target.name]: e.target.value
        });
    };

    // Handle input changes for Patient & Vaccination Data
    const handlePatientChange = (e) => {
        setPatientData({
            ...patientData,
            [e.target.name]: e.target.value
        });
    };

    // Handle input changes for Personal Information
    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({
            ...personalInfo,
            [e.target.name]: e.target.value
        });
    };

    // Validate and Save Incident Data
    const handleSaveIncident = () => {
        if (!incidentData.location || !incidentData.species || !incidentData.dateTime || !incidentData.biteSite) {
            setError('Please fill in all the fields for the Incident Data.');
            return;
        }

        // Reset error and save incident data
        setError('');
        console.log("Incident Data Saved: ", incidentData);
        // Here you can make an API call to save the data to your backend or database
    };

    // Remove Incident Data
    const handleRemoveIncident = () => {
        setIncidentData({
            caseId: '',
            location: '',
            species: '',
            dateTime: '',
            biteSite: ''
        });
        setError('');
    };

    // Validate and Save Patient & Vaccination Data
    const handleSavePatient = () => {
        if (!patientData.vaccinationStatus || !patientData.vaccinationDate) {
            setError('Please fill in all the fields for the Patient Data.');
            return;
        }

        // Reset error and save patient data
        setError('');
        console.log("Patient Data Saved: ", patientData);
        // Here you can make an API call to save the data to your backend or database
    };

    // Remove Patient & Vaccination Data
    const handleRemovePatient = () => {
        setPatientData({
            patientId: '',
            vaccinationStatus: '',
            vaccinationDate: ''
        });
        setError('');
    };

    return (
        <div>
            <h2>Staff Dashboard</h2>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <h3>Personal Information</h3>
            <div>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Age:</label>
                <input
                    type="number"
                    name="age"
                    value={personalInfo.age}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Gender:</label>
                <input
                    type="text"
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                />
            </div>
            <div>
                <label>Emergency Contact:</label>
                <input
                    type="text"
                    name="emergencyContact"
                    value={personalInfo.emergencyContact}
                    onChange={handlePersonalInfoChange}
                />
            </div>

            <h3>Incident Information</h3>
            <div>
                <label>Case ID:</label>
                <input
                    type="text"
                    name="caseId"
                    value={incidentData.caseId}
                    onChange={handleIncidentChange}
                />
            </div>
            <div>
                <label>Date and Time of Bite Incident:</label>
                <input
                    type="datetime-local"
                    name="dateTime"
                    value={incidentData.dateTime}
                    onChange={handleIncidentChange}
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    name="location"
                    value={incidentData.location}
                    onChange={handleIncidentChange}
                />
            </div>
            <div>
                <label>Type of Animal:</label>
                <input
                    type="text"
                    name="species"
                    value={incidentData.species}
                    onChange={handleIncidentChange}
                />
            </div>
            <div>
                <label>Bite Site:</label>
                <input
                    type="text"
                    name="biteSite"
                    value={incidentData.biteSite}
                    onChange={handleIncidentChange}
                />
            </div>

            <h3>Medical Information</h3>
            
            <div>
                <label>Follow-up Vaccination Care Schedule:</label>
                <input
                    type="date"
                    name="vaccinationDate"
                    value={patientData.vaccinationDate}
                    onChange={handlePatientChange}
                />
            </div>

            <div>
                <button onClick={handleSaveIncident}>Save Incident Data</button>
                <button onClick={handleRemoveIncident}>Remove Incident Data</button>
            </div>

            <div>
                <button onClick={handleSavePatient}>Save Patient Data</button>
                <button onClick={handleRemovePatient}>Remove Patient Data</button>
            </div>
        </div>
    );
};

export default StaffDashboard;