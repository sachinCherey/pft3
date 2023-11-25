import { Line, Pie } from '@ant-design/charts';
import { Button } from 'antd';
import React, { useState } from 'react';


function ChartComponent({ sortedTransactions }) {

    const [toggleC, setToggleC] = useState(false);

    const data = sortedTransactions.map((item) => {
        return {
            date: item.date,
            amount: item.amount
        };
    });

    let spendingData = sortedTransactions.filter((transactions) => {
        if (transactions.type === 'expense') {
            return { tag: transactions.tag, amount: transactions.amount };
        }
    });


    let incomeData = sortedTransactions.filter((transactions) => {
        if (transactions.type === 'income') {
            return { tag: transactions.tag, amount: transactions.amount };
        }
    });

    let finalIncome = incomeData.reduce((acc, obj) => {
        let key = obj.tag;
        if (!acc[key]) {
            acc[key] = { tag: obj.tag, amount: obj.amount };
        } else {
            acc[key].amount += obj.amount;
        }
        return acc;
    }, []);

    let finalSpendings = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if (!acc[key]) {
            acc[key] = { tag: obj.tag, amount: obj.amount };
        } else {
            acc[key].amount += obj.amount;
        }
        return acc;
    }, []);


    const config = {
        data: data,
        xField: 'date',
        yField: 'amount',
        width: 500,
        autoFit: true,
    };


    const spendingConfig = {
        data: Object.values(finalSpendings),
        angleField: 'amount',
        colorField: 'tag',
        width: 400,
        autoFit: true,
    };


    const incomeConfig = {
        data: Object.values(finalIncome),
        angleField: 'amount',
        colorField: 'tag',
        width: 400,
        autoFit: true,
    }

    let chart;
    let pieChart;
    let pieChart2;


    return (
        <div className='conman' style={{ display: 'flex', justifyContent: 'space-around' }}>

            <div style={{ margin: '2rem' }}>
                <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>

            <div style={{ margin: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <Button onClick={() => setToggleC(!toggleC)}>Toggle Chart</Button>
                {toggleC ? (
                    <div>
                        <h2 style={{ marginTop: 0 }}>Your Spending</h2>
                       { Object.values(finalSpendings).length? <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />:<p>"You have no spending!"</p>}
                    </div>
                ) : (
                    <div>
                        <h2 style={{ marginTop: 0 }}>Your Income</h2>
                        {Object.values(finalIncome).length?<Pie {...incomeConfig} onReady={(chartInstance) => (pieChart2 = chartInstance)} />:<p>"You have no income!"</p>}
                    </div>
                )}
            </div>



        </div>

    );





}

export default ChartComponent;