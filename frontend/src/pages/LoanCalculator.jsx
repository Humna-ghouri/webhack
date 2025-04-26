import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const loanTypes = [
  {
    type: 'Wedding Loans',
    subcategories: ['Valima', 'Furniture', 'Valima Food', 'Jahez'],
    maxAmount: 500000,
    loanPeriod: 3,
  },
  {
    type: 'Home Construction Loans',
    subcategories: ['Structure', 'Finishing', 'Loan'],
    maxAmount: 1000000,
    loanPeriod: 5,
  },
  {
    type: 'Business Startup Loans',
    subcategories: ['Buy Stall', 'Advance Rent for Shop', 'Shop Assets', 'Shop Machinery'],
    maxAmount: 1000000,
    loanPeriod: 5,
  },
  {
    type: 'Education Loans',
    subcategories: ['University Fees', 'Child Fees Loan'],
    maxAmount: null,
    loanPeriod: 4,
  },
];

const LoanCalculator = () => {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState(loanTypes[0]);
  const [loanData, setLoanData] = useState({
    amount: '',
    tenure: loanType.loanPeriod * 12,
    interestRate: 10,
    subcategory: loanType.subcategories[0],
  });
  const [emi, setEmi] = useState(0);

  const calculateEMI = () => {
    const { amount, tenure, interestRate } = loanData;
    const principal = parseFloat(amount);
    const monthlyInterest = interestRate / 12 / 100;
    const emiValue =
      (principal * monthlyInterest * Math.pow(1 + monthlyInterest, tenure)) /
      (Math.pow(1 + monthlyInterest, tenure) - 1);

    if (!isNaN(emiValue)) setEmi(emiValue.toFixed(2));
  };

  const handleChange = (e) => {
    if (e.target.name === 'loanType') {
      const selectedLoanType = loanTypes.find((type) => type.type === e.target.value);
      setLoanType(selectedLoanType);
      setLoanData({
        ...loanData,
        tenure: selectedLoanType.loanPeriod * 12,
        subcategory: selectedLoanType.subcategories[0],
      });
    } else {
      setLoanData({
        ...loanData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateForm = () => {
    if (!loanData.amount) {
      Swal.fire('Error', 'Please enter loan amount', 'error');
      return false;
    }
    if (loanType.maxAmount && loanData.amount > loanType.maxAmount) {
      Swal.fire('Error', `Amount cannot exceed PKR ${loanType.maxAmount}`, 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    calculateEMI();
    if (emi > 0) {
      const loanDetails = {
        ...loanData,
        emi,
        loanType: loanType.type,
        subcategory: loanData.subcategory
      };
      
      Swal.fire({
        title: 'Loan Summary',
        html: `
          <div class="text-left">
            <p><strong>Loan Type:</strong> ${loanType.type}</p>
            <p><strong>Subcategory:</strong> ${loanData.subcategory}</p>
            <p><strong>Amount:</strong> PKR ${loanData.amount}</p>
            <p><strong>Tenure:</strong> ${loanData.tenure} months</p>
            <p><strong>Interest Rate:</strong> ${loanData.interestRate}%</p>
            <p class="mt-2"><strong>Monthly EMI:</strong> PKR ${emi}</p>
          </div>
        `,
        confirmButtonText: 'Proceed to Loan Request',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/loan-request', { 
            state: { 
              loanDetails
            } 
          });
        }
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Loan Calculator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Loan Type</label>
          <select
            name="loanType"
            value={loanType.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {loanTypes.map((type) => (
              <option key={type.type} value={type.type}>
                {type.type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Subcategory</label>
          <select
            name="subcategory"
            value={loanData.subcategory}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {loanType.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Loan Amount (PKR)</label>
          <input
            type="number"
            name="amount"
            value={loanData.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            max={loanType.maxAmount || undefined}
          />
          {loanType.maxAmount && (
            <p className="text-sm text-gray-500">Max: PKR {loanType.maxAmount}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Loan Tenure (months)</label>
          <input
            type="number"
            name="tenure"
            value={loanData.tenure}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-1">Interest Rate (% p.a.)</label>
          <input
            type="number"
            name="interestRate"
            value={loanData.interestRate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            step="0.1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Calculate EMI
        </button>
      </form>
    </div>
  );
};

export default LoanCalculator;