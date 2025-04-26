// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, User, Smartphone, Lock, AlertCircle, CreditCard } from 'lucide-react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// export default function AuthForm({ onClose, setIsLoggedIn, setUser }) {
//     const [isLogin, setIsLogin] = useState(false); // Default to signup first
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         confirmPassword: '',
//         cnic: '',
//     });
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     const validate = () => {
//         const newErrors = {};

//         if (!isLogin) {
//             if (!formData.name.trim()) {
//                 newErrors.name = 'Name is required';
//             }

//             if (!formData.phone.trim()) {
//                 newErrors.phone = 'Phone is required';
//             } else if (!/^\d{11}$/.test(formData.phone)) {
//                 newErrors.phone = 'Phone must be 11 digits';
//             }

//             if (!formData.cnic.trim()) {
//                 newErrors.cnic = 'CNIC is required';
//             } else if (!/^\d{13}$/.test(formData.cnic)) {
//                 newErrors.cnic = 'CNIC must be 13 digits';
//             }

//             if (formData.password !== formData.confirmPassword) {
//                 newErrors.confirmPassword = 'Passwords do not match';
//             }
//         }

//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 8) {
//             newErrors.password = 'Password must be at least 8 characters';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validate()) return;

//         setIsSubmitting(true);

//         try {
//             const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
//             const response = await axios.post(endpoint, formData);

//             Swal.fire({
//                 icon: 'success',
//                 title: isLogin ? 'Login Successful!' : 'Signup Successful!',
//                 text: response.data.message,
//             });

//             if (isLogin) {
//                 setIsLoggedIn(true);
//                 setUser(response.data.user);
//                 localStorage.setItem('token', response.data.token);
//                 navigate('/loan-calculator');
//                 onClose();
//             } else {
//                 // After signup, switch to login form
//                 setIsLogin(true);
//                 setFormData({
//                     ...formData,
//                     name: '',
//                     phone: '',
//                     cnic: '',
//                     confirmPassword: '',
//                 });
//             }
//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Authentication Failed',
//                 text: error.response?.data?.message || 'An error occurred.',
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });

//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: null,
//             });
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
//             <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                     {isLogin ? 'Sign In' : 'Sign Up'}
//                 </h1>
//                 <p className="text-gray-600">
//                     {isLogin ? 'Enter your credentials to access your account' : 'Create an account to get started'}
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 {!isLogin && (
//                     <>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                             <div className={`relative rounded-md shadow-sm ${errors.name ? 'border-red-300' : 'border-gray-300'}`}>
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <User className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                                     placeholder="John Doe"
//                                 />
//                             </div>
//                             {errors.name && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <AlertCircle className="h-4 w-4 mr-1" />
//                                     {errors.name}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                             <div className={`relative rounded-md shadow-sm ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}>
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Smartphone className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="tel"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                                     placeholder="03001234567"
//                                 />
//                             </div>
//                             {errors.phone && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <AlertCircle className="h-4 w-4 mr-1" />
//                                     {errors.phone}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">CNIC (Without Dashes)</label>
//                             <div className={`relative rounded-md shadow-sm ${errors.cnic ? 'border-red-300' : 'border-gray-300'}`}>
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <CreditCard className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     name="cnic"
//                                     value={formData.cnic}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.cnic ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                                     placeholder="1234512345671"
//                                     maxLength="13"
//                                 />
//                             </div>
//                             {errors.cnic && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <AlertCircle className="h-4 w-4 mr-1" />
//                                     {errors.cnic}
//                                 </p>
//                             )}
//                         </div>
//                     </>
//                 )}

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                     <div className={`relative rounded-md shadow-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Mail className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                             placeholder="you@example.com"
//                         />
//                     </div>
//                     {errors.email && (
//                         <p className="mt-1 text-sm text-red-600 flex items-center">
//                             <AlertCircle className="h-4 w-4 mr-1" />
//                             {errors.email}
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                     <div className={`relative rounded-md shadow-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className={`block w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                             placeholder="••••••••"
//                         />
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="text-gray-400 hover:text-gray-500 focus:outline-none"
//                             >
//                                 {showPassword ? (
//                                     <EyeOff className="h-5 w-5" />
//                                 ) : (
//                                     <Eye className="h-5 w-5" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                     {errors.password && (
//                         <p className="mt-1 text-sm text-red-600 flex items-center">
//                             <AlertCircle className="h-4 w-4 mr-1" />
//                             {errors.password}
//                         </p>
//                     )}
//                 </div>

//                 {!isLogin && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                         <div className={`relative rounded-md shadow-sm ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}>
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Lock className="h-5 w-5 text-gray-400" />
//                             </div>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:outline-none`}
//                                 placeholder="••••••••"
//                             />
//                         </div>
//                         {errors.confirmPassword && (
//                             <p className="mt-1 text-sm text-red-600 flex items-center">
//                                 <AlertCircle className="h-4 w-4 mr-1" />
//                                 {errors.confirmPassword}
//                             </p>
//                         )}
//                     </div>
//                 )}

//                 <div>
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 Processing...
//                             </>
//                         ) : (
//                             isLogin ? 'Sign In' : 'Sign Up'
//                         )}
//                     </button>
//                 </div>
//             </form>

//             <div className="mt-6 text-center">
//                 <p className="text-sm text-gray-600">
//                     {isLogin ? "Don't have an account? " : "Already have an account? "}
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setIsLogin(!isLogin);
//                             setErrors({});
//                         }}
//                         className="font-medium text-blue-600 hover:text-blue-500"
//                     >
//                         {isLogin ? 'Sign Up' : 'Sign In'}
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// }