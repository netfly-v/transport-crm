import React from 'react';
import {Input, Button, Form, Typography, DatePicker, InputNumber, Select, message} from 'antd';
import {AddTripWrapper} from './styles';
import {app} from '../../constants/firebase';
import {getFirestore, collection, addDoc} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {UserRoles} from '../../constants/common';
const {Title} = Typography;

export const AddTrip: React.FC = () => {
  const firestore = getFirestore(app);
  const [messageApi, contextHolder] = message.useMessage();
  const [users] = useCollectionData(collection(firestore, 'users'));

  const drivers = users?.filter((u) => u.role === UserRoles.DRIVER);
  const passengers = users?.filter((u) => u.role === UserRoles.PASSENGER);

  const addTrip = async (values: any) => {
    try {
      await addDoc(collection(firestore, 'trips'), {
        ...values,
        date: new Date(values.date).toLocaleDateString(),
      });
      messageApi.open({
        type: 'success',
        content: 'Trip added!',
      });
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const onFinish = (values: any) => {
    addTrip(values);
  };

  return (
    <AddTripWrapper>
      {contextHolder}
      <Title level={2} style={{textAlign: 'center'}}>
        Add new trip
      </Title>
      <Form
        name="addTrip"
        labelCol={{span: 9}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600, margin: '20px auto'}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        autoComplete="off">
        <Form.Item label="Auto" name="auto" rules={[{required: true, message: 'Please input the name of auto!'}]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Auto Number"
          name="autoId"
          rules={[
            {required: true, message: 'Please auto registration number!'},
            {max: 8, message: 'Auto number must be not longer than 8 symbols'},
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="From" name="from" rules={[{required: true, message: 'Please input where you start from!'}]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Destination"
          name="to"
          rules={[{required: true, message: 'Please input your destination point!'}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{required: true, message: 'Please choose a date of trip!'}]}>
          <DatePicker style={{width: '100%'}} />
        </Form.Item>
        <Form.Item label="Driver" name="driver" rules={[{required: true, message: 'Please choose a driver!'}]}>
          <Select>
            {drivers?.map((d) => (
              <Select.Option value={d.email} key={d.uid}>
                {d.email}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Passengers" name="passengers" rules={[{required: true, message: 'Please choose passengers'}]}>
          <Select mode="multiple">
            {passengers?.map((p) => (
              <Select.Option value={p.email || p.phone} key={p.uid}>
                {p.email || p.phone}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Max pass."
          name="maxPassengers"
          rules={[{required: true, message: 'Please input max passengers number!'}]}>
          <InputNumber style={{width: '100%'}} />
        </Form.Item>

        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            Add trip
          </Button>
        </Form.Item>
      </Form>
    </AddTripWrapper>
  );
};
