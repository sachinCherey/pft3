

import Cards from '../components/Cards';
import AddExpense from '../components/Modals/AddExpense';
import AddIncome from '../components/Modals/AddIncome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

import { getDocs } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTable';
import NoTransactions from '../components/NoTransactions';
import ChartComponent from '../components/Charts';
import {deleteDoc} from 'firebase/firestore';
import {updateDoc} from 'firebase/firestore';



function Dashboard(){
    const [transactions, setTransactions] = useState([]);
    const [user]=useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };
    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    }

    const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
    };

    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    };
    

    const onFinish = (values,type) => {
        const newTransaction={
            type:type,
            date:(values.date).format('YYYY-MM-DD'),
            amount:parseFloat(values.amount),
            tag:values.tag,
            name:values.name,
            
        };
        addTransaction(newTransaction);
    }

    async function addTransaction(transaction,many){
        try{
            const docRef=await addDoc(
                collection(db,`users/test/transactions`),transaction
            );
            await updateDoc(docRef, {
                id: docRef.id
              });
            // console.log('Document written with ID: ', docRef.id);
            if(!many){
                toast.success('Transaction added!');
                let newArr=transactions;
                newArr.push(transaction);
                setTransactions(newArr);
                calculateBalance();
            }
        } catch(e){
            console.error('Error adding document: ', e);
            if(!many){
                toast.error("Couldn't add transaction");
            }
        }
    }

    useEffect(() => {
        fetchTransactions();   
    }, [user]);

    async function fetchTransactions(){
        setLoading(true);
        if(user){
            const q = query(collection(db,`users/test/transactions`));
            const querySnapshot = await getDocs(q);
           let transactionsArray=[];
           querySnapshot.forEach((doc) => {
               transactionsArray.push(doc.data());
           });
           setTransactions(transactionsArray);
           toast.success('Transactions fetched!');
        }
        setLoading(false);
    }



    useEffect(() => {
        calculateBalance()
    }, [transactions]);

    function calculateBalance(){
        let incomeTotal=0;
        let expenseTotal=0;
        transactions.forEach((transaction)=>{
            if(transaction.type==='income'){
                incomeTotal+=transaction.amount;
            }
            else{
                expenseTotal+=transaction.amount;
            }
        });
        setIncome(incomeTotal);
        setExpense(expenseTotal);
        setTotalBalance(incomeTotal-expenseTotal);
    };

    let sortedTransactions = transactions.sort(
        (a, b) => {
            return new Date(a.date) - new Date(b.date);
        }
    )


    async function deleteAllTransactions() {
        try {
          // Reference to the user's transactions collection in Firestore
          const transactionsRef = collection(db, `users/test/transactions`);
      
          // Get all documents in the collection
          const querySnapshot = await getDocs(transactionsRef);
      
          // Delete each document in the collection
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
      
          // Clear the local state (assuming transactions is an array of transactions)
          setTransactions([]);
      
          // Recalculate the balance or perform any other necessary updates
          calculateBalance();
      
          toast.success('All transactions deleted successfully!');
        } catch (error) {
          console.error('Error deleting all transactions: ', error);
          toast.error("Couldn't delete all transactions");
        }
      }
    
    return(
        <div>
            {loading ? <p>Loading...</p> :<>
            <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            deleteAllTransactions={deleteAllTransactions}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            />
            {transactions.length!==0 ? <ChartComponent sortedTransactions={sortedTransactions} /> : <NoTransactions/>}
            <AddExpense
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish}
            />

            <AddIncome
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish}
            />
            <TransactionsTable calculateBalance={calculateBalance} transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} setTransactions={setTransactions}/>
            </>}

             
        </div>
    )
    }


export default Dashboard;