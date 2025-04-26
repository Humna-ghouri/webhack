import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { pakistaniCities } from '../utils/cities';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoanRequestForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get loan details from navigation state
    const passedLoanDetails = location.state?.loanDetails || {};
    
    const [formData, setFormData] = useState({
        applicantName: '',
        applicantEmail: '',
        applicantCNIC: '',
        guarantorName: '',
        guarantorEmail: '',
        guarantorLocation: '',
        guarantorCNIC: '',
        address: '',
        city: '',
        country: 'Pakistan',
        phoneNumber: '',
        appointmentDate: '',
        userPhoto: null,
        userPhotoUrl: '',
    });

    const [loanTerms, setLoanTerms] = useState({
        amount: passedLoanDetails.amount || 0,
        tenure: passedLoanDetails.tenure || 0,
        interestRate: passedLoanDetails.interestRate || 0,
        emi: passedLoanDetails.emi || 0,
        loanType: passedLoanDetails.loanType || '',
        subcategory: passedLoanDetails.subcategory || '',
        maxAmount: passedLoanDetails.maxAmount || 0,
        loanPeriod: passedLoanDetails.loanPeriod || 0
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get(`${apiUrl}/api/auth/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data) {
                setUserData(response.data);
                setFormData(prev => ({
                    ...prev,
                    applicantName: response.data.name || '',
                    applicantEmail: response.data.email || '',
                    phoneNumber: response.data.phone || prev.phoneNumber,
                    address: response.data.address || prev.address,
                    city: response.data.city || prev.city
                }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    const validateForm = () => {
        if (!/^\d{13}$/.test(formData.applicantCNIC)) {
            Swal.fire('Error', 'Please enter a valid 13-digit CNIC', 'error');
            return false;
        }
        if (!/^(\+92|0)[1-9]\d{9}$/.test(formData.phoneNumber)) {
            Swal.fire('Error', 'Please enter a valid Pakistani phone number', 'error');
            return false;
        }
        if (!formData.appointmentDate) {
            Swal.fire('Error', 'Please select appointment date', 'error');
            return false;
        }
        if (!formData.userPhoto) {
            Swal.fire('Error', 'Please upload your photo', 'error');
            return false;
        }
        if (!formData.city) {
            Swal.fire('Error', 'Please select your city', 'error');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire('Error', 'Image size should be less than 2MB', 'error');
                return;
            }
            if (!file.type.match('image.*')) {
                Swal.fire('Error', 'Please upload an image file', 'error');
                return;
            }
            setFormData(prev => ({
                ...prev,
                userPhoto: file,
                userPhotoUrl: URL.createObjectURL(file),
            }));
        }
    };

// LoanRequestForm.js (only showing the modified handleSubmit function)
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const formDataToSend = new FormData();
        
        // Add all form data
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'userPhoto' && key !== 'userPhotoUrl') {
                formDataToSend.append(key, value);
            }
        });
        
        // Add loan terms - ensure loanType is included
        Object.entries(loanTerms).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        
        // Add photo
        formDataToSend.append('userPhoto', formData.userPhoto);

        // Debug: Log what's being sent
        console.log('Submitting loan with type:', loanTerms.loanType);
        
        const response = await axios.post(
            `${apiUrl}/api/loans/submit`,
            formDataToSend,
            {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        await Swal.fire('Success!', 'Loan submitted successfully', 'success');
        navigate(`/slip-generation/${response.data.loanId}`);
        
    } catch (err) {
        const errorMsg = err.response?.data?.message || 'Submission failed';
        setError(errorMsg);
        await Swal.fire('Error!', errorMsg, 'error');
    } finally {
        setIsSubmitting(false);
    }
};

return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Loan Application Form</h1>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

            {/* Loan Terms Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h2 className="text-lg font-semibold mb-3 text-blue-800">Loan Terms</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Loan Type</p>
                        <p className="text-lg font-bold text-blue-600">{loanTerms.loanType}</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Subcategory</p>
                        <p className="text-lg font-bold text-blue-600">{loanTerms.subcategory}</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Amount</p>
                        <p className="text-lg font-bold text-blue-600">
                            {loanTerms.amount ? loanTerms.amount.toLocaleString() + ' PKR' : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Tenure</p>
                        <p className="text-lg font-bold text-blue-600">{loanTerms.tenure} months</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Interest Rate</p>
                        <p className="text-lg font-bold text-blue-600">{loanTerms.interestRate}%</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Monthly EMI</p>
                        <p className="text-lg font-bold text-blue-600">
                            {loanTerms.emi ? loanTerms.emi + ' PKR' : 'N/A'}
                        </p>
                    </div>
                    {loanTerms.maxAmount > 0 && (
                        <div className="bg-white p-3 rounded border">
                            <p className="text-gray-600">Max Amount</p>
                            <p className="text-lg font-bold text-blue-600">
                                {loanTerms.maxAmount.toLocaleString()} PKR
                            </p>
                        </div>
                    )}
                    <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Loan Period</p>
                        <p className="text-lg font-bold text-blue-600">{loanTerms.loanPeriod} years</p>
                    </div>
                </div>
            </div>

            {/* Rest of your form remains the same */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Applicant Section */}
                <div className="border p-6 rounded-lg border-blue-100 bg-white">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Applicant Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="applicantName"
                                value={formData.applicantName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                readOnly={!!userData?.name}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="applicantEmail"
                                value={formData.applicantEmail}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                readOnly={!!userData?.email}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">CNIC (without dashes)</label>
                            <input
                                type="text"
                                name="applicantCNIC"
                                value={formData.applicantCNIC}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="4230112345678"
                                required
                                maxLength="13"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="03001234567"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="border p-6 rounded-lg border-blue-100 bg-white">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Address Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-gray-700 font-medium">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">City</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select City</option>
                                {pakistaniCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Guarantor Section */}
                <div className="border p-6 rounded-lg border-blue-100 bg-white">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Guarantor Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="guarantorName"
                                value={formData.guarantorName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="guarantorEmail"
                                value={formData.guarantorEmail}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Location</label>
                            <input
                                type="text"
                                name="guarantorLocation"
                                value={formData.guarantorLocation}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">CNIC (without dashes)</label>
                            <input
                                type="text"
                                name="guarantorCNIC"
                                value={formData.guarantorCNIC}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="4230112345678"
                                required
                                maxLength="13"
                            />
                        </div>
                    </div>
                </div>

                {/* Appointment Section */}
                <div className="border p-6 rounded-lg border-blue-100 bg-white">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Appointment Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-gray-700 font-medium">Appointment Date</label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="flex items-end">
                            <div className="bg-blue-50 p-4 rounded-lg w-full">
                                <p className="text-blue-800 font-medium">Documents Required:</p>
                                <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                                    <li>Original CNIC</li>
                                    <li>Proof of Income</li>
                                    <li>2 Passport Size Photos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo Upload Section */}
                <div className="border p-6 rounded-lg border-blue-100 bg-white">
                    <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Photo Upload</h2>
                    <div className="flex flex-col items-center">
                        <div
                            onClick={handleImageClick}
                            className="w-40 h-40 border-2 border-dashed border-blue-300 rounded-full flex justify-center items-center cursor-pointer mb-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            {formData.userPhotoUrl ? (
                                <img
                                    src={formData.userPhotoUrl}
                                    alt="User Preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-blue-500 font-medium mt-2 block">Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 text-center">Upload a clear passport-size photo (JPG/PNG, Max 2MB)</p>
                        <input
                            type="file"
                            name="userPhoto"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-70 transition-all font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Your Application...
                            </>
                        ) : (
                            'Submit Loan Application'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoanRequestForm;