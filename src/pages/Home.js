import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpensesTable from './ExpensesTable';
import ExpenseTrackerform from './ExpenseTrackerform';
import ExpenseDetails from './ExpenseDetails';
function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [expensesAmt, setExpensesAmt] = useState(0);
    const [incomeAmt, setIncomeAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchExpenses();
    }, []);

    // Fetch Expenses from API
    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log("Fetched expenses:", result);

            setExpenses(result.data || []);  // Ensure expenses is an array
            handleSuccess(result.message);
        } catch (err) {
            handleError(err);
        }
    };

    // Add New Expense
    const addExpenses = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log("Added expense:", result);

            setExpenses((prevExpenses) => [...prevExpenses, result]);  // Append new expense
            handleSuccess(result.message);
        } catch (err) {
            handleError(err);
        }
    };

    // Calculate Income and Expense
    useEffect(() => {
        if (!Array.isArray(expenses)) {
            console.error("Error: expenses is not an array", expenses);
            return;
        }

        const amounts = expenses.map((item) => Number(item.amount) || 0);
        console.log("Amounts:", amounts);

        const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

        console.log('Income:', income);
        console.log('Expense:', expense);

        setIncomeAmt(income);
        setExpensesAmt(expense);
    }, [expenses]);

    // Delete Expense
    const handleDeleteExpense = async (expenseId) => {
        try {
            const url = `${APIUrl}/expenses/${expenseId}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log("Deleted expense:", result);

            // Remove the deleted expense from the list
            setExpenses((prevExpenses) => prevExpenses.filter(exp => exp._id !== expenseId));
            handleSuccess(result.message);
        } catch (err) {
            handleError(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails incomeAmt={incomeAmt} expensesAmt={expensesAmt}></ExpenseDetails>
            <ExpenseTrackerform 
            addExpenses={addExpenses} 
            ></ExpenseTrackerform>
            <ExpensesTable
             expenses={expenses}
             handleDeleteExpense={handleDeleteExpense}
             ></ExpensesTable>

            <ToastContainer />

        </div>
    )
}

export default Home