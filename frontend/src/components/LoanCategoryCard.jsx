// const LoanCategoryCard = ({ category, isSelected, onSelect }) => {
//     return (
//       <div 
//         className={`category-card ${isSelected ? 'selected' : ''}`}
//         onClick={onSelect}
//       >
//         <h3>{category.name}</h3>
//         <p>{category.description}</p>
//         <div className="card-details">
//           <div>
//             <strong>Max Loan:</strong> 
//             {typeof category.maxLoan === 'number' 
//               ? category.maxLoan.toLocaleString() + ' PKR' 
//               : category.maxLoan}
//           </div>
//           <div>
//             <strong>Max Period:</strong> {category.maxPeriod} years
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default LoanCategoryCard;