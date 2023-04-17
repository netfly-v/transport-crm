import React from 'react';
import {Input, Button, Form, Space} from 'antd';
import {formStyles} from '../../constants/form';
import {ReCaptchaContainer} from './styles';

type PhoneAuthFormProps = {
  onAuth: (v: string) => Promise<void>;
  isOtpOpen: boolean;
};

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({onAuth, isOtpOpen}) => {
  const onFinish = (values: any) => {
    const {phone, otp} = values;
    if (isOtpOpen) {
      onAuth(otp);
    } else {
      onAuth(phone);
    }
  };

  return (
    <Form layout="vertical" style={formStyles} onFinish={onFinish} autoComplete="off">
      <Form.Item
        name="phone"
        label="Phone number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
          {
            validator: (_, value) => {
              if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject('Not a valid phone number');
              }
            },
          },
        ]}>
        <Input placeholder="enter phone number" disabled={isOtpOpen} />
      </Form.Item>
      {isOtpOpen && (
        <Form.Item name="otp" label="SMS code" rules={[{required: true, message: 'Please input code from SMS!'}]}>
          <Input placeholder="enter code from SMS" />
        </Form.Item>
      )}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {isOtpOpen ? 'Submit' : 'Send code'}
          </Button>
        </Space>
      </Form.Item>
      <ReCaptchaContainer />
    </Form>
  );
};
