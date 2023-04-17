import React, {useContext} from 'react';
import {AppstoreOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {route} from '../../constants/route';
import {useNavigate} from 'react-router-dom';
import {UserRoleContext} from '../../App';
import {UserRoles} from '../../constants/common';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const userRole = useContext(UserRoleContext);
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const items: MenuProps['items'] = [
    getItem('Menu', 'sub', <AppstoreOutlined />, [
      getItem('All users', route.user),
      userRole === UserRoles.ADMIN ? getItem('Edit users', route.editUsers) : null,
      getItem('Add trip', route.addTrip),
      getItem('View trips', route.viewTrips),
    ]),
  ];

  return (
    <Menu
      onClick={onClick}
      style={{width: 256, backgroundColor: 'transparent'}}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
