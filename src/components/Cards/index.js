import {Button, Card} from 'antd';
import './styles.css';
function Cards({showExpenseModal,showIncomeModal,income,expense,totalBalance,deleteAllTransactions}){
  return(
    <div className='my-grid'>
       
          <Card title='Current Balance' className='my-card'>
            <p>₹{totalBalance}</p>
            <Button onClick={deleteAllTransactions}>Reset Balance</Button>
          </Card>
       

      
          <Card title='Total Income' className='my-card'>
            <p>₹{income}</p>
            <Button onClick={showIncomeModal}>Add Income</Button>
          </Card>
       


       
          <Card title='Total Expense' className='my-card'>
            <p>₹{expense}</p>
            <Button onClick={showExpenseModal}>Add Expense</Button>
          </Card>
      
    </div>
  )
}

export default Cards;