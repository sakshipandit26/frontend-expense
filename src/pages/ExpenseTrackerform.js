import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseTrackerForm({ addExpenses }) {
  const [expenseInfo, setExpenseInfo] = useState({ text: '', amount: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExpenses = (e) => {
    e.preventDefault();
    const { text, amount } = expenseInfo;

    if (!text || !amount) {
      handleError("All fields are required");
      return;
    }

    addExpenses({ text, amount: Number(amount) });

    setTimeout(() => {
      setExpenseInfo({ text: '', amount: '' });
    }, 1000);
  };

  return (
    <div className='container'>
      <h1>Add Expense</h1>
      <form onSubmit={handleExpenses}>
        <div>
          <label htmlFor='text'>Description</label>
          <input
            onChange={handleChange}
            type='text'
            name='text'
            placeholder='Enter expense description...'
            value={expenseInfo.text}
          />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input
            onChange={handleChange}
            type='number'
            name='amount'
            placeholder='Enter amount, Expense (-ve) Income (+ve)...'
            value={expenseInfo.amount}
          />
        </div>
        <button type='submit'>Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseTrackerForm;
