import {Select, Table, message, Button} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {collection, DocumentData, getDocs, doc, setDoc, deleteDoc, getFirestore} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {UserRoles} from '../../constants/common';
import {app} from '../../constants/firebase';
import {UserWrapper} from './styles';

interface TableDataType {
  key: string;
  login: string;
  role: string;
}

type RoleSelectProps = {
  defaultValue?: string;
  id: string;
  selectRole: (id: string, value: string) => Promise<void>;
};

const RoleSelect: React.FC<RoleSelectProps> = ({defaultValue, id, selectRole}) => {
  const handleChange = (value: string) => {
    selectRole(id, value);
  };
  return (
    <Select
      defaultValue={defaultValue}
      style={{width: 120}}
      onChange={handleChange}
      disabled={defaultValue === UserRoles.ADMIN}
      options={[
        {value: UserRoles.ADMIN, label: 'Admin'},
        {value: UserRoles.PASSENGER, label: 'Passenger'},
        {value: UserRoles.DRIVER, label: 'Driver'},
      ]}
    />
  );
};

export const EditUsers: React.FC = () => {
  const firestore = getFirestore(app);
  const docsRef = collection(firestore, 'users');
  const [users] = useCollectionData(collection(firestore, 'users'));
  const [tableData, setTableData] = useState<TableDataType[]>();
  const [messageApi, contextHolder] = message.useMessage();

  const getTableData = async () => {
    try {
      const {docs} = await getDocs(docsRef);
      const mappedData = users?.map((user) => ({
        key: docs.find((d: DocumentData) => d._document.data.value.mapValue.fields.uid.stringValue === user.uid)
          ?.id as string,
        login: user.email ? `${user.email} (${user.authProvider})` : user.phone,
        role: user.role,
      }));
      setTableData(mappedData);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const editRoles = async (id: string, value: string) => {
    const docRef = doc(firestore, 'users', id);
    try {
      await setDoc(docRef, {role: value}, {merge: true});
      messageApi.open({
        type: 'success',
        content: 'Role added!',
      });
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const deleteUser = async (id: string) => {
    const docRef = doc(firestore, 'users', id);
    try {
      await deleteDoc(docRef);
      messageApi.open({
        type: 'success',
        content: 'User deleted!',
      });
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: (e as Error).message,
      });
    }
  };

  const columns: ColumnsType<TableDataType> = [
    {
      title: 'Login',
      dataIndex: 'login',
      key: 'login',
      width: '30%',
    },
    {
      title: 'Add/Edit Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, {key}) => <RoleSelect defaultValue={role} id={key} selectRole={editRoles} />,
    },
    {
      title: 'Delete user',
      dataIndex: 'del',
      key: 'del',
      render: (_, {key, role}) => (
        <Button type="primary" onClick={() => deleteUser(key)} disabled={role === UserRoles.ADMIN} danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getTableData();
  }, [users]);

  return (
    <UserWrapper>
      {contextHolder}
      <Table columns={columns} dataSource={tableData} pagination={false} style={{width: '100%'}} />
    </UserWrapper>
  );
};
