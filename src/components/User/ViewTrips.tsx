import {Button, message, Table} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {getFirestore, collection, deleteDoc, doc, getDocs, DocumentData} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {app} from '../../constants/firebase';
import {UserWrapper} from './styles';

interface TableDataType {
  key: string;
  auto: string;
  autoId: string;
  date: string;
  driver: string;
  from: string;
  to: string;
  maxPassengers: number;
  passengers: string[];
}

export const ViewTrips: React.FC = () => {
  const firestore = getFirestore(app);
  const docsRef = collection(firestore, 'trips');
  const [trips] = useCollectionData(collection(firestore, 'trips'));
  const [tableData, setTableData] = useState<TableDataType[]>();
  const [messageApi, contextHolder] = message.useMessage();

  const getTableData = async () => {
    try {
      const {docs} = await getDocs(docsRef);
      const mappedData = trips?.map((trip) => ({
        key: docs.find((d: DocumentData) => d._document.data.value.mapValue.fields.autoId.stringValue === trip.autoId)
          ?.id as string,
        auto: trip.auto,
        autoId: trip.autoId,
        from: trip.from,
        to: trip.to,
        date: trip.date,
        driver: trip.driver,
        passengers: trip.passengers.join(', '),
        maxPassengers: trip.maxPassengers,
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

  const deleteTrip = async (id: string) => {
    const docRef = doc(firestore, 'trips', id);
    try {
      await deleteDoc(docRef);
      messageApi.open({
        type: 'success',
        content: 'Trip deleted!',
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
      title: 'Auto',
      dataIndex: 'auto',
      key: 'auto',
    },
    {
      title: 'Auto Number',
      dataIndex: 'autoId',
      key: 'autoId',
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'Destination',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Driver',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: 'Passengers',
      dataIndex: 'passengers',
      key: 'passengers',
    },
    {
      title: 'Max pass.',
      dataIndex: 'maxPassengers',
      key: 'maxPassengers',
    },
    {
      title: 'Delete trip',
      dataIndex: 'del',
      key: 'del',
      render: (_, {key}) => (
        <Button type="primary" onClick={() => deleteTrip(key)} danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getTableData();
  }, [trips]);

  return (
    <UserWrapper>
      {contextHolder}
      <Table columns={columns} dataSource={tableData} pagination={false} style={{width: '100%'}} />
    </UserWrapper>
  );
};
