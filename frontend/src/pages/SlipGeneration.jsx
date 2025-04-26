
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaPrint, FaCalendarAlt } from 'react-icons/fa';

// const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const SlipGeneration = () => {
//     const { loanRequestId } = useParams();
//     const navigate = useNavigate();
//     const [loanDetails, setLoanDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const fetchLoanDetails = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) return navigate('/login');

//             const response = await axios.get(
//                 `${apiUrl}/api/loans/details/${loanRequestId}`,
//                 {
//                     headers: { 
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 setLoanDetails(response.data.data);
//             } else {
//                 setError(response.data.message || 'Loan details not available');
//             }
//         } catch (err) {
//             console.error('Fetch error:', err);
//             setError(err.response?.data?.message || 'Failed to load details');
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 navigate('/login');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchLoanDetails(); }, [loanRequestId, navigate]);

//     const formatDateWithDay = (dateString) => {
//         if (!dateString) return 'Not specified';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-GB', {
//             weekday: 'long',
//             day: '2-digit',
//             month: 'long',
//             year: 'numeric'
//         });
//     };

//     if (loading) return <div className="text-center p-8">Loading loan details...</div>;
//     if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
//     if (!loanDetails) return <div className="text-center p-8">No loan details found</div>;

//     return (
//         <div className="max-w-4xl mx-auto p-6 print:p-0">
//             <div className="bg-white p-8 rounded-lg shadow-md print:shadow-none">
//                 <div className="flex justify-between items-center mb-6 border-b pb-4">
//                     <h1 className="text-2xl font-bold">Loan Application Slip</h1>
//                     <div className="text-right">
//                         <p className="font-semibold">Token #: {loanDetails.tokenNumber}</p>
//                         <p>Status: <span className="font-medium capitalize">{loanDetails.status}</span></p>
//                     </div>
//                 </div>

//                 {/* Loan Selection Details (from calculator selections) */}
//                 <div className="mb-4 p-4 bg-blue-50 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-2 text-blue-800">Loan Selection</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <p className="font-medium">Loan Type:</p>
//                             <p className="text-lg">{loanDetails.loanType}</p>
//                         </div>
//                         <div>
//                             <p className="font-medium">Subcategory:</p>
//                             <p className="text-lg">{loanDetails.subcategory}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Loan Calculation Details (from SweetAlert) */}
//                 <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-2 text-gray-800">Loan Calculation</h2>
//                     <div className="space-y-2">
//                         <p><span className="font-medium">Amount:</span> PKR {loanDetails.amount}</p>
//                         <p><span className="font-medium">Tenure:</span> {loanDetails.tenure} months</p>
//                         <p><span className="font-medium">Interest Rate:</span> {loanDetails.interestRate}%</p>
//                         <p><span className="font-medium">Monthly EMI:</span> PKR {loanDetails.emi}</p>
//                     </div>
//                 </div>

//                 {/* Rest of your existing slip content... */}
//                 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
//                     <div className="flex items-center">
//                         <FaCalendarAlt className="text-blue-500 mr-3 text-xl" />
//                         <div>
//                             <h3 className="font-bold text-blue-700">Your Appointment Date</h3>
//                             <p className="text-lg">
//                                 {formatDateWithDay(loanDetails.appointmentDate)} at {loanDetails.branch || 'Main Branch'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Applicant and other details sections remain the same */}
                
//                 {/* Applicant Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div>
//                         <h2 className="text-lg font-semibold mb-3 border-b pb-2">Applicant Details</h2>
//                         <div className="space-y-2">
//                             <p><span className="font-medium">Name:</span> {loanDetails.applicantName}</p>
//                             <p><span className="font-medium">Email:</span> {loanDetails.applicantEmail}</p>
//                             <p><span className="font-medium">CNIC:</span> {loanDetails.applicantCNIC}</p>
//                             <p><span className="font-medium">Phone:</span> {loanDetails.phoneNumber}</p>
//                             <p><span className="font-medium">Address:</span> {loanDetails.address}, {loanDetails.city}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <h2 className="text-lg font-semibold mb-3 border-b pb-2">Guarantor Details</h2>
//                         <div className="space-y-2">
//                             <p><span className="font-medium">Name:</span> {loanDetails.guarantorName}</p>
//                             <p><span className="font-medium">Email:</span> {loanDetails.guarantorEmail}</p>
//                             <p><span className="font-medium">CNIC:</span> {loanDetails.guarantorCNIC}</p>
//                             <p><span className="font-medium">Location:</span> {loanDetails.guarantorLocation}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Documents and Photos */}
//                 <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-8">
//                     {loanDetails.userPhoto && (
//                         <div className="text-center">
//                             <p className="font-medium mb-2">Applicant Photo</p>
//                             <img 
//                                 src={loanDetails.userPhoto} 
//                                 alt="Applicant" 
//                                 className="w-32 h-32 object-cover rounded-full border-2 border-gray-200 mx-auto"
//                             />
//                         </div>
//                     )}

//                     {loanDetails.qrCode && (
//                         <div className="text-center">
//                             <p className="font-medium mb-2">Verification QR Code</p>
//                             <img 
//                                 src={loanDetails.qrCode} 
//                                 alt="QR Code" 
//                                 className="w-32 h-32 mx-auto border border-gray-200 p-1"
//                             />
//                         </div>
//                     )}
//                 </div>

//                 {/* ... */}

//                 <div className="mt-8 text-center border-t pt-6">
//                     <button
//                         onClick={() => window.print()}
//                         className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto"
//                     >
//                         <FaPrint className="mr-2" />
//                         Print Slip
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SlipGeneration;


// ya abhi nhi hoa adhi chezn mil rahi hain abhi humay 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFilePdf, FaCalendarAlt, FaUser, FaHome, FaHandshake, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SlipGeneration = () => {
    const { loanRequestId } = useParams();
    const navigate = useNavigate();
    const [loanDetails, setLoanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLoanDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get(
                `${apiUrl}/api/loans/details/${loanRequestId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Combine loan terms and form data for display
                const details = {
                    ...response.data.data,
                    ...response.data.data.loanTerms,
                    loanType: response.data.data.loanType || response.data.data.loanTerms?.loanType || 'N/A'
                };
                setLoanDetails(details);
            } else {
                setError(response.data.message || 'Loan details not available');
            }
        } catch (err) {
            console.error('Error fetching loan details:', err);
            setError(err.response?.data?.message || 'Failed to load details');
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${apiUrl}/api/pdf/${loanRequestId}`,
                { 
                    headers: { 'Authorization': `Bearer ${token}` },
                    responseType: 'blob'
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `loan-application-${loanDetails.tokenNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download PDF');
            console.error('PDF download error:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCNIC = (cnic) => {
        if (!cnic) return '';
        return cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    };

    useEffect(() => { fetchLoanDetails(); }, [loanRequestId]);

    if (loading) return <div className="text-center p-8">Loading loan details...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!loanDetails) return <div className="text-center p-8">No loan details found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-800">Loan Application Receipt</h1>
                        <p className="text-sm text-gray-600">Application ID: {loanDetails.tokenNumber}</p>
                        <p className="text-sm text-gray-600">Submission Date: {formatDate(loanDetails.createdAt)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
                        loanDetails.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        loanDetails.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {loanDetails.status}
                    </div>
                </div>

                {/* Loan Information */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                        <FaHome className="mr-2" /> Loan Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Loan Type:</span>
                                <span className="font-semibold text-blue-600">{loanDetails.loanType}</span>
                            </div>
                            {loanDetails.subcategory && (
                                <div className="flex items-start">
                                    <span className="font-medium min-w-[120px]">Subcategory:</span>
                                    <span>{loanDetails.subcategory}</span>
                                </div>
                            )}
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Amount:</span>
                                <span className="font-semibold">PKR {loanDetails.amount?.toLocaleString()}</span>
                            </div>
                            {loanDetails.maxAmount > 0 && (
                                <div className="flex items-start">
                                    <span className="font-medium min-w-[120px]">Max Amount:</span>
                                    <span>PKR {loanDetails.maxAmount?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Tenure:</span>
                                <span>{loanDetails.tenure} months</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Interest Rate:</span>
                                <span>{loanDetails.interestRate}%</span>
                            </div>
                            {loanDetails.loanPeriod && (
                                <div className="flex items-start">
                                    <span className="font-medium min-w-[120px]">Loan Period:</span>
                                    <span>{loanDetails.loanPeriod} years</span>
                                </div>
                            )}
                            {loanDetails.emi && (
                                <div className="flex items-start">
                                    <span className="font-medium min-w-[120px]">Monthly EMI:</span>
                                    <span className="font-semibold">PKR {loanDetails.emi?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Applicant Information */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                        <FaUser className="mr-2" /> Applicant Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Full Name:</span>
                                <span>{loanDetails.applicantName}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaIdCard className="mr-1" /> CNIC:
                                </span>
                                <span>{formatCNIC(loanDetails.applicantCNIC)}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaMapMarkerAlt className="mr-1" /> Address:
                                </span>
                                <span>{loanDetails.address}, {loanDetails.city}, {loanDetails.country}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaEnvelope className="mr-1" /> Email:
                                </span>
                                <span>{loanDetails.applicantEmail}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaPhone className="mr-1" /> Phone:
                                </span>
                                <span>{formatPhone(loanDetails.phoneNumber)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guarantor Information */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                        <FaHandshake className="mr-2" /> Guarantor Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px]">Full Name:</span>
                                <span>{loanDetails.guarantorName}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaIdCard className="mr-1" /> CNIC:
                                </span>
                                <span>{formatCNIC(loanDetails.guarantorCNIC)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaEnvelope className="mr-1" /> Email:
                                </span>
                                <span>{loanDetails.guarantorEmail}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium min-w-[120px] flex items-center">
                                    <FaMapMarkerAlt className="mr-1" /> Location:
                                </span>
                                <span>{loanDetails.guarantorLocation}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointment */}
                <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                        <FaCalendarAlt className="text-blue-500 mt-1 mr-3 text-xl" />
                        <div>
                            <h3 className="font-semibold text-blue-700 text-lg">Appointment Details</h3>
                            <p className="text-lg mt-1">
                                {formatDate(loanDetails.appointmentDate)} at {loanDetails.branch || 'Main Branch'}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Please bring all required documents and arrive 15 minutes before your appointment time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Documents and Images */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div className="w-full md:w-1/2">
                        <h3 className="font-semibold mb-3 text-blue-700 text-lg">Required Documents</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Original CNIC (Applicant + Guarantor)</li>
                            <li>2 Passport Size Photos</li>
                            <li>Proof of Income (Salary slips or bank statements for last 3 months)</li>
                            <li>Utility Bill (Proof of Address not older than 3 months)</li>
                            <li>Any other documents related to your loan type</li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-6 justify-center">
                        {loanDetails.userPhoto && (
                            <div className="text-center">
                                <p className="font-medium mb-2">Applicant Photo</p>
                                <img 
                                    src={loanDetails.userPhoto} 
                                    alt="Applicant" 
                                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-200 mx-auto"
                                />
                            </div>
                        )}
                        {loanDetails.qrCode && (
                            <div className="text-center">
                                <p className="font-medium mb-2">Verification Code</p>
                                <img 
                                    src={loanDetails.qrCode} 
                                    alt="QR Code" 
                                    className="w-32 h-32 mx-auto border border-gray-200 p-1 bg-white"
                                />
                                <p className="text-xs mt-2 text-gray-600">Scan this code at the branch</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold mb-2 text-yellow-800">Important Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                        <li>This receipt is not a loan approval. Your application will be processed after document verification.</li>
                        <li>Bring original documents along with photocopies for verification.</li>
                        <li>Late arrival may result in rescheduling of your appointment.</li>
                        <li>For any queries, please contact our customer support.</li>
                    </ul>
                </div>

                {/* Action Button */}
                <div className="flex justify-center mt-8 border-t pt-6">
                    <button
                        onClick={downloadPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center text-lg transition-colors duration-300"
                    >
                        <FaFilePdf className="mr-2 text-xl" />
                        Download Application PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlipGeneration;