import { Radio, Select, Table } from "antd";
import { Form, Input, Popconfirm } from 'antd';
import { parse, unparse } from "papaparse";
import { useState } from "react";
import { toast } from "react-toastify";
import {Button} from "antd";
import {SearchOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
function TransactionsTable({ transactions, addTransaction, fetchTransactions ,setTransactions, calculateBalance}) {
    const { Option } = Select;
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortKey, setSortKey] = useState('date');

    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) =>
            transactions.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null,
        },
    ];




    async function handleDelete(record){
        const newData = transactions.filter((item) => item.id !== record.id);
        setTransactions(newData);
        await deleteDoc(doc(db, "users/test/transactions", record.id));
        fetchTransactions();
        calculateBalance();
        toast.success('Transaction deleted!');
        
    }
  

    let filteredTransactions = transactions.filter(
        (item) =>
            (item.name && item.name.toLowerCase().includes(search.toLowerCase())) &&
            (item.type && item.type.includes(typeFilter))
    );

   
   
    

    let sortedTransactions = filteredTransactions.sort(
        (a, b) => {
            if (sortKey === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortKey === 'amount') {
                return a.amount - b.amount;
            } else {
                return 0;
            }
        }
    );

    // console.log(filteredTransactions,sortedTransactions);

    function exportCSV() {
        var csv = unparse({
            fields: ['name', 'amount', 'tag', 'type', 'date'],
            data: transactions,
        });
        const data = new Blob([csv], {
            type: 'text/csv',
        });
        const csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.download = 'transactions.csv';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }

    function importCSV(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    for (const item of results.data) {
                        const newTransaction = {
                            ...item,
                            amount: parseFloat(item.amount) || 0,
                        };
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("All Transactions Added!");
            fetchTransactions();
            event.target.value = null;
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <div className="sContainer">
            <SearchOutlined className="searchg"/>
                <input
                    
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                ></input>

                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            <div className="sContainer2">
                <h3>My Transactions</h3>
                <Radio.Group
                    className="input-radio"
                    onChange={(e) => setSortKey(e.target.value)}
                    value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                </Radio.Group>
                <div style={{ display: 'flex', gap: '1rem' }}>

                    <Button onClick={exportCSV}>Export to CSV</Button>

                    <Button style={{backgroundColor:'#0d6efd',color:'white'}}>
                    <label htmlFor='file-csv' className="bblue">Import from CSV</label>
                    <input
                        id='file-csv' type="file"
                        accept=".csv"
                        required
                        onChange={importCSV}
                        style={{ display: 'none' }}
                    />
                    </Button>
                </div>

            </div>

            <Table rowKey={(record) => record.id} dataSource={sortedTransactions} columns={columns} />
        </>
    );
}

export default TransactionsTable;
