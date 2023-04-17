import React from 'react';
import {Input, Button, Form} from 'antd';
import {AuthDataType} from '.';
import {formStyles} from '../../constants/form';

type AuthFormProps = {
  onAuth: (v: AuthDataType) => Promise<void>;
  onRegisterUser: () => void;
  onResetPassword: () => void;
  isRegister: boolean;
  isReset: boolean;
};

export const AuthForm: React.FC<AuthFormProps> = ({onAuth, onRegisterUser, onResetPassword, isRegister, isReset}) => {
  const onFinish = (values: AuthDataType) => {
    onAuth(values);
  };

  return (
    <Form
      name="auth"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      style={formStyles}
      initialValues={{remember: true}}
      onFinish={onFinish}
      autoComplete="off">
      {isRegister && !isReset && (
        <Form.Item
          label="Name"
          name="name"
          rules={[{required: true, message: 'Please input your name!'}]}
          style={{width: '300px'}}>
          <Input />
        </Form.Item>
      )}

      <Form.Item
        label="Email"
        name="email"
        rules={[{required: true, message: 'Please input your email!'}]}
        style={{width: '300px'}}>
        <Input />
      </Form.Item>

      {!isReset && (
        <Form.Item
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}
          style={{width: '300px'}}>
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isRegister ? 'Register' : isReset ? 'Reset password' : 'Login'}
        </Button>
      </Form.Item>
      {!isRegister && (
        <Button type="link" htmlType="button" onClick={onResetPassword} danger>
          Reset password
        </Button>
      )}
      {!isRegister && (
        <Button type="link" htmlType="button" style={{margin: '0 auto', display: 'block'}} onClick={onRegisterUser}>
          {'Don’t have an account? Register here'}
        </Button>
      )}
    </Form>
  );
};
