import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Input, InputRef, Space, Table, Tag} from 'antd';
import {JobType} from '../../models/type';
import {SearchOutlined} from '@ant-design/icons';

import './style.css';
import {ColumnsType, ColumnType, FilterConfirmProps, SorterResult} from "antd/lib/table/interface";
import {TableProps} from "antd/lib/table";
import {JobService} from "../../service/jobService";
import moment from "moment";
import JobView from "../../component/JobView";


type DataIndex = keyof JobType;


const HomePage: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<string>('');
    const searchInput = useRef<InputRef>(null);
    const [sortedInfo, setSortedInfo] = useState<SorterResult<JobType>>({});
    const [dataSource, setDataSource] = useState<JobType[]>([]);

    const [selectedJob, setSelectedJob] = useState<JobType | null>(null);


    useEffect(() => {
        const jobService = new JobService();
        jobService.getJobs().then((data) => {
            setDataSource(data);
        });
    }, []);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const handleChange: TableProps<JobType>['onChange'] = (pagination, filters, sorter) => {
        setSortedInfo(sorter as SorterResult<JobType>);
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<JobType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text => text,
    });

    const columns: ColumnsType<JobType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id.length - b.id.length,
            sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        },
        {
            title: 'Contact No',
            dataIndex: 'contactNo',
            key: 'contactNo',
            ...getColumnSearchProps('contactNo'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Scheduled',
                    value: 'scheduled',
                },
                {
                    text: 'Active',
                    value: 'active',
                },
                {
                    text: 'Invoicing',
                    value: 'invoicing',
                },
                {
                    text: 'To Priced',
                    value: 'to priced',
                },
                {
                    text: 'Completed',
                    value: 'completed',
                },
            ],
            render: (_, {status}) => {
                let color = 'blue';
                switch (status) {
                    case "scheduled":
                        color = 'blue';
                        break;
                    case "active":
                        color = 'lime';
                        break;
                    case "invoicing":
                        color = 'gold';
                        break;
                    case "to priced":
                        color = 'purple';
                        break;
                    case "completed":
                        color = 'green';
                        break;
                }
                return (
                    <Tag color={color} key={status}>
                        {status}
                    </Tag>
                );
            },
            onFilter: (value: string | boolean | number, record: JobType) => record.status.indexOf(value as string) === 0,
        },
        {
            title: 'Date Time',
            dataIndex: 'dateTime',
            key: 'dateTime',
            sorter: (a, b) => Number(a.dateTime) - Number(b.dateTime),
            sortOrder: sortedInfo.columnKey === 'dateTime' ? sortedInfo.order : null,
            render: (_, {dateTime}) => {
                return (moment(Number(dateTime)).format('lll'));
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => setSelectedJob(record)}>View</a>
                </Space>
            ),
        },
    ];

    const jobViewClose = (job: JobType | null) => {
        if (job) {

            const newDataSource = dataSource.map((item) => {
                if (job.id === item.id) {
                    item = {...job}
                }
                return item;
            });
            setDataSource(newDataSource);
        }
        setSelectedJob(null);
    };

    return (
        <div className="wrapper">

            <Card title="Jobs" bordered={true}>
                <Table dataSource={dataSource}
                       onChange={handleChange}
                       columns={columns}/>
            </Card>
            <JobView job={selectedJob} onClose={jobViewClose} show={selectedJob != null}/>
        </div>

    );
};

export default HomePage;
