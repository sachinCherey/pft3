import{
    Modal,Form,Input,Button,DatePicker,
} from 'antd';

import { Select } from 'antd';
const { Option } = Select;





function AddIncome({
   isIncomeModalVisible,
   handleIncomeCancel,
   onFinish,
}) {

    const [form] = Form.useForm();

    return (
        <Modal style={{fontWeight:600}} title="Add Income" open={isIncomeModalVisible} onCancel={handleIncomeCancel} footer={null}>
            <Form 
                
                form={form}
                layout='vertical'
                
                onFinish={(values) => {
                    onFinish(values,'income');
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
                            message: 'Please input the income amount!',
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
                            message: 'Please select the income date!',
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
                        <Option value="salary">Salary</Option>                       
                        <Option value="Travel">Travel</Option>
                        <Option value="freelance">Freelance</Option>
                        <Option value="investment">Investment</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Income
                    </Button>
                </Form.Item>
                
            </Form>

        </Modal>
    );
}

export default AddIncome;