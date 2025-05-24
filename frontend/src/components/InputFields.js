import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const barangayOptions = [
    "Antipolo", "Balubal", "Bignay 1", "Bignay 2", "Bucal", "Canda", "Castañas", "Concepcion 1",
    "Concepcion Banahaw", "Concepcion Palasan", "Concepcion Pinagbakuran", "Gibanga",
    "Guisguis San Roque", "Guisguis Talon", "Janagdong 1", "Janagdong 2", "Limbon", "Lutucan 1",
    "Lutucan Bata", "Lutucan Malabag", "Mamala 1", "Mamala 2", "Manggalang 1", "Manggalang Bantilan",
    "Manggalang Kiling", "Manggalang Tulo-Tulo", "Montecillo", "Morong", "Pili", "Poblacion 1",
    "Poblacion 2", "Poblacion 3", "Poblacion 4", "Poblacion 5", "Poblacion 6", "Sampaloc 1",
    "Sampaloc 2", "Sampaloc Bogon", "Santo Cristo", "Talaan Aplaya", "Talaan Pantoc", "Tumbaga 1",
    "Tumbaga 2"
];

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', age: '', gender: '', phoneNumber: '', email: '', address: '', emergencyContact: '',
        caseId: '', location: '', species: '', dateTime: '', biteSite: '',
        patientId: '', vaccinationStatus: '', vaccinationDate: ''
    });
    const [error, setError] = useState('');


    const personalInfoFields = [
        { label: 'Full Name', name: 'fullName', type: 'text', required: true },
        { label: 'Age', name: 'age', type: 'number', required: true },
        // { label: 'Gender', name: 'gender', type: 'text', required: true },
        { label: 'Phone Number', name: 'phoneNumber', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Address', name: 'address', type: 'text', required: true },
        { label: 'Emergency Contact', name: 'emergencyContact', type: 'text', required: true },
    ];

    const incidentInfoFields = [
        
        { label: 'Date and Time of Bite Incident', name: 'dateTime', type: 'datetime-local', required: true },
        // { label: 'Type of Animal', name: 'species', type: 'text', required: true },
        { label: 'Bite Site', name: 'biteSite', type: 'text', required: true },
    ];

    const medicalInfoFields = [
        
        { label: 'Vaccination Status', name: 'vaccinationStatus', type: 'text', required: true },
        { label: 'Vaccination Date', name: 'vaccinationDate', type: 'date', required: true },
    ];

    // const handleLogout = () => {
    //     localStorage.removeItem('access');
    //     localStorage.removeItem('refresh');
    //     navigate('/login');
    // };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const goToNextPage = () => {
        const requiredFields = currentPage === 1 ? personalInfoFields : incidentInfoFields;
        const missing = requiredFields.find(field => field.required && !formData[field.name]);

        if (currentPage === 2 && !formData.location) {
            setError('Please select a Barangay.');
            return;
        }

        if (missing) {
            setError(`Please fill in the ${missing.label} field.`);
            return;
        }

        setError('');
        setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1);
        setError('');
    };

    const handleSaveData = async () => {
        const allRequiredFields = [...personalInfoFields, ...incidentInfoFields, { name: 'location', label: 'Barangay', required: true }, ...medicalInfoFields];
        for (const field of allRequiredFields) {
            if (!formData[field.name]) {
                setError(`Please fill in the ${field.label} field.`);
                setCurrentPage(
                    personalInfoFields.some(f => f.name === field.name) ? 1 :
                        incidentInfoFields.some(f => f.name === field.name) || field.name === 'location' ? 2 : 3
                );
                return;
            }
        }

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
                case_id: crypto.randomUUID(),
                location: formData.location,
                species: formData.species,
                date_time: formData.dateTime,
                bite_site: formData.biteSite
            },
            patientData: {
                patient_id: crypto.randomUUID(),
                vaccination_status: formData.vaccinationStatus,
                vaccination_date: formData.vaccinationDate
            }
        };

        try {
            // let accessToken = localStorage.getItem('token');

            // Try to send request with current token
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/api/save-data/`, payload);

            //         // 'Authorization': `Bearer ${accessToken}`
            //     },
            // });

            // If token is expired, try refreshing it
            if (response.status === 401) {
                // const refreshResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         refresh: localStorage.getItem('refresh')
                //     })
                // });

                // if (!refreshResponse.ok) {
                //     alert('Session expired. Please log in again.');
                //     navigate('/login');
                //     return;
                // }

                // const refreshData = await refreshResponse.json();
                // localStorage.setItem('access', refreshData.access); // Save new access token
                // accessToken = refreshData.access;

                // Retry the original request with the new token
                // response = await fetch(`${process.env.REACT_APP_API_URL}/api/save-data/`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         // 'Authorization': `Bearer ${accessToken}`
                //     },
                //     body: JSON.stringify(payload)
                // });
            }

            const data = response.data;

            if (data.message) {
                alert(data.message);
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
            fullName: '', age: '', gender: '', phoneNumber: '', email: '', address: '', emergencyContact: '',
            caseId: '', location: '', species: '', dateTime: '', biteSite: '',
            patientId: '', vaccinationStatus: '', vaccinationDate: ''
        });
        setError('');
        setCurrentPage(1);
    };

    return (
        <div className="staff-dashboard">
            {/* <div className="logout-section">
                <h2>Staff Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div> */}

            {error && <div className="error-message">{error}</div>}

            {currentPage === 1 && (
                <div>
                    <h3>Personal Information</h3>
                    {personalInfoFields.map(field => (
                        <div key={field.name}>
                            <label>{field.label}:</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </div>
                    ))}

                    {/* Gender select field */}
                    <div>
                        <label>Gender:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            style={{ maxHeight: '100px', overflowY: 'auto' }} // scrollable if more options added later
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <button onClick={goToNextPage}>Next</button>
                </div>
            )}


            {currentPage === 2 && (
                <div>
                    <h3>Incident Information</h3>
                    <div>
                        <label>Barangay:</label>
                        <select name="location" value={formData.location} onChange={handleChange} required>
                            <option value="">Select Barangay</option>
                            {barangayOptions.map(barangay => (
                                <option key={barangay} value={barangay}>{barangay}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Type of Animal:</label>
                        <select
                            name="species"
                            value={formData.species}
                            onChange={handleChange}
                            required
                            style={{ maxHeight: '100px', overflowY: 'auto' }}
                        >
                            <option value="">Select Animal</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>

                            <option value="Other">Other</option>
                        </select>
                    </div>


                    {incidentInfoFields.map(field => (
                        <div key={field.name}>
                            <label>{field.label}:</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </div>
                    ))}
                    <button onClick={goToPreviousPage}>Back</button>
                    <button onClick={goToNextPage}>Next</button>
                </div>
            )}

            {currentPage === 3 && (
                <div>
                    <h3>Medical Information</h3>
                    {medicalInfoFields.map(field => (
                        <div key={field.name}>
                            <label>{field.label}:</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            />
                        </div>
                    ))}
                    <button onClick={goToPreviousPage}>Back</button>
                    <button onClick={handleSaveData}>Save</button>
                    <button onClick={handleClearForm}>Clear</button>
                </div>
            )}

        </div>
    );
};

export default StaffDashboard;
