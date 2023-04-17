import {Tag} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import Table, {ColumnsType} from 'antd/es/table';
import {collection, getFirestore} from 'firebase/firestore';
import React from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {app} from '../../constants/firebase';
import {UserWrapper} from './styles';

interface DataType {
  key: string;
  name: string;
  login: string;
  authType: string;
  role: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Login',
    dataIndex: 'login',
    key: 'login',
  },
  {
    title: 'Auth Type',
    dataIndex: 'authType',
    key: 'authType',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
];

const notFound = (
  <Tag icon={<ExclamationCircleOutlined />} color="default">
    data not found
  </Tag>
);

export const User: React.FC = () => {
  const firestore = getFirestore(app);
  const [users] = useCollectionData(collection(firestore, 'users'));

  const tableData = users?.map((user) => ({
    key: user.uid,
    name: user.name || user.phone || notFound,
    login: user.email || user.phone || notFound,
    authType: user.authProvider || notFound,
    role: user.role || notFound,
  }));

  return (
    <UserWrapper>
      <Table columns={columns} dataSource={tableData} pagination={false} style={{width: '100%'}} />
    </UserWrapper>
  );
};
