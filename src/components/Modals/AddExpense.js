import{
    Modal,Form,Input,Button,DatePicker,
} from 'antd';

import { Select } from 'antd';
const { Option } = Select;


function AddExpense({
    isExpenseModalVisible,
    handleExpenseCancel,
    onFinish,
}) {

    const [form] = Form.useForm();

    return (
        <Modal className="add-expense-modal" style={{fontWeight:600}} title="Add Expense" open={isExpenseModalVisible} onCancel={handleExpenseCancel} footer={null}>
            <Form 
                
                form={form}
                layout='vertical'
                
                onFinish={(values) => {
                    onFinish(values,'expense');
                    form.resetFields();
                }}
               
            >
                <Form.Item
                    style={{fontWeight:600}}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of the transection!',
                        },
                    ]}
                >
                    <Input type='text' className='custom-input'/>
                </Form.Item>


                <Form.Item
                    style={{fontWeight:600}}
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the expense amount!',
                        },
                    ]}
                >
                    <Input type='number' className='custom-input'/>
                </Form.Item>


                <Form.Item
                    style={{fontWeight:600}}
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the expense date!',
                        },
                    ]}
                >
                    <DatePicker className='custom-input' format="YYYY-MM-DD"/>
                </Form.Item>

                <Form.Item
                    style={{fontWeight:600}}
                    label="Tag"
                    name="tag"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a tag!',
                        },
                    ]}
                >
                    <Select className='select-input'>
                        <Option value="salary">Salary</Option>                        <Option value="Travel">Travel</Option>
                        <Option value="freelance">Freelance</Option>
                        <Option value="investment">Investment</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        AddExpense
                    </Button>
                </Form.Item>
                
            </Form>

        </Modal>
    );
}

export default AddExpense;