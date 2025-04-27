import React from 'react';

function ExpenseDetails({ incomeAmt, expensesAmt }) {
  return (
    <div>
      <h1>Your Balance is {incomeAmt - expensesAmt}</h1>
      <div className='amounts-container'>
        <div>
          <strong>Income:</strong> <span className='income-amount'>{incomeAmt}</span>
        </div>
        <div>
          <strong>Expense:</strong> <span className='expense-amount'>{expensesAmt}</span>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetails;
