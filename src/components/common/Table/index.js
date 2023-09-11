 import React, { useState } from 'react';
import { Table, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { DotIcon } from '../../../svg';


const option = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <Link to="/">Edit</Link>
        ),
      },
      {
        key: '2',
        label: (
          <Link to="/">Add</Link>
        ),
      },
    ]}
  />
);


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (row) => <div>
      <div>{row.name}</div>
    </div>
  },
  {
    title: 'Birthdate',
    dataIndex: 'birthdate',
    key: 'birthdate',
    render: (row) => <div>
      <div>{row.birthnumber}</div>
    </div>
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
    render: (row) => <div>
      <div>{row.contactnumber}</div>
    </div>
  },
  {
    title: 'Practice',
    dataIndex: 'practice',
    key: 'practice',
    render: (row) => <div>
      <div>{row.desc}</div>
    </div>
  },
  {
    title: 'Options',
    dataIndex: 'options',
    key: 'options',
    width: 100,
    render: (row) => <div className='option'>
      <Dropdown overlay={option} trigger={['click']} placement="topLeft">
        <Link to=""><DotIcon /></Link>
      </Dropdown>
    </div>
  },
];


const data = [
  {
    key: '1',
    name: { name: 'Danesha Russ' },
    birthdate: { birthnumber: '7/21/1935' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Heart and Vascular' },
  },
  {
    key: '2',
    name: { name: 'William Korn unenrolled' },
    birthdate: { birthnumber: '8/19/1947' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Advanced Family Care' },
  },
  {
    key: '3',
    name: { name: 'Chakkira Wonnum' },
    birthdate: { birthnumber: '6/8/1968' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Highmark Health Options' },
  },
  {
    key: '4',
    name: { name: 'Paul Vines' },
    birthdate: { birthnumber: '2/28/1947' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Family Medicine at Greenhill' },
  },
  {
    key: '5',
    name: { name: 'Edward Canning' },
    birthdate: { birthnumber: '3/25/1940' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Ivira Pharmacy' },
  },
  {
    key: '6',
    name: { name: 'David Smith' },
    birthdate: { birthnumber: '2/26/1933' },
    contact: { contactnumber: '(302) 494-9964' },
    practice: { desc: 'Family Medicine at Greenhill' },
  },
  {
    key: '7',
    name: { name: 'Ann Hopkins' },
    birthdate: { birthnumber: '5/1/1974' },
    contact: { contactnumber: '(209) 471-9803' },
    practice: { desc: 'Advanced Family Care' },
  },
];


const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};


const CommonTable = () => {

  const [selectionType] = useState('checkbox');

  return (
    <>
      <Table
        rowSelection={{ type: selectionType, ...rowSelection, }}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1184 }}
      />
    </>
  );
}

export default CommonTable;